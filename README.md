# Galaxy Legacy — ChromeOS Edition

**Versão:** v1.0.4  
**Plataforma principal:** Chromebook / ChromeOS  
**Tecnologia:** HTML, CSS e JavaScript nativos; ES Modules; PWA preparada para HTTPS  
**Identidade:** pixel art + coquette + kawaii desktop

Galaxy Legacy é um desktop web personalizável executado dentro do Chrome/ChromeOS. Ele não substitui o sistema operacional nem exige APK, root ou instalação Linux. A versão publicada pode ser aberta diretamente em https://galaxy-legacy-chromeos.vercel.app/ sem iniciar o Linux ou um servidor local.

## O que já funciona

- Biblioteca v0.9.0: plataformas de livros, novels e fanfics, sem Novel Updates nem serviços de mangá; pesquisa no Internet Archive e Open Library, BookReader e estante local JSON.


- Desktop vazio ao iniciar: nenhum aplicativo abre sem ação da pessoa usuária.
- Janelas independentes que podem ser arrastadas, minimizadas, maximizadas, restauradas e fechadas.
- Barra superior, atalhos laterais e dock com ativação de mouse em uma faixa de 8 px; controles por toque mantêm uma área de 32 px.
- Barra lateral compacta: 184 px em telas maiores e 104 px em telas estreitas.
- Layout fluido, sem resolução fixa, acompanhando o espaço disponível.
- Aplicativos internos: Mail demonstrativo, Trash, Files demonstrativo, Save Center, Internet, Biblioteca, Notes, Personalize e Picatsso.
- Internet v1.0.3: correção do fechamento da janela; pesquisa no Archive.org a partir do campo central de novas abas (+), mantendo endereços diretos; navegador integrado com abas, barra de endereço e busca geral (Google/Bing/DuckDuckGo), histórico local, favoritos, localizar na página, modo imersivo, busca pública do Archive.org e banner personalizável.
- Temas, escala da interface, grade, decorações, wallpaper e perfis JSON.
- Notes v0.4.0: biblioteca de notas com autosave, busca, checklist, cores, favoritos, arquivamento, duplicação, importação/exportação JSON e papéis adesivos fixados no desktop.
- Wallpaper armazenado no IndexedDB local.

## Biblioteca v0.9.0 — catálogo simplificado

A Biblioteca deixou de listar Novel Updates e provedores de mangá. Permanecem as opções para livros digitais, novels e fanfics. A estante local foi mantida, inclusive links salvos anteriormente.

## Navegação interna da Biblioteca

A Biblioteca abre no próprio desktop as páginas dos serviços cujo domínio foi incluído na lista permitida. A barra interna aceita somente HTTPS dos domínios cadastrados e fornece histórico próprio de endereços iniciados pela barra ou pelos cartões. Por segurança do navegador, o Galaxy não consegue ler o histórico dos links clicados dentro de páginas de outra origem. Sites que enviam `X-Frame-Options` ou `Content-Security-Policy: frame-ancestors` podem bloquear o iframe; cookies de terceiros também podem impedir login. Wuxiaworld permanece como link externo por restrição explícita dos termos de uso. Veja [documentação da Biblioteca v0.8.0](docs/INTERNET_BROWSER_V1.0.0.md).

## Executar no Chromebook

A versão modular deve ser servida por HTTP/HTTPS porque usa ES Modules nativos.

1. Extraia o ZIP e mova a pasta para **Arquivos do Linux**.
2. Abra Terminal e execute:

```bash
cd ~/Galaxy-Legacy-ChromeOS-v0.3.4
python3 -m http.server 8000
```

3. Abra `http://localhost:8000` no ChromeOS.
4. Pressione `Ctrl+C` no Terminal para encerrar.

Não é necessário `npm install`. Instruções adicionais: [README-EXECUTAR-NO-CHROMEOS.md](README-EXECUTAR-NO-CHROMEOS.md).

## Verificações

`npm run verify` verifica a sintaxe dos módulos, os imports relativos, o manifesto e os assets. Para executar o site no navegador, use o servidor HTTP indicado acima.

## PWA e GitHub Pages

O projeto está preparado com Web App Manifest e workflow estático. **A ativação inicial do GitHub Pages ainda precisa ser feita pela pessoa proprietária do repositório**, pois a integração conectada não tem permissão para criar o site nas configurações.

