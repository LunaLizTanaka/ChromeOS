# Pesquisa de Notes e Sticky Notes — Galaxy Legacy ChromeOS

**Data da pesquisa:** 10/11/2026  
**Objetivo:** evoluir o Notes atual para um gerenciador de várias notas e permitir fixar notas como papéis adesivos dentro da área de trabalho Galaxy Legacy.

## 1. Diagnóstico da implementação atual

O aplicativo Notes da v0.3.4 é simples: contém um único campo de texto `#noteText`; o conteúdo é lido da chave `gl-notes` do LocalStorage e gravado a cada evento de digitação. O botão CLEAR apaga esse único texto.

Isso significa que atualmente:
- há um único caderno/texto, não uma coleção de notas independentes;
- o conteúdo persiste na mesma origem/perfil do navegador;
- não há título individual, cor, categoria, busca, lista, checklists, histórico ou anexos;
- não existe uma nota que possa ser colocada na área de trabalho;
- fechar a janela Notes preserva o texto porque o estado é salvo no LocalStorage, mas não há cartões adesivos independentes.

O wallpaper personalizado e as preferências do desktop são armazenados separadamente. O Notes não está sincronizado com nuvem nem com outros dispositivos.

## 2. Projetos pesquisados no GitHub

### 2.1 Stickies — referência principal para papéis adesivos

Repositório: https://github.com/jeremehancock/Stickies  
Licença: MIT.  
Último commit observado na consulta: 08/09/2026.  
Tecnologia: HTML, CSS e JavaScript vanilla em um único HTML; sem framework ou etapa de build para o núcleo.

Recursos descritos e inspecionados:
- quadro livre com várias notas simultâneas;
- criar notas por botão ou duplo clique na área;
- arrastar notas pelo quadro;
- redimensionar pela alça de canto;
- cores por nota;
- escolha de fonte e tamanho de texto por nota;
- inclinação visual independente;
- excluir com desfazer;
- Markdown, listas, checklists clicáveis, links e tabelas;
- exportar/importar o quadro em JSON;
- layout separado para dispositivos móveis e páginas de notas.

Armazenamento: LocalStorage no dispositivo/navegador atual. O próprio README alerta que não existe sincronização ou backup automático e que limpar os dados do navegador pode apagar as notas. Markdown usa `marked` e `DOMPurify` opcionais via CDN; sem conexão, o conteúdo segue disponível em texto simples.

**O que aproveitar:** interação de quadro, arrastar, redimensionar, notas com visual individual, checklists, desfazer e backup JSON. É a melhor referência para a ideia de “papéis” espalhados na área de trabalho.

**O que não copiar sem adaptação:** a aparência, os efeitos de inclinação e a estrutura monolítica inteira. A identidade Galaxy Legacy continuará pixel/coquette. O Markdown deve ser implementado com sanitização e sem introduzir dependência obrigatória de CDN.

### 2.2 MyNotes — referência principal para administrar várias notas

Repositório: https://github.com/hasangurler/MyNotes  
Licença: MIT.  
Último commit observado na consulta: 31/08/2026.  
Tecnologia: HTML, CSS e JavaScript vanilla, PWA.

Recursos:
- criar, editar e excluir várias notas;
- busca em título e conteúdo;
- ordenação por edição recente, criação, título e ordem manual;
- arrastar e soltar para reordenar;
- cores e temas;
- contadores e validação;
- exportar e restaurar JSON;
- persistência local por LocalStorage;
- PWA offline com Service Worker.

**O que aproveitar:** lista/gerenciador de notas, busca, ordenação, backup/restauração e separação entre editor e lista de notas.

**Ressalva:** a base inclui Bootstrap e alguns assets locais. Não é necessário trazer a biblioteca para o Galaxy Legacy; podemos implementar os mesmos conceitos com CSS próprio e módulos nativos, mantendo o peso baixo.

### 2.3 Notes-Board — referência de posição persistente

Repositório: https://github.com/MAMehrza/Notes-Board  
Último commit observado: 01/11/2025.  
O README descreve um quadro offline, feito em HTML/CSS/JS, com notas que podem ser adicionadas, movidas, redimensionadas, editadas e apagadas. A persistência inclui posição, tamanho, cor, conteúdo e ordem visual (z-index), via LocalStorage.

