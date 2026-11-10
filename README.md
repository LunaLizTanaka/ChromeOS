# Galaxy Legacy — ChromeOS Edition

**Estado:** início do projeto / protótipo visual v0.1.0  
**Plataforma principal:** Chromebook com ChromeOS  
**Formato:** website/PWA, sem aplicativo Android nativo  
**Identidade:** pixel art + coquette + kawaii desktop

Galaxy Legacy será um ambiente de desktop web personalizável. A intenção é que, ao abrir o app no Chromebook, a pessoa encontre um pequeno desktop próprio, com atalhos, pastas, janelas, widgets, personagens e ferramentas — sem substituir o ChromeOS real.

## Direção visual

A imagem de referência enviada pela responsável define a linguagem visual inicial:

- **Pixel art:** tipografia quadrada/monoespaçada, ícones pixelados, grade e molduras bem marcadas.
- **Coquette:** laços, corações, flores, fitas, pérolas e pequenos enfeites.
- **Kawaii retrô:** personagens/adesivos, notificações divertidas e janelas com cabeçalhos pastel.
- **Composição:** coluna lateral de atalhos, área central com janelas, pequenos widgets e dock.

Paleta inicial:

| Cor | HEX |
|---|---|
| Menta | `#BDEBE5` |
| Rosa | `#F5C5D9` |
| Baunilha | `#FFF0B9` |
| Lilás | `#C9C4E9` |
| Malva/contorno | `#B56C89` |
| Branco quente | `#FFFDFB` |

## Personalização como requisito central

A aparência não deve ser fixa. A direção de produto inclui:

- Temas e paletas configuráveis.
- Papel de parede próprio da área de trabalho Galaxy Legacy.
- Ícones e pacotes de adesivos substituíveis.
- Laços, flores, grade e efeitos decorativos que podem ser ligados/desligados.
- Tamanho de ícones e controles.
- Posição, tamanho e visibilidade de widgets.
- Pastas, páginas, dock e atalhos organizáveis.
- Janelas com cores e molduras ajustáveis.
- Perfis de desktop salváveis, exportáveis e importáveis.
- Cenários e personagens personalizáveis.

As preferências de cada componente devem ser independentes: mudar o wallpaper não deve apagar a organização dos ícones; trocar ícones não deve reiniciar widgets ou notas.

## Aplicativos planejados

Mail, Trash, Files, Save, Internet, Notes, Galeria, Música, Calendário, Calculadora, editor de desenho, personagens, widgets e ferramentas futuras. Parte dos aplicativos será criada como módulos internos do Galaxy Legacy; outros serão atalhos para serviços web externos.

A área de Internet deverá tentar incorporar uma página apenas quando o site permitir. Se a página bloquear iframe ou não funcionar corretamente, o Galaxy Legacy deverá oferecer abertura pelo próprio Chrome.

## Plataforma e desempenho

O perfil técnico documentado do Chromebook de referência indica Intel Celeron N4000, 2 núcleos, 4 GB RAM e Intel UHD Graphics 600. A estratégia é **2D-first e Chromebook-friendly**:

- HTML, CSS e JavaScript como base.
- SVG e Canvas 2D quando úteis.
- Imagens e animações leves, carregadas sob demanda.
- Evitar frameworks e processos pesados sem necessidade.
- Pausar animações quando a aplicação estiver oculta.
- Testar no Chromebook real antes de declarar fluidez ou compatibilidade.

## Integração com ChromeOS

O caminho principal será um website publicado por HTTPS, preparado como PWA. Um PWA instalado pode aparecer no Launcher e ser fixado na Shelf do ChromeOS, segundo a documentação do Google. Isso é uma aplicação web em janela própria, não uma substituição do launcher/sistema operacional.

**Não confundir três coisas:**

1. Wallpaper dentro da página do Galaxy Legacy: faz parte do projeto web.
2. PWA em janela independente: pode parecer um pequeno desktop e ocupar a própria janela.
3. Wallpaper real do ChromeOS: é controlado pelo sistema. A API de wallpaper é uma API de extensão e define imagens; não executa uma página HTML interativa atrás de todas as janelas.

Uma pesquisa de integração nativa poderá ser feita no futuro, mas não é dependência do desktop web.

## Arquivos de planejamento

- [Identidade visual e personalização](docs/IDENTIDADE_VISUAL_E_PERSONALIZACAO.md)
- [Arquitetura e limites do ChromeOS](docs/ARQUITETURA_E_LIMITES_CHROMEOS.md)

## Estado atual

A direção visual e a arquitetura inicial estão sendo registradas. O código do protótipo será adicionado incrementalmente; a instalação PWA depende de publicação HTTPS e teste no Chromebook. Nuvem, autenticação e sincronização ainda não estão conectadas.
