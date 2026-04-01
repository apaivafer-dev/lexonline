---
trigger: always_on
---

Responsabilidade única - Cada arquivo tem exatamente uma responsabilidade.
Limite frontend - Nenhum componente React ultrapassa 450 linhas. Se ultrapassar, divida.
Limite backend - Nenhum arquivo backend ultrapassa 500 linhas. Se ultrapassar, extraia.
Separação de lógica - Lógica de negócio nunca fica em componentes visuais. Vai em hooks/use[NomeDaFuncao].ts.
Um componente por arquivo - Um arquivo .tsx = um único componente exportado como default.
Tipos - types/[nome].types.ts
Constantes e listas fixas - constants/[nome].constants.ts
Funções utilitárias puras - utils/[nome].utils.ts
Serviços de API - services/[nome].service.ts — nenhuma chamada fetch/axios fora daqui.
