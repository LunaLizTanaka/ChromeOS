# Internet v1.0.2 — pesquisa nas novas abas

O formulário de pesquisa da nova aba criada pelo botão `+` agora usa o catálogo público do Internet Archive, por padrão. Termos comuns são convertidos por `buildArchivePublicSearchUrl` e abertos em `archive.org/search.php?query=...` dentro da aba atual.

Se o texto digitado for um endereço HTTP/HTTPS, a nova aba abre diretamente esse endereço. Esquemas `javascript:`, `data:`, `file:` e outros não permitidos continuam recusados.

A barra de endereço principal não mudou: pesquisas nessa barra continuam usando o mecanismo escolhido no seletor Google, Bing ou DuckDuckGo.

## Cobertura de testes

`scripts/verify-internet.mjs` verifica:
- Texto de pesquisa na nova aba -> URL de resultados pública do Archive.org.
- Endereço HTTP/HTTPS na nova aba -> endereço direto.
- Campo vazio e esquemas inseguros.
- Barra de endereço principal -> mecanismo Google/Bing/DuckDuckGo.
