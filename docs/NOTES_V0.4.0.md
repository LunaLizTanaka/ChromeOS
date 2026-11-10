# Notes v0.4.0 e Sticky Desktop — Galaxy Legacy

## Implementado
- Biblioteca com várias notas independentes, título e corpo separados.
- Salvamento automático com debounce e salvamento ao sair da página.
- Busca em título e conteúdo.
- Tipos Texto livre e Checklist.
- Cores rosa, menta, baunilha, lilás, azul e branco.
- Favoritar, arquivar, duplicar e excluir com confirmação.
- Backup JSON com validação e confirmação antes de substituir.
- Papéis adesivos fixados no desktop; arrastar, redimensionar, recolher/restaurar, editar e desafixar.
- Checklist interativa nos papéis.
- Posição normalizada, tamanho, cor, ordem visual e estado minimizado persistidos.

## Migração de dados
A versão antiga usava `gl-notes` como uma única string. Se `gl-notes-v2` ainda não existir e `gl-notes` contiver texto, esse conteúdo vira uma nota chamada “Minha primeira nota”. A chave antiga não é apagada: fica como cópia de recuperação.

## Onde os dados ficam
A coleção usa LocalStorage em `gl-notes-v2`. É local ao perfil/origem do navegador, não sincroniza com nuvem e não substitui backup. EXPORTAR gera `galaxy-legacy-notes-backup.json`. IMPORTAR limita o arquivo a 2 MB e a coleção a 500 notas. Anexos ainda não são suportados.

## Papéis adesivos
FIXAR NO DESKTOP cria um cartão dentro de `#stickyLayer`. Ele permanece visível mesmo quando a janela Notes é fechada. A barra superior move o cartão; o canto inferior direito redimensiona. Desafixar remove apenas o cartão, não a nota. Os papéis existem dentro do Galaxy Legacy, não sobre outras aplicações ou no desktop nativo do ChromeOS.

## Testes
Chromium automatizado em montagem temporária: migração sem apagar a chave antiga, criação/edição, autosave, checklist, cores, pin/unpin, arraste e posição persistida, resize e dimensões persistidas, minimizar/restaurar, fechar a janela sem remover o papel, editar pelo cartão, busca, duplicação, exportação/importação JSON e seis viewports (1920×1080 a 320×568). Nenhum erro JavaScript nos fluxos exercitados.

**Limite:** o ambiente bloqueou navegação por localhost/file://. Os testes de navegador foram feitos via page.set_content com armazenamento em memória; persistência real e homologação no Chromebook físico ainda são necessárias.
