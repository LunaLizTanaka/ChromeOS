# Galaxy Legacy — janelas redimensionáveis e busca ampliada do Archive

**Escopo:** manutenção incremental sobre a base v0.6.0.

## Janelas
- As janelas abertas pelo gerenciador recebem alças nas bordas superior, inferior, esquerda e direita e nos cantos inferiores.
- O redimensionamento usa Pointer Events, com limites mínimos e máximos para manter a janela dentro da área de trabalho.
- Maximizar, restaurar, minimizar, fechar e arrastar continuam separados do gesto de redimensionamento.
- As dimensões ficam preservadas enquanto a janela permanece aberta no desktop. Não foi introduzida gravação adicional em armazenamento.

## Neocities
- O iframe ocupa a área flexível restante do pop-up.
- A altura não depende de `vh`, mas do espaço real disponível dentro da janela.
- Largura e altura do iframe acompanham o redimensionamento. O layout interno final ainda depende de cada site Neocities ser responsivo.
- As regras de container query ajustam a disposição interna da aplicação Internet conforme a largura do pop-up, mesmo quando a janela é menor que o viewport do Chrome.

## Internet Archive
- A busca anterior usava uma frase entre aspas e limitava os campos a `title` e `creator`. Isso excluía ocorrências em assuntos e outros metadados.
- A busca nova usa o índice geral de metadados do Archive e mantém o filtro opcional de tipo de mídia.
- Cada página passa de 12 para 18 itens; os cartões também podem exibir assuntos e data.
- A busca continua sendo de metadados do catálogo. Não consulta o OCR do interior dos livros.
- Os itens seguem abrindo pelo embed com link para a página completa como alternativa.

## Verificações
- `npm run verify` cobre sintaxe, imports, estrutura, alças de redimensionamento, busca geral, filtro de mídia, paginação e URLs dos players.
- Testes estáticos não substituem a conferência visual no Chromebook real.
