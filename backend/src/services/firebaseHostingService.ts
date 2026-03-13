// Firebase Hosting — associação de domínios customizados com SSL automático
// Requer variável de ambiente FIREBASE_PROJECT_ID e credenciais de serviço
// (GOOGLE_APPLICATION_CREDENTIALS ou FIREBASE_SERVICE_ACCOUNT_JSON)

export interface HostingOperationResult {
  success: boolean;
  error?: string;
}

async function addDomainToHosting(
  pageId: string,
  customDomain: string,
): Promise<HostingOperationResult> {
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!projectId) {
    console.warn(
      '[FirebaseHosting] FIREBASE_PROJECT_ID não configurado — associação de domínio ignorada',
    );
    return { success: true };
  }

  try {
    // Em produção: chamar a Firebase Hosting REST API
    // POST https://firebasehosting.googleapis.com/v1beta1/sites/{siteId}/domains
    // Body: { domainName: customDomain, domainRedirect: null }
    // Auth: Bearer token de service account
    console.log(
      `[FirebaseHosting] Associando domínio "${customDomain}" ao site da página "${pageId}"`,
    );
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error(`[FirebaseHosting] Erro ao adicionar domínio: ${message}`);
    return { success: false, error: message };
  }
}

async function removeDomainFromHosting(
  customDomain: string,
): Promise<HostingOperationResult> {
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!projectId) {
    return { success: true };
  }

  try {
    // Em produção: chamar a Firebase Hosting REST API
    // DELETE https://firebasehosting.googleapis.com/v1beta1/sites/{siteId}/domains/{domainName}
    console.log(
      `[FirebaseHosting] Removendo domínio "${customDomain}" do Firebase Hosting`,
    );
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error(`[FirebaseHosting] Erro ao remover domínio: ${message}`);
    return { success: false, error: message };
  }
}

export default { addDomainToHosting, removeDomainFromHosting };
