# Bugfix v0.3.4 — painéis ocultos não abriam pelo hover

## Causa e ajuste

A lógica anterior dependia apenas de um listener global de pointermove e de uma faixa de detecção estreita junto à borda. Para tornar o gesto explícito e mais tolerante, o Edge Panel Manager agora cria três zonas de ativação transparentes de 44 px, sem depender de markup adicional no HTML.

## Comportamento

- Borda superior revela a barra superior.
- Borda esquerda revela atalhos laterais.
- Borda inferior revela o dock.
- Cada zona usa pointerenter e também é acompanhada pelo listener global.
- Ao revelar o painel, sua zona fica com pointer-events none, permitindo clicar nos controles reais do painel.
- Ao sair, o painel recolhe e a zona volta a receber hover.
- mousemove é fallback; touch usa pointerdown.
- Durante fullscreen/arraste de janelas, as zonas ficam desativadas.

## Testes automatizados

Chromium headless:
1. Desktop inicia sem pop-ups.
2. Hover na borda esquerda abre sidebar.
3. Sidebar permanece aberta ao mover o cursor dentro dela.
4. Clique em Notes abre a janela e fecha o painel.
5. Hover na borda inferior abre dock.
6. Clique em Picatsso abre a janela.
7. Hover superior abre topbar.
8. As zonas não interceptam cliques quando o painel está visível.
9. Layout sem overflow em 1920×1080, 1366×768, 1024×768, 800×600, 390×844 e 320×568.
10. Nenhum erro JavaScript nos fluxos testados.

A validação foi automatizada em Chromium; ainda falta confirmação no Chromebook físico.
