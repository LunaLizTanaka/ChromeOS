# Biblioteca v0.8.0 — navegação interna

A Biblioteca abre plataformas de livros, mangás, novels e fanfics dentro da janela do Galaxy Legacy sempre que o próprio site permite ser exibido em iframe. A integração não remove nem contorna políticas de enquadramento dos provedores.

## Navegador interno

A área de leitura inclui:

- Barra HTTPS para abrir endereços dos domínios cadastrados.
- Voltar e avançar entre endereços navegados pela própria barra ou pelos cartões da Biblioteca.
- Atualizar o endereço atual.
- Botão para abrir a página no Chrome, como alternativa.

Por segurança, a barra aceita apenas HTTPS e apenas domínios catalogados na Biblioteca e marcados para tentativa interna. Wuxiaworld fica fora dessa lista: seus termos proíbem framing/mirroring sem autorização escrita.

## Limite de navegação entre origens

Quando a página de um serviço é carregada no iframe, a política de mesma origem do navegador impede o Galaxy de ler o endereço, os links clicados e o histórico interno daquela página. Portanto, os botões Voltar/Avançar do Galaxy percorrem o histórico iniciado pela barra e pelos cartões; links e navegação realizados dentro do próprio site usam os controles e o histórico do próprio site.

O evento de carregamento do iframe não prova que a página foi exibida com sucesso. Alguns servidores respondem com X-Frame-Options ou Content-Security-Policy: frame-ancestors, que impedem a incorporação. Políticas de cookies de terceiros também podem impedir login ou manter sessões. Nesses casos, use **ABRIR NO CHROME**. O Galaxy não usa proxy para remover esses bloqueios.

## Plataformas

A Biblioteca mantém as 16 plataformas adicionadas na versão anterior. A maioria está configurada como tentativa interna; a tentativa precisa ser conferida visualmente em cada site/navegador. Internet Archive e Open Library continuam com suas pesquisas e leitores próprios. Wuxiaworld continua como acesso externo oficial por restrição expressa dos termos.

A versão não copia capítulos, não hospeda arquivos de terceiros, não contorna paywalls ou DRM e não lê credenciais de contas externas.

## Verificações

npm run verify valida sintaxe dos módulos, estrutura da interface, domínios permitidos, protocolos HTTPS, modos de integração, URLs do Open Library e as funções existentes do Internet. O compilador scripts/build-standalone.py gera a edição independente HTML único e falha se encontrar imports pendentes, módulos sem referência ou caminhos externos para CSS/JS.
