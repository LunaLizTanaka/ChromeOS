# Correção do fechamento da Internet — v1.0.3

## Causa raiz

A folha de estilos definia a janela Internet com o seletor:

`#desktop #scene > .window[data-window="app-internet"] { display:flex; ... }`

O seletor tinha especificidade maior que a regra global `.window.hidden { display:none }`. Quando `closeWindow()` adicionava a classe `hidden`, a regra específica da Internet continuava forçando `display:flex`. O JavaScript executava o fechamento, mas o pop-up permanecia visível.

## Correção

Foi adicionada a regra de maior especificidade:

`#desktop #scene > .window[data-window="app-internet"].hidden { display:none!important; visibility:hidden!important; pointer-events:none!important; }`

Assim, a janela continua usando flex quando aberta, mas desaparece quando é fechada. Como o botão da barra, o X da janela e o alvo de arraste chamam o mesmo `closeWindow()`, todos são corrigidos por essa regra.

## Regressão

`scripts/verify-structure.mjs` verifica a existência do seletor e da declaração `display:none!important`, além da função `closeWindow()` continuar adicionando `hidden`.
