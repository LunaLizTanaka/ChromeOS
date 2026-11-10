# Galaxy Legacy — ChromeOS Edition

**Versão:** v0.6.0  
**Plataforma principal:** Chromebook / ChromeOS  
**Tecnologia:** HTML, CSS e JavaScript nativos; ES Modules; PWA preparada para HTTPS  
**Identidade:** pixel art + coquette + kawaii desktop

Galaxy Legacy é um desktop web personalizável executado dentro do Chrome/ChromeOS. Ele não substitui o sistema operacional nem exige APK, root ou instalação Linux. A versão publicada pode ser aberta diretamente em https://galaxy-legacy-chromeos.vercel.app/ sem iniciar o Linux ou um servidor local.

## O que já funciona

- Desktop vazio ao iniciar: nenhum aplicativo abre sem ação da pessoa usuária.
- Janelas independentes que podem ser arrastadas, minimizadas, maximizadas, restauradas e fechadas.
- Barra superior, atalhos laterais e dock que se revelam ao aproximar o ponteiro das bordas.
- Layout fluido, sem resolução fixa, acompanhando o espaço disponível.
- Aplicativos internos: Mail demonstrativo, Trash, Files demonstrativo, Save Center, Internet, Notes, Personalize e Picatsso.
- Internet v0.6.0: blogoteca com quatro páginas Neocities testadas e pesquisa própria no Internet Archive por filmes, vídeos, áudio, livros, textos, software e imagens; resultados abrem no player/leitor do acervo.
- Temas, escala da interface, grade, decorações, wallpaper e perfis JSON.
- Notes v0.4.0: biblioteca de notas com autosave, busca, checklist, cores, favoritos, arquivamento, duplicação, importação/exportação JSON e papéis adesivos fixados no desktop.
- Wallpaper armazenado no IndexedDB local.

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

Galaxy Legacy é uma camada visual web dentro do ChromeOS. Não controla notificações, Wi-Fi, Bluetooth ou launcher nativo. A nuvem e a sincronização ainda não estão conectadas; Files apenas mostra nomes e tamanhos de arquivos escolhidos localmente. Na Internet v0.6.0 não há navegador geral nem abertura de endereços arbitrários: somente os blogs selecionados e o acervo do Internet Archive.

## Documentação

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

## Notes v0.4.0

O Notes mantém várias notas independentes, com autosave, busca, cores, texto/checklist, favoritas, arquivamento, duplicação e importação/exportação JSON. O antigo conteúdo `gl-notes` é migrado para “Minha primeira nota” sem apagar a cópia legada.

Use **FIXAR NO DESKTOP** para deixar uma nota visível no workspace mesmo com a janela Notes fechada. Os papéis podem ser movidos pela barra superior, redimensionados pelo canto, recolhidos, editados e desafixados sem excluir a nota.

Os dados ficam localmente no navegador (chave `gl-notes-v2`); não há sincronização em nuvem. Exportar JSON é o backup portátil. Consulte [NOTES_V0.4.0.md](docs/NOTES_V0.4.0.md).
