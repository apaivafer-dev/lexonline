import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { UserPlan } from '@/types/page.types';
import domainVerifier from '@/services/domainVerifier';
import firebaseHostingService from '@/services/firebaseHostingService';

const prisma = new PrismaClient();

const DOMAIN_LIMITS: Record<UserPlan, number> = {
  essential: 0,
  professional: 3,
  agency: 25,
};

// ============================================================================
// POST /api/page/:id/domain
// ============================================================================

export async function addPageDomain(req: Request, res: Response): Promise<void> {
  try {
    const { id: pageId } = req.params;
    const userId = req.user?.id;
    const plan = (req.user?.plan ?? 'essential') as UserPlan;
    const { domain } = req.body as { domain: string };

    if (!userId || !domain) {
      res.status(400).json({ error: 'Campo obrigatório: domain' });
      return;
    }

    const limit = DOMAIN_LIMITS[plan];
    if (limit === 0) {
      res
        .status(403)
        .json({ error: 'Plano Essencial não permite domínios customizados. Faça upgrade para Profissional.' });
      return;
    }

    // Verifica ownership da página
    const page = await prisma.pages.findFirst({ where: { id: pageId, user_id: userId } });
    if (!page) {
      res.status(404).json({ error: 'Página não encontrada' });
      return;
    }

    // Verifica limite do plano para esta página
    const domainCount = await prisma.page_domains.count({ where: { page_id: pageId } });
    if (domainCount >= limit) {
      res
        .status(403)
        .json({ error: `Limite de ${limit} domínio(s) atingido para o plano ${plan}` });
      return;
    }

    // Valida sintaxe do domínio
    const validation = await domainVerifier.validateDomain(domain.trim().toLowerCase());
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // Verifica se domínio já está em uso
    const existing = await prisma.page_domains.findUnique({ where: { domain: domain.trim().toLowerCase() } });
    if (existing) {
      res.status(409).json({ error: 'Domínio já está cadastrado em outro site' });
      return;
    }

    const record = await prisma.page_domains.create({
      data: {
        user_id: userId,
        page_id: pageId,
        domain: domain.trim().toLowerCase(),
        status: 'pending',
      },
    });

    res.status(201).json({
      domainId: record.id,
      domain: record.domain,
      status: record.status,
      created_at: record.created_at,
      instructions: {
        cname: {
          name: record.domain,
          value: domainVerifier.CNAME_TARGET,
          ttl: 3600,
        },
        steps: [
          'Acesse o painel do seu registrador de domínios (ex: Registro.br, HostGator)',
          `Crie um registro CNAME: Nome = ${record.domain} | Valor = ${domainVerifier.CNAME_TARGET} | TTL = 3600`,
          'Aguarde a propagação DNS (pode levar até 48h). Verificamos a cada 30 segundos.',
        ],
      },
    });
  } catch {
    res.status(500).json({ error: 'Erro ao registrar domínio' });
  }
}

// ============================================================================
// GET /api/page/:id/domain/:domainId/verify
// ============================================================================

export async function verifyPageDomain(req: Request, res: Response): Promise<void> {
  try {
    const { id: pageId, domainId } = req.params;
    const userId = req.user?.id;

    const record = await prisma.page_domains.findFirst({
      where: { id: domainId, page_id: pageId, user_id: userId ?? '' },
    });

    if (!record) {
      res.status(404).json({ error: 'Domínio não encontrado' });
      return;
    }

    // Se já está ativo, retorna imediatamente
    if (record.status === 'active') {
      res.json({ status: 'active', verified_at: record.verified_at });
      return;
    }

    const verified = await domainVerifier.verifyDNS(record.domain);

    if (verified) {
      await firebaseHostingService.addDomainToHosting(pageId, record.domain);

      const updated = await prisma.page_domains.update({
        where: { id: domainId },
        data: {
          status: 'active',
          is_verified: true,
          verified_at: new Date(),
          error_message: null,
        },
      });

      res.json({ status: 'active', verified_at: updated.verified_at });
    } else {
      await prisma.page_domains.update({
        where: { id: domainId },
        data: {
          status: 'pending',
          error_message: 'CNAME não encontrado ou aponta para destino incorreto',
        },
      });

      res.json({
        status: 'pending',
        verified_at: null,
        message: `Aponte o CNAME de "${record.domain}" para "${domainVerifier.CNAME_TARGET}"`,
      });
    }
  } catch {
    res.status(500).json({ error: 'Erro ao verificar domínio' });
  }
}

// ============================================================================
// DELETE /api/page/:id/domain/:domainId
// ============================================================================

export async function removePageDomain(req: Request, res: Response): Promise<void> {
  try {
    const { id: pageId, domainId } = req.params;
    const userId = req.user?.id;

    const record = await prisma.page_domains.findFirst({
      where: { id: domainId, page_id: pageId, user_id: userId ?? '' },
    });

    if (!record) {
      res.status(404).json({ error: 'Domínio não encontrado' });
      return;
    }

    // Impede remoção se for o domínio primário ativo da página
    const page = await prisma.pages.findFirst({ where: { id: pageId, domain_id: domainId } });
    if (page) {
      res
        .status(400)
        .json({ error: 'Não é possível remover o domínio primário ativo. Associe outro domínio primeiro.' });
      return;
    }

    if (record.status === 'active') {
      await firebaseHostingService.removeDomainFromHosting(record.domain);
    }

    await prisma.page_domains.delete({ where: { id: domainId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro ao remover domínio' });
  }
}

// ============================================================================
// GET /api/page/:id/domains  (lista domínios da página)
// ============================================================================

export async function getPageDomains(req: Request, res: Response): Promise<void> {
  try {
    const { id: pageId } = req.params;
    const userId = req.user?.id;

    const page = await prisma.pages.findFirst({ where: { id: pageId, user_id: userId ?? '' } });
    if (!page) {
      res.status(404).json({ error: 'Página não encontrada' });
      return;
    }

    const domains = await prisma.page_domains.findMany({
      where: { page_id: pageId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        domain: true,
        status: true,
        error_message: true,
        verified_at: true,
        created_at: true,
      },
    });

    const plan = (req.user?.plan ?? 'essential') as UserPlan;
    const limit = DOMAIN_LIMITS[plan];

    res.json({
      domains,
      plan_limit: limit,
      used: domains.length,
      free_subdomain: `${page.slug}.lexonline.com.br`,
    });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar domínios' });
  }
}