1. Abra [Settings → Pages](https://github.com/LunaLizTanaka/ChromeOS/settings/pages).
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Abra [Actions](https://github.com/LunaLizTanaka/ChromeOS/actions), escolha **Deploy Galaxy Legacy to GitHub Pages** e clique em **Run workflow** na branch `main`.

O workflow também executa automaticamente em cada novo push. A URL pública só estará disponível depois que a execução terminar com sucesso. Veja [Ativar e publicar no GitHub Pages](docs/ATIVAR_GITHUB_PAGES.md).

## Limites atuais

Galaxy Legacy é uma camada visual web dentro do ChromeOS. Não controla notificações, Wi-Fi, Bluetooth ou launcher nativo. A nuvem e a sincronização ainda não estão conectadas; Files apenas mostra nomes e tamanhos de arquivos escolhidos localmente. Na Internet v1.0.0 existe uma camada de navegador dentro da janela do Galaxy. Ela usa iframes para sites externos; páginas que bloqueiam incorporação, logins/cookies de terceiros ou certas navegações podem exigir a opção Abrir no Chrome. Não é um motor Chromium independente.

## Documentação

- [Biblioteca v0.7.0 — catálogos, leitores e estante](docs/BIBLIOTECA_V0.7.0.md)

- [Identidade visual e personalização](docs/IDENTIDADE_VISUAL_E_PERSONALIZACAO.md)
- [Arquitetura e limites do ChromeOS](docs/ARQUITETURA_E_LIMITES_CHROMEOS.md)
- [Interações e layout responsivo](docs/INTERACOES_JANELAS_E_LAYOUT_RESPONSIVO.md)
- [Pesquisa de referências open source](docs/PESQUISA_REFERENCIAS_DESKTOP_WEB.md)
- [Pesquisa de Notes e papéis adesivos](docs/PESQUISA_NOTES_E_STICKY_DESKTOP.md)
- [Internet v0.6.0 — Neocities + Internet Archive](docs/INTERNET_V0.6.0.md)
- [Pesquisa de sites incorporáveis na Internet (histórico)](docs/PESQUISA_INTERNET_EMBEDS_E_SITES.md)
- [Notes v0.4.0 e Sticky Desktop](docs/NOTES_V0.4.0.md)
- [Refatoração modular](docs/MODULARIZACAO_V0.3.0.md)
- [Correção do hover dos painéis](docs/BUGFIX_V0.3.4_HOVER_PAINES.md)


## Sobre index.html e standalone

O `index.html` é a entrada do projeto modular e usa ES Modules. Ele deve ser servido por HTTPS ou por um servidor local (ex.: `python3 -m http.server 8000`); abrir por duplo clique em `file://` pode bloquear os módulos no Chrome. O `standalone.html` é uma edição independente com CSS/JS incorporados, adequada para abrir diretamente. As duas edições compartilham a mesma direção visual, mas seus dados locais podem ficar em contextos de armazenamento diferentes.


## Internet v0.6.0

A janela Internet tem apenas dois espaços. **Neocities** reúne quatro blogs selecionados e testados, abertos dentro da própria janela. **Internet Archive** consulta a API pública de busca do Archive.org e permite filtrar por filmes/vídeos, áudio, livros/textos, software/jogos e imagens. Ao escolher um resultado, o Galaxy carrega o player ou leitor oficial do item. Não há pesquisa Google, tags Neocities, campo para endereços genéricos, Tumblr, YouTube, Spotify ou navegação para sites aleatórios.

A busca usa `advancedsearch.php` do Internet Archive, e a visualização usa o endereço de incorporação `archive.org/embed/IDENTIFIER`. Alguns itens podem não ter player, estar indisponíveis ou possuir restrições específicas; nesse caso, o botão **PÁGINA COMPLETA** abre a ficha do próprio item no Archive.org. Os blogs Neocities também podem mudar suas políticas ou sair do ar. Veja [INTERNET_V0.6.0.md](docs/INTERNET_V0.6.0.md).

## Internet v1.0.2 — pesquisa da nova aba

O formulário central de uma nova aba pesquisa no Internet Archive por padrão. A barra de endereço principal continua oferecendo Google, Bing e DuckDuckGo para pesquisas gerais. Endereços HTTP/HTTPS digitados na nova aba continuam abrindo diretamente.

## Internet v1.0.1 — correções

A busca da homepage abre diretamente a página de resultados pública do Archive.org no navegador interno. O banner aceita imagens PNG/JPG/WebP/GIF/AVIF de até 2 MB, salvas no armazenamento local, com botão para restaurar o desenho original. O fechamento da janela Internet ganhou um controle adicional e os controles padrão das janelas recebem eventos diretos.

O botão voltar/avançar controla o histórico de endereços abertos pela barra, favoritos e atalhos do Galaxy. O navegador do Chrome não permite que a aplicação leia o histórico dos links percorridos dentro de páginas de outra origem; nesses casos, use a navegação oferecida pelo próprio site. Consulte [INTERNET_BROWSER_V1.0.1.md](docs/INTERNET_BROWSER_V1.0.1.md).

## Internet v1.0.0 — navegador integrado

O aplicativo Internet oferece abas independentes, barra de endereço que diferencia URLs de pesquisas, mecanismos Google/Bing/DuckDuckGo, voltar/avançar/recarregar, botão Página inicial, favoritos e histórico salvos localmente, sugestões com base no histórico, pesquisa dentro da página quando o contexto permite e modo imersivo. A homepage rosa, os atalhos Neocities, a busca e o leitor do Archive.org foram preservados. A área de leitura ocupa o espaço restante da janela e acompanha o redimensionamento. Veja [INTERNET_BROWSER_V1.0.0.md](docs/INTERNET_BROWSER_V1.0.0.md).

## Internet v0.9.0

A tela Internet usa um visual de homepage pessoal, com banner ilustrado, divisórias decorativas, cartão de boas-vindas e navegação entre Archive e Neocities. A busca do Internet Archive fica no topo; os quatro sites Neocities aparecem logo abaixo como atalhos. Os botões de categoria preselecionam o filtro da busca, sem alterar a pesquisa ampla nem a paginação. Consulte [INTERNET_BIBLIOTECA_V0.9.0.md](docs/INTERNET_BIBLIOTECA_V0.9.0.md).

## Notes v0.4.0

O Notes mantém várias notas independentes, com autosave, busca, cores, texto/checklist, favoritas, arquivamento, duplicação e importação/exportação JSON. O antigo conteúdo `gl-notes` é migrado para “Minha primeira nota” sem apagar a cópia legada.

Use **FIXAR NO DESKTOP** para deixar uma nota visível no workspace mesmo com a janela Notes fechada. Os papéis podem ser movidos pela barra superior, redimensionados pelo canto, recolhidos, editados e desafixados sem excluir a nota.

Os dados ficam localmente no navegador (chave `gl-notes-v2`); não há sincronização em nuvem. Exportar JSON é o backup portátil. Consulte [NOTES_V0.4.0.md](docs/NOTES_V0.4.0.md).
