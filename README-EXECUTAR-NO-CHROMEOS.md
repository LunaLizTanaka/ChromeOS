# Galaxy Legacy v0.3.4 — executar no ChromeOS

## Executar a versão modular completa

1. Baixe o ZIP do projeto e extraia a pasta.
2. Mova a pasta para **Arquivos do Linux** no aplicativo Arquivos.
3. Abra o Terminal e execute:

```bash
cd ~/Galaxy-Legacy-ChromeOS-v0.3.4
python3 -m http.server 8000
```

4. Deixe o Terminal aberto e abra no Chrome: http://localhost:8000
5. Para encerrar o servidor, volte ao Terminal e pressione `Ctrl+C`.

Não é necessário executar `npm install`. O projeto usa HTML, CSS e ES Modules nativos. Não abra o `index.html` modular por duplo clique: módulos JavaScript precisam de HTTP/HTTPS.

## Abrir sem Terminal

Use o arquivo standalone incluído em `standalone/` e abra-o pelo aplicativo Arquivos com o Google Chrome. Essa edição reúne HTML, CSS e JavaScript em um único arquivo, mas não substitui a versão modular principal.

## Abrir os menus

Mova o ponteiro até os primeiros 44 pixels da borda esquerda para abrir os atalhos ou até a borda inferior para abrir o dock. Ao abrir, a zona invisível deixa de interceptar os cliques. Na tela de toque, toque na borda correspondente.

## Internet

No aplicativo Internet, digite uma URL ou termo de pesquisa e clique em **NAVEGAR**. O destino abre em uma nova aba do Chrome. **TENTAR ABRIR AQUI** tenta incorporar a página dentro da janela, mas alguns sites bloqueiam esse comportamento. Use **ABRIR NO CHROME** como alternativa.

## Aplicativos e armazenamento

O desktop inicia sem janelas abertas. Abra os aplicativos pelos atalhos laterais ou pelo dock. Cat Club/Catz foi removido.

Notas e preferências visuais usam o armazenamento local do navegador. O wallpaper personalizado usa IndexedDB. Files apenas lista os arquivos selecionados; não faz upload. Nuvem e sincronização ainda não estão conectadas.

## Publicação como PWA

O projeto está preparado com Web App Manifest. Para instalar como aplicativo no ChromeOS, publique esta pasta em HTTPS e use a opção de instalação do Chrome. A configuração do GitHub Pages deve usar a origem **GitHub Actions**; a URL de produção só pode ser confirmada depois que o workflow executar com sucesso.
