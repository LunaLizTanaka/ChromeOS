# Correção v0.3.2 — aplicativos sob demanda e janelas arrastáveis

## Problema corrigido

A versão anterior colocava janelas de demonstração diretamente no HTML e inicializava o Picatsso no carregamento da página. Isso fazia a tela começar cheia de pop-ups e deixava o ciclo de vida dos aplicativos inconsistente quando tentávamos abrir uma janela dinâmica.

## Comportamento novo

- A cena inicial não contém nenhuma janela de aplicativo.
- Atalhos ficam nos painéis laterais/dock auto-ocultáveis.
- Cada aplicação é criada só depois de clique explícito.
- Cats e Picatsso usam o mesmo mecanismo de criação dinâmica das demais aplicações.
- O canvas do Picatsso recebe seus eventos após sua janela existir.
- O arraste começa na barra de título, em fase de captura, e os controles circulares são excluídos do gesto.
- Maximizar, restaurar, minimizar, fechar e reabrir continuam preservando o mesmo DOM/state em memória.

## Orientação de uso

1. Mova o ponteiro até a borda esquerda para revelar os atalhos laterais; clique no aplicativo desejado.
2. Mova o ponteiro até a borda inferior para revelar o dock; clique nos atalhos fixados.
3. Para mover uma janela, pressione e segure a barra de título (faixa onde aparece o nome) e mova o mouse.
4. Os três botões redondos do cabeçalho são controles, não alças de arraste.

## Arquivos modificados

- `src/apps/app-templates.js`
- `src/apps/app-registry.js`
- `src/apps/paint-app.js`
- `src/managers/window-manager.js`
- `src/main.js`

O pacote completo v0.3.2 inclui também o HTML sem janelas iniciais, folha de estilos, manifesto e instruções do ChromeOS.

## Testes

Chromium automatizado: desktop vazio; hover das bordas; abrir app por clique real; drag na barra; fullscreen/restauração; minimizar/fechar/reabrir; Picatsso interativo; Notes; Settings; 10 viewports; zero erros JavaScript nos fluxos exercitados.

O teste não substitui homologação manual no Chromebook real.
