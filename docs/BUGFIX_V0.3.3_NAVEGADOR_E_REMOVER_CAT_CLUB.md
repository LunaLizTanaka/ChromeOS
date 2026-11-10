# Correção v0.3.3 — navegador e remoção do Cat Club

- Removido example.com da URL inicial: o domínio é reservado a exemplos, não serve como página de navegação.
- Navegador começa com campo vazio e links rápidos reais.
- A ação principal abre destino/pesquisa em nova aba Chrome; a incorporação em iframe é alternativa.
- Removido Cat Club/Catz do registro e da interface.
- Removido texto "sticker club" do Mail.
- Endereço de domínio sem esquema usa HTTPS; texto simples abre pesquisa Google.

Testado em Chromium automatizado: sem URL exemplo no HTML; sem atalho Cat/Catz; endereço inicial vazio; normalização de domínio e pesquisa; abertura externa chamada a partir de clique; iframe opcional; Notes e drag de janelas; Picatsso; 10 viewports; zero erros JavaScript nos fluxos avaliados.

A rede pública foi simulada no teste; isso verifica a URL enviada ao Chrome, não disponibilidade de cada site ou acesso real à internet.
