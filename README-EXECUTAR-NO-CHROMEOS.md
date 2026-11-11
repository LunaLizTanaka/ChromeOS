# Galaxy Legacy v1.0.1 — executar no ChromeOS

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

## Biblioteca de leitura

Abra **Biblioteca** pelo atalho lateral ou pelo dock. Ela reúne livros, novels e fanfics, sem Novel Updates ou atalhos de mangá. A estante local mantém seus links salvos. Consulte `docs/INTERNET_BIBLIOTECA_V0.9.0.md` para detalhes.

## Abrir os menus

Mova o ponteiro até os primeiros 44 pixels da borda esquerda para abrir os atalhos ou até a borda inferior para abrir o dock. Ao abrir, a zona invisível deixa de interceptar os cliques. Na tela de toque, toque na borda correspondente.

## Internet

O aplicativo Internet agora funciona como navegador integrado: crie abas com ＋ ou Ctrl+T, digite endereço ou pesquisa na barra superior, alterne entre Google, Bing e DuckDuckGo, use voltar/avançar/recarregar, salve favoritos com ☆, consulte o histórico com ◷ e use Ctrl+F quando o site permitir. A homepage rosa, a pesquisa do Archive.org e os atalhos Neocities continuam disponíveis. Use ↗ para abrir no Chrome páginas que bloqueiem incorporação. A pesquisa da homepage abre resultados públicos do Archive.org, o banner pode ser alterado pelo botão ESCOLHER IMAGEM e a imagem fica salva localmente. Para voltar em páginas externas, o Galaxy controla o histórico que foi aberto pela própria barra; links internos continuam sob controle do site. Mais detalhes em `docs/INTERNET_BROWSER_V1.0.1.md`.

## Aplicativos e armazenamento

O desktop inicia sem janelas abertas. Abra os aplicativos pelos atalhos laterais ou pelo dock. Cat Club/Catz foi removido.

Notas e preferências visuais usam o armazenamento local do navegador. O wallpaper personalizado usa IndexedDB. Files apenas lista os arquivos selecionados; não faz upload. Nuvem e sincronização ainda não estão conectadas.

## Publicação como PWA

O projeto está preparado com Web App Manifest. Para instalar como aplicativo no ChromeOS, publique esta pasta em HTTPS e use a opção de instalação do Chrome. A configuração do GitHub Pages deve usar a origem **GitHub Actions**; a URL de produção só pode ser confirmada depois que o workflow executar com sucesso.


## Notes e papéis adesivos

1. Abra **Notes** pelo menu lateral ou pelo dock.
2. Use **+ NOVA NOTA** para criar uma nota. O título e o texto são salvos automaticamente.
3. Escolha **Texto livre** ou **Checklist** e selecione a cor do papel.
4. Clique em **FIXAR NO DESKTOP** para deixar um papel na área de trabalho.
5. Arraste pela barra de título do papel e redimensione pelo canto inferior direito.
6. Fechar a janela Notes não remove os papéis. Para editar, use o lápis no cartão. **DESAFIXAR DO DESKTOP** remove somente o cartão, mantendo a nota salva.
7. Use **EXPORTAR** para criar um JSON de backup e **IMPORTAR** para restaurar uma coleção.

O texto antigo em `gl-notes` é migrado automaticamente para a primeira nota e mantido como cópia de recuperação. Os dados são locais ao navegador/perfil; não há nuvem nesta versão.