**O que aproveitar:** salvar as coordenadas, dimensões, cor, conteúdo e ordem das notas para que o quadro seja reconstruído exatamente ao reabrir.

**Licença:** não foi encontrado arquivo LICENSE na árvore consultada. Usar apenas como referência funcional; não copiar código ou assets sem esclarecer a licença.

### 2.4 HTML5Sticky — referência histórica de personalização

Repositório: https://github.com/sarfraznawaz2005/HTML5Sticky  
Licença: MIT.  
Última alteração observada: 01/10/2020.

Recursos descritos:
- notas persistentes via LocalStorage;
- texto e listas com HTML básico;
- múltiplas cores;
- largura e altura ajustáveis;
- aparência de papel adesivo.

**O que aproveitar:** personalização de dimensões e aparência de papel. É um projeto antigo e não deve ser a base técnica principal.

### 2.5 NoteCute — referência de extensão, não de website

Repositório: https://github.com/tranthangit/NoteCute  
Último commit observado: 24/04/2026.  
É uma extensão do Chrome Manifest V3, com side panel, quadro de notas, tipos Text/Focus/Star/Blank, oito cores, drag-and-drop, minimizar, visualização em tela cheia, zona de lixeira e persistência usando `chrome.storage`.

**O que aproveitar como conceito:** tipos de nota, checklist/foco, quadro colorido, mini-cartões e ações de minimizar/expandir.

**Limite:** o projeto depende de APIs de extensão (`chrome.storage`, `sidePanel`, `activeTab`, content scripts). Essas APIs não estão disponíveis em uma página web comum. Não transformar o Galaxy Legacy em extensão nem exigir instalação nesta fase. Não foi localizado um arquivo LICENSE na raiz consultada; não copiar código/recursos sem licença clara.

### 2.6 Lattice Notes — referência para organização avançada futura

Repositório: https://github.com/anasfik/lattice-notes  
Último commit observado: 23/10/2026.

Projeto local-first de Markdown usando IndexedDB, com vaults, notas interligadas, backlinks, gráfico, notas diárias, busca, snapshots de recuperação, importação/exportação e PWA offline.

**O que aproveitar futuramente:** snapshots de recuperação, pesquisa mais avançada, links internos entre notas e armazenamento estruturado em IndexedDB.

**Ressalva:** é um workspace de notas mais complexo e exige Node/npm para desenvolvimento. Não é necessário para o primeiro upgrade de Notes do Galaxy Legacy.

## 3. Arquitetura recomendada para o Galaxy Legacy Notes

Não substituir a aplicação inteira por qualquer um dos projetos. Construir um módulo original, reaproveitando padrões comprovados e compatíveis com a arquitetura atual.

### 3.1 Gerenciador de notas

Uma janela Notes com:
- lista de todas as notas;
- botão `+ Nova nota`;
- título e conteúdo separados;
- busca por título e texto;
- filtros por cor, categoria e favoritas;
- ordenação por atualização, criação, título ou ordem manual;
- editar, duplicar, arquivar e excluir;
- salvar automaticamente após pequena pausa na digitação;
- indicador “Salvo”/“Salvando”.

### 3.2 Papéis adesivos na área de trabalho

Cada nota poderá ter a ação **Fixar na área de trabalho**. Isso cria um cartão visual dentro do workspace principal do Galaxy Legacy, sem precisar manter a janela Notes aberta.

O papel adesivo deverá:
- continuar visível quando a janela Notes for fechada;
- ser arrastável pela pequena barra superior;
- ser redimensionável;
- permitir trocar cor e estilo de papel;
- permitir editar o texto diretamente ou abrir no Notes;
- poder ser minimizado/recolhido sem excluir o conteúdo;
- ter ação “Desafixar” que remove apenas o cartão do desktop, mantendo a nota na biblioteca;
- salvar posição, tamanho, cor, ordem z-index, visibilidade e estado de minimização;
- ser reconstruído ao reabrir o Galaxy Legacy.

As notas fixadas pertencem à área de trabalho **dentro da página Galaxy Legacy**. Uma página web/PWA não consegue manter esses papéis visíveis por cima de outras janelas ou no desktop nativo do ChromeOS depois que o Galaxy Legacy é fechado.

### 3.3 Tipos de notas

