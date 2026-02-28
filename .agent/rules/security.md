---
description: Diretrizes de Segurança baseadas no OWASP Top 10
---

# Diretrizes de Segurança (OWASP Top 10)

Ao implementar ou alterar qualquer parte da aplicação (Frontend ou Backend), é OBRIGATÓRIO seguir as diretrizes de segurança abaixo baseadas no OWASP Top 10. Nunca sacrifique a segurança pela velocidade de entrega.

## 1. Quebra de Controle de Acesso (Broken Access Control)
- **Princípio do Privilégio Mínimo:** Conceda o nível mínimo de acesso necessário.
- **Validação no Servidor:** Nunca confie no cliente (Frontend) para tomar decisões de autorização. O backend deve revalidar todas as permissões em cada requisição.
- **Isolamento de Tenants (Multitenant):** Todas as queries feitas no backend que retornam dados sensíveis ou manipulam registros devem **sempre** filtrar por `user_id` ou `company_id`. Por exemplo: `SELECT * FROM leads WHERE id = ? AND user_id = ?`.

## 2. Falhas Criptográficas (Cryptographic Failures)
- **Criptografia em Repouso e Trânsito:** Certifique-se de que os dados (como senhas) sejam hasheados com algoritmos fortes (ex: bcrypt, Argon2).
- **Sem Dados no Front:** As senhas nunca devem ser expostas, mesmo em `select *` que vai para o cliente logado.

## 3. Injeção (Injection: SQL/NoSQL)
- **Consultas Parametrizadas:** SEMPRE use *Prepared Statements* ou ORM. Nunca concatene strings em queries SQL.
- **Validação de Inputs:** Valide e sanitize todos os inputs (exemplo: usar Zod no backend antes de passar o dado para a query).

## 4. Design Inseguro (Insecure Design)
- **Modelagem de Ameaças:** Avalie riscos e fluxos antes de escrever código.
- **Limitação de Requisições (Rate Limiting):** Use mecanismos de Rate Limiting para evitar ataques de Força Bruta e Denial of Service. Evite iterar dados massivos na memória sem paginação.

## 5. Configuração Insegura (Security Misconfiguration)
- **Exposição de Informações:** Nunca retorne "stack traces" completos em respostas da API em ambiente de produção (Cuidado com retornos 500 informativos).
- **Headers de Segurança:** Use cabeçalhos seguros configurados no servidor e CORS restrito, autorizando as origens certas e não `*` para métodos que precisam de credenciais ou cookies.

## 6. Componentes Vulneráveis e Desatualizados
- **Higiene de Dependências:** Mantenha dependências atualizadas; remova código e componentes (bibliotecas) não utilizados para diminuir a superfície de ataque, como verificado anteriormente.

## 7. Falhas de Identificação e Autenticação
- **Sessões Seguras:** Garanta que os cookies ou Tokens JWT não sejam expostos e respeitem as diretivas `HttpOnly` e `Secure`.
- **Validação de Token:** Toda a ação logada deve possuir verificação efetiva do token atual do usuário na assinatura.

## 8. Falhas na Integridade de Software e Dados
- **Verificação de Origem:** Só permita que atualizações e dados venham de fontes esperadas. Assinatura de payloads em chamadas sensíveis, se for pertinente.

## 9. Falhas em Registro e Monitoramento (Logging and Monitoring Defaults)
- **Logs Sensatos:** Não grave senhas ou dados sensíveis (números de cartão de crédito) em logs da aplicação. Mas garanta monitoramento nos eventos de falhas de autenticação e exceções da API.

## 10. Falsificação de Solicitação do Lado do Servidor (SSRF)
- Se a aplicação buscar recursos em URL informada pelo usuário, valide estritamente o domínio para evitar escaneamento ou exfiltração da rede interna do servidor.

---
**NOTA: Este arquivo serve como um contrato. Ao desenvolver *features* futuras no LEXONLINE, aplique esses controles em PR / commits de desenvolvimento.**
