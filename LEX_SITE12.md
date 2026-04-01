# LEX_SITE12 — Fase 7: Domínio Customizado + SSL

## Objetivo
Implementar suporte a domínios customizados com SSL automático, permitindo que usuários do plano Profissional+ associem seus próprios domínios às páginas.

## Dependência
- **Fase 6** (Editor Responsivo + Publicação)

## Status de Desenvolvimento
- ⏳ Planejado
- 📋 Arquivos: 5 componentes/serviços
- 🎯 Prazo estimado: 10 dias

---

## Arquitetura de Arquivos

### Backend

#### `backend/src/controllers/domainsController.ts`
Controlador responsável por operações CRUD de domínios customizados.

**Rotas implementadas:**
- `POST /api/page/:id/domain` — Registra novo domínio customizado
- `GET /api/page/:id/domain/:domainId/verify` — Verifica status de validação DNS
- `DELETE /api/page/:id/domain/:domainId` — Remove domínio customizado

**Lógica principal:**
```
POST /api/page/:id/domain
├── Validação: contagem de domínios vs. limite do plano
├── Criação: registra domínio com status = "pending"
└── Resposta: {domainId, domain, status, instructions}

GET /api/page/:id/domain/:domainId/verify
├── Chamada DomainVerifier.verifyDNS()
├── Atualização: status no banco se validado
└── Resposta: {status, verified_at}

DELETE /api/page/:id/domain/:domainId
├── Validação: domínio não é o principal
├── Remoção: registra de domínio
└── Resposta: {success}
```

#### `backend/src/services/domainVerifier.ts`
Serviço de verificação de DNS e validação de domínios.

**Métodos:**
- `async verifyDNS(domain: string, expectedCNAME: string): Promise<boolean>`
  - Usa `dns.promises.resolveCname(domain)`
  - Retorna `true` se CNAME === "hosting.lexonline.com.br"
  - Registra logs de cada tentativa

- `async validateDomain(domain: string): Promise<ValidationResult>`
  - Verifica sintaxe do domínio (RFC 1123)
  - Verifica se domínio já está em uso
  - Retorna `{valid: boolean, error?: string}`

#### `backend/src/services/firebaseHostingService.ts`
Integração com Firebase Hosting para associação de domínios customizados.

**Métodos:**
- `async addDomainToHosting(pageId: string, customDomain: string): Promise<void>`
  - Usa Firebase Admin SDK
  - Associa domínio ao site publicado
  - Gera certificado SSL automático via Firebase

- `async removeDomainFromHosting(customDomain: string): Promise<void>`
  - Remove domínio do Firebase
  - Desassocia SSL

### Frontend

#### `frontend/src/page/settings/DomainSettings.tsx`
Página de configuração de domínios dentro de Settings.

**Seções:**
1. **Subdomínio Gratuito** (sempre ativo)
   - Exibe: `[slug].lexonline.com.br`
   - Badge: ✅ Ativo
   - Campo read-only

2. **Domínio Próprio** (Profissional+)
   - Verificação de plano antes de renderizar
   - Input: campo para inserir domínio
   - Botão: "Verificar disponibilidade"
   - Exibe: contagem atual vs. limite do plano

3. **Stepper de Configuração** (3 passos)
   - Passo 1: "Acesse seu painel de domínios"
   - Passo 2: "Crie o registro CNAME"
   - Passo 3: "Aguarde verificação"
   - Cada passo com instruções e ícone de progresso

4. **Tabela de Domínios Customizados**
   - Colunas: Domínio | Status | Criado em | Ações
   - Status com badge: ⏳ Verificando | ✅ Ativo | ❌ Erro
   - Botão delete para cada domínio

#### `frontend/src/hooks/useDomain.ts`
Hook customizado para gerenciamento de estado de domínios.

**State:**
```typescript
{
  domains: Domain[];
  loading: boolean;
  error: string | null;
  verifyingDomainId: string | null;
  planLimits: {
    essential: 0,
    professional: 3,
    agency: 25
  };
}
```

**Funções:**
- `async addDomain(domain: string): Promise<void>`
- `async removeDomain(domainId: string): Promise<void>`
- `async verifyDomain(domainId: string): Promise<void>` (polling)
- `async checkAvailability(domain: string): Promise<{available: boolean}>`

---

## Fluxo de Usuário

