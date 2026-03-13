import Anthropic from '@anthropic-ai/sdk';

// ─── Types ────────────────────────────────────────────────────────────────────

export type GenerateTextType =
  | 'headline'
  | 'bio'
  | 'service-description'
  | 'blog-post'
  | 'testimonial-request'
  | 'about'
  | 'faq-answer';

export interface GenerateTextRequest {
  area?: string;
  especialidade?: string;
  publicoAlvo?: string;
  tom?: string;
  nicho?: string;
  cidade?: string;
  experiencia?: string;
  servico?: string;
  contextoExtra?: string;
}

export interface SeoOptimization {
  title: string;
  metaDescription: string;
  keywords: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Suggestion {
  element: string;
  text: string;
  priority: 'alta' | 'media' | 'baixa';
}

// ─── System Prompt Base ───────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Você é especialista em marketing jurídico digital brasileiro. Sua missão é
criar conteúdo profissional, persuasivo e em conformidade com o Código de
Ética e Disciplina da OAB (Resolução 02/2015).

ESTRITAMENTE PROIBIDO:
- Mercantilização da profissão (captação agressiva)
- Promessas de resultados ("garantia de ganhar", "com 100% de êxito")
- Depoimentos de clientes reais identificados
- Comparação direta com concorrentes
- Publicidade em meios impróprios
- Solicitar dados pessoais em formulários enganosos

SEMPRE FAZER:
- Usar linguagem técnica mas acessível ao público leigo
- Focar em direitos do cliente e proteção legal
- Incluir prova social ética (certificações, associações profissionais)
- Destacar credenciais e especialidade do advogado
- Educar sobre os temas jurídicos envolvidos
- Respeitar privacidade e confidencialidade
- Ser honesto sobre limitações e complexidades legais
- Usar "pode ajudar", "busca por", "procura proteger" — nunca "garante", "certeza", "vai ganhar"

Escreva em português brasileiro formal mas acessível. Use exemplos reais mas genéricos.
Crie urgência através de educação sobre direitos, não de pressão emocional.
Retorne APENAS o conteúdo solicitado, sem explicações ou comentários adicionais.`;

// ─── Prompt Builders ──────────────────────────────────────────────────────────

const TYPE_PROMPTS: Record<GenerateTextType, (ctx: GenerateTextRequest) => string> = {
  headline: (ctx) => `
Área: ${ctx.area ?? 'Direito'}
Especialidade: ${ctx.especialidade ?? 'Consultoria Jurídica'}
Público-alvo: ${ctx.publicoAlvo ?? 'Clientes em geral'}
${ctx.cidade ? `Cidade: ${ctx.cidade}` : ''}
${ctx.contextoExtra ? `Contexto adicional: ${ctx.contextoExtra}` : ''}

Gere um headline persuasivo para uma página de advogado especializado nessa área.
Máximo 80 caracteres. Foque no direito e benefício do cliente, não no advogado.
Responda apenas com o headline, sem aspas ou pontuação desnecessária.`,

  bio: (ctx) => `
Área: ${ctx.area ?? 'Direito'}
Especialidade: ${ctx.especialidade ?? ''}
Experiência: ${ctx.experiencia ?? 'vários anos'}
${ctx.contextoExtra ? `Contexto adicional: ${ctx.contextoExtra}` : ''}

Escreva uma bio profissional de advogado especialista nessa área.
Destaque credenciais, formação, filosofia de trabalho.
Entre 200 e 300 palavras. Tom formal mas acessível.`,

  'service-description': (ctx) => `
Área: ${ctx.area ?? 'Direito'}
Serviço: ${ctx.servico ?? ctx.especialidade ?? 'Consultoria Jurídica'}
${ctx.publicoAlvo ? `Público: ${ctx.publicoAlvo}` : ''}
${ctx.contextoExtra ? `Contexto adicional: ${ctx.contextoExtra}` : ''}

Descreva este serviço jurídico em linguagem clara e educativa.
Explique o que o serviço cobre, riscos envolvidos e como o advogado protege o cliente.
Entre 150 e 200 palavras.`,

  'blog-post': (ctx) => `
Área: ${ctx.area ?? 'Direito'}
Tema: ${ctx.especialidade ?? ctx.nicho ?? 'Direitos do Cidadão'}
${ctx.publicoAlvo ? `Público: ${ctx.publicoAlvo}` : ''}
${ctx.contextoExtra ? `Contexto adicional: ${ctx.contextoExtra}` : ''}

Escreva um post de blog educativo sobre este tema jurídico.
Use subtítulos, seja informativo e educativo. Tom acessível.
Entre 400 e 600 palavras. Inclua uma chamada para ação ética no final.`,

  'testimonial-request': (ctx) => `
Área: ${ctx.area ?? 'Direito'}
${ctx.contextoExtra ? `Contexto: ${ctx.contextoExtra}` : ''}

Escreva um texto modelo de solicitação de avaliação/depoimento para clientes.
Deve ser sutil, ético, sem pressão. O texto será enviado por e-mail após o encerramento do caso.
Máximo 100 palavras.`,

  about: (ctx) => `
Área: ${ctx.area ?? 'Direito'}
Especialidade: ${ctx.especialidade ?? ''}
${ctx.experiencia ? `Experiência: ${ctx.experiencia}` : ''}
${ctx.cidade ? `Cidade: ${ctx.cidade}` : ''}
${ctx.contextoExtra ? `Contexto adicional: ${ctx.contextoExtra}` : ''}

Escreva uma seção "Sobre nós" ou "Quem somos" para escritório de advocacia.
Destaque valores, missão, compromisso com o cliente, especialidades.
Entre 150 e 250 palavras.`,

  'faq-answer': (ctx) => `
Área: ${ctx.area ?? 'Direito'}
Nicho: ${ctx.nicho ?? ctx.especialidade ?? ''}
Pergunta: ${ctx.contextoExtra ?? 'O que devo fazer se meus direitos forem violados?'}

Responda esta pergunta frequente de forma educativa, clara e ética.
Máximo 150 palavras. Oriente o leitor a buscar orientação jurídica específica.`,
};

// ─── Client ───────────────────────────────────────────────────────────────────

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY não configurada');
  return new Anthropic({ apiKey });
}

// ─── Methods ──────────────────────────────────────────────────────────────────

/**
 * Streaming: yields text chunks one by one.
 * Caller is responsible for writing to SSE response.
 */
async function* generateText(
  type: GenerateTextType,
  context: GenerateTextRequest,
): AsyncGenerator<string> {
  const client = getClient();
  const buildPrompt = TYPE_PROMPTS[type];
  const userPrompt = buildPrompt(context);

  const stream = client.messages.stream({
    model: process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text;
    }
  }
}

async function generateSeo(
  pageContent: string,
  city: string,
): Promise<SeoOptimization> {
  const client = getClient();

  const prompt = `Analise este conteúdo de página de advogado e gere otimizações de SEO:

Conteúdo: ${pageContent.slice(0, 2000)}
Cidade: ${city}

Retorne um JSON válido com exatamente este formato:
{
  "title": "título SEO de 50-60 caracteres incluindo especialidade e cidade",
  "metaDescription": "descrição de 150-160 caracteres com call-to-action sutil",
  "keywords": ["5 a 10 termos long-tail com localidade e especialidade"]
}

Responda APENAS com o JSON, sem texto adicional.`;

  const response = await client.messages.create({
    model: process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return JSON.parse(text) as SeoOptimization;
}

async function generateFaqList(area: string, nicho: string): Promise<FaqItem[]> {
  const client = getClient();

  const prompt = `Crie uma lista de perguntas frequentes (FAQ) para uma página de advogado.

Área: ${area}
Nicho: ${nicho}

Gere entre 10 e 15 perguntas e respostas realistas que clientes fariam.
As respostas devem ser educativas, claras, em conformidade com a OAB.
Cada resposta entre 80 e 150 palavras.

Retorne um JSON válido com exatamente este formato:
[
  { "question": "Pergunta aqui?", "answer": "Resposta aqui." }
]

Responda APENAS com o JSON, sem texto adicional.`;

  const response = await client.messages.create({
    model: process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001',
    max_tokens: 3000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
  return JSON.parse(text) as FaqItem[];
}

async function analyzePage(pageJSON: unknown): Promise<Suggestion[]> {
  const client = getClient();

  const prompt = `Analise a estrutura desta página de advogado e sugira melhorias:

${JSON.stringify(pageJSON, null, 2).slice(0, 3000)}

Retorne um JSON válido com sugestões de melhoria:
[
  {
    "element": "nome do elemento ou seção",
    "text": "sugestão clara e acionável",
    "priority": "alta|media|baixa"
  }
]

Avalie: clareza do conteúdo, conformidade OAB, SEO, conversão, hierarquia visual.
Mínimo 3, máximo 8 sugestões. Responda APENAS com o JSON.`;

  const response = await client.messages.create({
    model: process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
  return JSON.parse(text) as Suggestion[];
}

export default { generateText, generateSeo, generateFaqList, analyzePage };
