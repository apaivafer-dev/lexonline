import dns from 'dns';

export const CNAME_TARGET = 'hosting.lexonline.com.br';

// RFC 1123 domain regex
const DOMAIN_REGEX =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

async function verifyDNS(
  domain: string,
  expectedCNAME = CNAME_TARGET,
): Promise<boolean> {
  try {
    const addresses = await dns.promises.resolveCname(domain);
    const matched = addresses.some(
      (addr) => addr.toLowerCase() === expectedCNAME.toLowerCase(),
    );
    console.log(
      `[DomainVerifier] ${domain} → CNAME: [${addresses.join(', ')}] matched=${matched}`,
    );
    return matched;
  } catch (err) {
    console.log(`[DomainVerifier] DNS lookup failed for ${domain}:`, err);
    return false;
  }
}

async function validateDomain(domain: string): Promise<ValidationResult> {
  if (!domain || typeof domain !== 'string') {
    return { valid: false, error: 'Domínio inválido' };
  }

  const trimmed = domain.trim().toLowerCase();

  if (!DOMAIN_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Formato de domínio inválido. Use o formato: meudominio.com.br',
    };
  }

  if (trimmed.endsWith('lexonline.com.br')) {
    return {
      valid: false,
      error: 'Não é permitido usar subdomínios do lexonline.com.br',
    };
  }

  return { valid: true };
}

export default { verifyDNS, validateDomain, CNAME_TARGET };
