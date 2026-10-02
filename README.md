# InNovaERP

Aplicação demonstrativa de gestão comercial feita com React e Vite. Reúne dashboard, ponto de venda, clientes, produtos, estoque, relatórios e fluxo financeiro em uma interface responsiva.

## Requisitos

- Node.js 18 ou superior
- npm

## Executar localmente

```bash
npm install
npm run dev
```

O Vite informa a URL local no terminal. Para validar a versão de produção:

```bash
npm run build
npm run preview
```

## Funcionalidades

- Cadastro e consulta de produtos e clientes
- Entrada de estoque e alertas de nível baixo
- Carrinho de PDV com desconto, cliente e forma de pagamento
- Registro de vendas e lançamentos financeiros
- Relatório de vendas com exportação CSV
- Tema claro ou escuro
- Persistência local no navegador via `localStorage`

> Os dados são armazenados no navegador e servem para demonstração. O projeto ainda não possui API ou banco de dados compartilhado entre dispositivos.

## Publicação

O projeto pode ser publicado no Vercel como aplicação Vite. Use `npm run build` como comando de build e `dist` como diretório de saída.