### 1. Cadastro de Domínio Customizado
```
Usuário clica "Verificar disponibilidade"
    ↓
Frontend valida domínio localmente
    ↓
POST /api/page/:id/domain {domain}
    ↓
Backend verifica:
  - Limite do plano (3 para Profissional)
  - Sintaxe válida
  - Não registrado em outro site
    ↓
Registra com status: "pending"
    ↓
Retorna instruções DNS e stepper
```

### 2. Verificação DNS (Polling)
```
Usuário adiciona CNAME apontando para "hosting.lexonline.com.br"
    ↓
Frontend inicia polling GET /api/page/:id/domain/:domainId/verify
    ↓
A cada 30 segundos:
  domainVerifier.verifyDNS(domain)
    ↓
Se dns.promises.resolveCname() === "hosting.lexonline.com.br":
  - status = "active"
  - Firebase associa SSL automaticamente
  - Badge muda para ✅ Ativo
    ↓
Pare polling
```

### 3. Após Domínio Ativo
```
Quando status = "active":
  - Página acessível em: customdomain.com
  - SSL ativo automaticamente
  - Firebase cuida de renovação
  - Subdomínio gratuito também continua funcionando
```

---

## Limites por Plano

| Plano | Limite | Detalhes |
|-------|--------|----------|
| Essencial | 0 | Sem domínio customizado, apenas subdomínio gratuito |
| Profissional | 3 | Até 3 domínios customizados por site |
| Agência | 25 | Até 25 domínios customizados por site |

---

## Interface Detalhada

### Subdomínio Gratuito (sempre visível)
```
┌─────────────────────────────────────────┐
│ Seu subdomínio gratuito                 │
├─────────────────────────────────────────┤
│ 🌐 meustudio.lexonline.com.br           │
│    ✅ Ativo                              │
│                                          │
│ [Copiar] [Abrir em nova aba]            │
└─────────────────────────────────────────┘
```

### Seção Domínio Próprio (Profissional+)
```
┌─────────────────────────────────────────┐
│ Adicionar domínio próprio                │
├─────────────────────────────────────────┤
│ 📌 Plano suporta: 3 domínios             │
│    Em uso: 1 de 3                       │
│                                          │
│ [_______________] [Verificar]           │
│  seu-dominio.com.br                    │
│                                          │
│ Domínios cadastrados:                   │
│ ┌──────────────────────────────────────┐│
│ │ advocacia.com.br  ✅ Ativo   [×]     ││
│ │ juridico.com.br   ⏳ Verificando [×] ││
│ └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Stepper de Configuração
```
Step 1: Acesse seu painel de domínios
├─ Faça login em seu registrador (Registro.br, HostGator, etc)
└─ Localize o DNS da sua conta

Step 2: Crie o registro CNAME
├─ Nome: seu-dominio.com.br
├─ Valor: hosting.lexonline.com.br
├─ TTL: 3600 (padrão)
└─ [Copiar valor]

Step 3: Aguarde verificação
├─ Pode levar de 1 a 48 horas
├─ Verificamos a cada 30 segundos
└─ Badge mostrará ✅ quando ativo
```

---

## Banco de Dados

### Tabela: `custom_domains`
```sql
CREATE TABLE custom_domains (
  id VARCHAR(36) PRIMARY KEY,
  page_id VARCHAR(36) NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE,
  status ENUM('pending', 'active', 'error') DEFAULT 'pending',
  error_message TEXT,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);
```

---

## Critérios de Aceitação

- [ ] Subdomínio gratuito `[slug].lexonline.com.br` funciona imediatamente
- [ ] Interface de Domínio Próprio apenas visível para Profissional+
- [ ] Stepper visual com 3 passos de configuração
- [ ] Verificação DNS detecta CNAME correto
- [ ] Polling automático a cada 30s atualiza status
- [ ] Firebase Hosting associa SSL automaticamente
- [ ] Página publicada acessível via domínio customizado com HTTPS
- [ ] Limites de domínio respeitam plano (0, 3, 25)
- [ ] Erro DNS mostra mensagem clara ao usuário
- [ ] Remoção de domínio não afeta publicação

---

## Notas Técnicas

- **SSL:** Firebase Hosting gerencia certificados automaticamente
- **TTL DNS:** Usar 3600s para propagação rápida
- **Polling:** Intervalo de 30s é agressivo mas aceitável para UX
- **Limite de requisições:** Implementar rate-limit no endpoint verify
- **Backup:** Subdomínio gratuito continua funcionando mesmo com erro no customizado