Fase inicial:
- Texto livre.
- Checklist/tarefas.
- Nota rápida sem título obrigatório.

Depois:
- Nota formatada com Markdown seguro ou barra de formatação;
- lembretes/data de vencimento;
- anexos de imagem;
- notas com links e referências entre si.

### 3.4 Personalização coquette/pixel

- papéis em menta, rosa, baunilha, lilás, azul e branco;
- borda pixelada opcional;
- pequenas fitas, clipes, adesivos e sombras;
- escolher fonte e tamanho por nota;
- transparência e rotação opcionais;
- botão de cor por cartão, não uma cor global para todas as notas.

Manter o visual legível: a decoração não pode prejudicar contraste nem cobrir os controles.

## 4. Armazenamento, migração e proteção de dados

### 4.1 Migração sem perder o texto existente

O formato atual usa a chave `gl-notes` como uma única string. A nova estrutura deverá:
1. procurar a chave antiga;
2. se existir e a nova coleção ainda não existir, criar uma primeira nota chamada “Minha primeira nota” com o texto antigo;
3. salvar a nova coleção em chave versionada, por exemplo `gl-notes-v2`;
4. manter a chave antiga até confirmar que a migração foi salva;
5. nunca apagar silenciosamente o conteúdo legado.

### 4.2 Estrutura de dados proposta

Cada nota deve ter pelo menos:
- `id`, `title`, `body`, `type`;
- `createdAt`, `updatedAt`;
- `color`, `font`, `fontSize`;
- `tags[]`, `favorite`, `archived`;
- `pinnedToDesktop`;
- `desktopPosition: { x, y, width, height, zIndex, minimized }`.

Coordenadas devem ser normalizadas/proporcionais ao workspace e limitadas ao viewport ao restaurar em tela diferente.

### 4.3 Armazenamento no navegador

- LocalStorage pode armazenar pequenas preferências e metadados/texto simples.
- IndexedDB é mais apropriado para uma coleção estruturada maior, anexos e conteúdo rico.
- Não chamar armazenamento local de backup: limpar dados do site/perfil pode apagar notas.
- Disponibilizar exportação e importação JSON com validação e confirmação antes de substituir conteúdo.
- Para recuperação adicional, criar snapshot periódico ou histórico limitado de versões.
- A sincronização com nuvem será uma etapa separada e somente após escolha de backend/conta. Não compartilhar dados entre usuários.

## 5. Sequência de implementação sugerida

1. **Notes v0.4:** várias notas, título/conteúdo, autosave, busca, cores, checklist básico, excluir/duplicar e JSON import/export.
2. **Sticky Desktop v0.5:** fixar papel na área de trabalho, drag, resize, cores, minimizar, desafixar e persistir posição.
3. **Editor v0.6:** formatação simples/Markdown seguro, fontes, tags e favoritos.
4. **Robustez v0.7:** snapshots, migração validada, restauração, testes de quota e conflitos.
5. **Futuro:** anexos, links entre notas e sincronização em nuvem.

## 6. Decisão

Referência principal para quadro adesivo: **Stickies** (MIT).  
Referência principal para biblioteca/gestão: **MyNotes** (MIT).  
Referência adicional para posição persistente: **Notes-Board** (somente inspiração, licença não localizada).  
Referência histórica para tamanhos e cores: **HTML5Sticky** (MIT).  
Referência de tipos e controles: **NoteCute** (extensão Chrome; não copiar código sem licença e não adotar a dependência de extensão).  
Referência futura para notas ligadas e recuperação: **Lattice Notes**.

Nenhum código ou asset desses projetos foi incorporado ao Galaxy Legacy nesta pesquisa. A implementação deve preservar os módulos atuais, a identidade pixel/coquette e a compatibilidade ChromeOS.

## 7. Fontes

- Stickies: https://github.com/jeremehancock/Stickies
- MyNotes: https://github.com/hasangurler/MyNotes
- Notes-Board: https://github.com/MAMehrza/Notes-Board
- HTML5Sticky: https://github.com/sarfraznawaz2005/HTML5Sticky
- NoteCute: https://github.com/tranthangit/NoteCute
- Lattice Notes: https://github.com/anasfik/lattice-notes

Fontes consultadas em 10/11/2026. Recursos e licenças podem mudar; conferir novamente antes de reutilizar código.
