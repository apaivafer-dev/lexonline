# Convenção de Commits - LexOnline

Para manter o histórico do projeto organizado e facilitar a geração de changelogs, seguimos o padrão **Conventional Commits**.

## Formato do Commit

`<tipo>(<escopo>): <descrição curta>`

### Tipos Permitidos:

- **feat**: Uma nova funcionalidade.
- **fix**: Correção de algum bug.
- **docs**: Alterações apenas na documentação.
- **style**: Alterações que não afetam o significado do código (espaço em branco, formatação, falta de ponto e vírgula, etc).
- **refactor**: Uma alteração de código que não corrige um bug nem adiciona uma funcionalidade.
- **perf**: Uma alteração de código que melhora o desempenho.
- **test**: Adição de testes parados ou correção de testes existentes.
- **build**: Alterações que afetam o sistema de build ou dependências externas (ex: npm, tsc).
- **ci**: Alterações em nossos arquivos e scripts de configuração de CI.
- **chore**: Outras alterações que não modificam os arquivos `src` ou `test`.

### Exemplos:

- `feat(auth): implementar suporte a cookies HttpOnly`
- `fix(calc): corrigir erro no cálculo de décimo terceiro proporcional`
- `docs(readme): atualizar guia de instalação local`
- `refactor(db): migrar isolamento de user_id para company_id`

## Regras Adicionais:

1. Use o imperativo ("adicionar", não "adicionado").
2. Não capitalize a primeira letra da descrição.
3. Não use ponto final ao final da descrição.
