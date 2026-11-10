# Ativar e publicar Galaxy Legacy no GitHub Pages

**Workflow:** Deploy Galaxy Legacy to GitHub Pages  
**Branch:** main  
**Diretório publicado:** raiz da aplicação (index.html)

## 1. Ativação inicial obrigatória

O repositório ainda não tinha um site GitHub Pages criado. A primeira execução do workflow parou no passo Configure Pages com erro 404 porque não havia site configurado.

A execução seguinte tentou habilitar Pages automaticamente, mas a integração conectada não tem permissão administrativa para criar o site (erro `Resource not accessible by integration`). Isso não é um erro do HTML, CSS ou JavaScript.

A pessoa proprietária do repositório precisa fazer esta ativação única:

1. Abra https://github.com/LunaLizTanaka/ChromeOS/settings/pages
2. Em **Build and deployment**, encontre **Source**.
3. Selecione **GitHub Actions**.
4. Salve, se o GitHub apresentar um botão de confirmação.

Não selecione “Deploy from a branch”: o workflow já prepara e publica os arquivos estáticos.

## 2. Executar o workflow

Depois de habilitar Pages:

1. Abra https://github.com/LunaLizTanaka/ChromeOS/actions
2. Selecione **Deploy Galaxy Legacy to GitHub Pages**.
3. Clique em **Run workflow**, escolha `main` e confirme.

O workflow também inicia automaticamente em cada novo push na branch main.

## 3. Confirmar a publicação

Aguarde a execução terminar com estado **success**. Abra os detalhes e confira a etapa **Deploy to GitHub Pages**. A URL publicada aparece:
- no resumo da execução;
- no ambiente `github-pages`;
- e em Settings → Pages.

Não considere a PWA publicada enquanto o deploy não terminar com sucesso.

## 4. O que o workflow publica

- `index.html`
- `manifest.webmanifest`
- `styles/`
- `src/`
- `assets/`

Documentos, scripts de verificação e arquivos de planejamento ficam no repositório, mas não são necessários no site publicado.

## 5. Instalar como aplicativo no ChromeOS

Depois de a URL HTTPS abrir normalmente:

1. Abra o site no Chrome do Chromebook.
2. Use o menu do Chrome ou o ícone de instalação exibido na barra de endereço.
3. Escolha **Instalar Galaxy Legacy** ou **Criar atalho**, conforme a opção apresentada.
4. Marque abrir como janela, se essa opção aparecer.

A instalação como PWA é feita pelo ChromeOS/Chrome; não requer APK nem instalação Linux.

## 6. Estado observado em 10/11/2026

- Arquivos da aplicação e workflow: enviados para `main`.
- Estrutura local do ZIP: `npm run verify` aprovado.
- Primeira execução do workflow: falhou em Configure Pages porque o site ainda não existia.
- Segunda execução com `enablement: true`: a API de criação de Pages respondeu `Resource not accessible by integration`.
- Configuração inicial de Pages: depende da ação manual descrita na seção 1.
- URL de produção: ainda não confirmada; só deve ser compartilhada depois de um deploy bem-sucedido.
