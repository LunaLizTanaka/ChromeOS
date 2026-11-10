# Internet v0.5.0 — navegador interno experimental

**Versão:** 0.5.0  
**Data:** 10/11/2026

## O que foi adicionado

- Navegação interna por iframe isolado, mantendo a opção de abrir o endereço em uma nova aba do Chrome.
- Barra de endereço que aceita URLs e termos de pesquisa.
- Botões Voltar, Avançar e Recarregar para as navegações iniciadas pela própria janela Internet.
- Atalhos para Tumblr, Neocities e Internet Archive.
- Diretórios Neocities por tags e uma seleção inicial: Sweet-pea, Sakura Dreams, Pixel Safari e Neocities RSS List.
- Atalhos de descoberta para YouTube, itch.io, CodePen e Spotify.
- Conversão automática de URLs reconhecidas:
  - YouTube (watch, youtu.be, shorts e live) para o player de incorporação.
  - Internet Archive /details/IDENTIFICADOR para /embed/IDENTIFICADOR.
  - Spotify para o player /embed/tipo/ID.
  - CodePen /usuario/pen/ID para /usuario/embed/ID.
  - Google Forms viewform para a variante com embedded=true.

## Limites reais

A janela utiliza iframe e não é um navegador Chromium independente. Sites podem enviar X-Frame-Options ou CSP frame-ancestors para bloquear a incorporação. O Galaxy não tenta contornar essas políticas. Login, cookies de terceiros, reprodução de mídia e interações podem funcionar de forma diferente dentro de um iframe.

O evento load do iframe não confirma que o conteúdo ficou visível. Por isso, a interface avisa a pessoa usuária para verificar o resultado e mantém a opção ABRIR NO CHROME. Links internos clicados dentro de páginas externas não são adicionados ao histórico do Galaxy; Voltar/Avançar acompanham apenas as navegações iniciadas pelos controles e atalhos do Galaxy.

Conteúdo de terceiros permanece dentro do iframe. O Galaxy não injeta scripts remotos no DOM principal.

## Arquivos alterados

- src/apps/internet-manager.js — navegação, histórico, conversão de embeds e fallback.
- src/apps/app-registry.js — inicialização modular da Internet.
- src/apps/app-templates.js — interface e catálogo.
- styles/internet.css — estilos isolados da janela Internet.
- index.html — carrega a nova folha de estilos.
- src/main.js, package.json, README.md — versão e verificação do projeto.
