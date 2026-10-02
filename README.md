# InNovaERP – InNovaIdeia

Protótipo de interface para gestão de vendas, produtos, estoque, clientes e fluxo financeiro. O projeto é executado diretamente no navegador e, nesta versão, usa **HTML, CSS, JavaScript e `localStorage`**.

> **Status:** protótipo funcional para demonstração e testes locais. Ainda não é um ERP de produção: não possui backend, banco de dados central, autenticação ou sincronização entre dispositivos.

## Executar localmente

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` em um navegador moderno.

Os ícones usam Font Awesome por CDN e precisam de conexão com a internet para carregar. As demais telas são servidas pelo próprio arquivo HTML.

## Recursos disponíveis

- Dashboard com indicadores de vendas e alertas de estoque.
- Ponto de venda (PDV), carrinho, seleção de cliente e meios de pagamento.
- Cadastro e consulta de produtos, clientes e lançamentos financeiros.
- Entrada de estoque e aviso de quantidade baixa.
- Relatórios de vendas, produtos e clientes.
- Exportação do relatório de vendas em CSV.
- Tema claro/escuro.

## Dados e persistência

Produtos, clientes, vendas e lançamentos são gravados no `localStorage` do navegador. Isso significa que:

- os dados ficam apenas no navegador e dispositivo usados;
- limpar os dados do navegador pode apagar os registros;
- não há compartilhamento entre usuários;
- esta persistência não substitui backups nem um banco de dados.

As vendas criadas após a atualização registram uma cópia dos itens vendidos para alimentar o relatório de produtos. Vendas antigas não guardam esse detalhamento; por isso, aparecem sinalizadas e ficam fora do cálculo de produtos vendidos. O relatório de clientes usa vendas registradas e identifica o cliente pelo ID quando disponível.

## Verificações rápidas

Depois de abrir o sistema, você pode validar o fluxo manualmente:

1. Cadastre um produto com estoque conhecido.
2. Adicione ao carrinho e tente exceder a quantidade disponível.
3. Finalize uma venda com desconto válido e confira a baixa de estoque.
4. Informe desconto abaixo de 0% ou acima de 100% e confira o bloqueio.
5. Abra Relatórios e confira se quantidade, receita e compras correspondem às vendas registradas.
6. Atualize a página e confirme que os dados persistem no mesmo navegador.

## Próximos passos para produção

- Criar uma API e um banco de dados centralizado.
- Implementar autenticação, permissões e auditoria.
- Adicionar testes automatizados e validação no servidor.
- Implementar edição completa de produtos e clientes.
- Configurar backups, migrações e implantação segura.

## Licença

Consulte o arquivo [LICENSE](LICENSE).
