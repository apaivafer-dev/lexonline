# SOLUÇÃO DEPLOY FIREBASE - LexOnline

Este documento registra os problemas enfrentados durante a configuração do domínio `lexonline.com.br` no Resend e como conseguimos destravar o deploy das Cloud Functions.

## 1. O Problema: Erro 403 (Permission Denied)
Ao tentar executar o comando padrão `firebase deploy`, o processo era interrompido com a seguinte mensagem de erro:
`Error: Request to https://firebaseextensions.googleapis.com/... had HTTP Error: 403, The caller does not have permission`

### Causa:
O Firebase CLI tenta verificar instâncias de **Firebase Extensions** instaladas no projeto por padrão. Mesmo que o projeto não utilize extensões, se a conta do desenvolvedor não tiver a permissão específica (`firebaseextensions.api.get`) ou se a API de Extensões não estiver devidamente ativada/configurada no Google Cloud, o deploy inteiro é cancelado.

---

## 2. A Solução Aplicada

Para resolver e conseguir subir as alterações do novo domínio de e-mail, seguimos esta estratégia:

### Passo A: Atualização Direta de Segredos
Como o backend lê as chaves sensíveis (como a do Resend) do Secret Manager, primeiro atualizamos o segredo na nuvem:
```powershell
cmd /c "npx firebase-tools functions:secrets:set FUNCTIONS_CONFIG_EXPORT"
```
Isso garantiu que, independente do código, as credenciais estivessem corretas.

### Passo B: Deploy Cirúrgico (Ignorando Extensões)
Para subir a alteração no código (`utils/email.ts`) que define o remetente `no-reply@lexonline.com.br`, usamos um comando que especifica apenas o backend e ignora a análise global de extensões:
```powershell
cmd /c "npx firebase-tools deploy --only functions:api"
```

### Passo C: Contorno de Política do Windows
O PowerShell no Windows costuma bloquear o `npx` por falta de assinatura digital de scripts. A solução foi prefixar os comandos com `cmd /c` para usar o interpretador clássico do Windows, que não possui essa restrição.

---

## 3. Resumo da Configuração de E-mail
*   **Domínio**: `lexonline.com.br`
*   **Remetente**: `LexOnline <no-reply@lexonline.com.br>`
*   **API**: Firebase Functions v2 (`api`)
*   **Data da Solução**: 26/02/2026

## 4. Próximos Deploys
Caso o erro 403 persista em deploys futuros, utilize sempre a flag `--only functions` ou `--only hosting` separadamente para evitar que o Firebase CLI tente consultar a API de Extensões.
