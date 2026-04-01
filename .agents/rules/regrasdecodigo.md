---
trigger: always_on
---

TypeScript estrito — tipagem explícita em tudo. any é proibido sem exceção.
Chamadas à API — exclusivamente em /services. Nunca dentro de componentes ou hooks.
Autenticação — sempre via middleware/auth.ts existente. Nunca reimplemente verificação de JWT.
Estilo visual — siga os padrões Tailwind CSS já presentes no projeto. Não introduza bibliotecas de UI externas.
