import React, { useState } from 'react';
import { useDomain } from '@/hooks/useDomain';
import type { Domain, AddDomainResponse } from '@/types/page.types';

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Domain['status'] }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Ativo
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Erro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      Verificando
    </span>
  );
}

function ConfigStepper({ instructions }: { instructions: AddDomainResponse }) {
  const [copied, setCopied] = useState(false);

  function copyValue() {
    void navigator.clipboard.writeText(instructions.instructions.cname.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-4">
      <p className="text-sm font-semibold text-blue-800">
        Configure o DNS para ativar seu domínio:
      </p>

      <ol className="space-y-3">
        {instructions.instructions.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-slate-700">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="rounded-lg border border-blue-200 bg-white p-3 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Registro CNAME
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-slate-400 text-xs">Nome</span>
            <p className="font-mono text-slate-800 text-xs break-all">
              {instructions.instructions.cname.name}
            </p>
          </div>
          <div>
            <span className="text-slate-400 text-xs">Valor</span>
            <div className="flex items-center gap-1">
              <p className="font-mono text-slate-800 text-xs break-all">
                {instructions.instructions.cname.value}
              </p>
              <button
                onClick={copyValue}
                className="flex-shrink-0 text-blue-600 hover:text-blue-800 text-xs underline"
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-xs">TTL</span>
            <p className="font-mono text-slate-800 text-xs">
              {instructions.instructions.cname.ttl}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        A propagação pode levar até 48h. Verificamos automaticamente a cada 30 segundos.
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface DomainSettingsProps {
  pageId: string;
  pageSlug?: string;
  userPlan?: 'essential' | 'professional' | 'agency';
}

export function DomainSettings({ pageId, pageSlug, userPlan = 'essential' }: DomainSettingsProps) {
  const {
    domains,
    freeSubdomain,
    planLimit,
    loading,
    error,
    verifyingDomainId,
    pendingInstructions,
    addDomain,
    removeDomain,
    verifyDomain,
    checkAvailability,
    clearPendingInstructions,
  } = useDomain(pageId);

  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedSubdomain, setCopiedSubdomain] = useState(false);

  const displaySubdomain = freeSubdomain || (pageSlug ? `${pageSlug}.lexonline.com.br` : '');
  const isPlanAllowed = userPlan !== 'essential' && planLimit > 0;

  function copySubdomain() {
    void navigator.clipboard.writeText(displaySubdomain);
    setCopiedSubdomain(true);
    setTimeout(() => setCopiedSubdomain(false), 2000);
  }

  async function handleAdd() {
    setInputError('');
    const check = await checkAvailability(inputValue);
    if (!check.available) {
      setInputError(check.error ?? 'Domínio inválido');
      return;
    }

    setAdding(true);
    await addDomain(inputValue.trim().toLowerCase());
    setInputValue('');
    setAdding(false);
  }

  async function handleDelete(domainId: string) {
    setDeletingId(domainId);
    await removeDomain(domainId);
    setDeletingId(null);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Domínios</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gerencie os domínios associados a esta página.
        </p>
      </div>

      {/* ── Subdomínio Gratuito ── */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Subdomínio gratuito</h3>
        </div>
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg">🌐</span>
            <div className="min-w-0">
              <p className="font-mono text-sm text-slate-800 truncate">{displaySubdomain}</p>
              <StatusBadge status="active" />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={copySubdomain}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {copiedSubdomain ? 'Copiado!' : 'Copiar'}
            </button>
            <a
              href={`https://${displaySubdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Abrir
            </a>
          </div>
        </div>
      </section>

      {/* ── Domínio Próprio (Profissional+) ── */}
      {!isPlanAllowed ? (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-2xl mb-2">🔒</p>
          <p className="text-sm font-semibold text-slate-700">Disponível no Plano Profissional</p>
          <p className="text-xs text-slate-500 mt-1">
            Associe até 3 domínios próprios com SSL automático.
          </p>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Domínio próprio</h3>
            <span className="text-xs text-slate-400">
              {domains.length} de {planLimit} usado{planLimit !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="p-4 space-y-4">
            {/* Input de novo domínio */}
            {domains.length < planLimit && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setInputError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && !adding && void handleAdd()}
                    placeholder="seu-dominio.com.br"
                    className={`flex-1 text-sm px-3 py-2 rounded-lg border transition-colors outline-none
                      ${inputError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-400'}`}
                  />
                  <button
                    onClick={() => void handleAdd()}
                    disabled={adding || !inputValue.trim()}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {adding ? 'Verificando...' : 'Verificar'}
                  </button>
                </div>
                {inputError && (
                  <p className="text-xs text-red-600">{inputError}</p>
                )}
              </div>
            )}

            {/* Instruções de configuração DNS */}
            {pendingInstructions && (
              <div>
                <ConfigStepper instructions={pendingInstructions} />
                <button
                  onClick={clearPendingInstructions}
                  className="mt-2 text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Fechar instruções
                </button>
              </div>
            )}

            {/* Erro global */}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Tabela de domínios */}
            {loading && domains.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : domains.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                    <th className="text-left pb-2">Domínio</th>
                    <th className="text-left pb-2">Status</th>
                    <th className="text-left pb-2">Criado em</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {domains.map((d) => (
                    <tr key={d.id} className="group">
                      <td className="py-3 font-mono text-xs text-slate-800 pr-2">{d.domain}</td>
                      <td className="py-3 pr-2">
                        <StatusBadge status={d.status} />
                        {d.error_message && (
                          <p className="text-xs text-red-500 mt-0.5">{d.error_message}</p>
                        )}
                      </td>
                      <td className="py-3 text-xs text-slate-400 pr-2">{formatDate(d.created_at)}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {d.status !== 'active' && (
                            <button
                              onClick={() => void verifyDomain(d.id)}
                              disabled={verifyingDomainId === d.id}
                              className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                              {verifyingDomainId === d.id ? 'Verificando...' : 'Verificar'}
                            </button>
                          )}
                          <button
                            onClick={() => void handleDelete(d.id)}
                            disabled={deletingId === d.id}
                            className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {deletingId === d.id ? '...' : 'Remover'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                Nenhum domínio customizado cadastrado ainda.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default DomainSettings;
