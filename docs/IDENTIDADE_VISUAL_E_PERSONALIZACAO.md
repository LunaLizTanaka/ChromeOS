# Identidade visual e personalização — Galaxy Legacy ChromeOS

**Estado:** direção visual inicial definida pela responsável pelo projeto.  
**Referência:** imagem de desktop retrô kawaii enviada em 09/11/2026.

## 1. Direção artística

A linguagem visual combina três pilares:

- **Pixel art:** fontes quadradas/monoespaçadas, ícones em blocos, molduras marcadas, grade, botões e janelas com aparência de computador retrô.
- **Coquette:** laços, fitas, corações, flores, pérolas, tons doces e detalhes delicados.
- **Kawaii desktop:** personagens, adesivos, notificações divertidas, pastas e aplicativos ilustrados.

Não criar um dashboard corporativo nem copiar literalmente o ChromeOS. O resultado deve parecer um desktop ilustrado e pessoal, com linguagem pixelada e coquette.

## 2. Composição inspirada na referência

- Fundo menta com transição para creme e grade rosa opcional.
- Moldura principal branca, contorno rosa/malva e cabeçalho retrô.
- Coluna lateral de atalhos com ilustrações grandes.
- Área principal com janelas sobrepostas e widgets.
- Janelas com títulos pixelados, cabeçalhos pastel e controles circulares.
- Aplicativo de desenho com ferramentas e paleta.
- Pequenos painéis de personagens, stickers e elementos decorativos.
- Dock inferior com atalhos favoritos.

A disposição deve ser responsiva e permitir reorganização; a imagem é referência estética, não uma grade rígida.

## 3. Paleta inicial

| Função | Cor | HEX |
|---|---|---|
| Menta | Fundo primário | `#BDEBE5` |
| Rosa coquette | Cabeçalhos/detalhes | `#F5C5D9` |
| Baunilha | Superfícies de destaque | `#FFF0B9` |
| Lilás | Janelas secundárias | `#C9C4E9` |
| Malva | Contornos/texto | `#B56C89` |
| Branco quente | Superfícies | `#FFFDFB` |
| Verde claro | Acentos | `#D7F6B8` |

A paleta é o ponto de partida, não uma limitação. Futuramente, a pessoa usuária poderá criar paletas próprias.

## 4. Personalização — requisito central

A personalização deve ser uma função real do desktop, não apenas uma troca de cor.

### Aparência
- Temas predefinidos e cores individuais configuráveis.
- Wallpaper da própria área de trabalho Galaxy Legacy, com imagem escolhida pela pessoa usuária.
- Grade de fundo: ligar/desligar, tamanho e intensidade.
- Controles para laços, corações, flores, adesivos e outros enfeites.
- Tamanho de ícones e escala da interface.
- Estilo de borda, moldura e cabeçalho das janelas.

### Organização
- Criar, renomear, mover e excluir atalhos e pastas internas.
- Organizar ícones em páginas e dock.
- Mover, redimensionar, ocultar e reexibir widgets.
- Salvar layouts/cenários diferentes.
- Restaurar o layout sem apagar conteúdo dos aplicativos.

### Conteúdo
- Trocar ícones por imagens ou pacotes de ícones.
- Importar adesivos e personagens próprios.
- Personalizar widgets e cartões.
- Escolher imagens e elementos de fundo.
- Salvar, duplicar, renomear, exportar e importar perfis em JSON.

## 5. Persistência e isolamento

- Preferências pequenas podem usar LocalStorage.
- Imagens e arquivos binários devem usar IndexedDB, com limites e tratamento de quota.
- Importação deve ser explícita e iniciada pela pessoa usuária.
- Perfis JSON não podem incluir credenciais, tokens ou segredos.
- Exportações devem informar se imagens estão incluídas ou precisam ser exportadas separadamente.
- Sincronização em nuvem será planejada depois, com consentimento e escolha de infraestrutura.

Alterar uma preferência não deve resetar módulos não relacionados. Wallpaper, pacotes de ícones, widgets, posição de janelas e conteúdo das notas precisam ter ciclos de vida independentes.

## 6. Usabilidade

- Contraste suficiente mesmo em fundos pastel.
- Controles com rótulos e foco visível.
- Ícones com tooltip/nome, não apenas ilustração.
- Alvos de clique confortáveis para mouse, touchpad e tela sensível ao toque.
- Animações decorativas curtas e desligáveis.
- Preferência por atalhos de teclado para ações frequentes.
- Drag-and-drop deve ter alternativa acessível quando aplicável.

## 7. Estado

**Direção definida:** pixel + coquette + kawaii retrô; paleta menta/rosa/baunilha/lilás; janelas ilustradas, ícones, stickers e widgets.

**Personalização aprovada como requisito:** temas, wallpaper da página, ícones, stickers, tamanho, grade, widgets, janelas, pastas, dock, cenários e perfis.

**Pendente:** editor completo de desktop, biblioteca de ícones/stickers, cenários múltiplos, sincronização e nuvem.
