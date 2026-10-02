import { useEffect, useMemo, useState } from 'react';

const SEED = {
  products: [
    { id: 1, code: 'EL-001', name: 'Smartphone X Pro', category: 'Eletrônicos', emoji: '📱', price: 1299.9, cost: 750, stock: 25, min: 5 },
    { id: 2, code: 'EL-002', name: 'Fone Bluetooth', category: 'Eletrônicos', emoji: '🎧', price: 189.9, cost: 90, stock: 40, min: 10 },
    { id: 3, code: 'VE-001', name: 'Camiseta Premium', category: 'Vestuário', emoji: '👕', price: 79.9, cost: 30, stock: 3, min: 10 },
    { id: 4, code: 'VE-002', name: 'Tênis Runner', category: 'Vestuário', emoji: '👟', price: 349.9, cost: 180, stock: 18, min: 5 },
    { id: 5, code: 'BE-001', name: 'Kit Skincare', category: 'Beleza', emoji: '🧴', price: 129.9, cost: 55, stock: 0, min: 5 },
    { id: 6, code: 'AL-001', name: 'Café Especial 250g', category: 'Alimentos', emoji: '☕', price: 34.9, cost: 18, stock: 60, min: 20 },
    { id: 7, code: 'EL-003', name: 'Mouse Sem Fio', category: 'Eletrônicos', emoji: '🖱️', price: 99.9, cost: 45, stock: 15, min: 8 },
    { id: 8, code: 'MO-001', name: 'Cadeira Gamer', category: 'Móveis', emoji: '🪑', price: 899.9, cost: 480, stock: 7, min: 3 },
  ],
  clients: [
    { id: 1, name: 'Ana Lima', doc: '123.456.789-00', email: 'ana@email.com', tel: '(11)98765-4321', city: 'São Paulo', segment: 'VIP', spent: 4890.5 },
    { id: 2, name: 'Carlos Mendes', doc: '987.654.321-00', email: 'carlos@email.com', tel: '(21)91234-5678', city: 'Rio de Janeiro', segment: 'Regular', spent: 1240 },
    { id: 3, name: 'Fernanda Rocha', doc: '456.789.123-00', email: 'fer@email.com', tel: '(31)99876-5432', city: 'BH', segment: 'Novo', spent: 349.9 },
    { id: 4, name: 'João Silva', doc: '321.654.987-00', email: 'joao@email.com', tel: '(41)98888-7777', city: 'Curitiba', segment: 'VIP', spent: 8760 },
  ],
  sales: [
    { id: 1, client: 'Ana Lima', items: 3, subtotal: 389.7, discount: 10, total: 350.73, pay: 'cartao', date: '2026-02-10' },
    { id: 2, client: 'Carlos Mendes', items: 1, subtotal: 1299.9, discount: 0, total: 1299.9, pay: 'pix', date: '2026-02-12' },
    { id: 3, client: 'Consumidor Final', items: 2, subtotal: 269.8, discount: 5, total: 256.31, pay: 'dinheiro', date: '2026-02-14' },
    { id: 4, client: 'João Silva', items: 5, subtotal: 2189.5, discount: 15, total: 1861.08, pay: 'cartao', date: '2026-02-16' },
  ],
  fin: [
    { id: 1, desc: 'Venda #001', type: 'entrada', category: 'Vendas', value: 350.73, date: '2026-02-10' },
    { id: 2, desc: 'Venda #002', type: 'entrada', category: 'Vendas', value: 1299.9, date: '2026-02-12' },
    { id: 3, desc: 'Fornecedor Têxtil', type: 'saida', category: 'Fornecedores', value: 840, date: '2026-02-13' },
    { id: 4, desc: 'Aluguel Fevereiro', type: 'saida', category: 'Aluguel', value: 1200, date: '2026-02-14' },
    { id: 5, desc: 'Venda #003', type: 'entrada', category: 'Vendas', value: 256.31, date: '2026-02-14' },
    { id: 6, desc: 'Venda #004', type: 'entrada', category: 'Vendas', value: 1861.08, date: '2026-02-16' },
  ],
};

const readStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(`erp-${key}`)) ?? fallback; }
  catch { return fallback; }
};
const brl = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
const today = () => new Date().toISOString().slice(0, 10);
const nextId = (items) => items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

const NAV = [
  { group: 'Principal', items: [['dashboard', 'chart-pie', 'Dashboard'], ['pdv', 'cash-register', 'PDV']] },
  { group: 'Gestão', items: [['clientes', 'users', 'Clientes'], ['estoque', 'boxes-stacked', 'Estoque'], ['produtos', 'barcode', 'Produtos']] },
  { group: 'Financeiro', items: [['relatorios', 'chart-line', 'Relatórios'], ['financeiro', 'wallet', 'Financeiro']] },
  { group: 'Sistema', items: [['configuracoes', 'gear', 'Configurações']] },
];
const TITLES = Object.fromEntries(NAV.flatMap((section) => section.items.map(([id, , title]) => [id, title === 'PDV' ? 'Ponto de Venda' : title])));

function App() {
  const [products, setProducts] = useState(() => readStore('products', SEED.products));
  const [clients, setClients] = useState(() => readStore('clients', SEED.clients));
  const [sales, setSales] = useState(() => readStore('sales', SEED.sales));
  const [fin, setFin] = useState(() => readStore('fin', SEED.fin));
  const [page, setPage] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('erp-theme') || 'dark');
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState('');
  const [toast, setToast] = useState('');
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [pay, setPay] = useState('dinheiro');
  const [saleClient, setSaleClient] = useState('');
  const [reportTab, setReportTab] = useState('vendas');

  useEffect(() => { localStorage.setItem('erp-products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('erp-clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('erp-sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('erp-fin', JSON.stringify(fin)); }, [fin]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('erp-theme', theme);
  }, [theme]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(() => products.filter((p) => `${p.name} ${p.code} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const filteredClients = useMemo(() => clients.filter((c) => `${c.name} ${c.email}`.toLowerCase().includes(query.toLowerCase())), [clients, query]);
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0);
  const total = subtotal * (1 - Math.min(100, Math.max(0, Number(discount) || 0)) / 100);
  const notify = (message) => setToast(message);
  const addToCart = (product) => {
    if (product.stock < 1) return notify('Produto sem estoque.');
    setCart((current) => current.some((line) => line.id === product.id)
      ? current.map((line) => line.id === product.id && line.qty < product.stock ? { ...line, qty: line.qty + 1 } : line)
      : [...current, { ...product, qty: 1 }]);
  };
  const setQty = (id, qty) => setCart((current) => current.map((line) => line.id === id ? { ...line, qty: Math.max(1, Math.min(Number(qty) || 1, products.find((p) => p.id === id)?.stock || 1)) } : line));
  const finalizeSale = () => {
    if (!cart.length) return notify('Adicione produtos antes de finalizar.');
    const sale = { id: nextId(sales), client: clients.find((c) => c.id === Number(saleClient))?.name || 'Consumidor Final', items: cart.reduce((n, line) => n + line.qty, 0), subtotal, discount: Number(discount) || 0, total, pay, date: today() };
    setSales((current) => [...current, sale]);
    setProducts((current) => current.map((p) => ({ ...p, stock: p.stock - (cart.find((line) => line.id === p.id)?.qty || 0) })));
    setFin((current) => [...current, { id: nextId(current), desc: `Venda #${String(sale.id).padStart(3, '0')}`, type: 'entrada', category: 'Vendas', value: total, date: today() }]);
    const client = clients.find((c) => c.id === Number(saleClient));
    if (client) setClients((current) => current.map((c) => c.id === client.id ? { ...c, spent: c.spent + total } : c));
    setCart([]); setDiscount(0); setSaleClient(''); setPage('dashboard');
    notify(`Venda ${String(sale.id).padStart(3, '0')} finalizada com sucesso.`);
  };
  const createProduct = (event) => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
    if (!data.name || Number(data.price) <= 0) return notify('Informe o nome e um preço válido.');
    setProducts((current) => [...current, { id: nextId(current), code: data.code || `SKU-${String(nextId(current)).padStart(3, '0')}`, name: data.name, category: data.category || 'Geral', emoji: data.emoji || '📦', price: Number(data.price), cost: Number(data.cost) || 0, stock: Number(data.stock) || 0, min: Number(data.min) || 5 }]);
    setModal(''); event.currentTarget.reset(); notify('Produto cadastrado.');
  };
  const createClient = (event) => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
    if (!data.name) return notify('Informe o nome do cliente.');
    setClients((current) => [...current, { id: nextId(current), name: data.name, email: data.email, tel: data.tel, doc: data.doc, city: data.city, segment: 'Novo', spent: 0 }]);
    setModal(''); event.currentTarget.reset(); notify('Cliente cadastrado.');
  };
  const deleteProduct = (id) => { if (window.confirm('Excluir este produto?')) setProducts((current) => current.filter((p) => p.id !== id)); };
  const deleteClient = (id) => { if (window.confirm('Excluir este cliente?')) setClients((current) => current.filter((c) => c.id !== id)); };
  const stockEntry = (event) => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
    setProducts((current) => current.map((p) => p.id === Number(data.product) ? { ...p, stock: p.stock + Number(data.qty), cost: Number(data.cost) || p.cost } : p));
    setModal(''); event.currentTarget.reset(); notify('Entrada de estoque registrada.');
  };
  const createFin = (event) => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
    if (!data.desc || Number(data.value) <= 0) return notify('Preencha a descrição e o valor.');
    setFin((current) => [...current, { id: nextId(current), desc: data.desc, type: data.type, category: data.category || 'Geral', value: Number(data.value), date: data.date || today() }]);
    setModal(''); event.currentTarget.reset(); notify('Lançamento registrado.');
  };
  const exportCsv = () => {
    const rows = [['Data', 'Venda', 'Cliente', 'Itens', 'Total', 'Pagamento'], ...sales.map((s) => [s.date, `#${s.id}`, s.client, s.items, s.total.toFixed(2), s.pay])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' })); link.download = 'relatorio-vendas.csv'; link.click(); URL.revokeObjectURL(link.href);
  };

  const low = products.filter((p) => p.stock > 0 && p.stock <= p.min).length;
  const out = products.filter((p) => p.stock === 0).length;
  const revenue = sales.reduce((sum, s) => sum + s.total, 0);
  const enter = fin.filter((item) => item.type === 'entrada').reduce((sum, item) => sum + item.value, 0);
  const exit = fin.filter((item) => item.type === 'saida').reduce((sum, item) => sum + item.value, 0);
  const pageTitle = TITLES[page] || 'Dashboard';

  return <div className="erp-app">
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo"><div className="logo-icon">IE</div><div className="logo-text"><h2>InNovaERP</h2><span>InNovaIdeia</span></div></div>
      <nav>{NAV.map((group) => <div key={group.group}><div className="sidebar-section">{group.group}</div>{group.items.map(([id, icon, label]) => <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => { setPage(id); setQuery(''); }}><i className={`fa-solid fa-${icon}`} /><span>{label}</span>{id === 'pdv' && <span className="badge">Novo</span>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><i className={`fa-solid fa-${theme === 'dark' ? 'sun' : 'moon'}`} /><span>Tema</span></button></div>
    </aside>
    <main className="main">
      <header className="topbar"><button className="topbar-toggle" onClick={() => setCollapsed((value) => !value)} aria-label="Alternar menu"><i className="fa-solid fa-bars" /></button><div className="topbar-title">{pageTitle}</div><div className="topbar-spacer" /><div className="topbar-search"><i className="fa-solid fa-magnifying-glass" /><input aria-label="Buscar" placeholder="Buscar…" value={query} onChange={(event) => setQuery(event.target.value)} /></div><button className="topbar-btn" title={`${low + out} alertas de estoque`} onClick={() => setPage('estoque')}><i className="fa-solid fa-bell" />{low + out > 0 && <span className="dot" />}</button><div className="topbar-avatar" title="Dione Castro Alves">DC</div></header>
      <div className="content">
        {page === 'dashboard' && <Dashboard revenue={revenue} sales={sales} clients={clients} products={products} low={low + out} go={setPage} />}
        {page === 'pdv' && <section className="page active"><div className="section-header"><div><h1>Ponto de Venda</h1><p>Registre vendas rapidamente</p></div><div className="header-actions"><select className="form-control" value={saleClient} onChange={(e) => setSaleClient(e.target.value)}><option value="">— Cliente (opcional) —</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><button className="btn btn-outline btn-sm" onClick={() => setModal('product')}><i className="fa-solid fa-plus" /> Produto</button></div></div><div className="pdv-layout"><div className="pdv-products"><div className="pdv-filter"><div className="topbar-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Buscar produto…" value={query} onChange={(e) => setQuery(e.target.value)} /></div></div><div className="product-grid">{filteredProducts.map((p) => <button key={p.id} disabled={!p.stock} className="product-card" onClick={() => addToCart(p)}><div className="p-icon">{p.emoji}</div><div className="p-name">{p.name}</div><div className="p-price">{brl(p.price)}</div><div className="p-stock">{p.stock ? `${p.stock} em estoque` : 'Esgotado'}</div></button>)}</div></div><div className="pdv-cart"><div className="card-header"><h3><i className="fa-solid fa-cart-shopping" /> Carrinho</h3><button className="btn btn-outline btn-sm" onClick={() => setCart([])}>Limpar</button></div><div className="cart-items">{cart.length ? cart.map((line) => <div className="cart-item" key={line.id}><div className="cart-item-name">{line.emoji} {line.name}</div><div className="cart-item-qty"><button className="cart-qty-btn" onClick={() => setQty(line.id, line.qty - 1)}>−</button><span className="cart-qty-val">{line.qty}</span><button className="cart-qty-btn" onClick={() => setQty(line.id, line.qty + 1)}>+</button></div><div className="cart-item-total">{brl(line.price * line.qty)}</div><button className="cart-item-del" onClick={() => setCart((current) => current.filter((x) => x.id !== line.id))} aria-label="Remover"><i className="fa-solid fa-trash" /></button></div>) : <div className="empty-state"><i className="fa-solid fa-cart-shopping" /><h4>Carrinho vazio</h4><p>Clique em um produto para adicionar</p></div>}</div><div className="cart-footer"><div className="cart-row"><span>Subtotal</span><span>{brl(subtotal)}</span></div><div className="cart-row"><span>Desconto</span><span className="discount-input"><input type="number" className="form-control" value={discount} min="0" max="100" onChange={(e) => setDiscount(e.target.value)} /> %</span></div><div className="cart-row total"><span>TOTAL</span><span>{brl(total)}</span></div><div className="pay-methods">{[['dinheiro', 'money-bill-wave', 'Dinheiro'], ['cartao', 'credit-card', 'Cartão'], ['pix', 'qrcode', 'Pix']].map(([value, icon, label]) => <button key={value} className={`pay-method ${pay === value ? 'selected' : ''}`} onClick={() => setPay(value)}><i className={`fa-solid fa-${icon}`} /><span>{label}</span></button>)}</div><button className="btn btn-success checkout-btn" onClick={finalizeSale}><i className="fa-solid fa-circle-check" /> Finalizar Venda</button></div></div></div></section>}
        {page === 'clientes' && <Clients clients={filteredClients} allCount={clients.length} onCreate={() => setModal('client')} onDelete={deleteClient} />}
        {page === 'estoque' && <Inventory products={filteredProducts} all={products} low={low} out={out} onAdd={() => setModal('product')} onEntry={() => setModal('stock')} onDelete={deleteProduct} />}
        {page === 'produtos' && <Products products={filteredProducts} onAdd={() => setModal('product')} onDelete={deleteProduct} />}
        {page === 'relatorios' && <Reports sales={sales} products={products} clients={clients} tab={reportTab} setTab={setReportTab} exportCsv={exportCsv} />}
        {page === 'financeiro' && <Finance fin={fin} enter={enter} exit={exit} onAdd={() => setModal('fin')} />}
        {page === 'configuracoes' && <Settings theme={theme} setTheme={setTheme} notify={notify} />}
      </div>
    </main>
    {modal && <Modal title={{ product: 'Novo Produto', client: 'Novo Cliente', stock: 'Entrada de Estoque', fin: 'Novo Lançamento' }[modal]} close={() => setModal('')}>
      {modal === 'product' && <form onSubmit={createProduct}><div className="form-row"><Field label="Nome" name="name" required /><Field label="Código / SKU" name="code" /><Field label="Categoria" name="category" /><Field label="Emoji" name="emoji" defaultValue="📦" /><Field label="Preço de venda" name="price" type="number" min="0.01" step="0.01" required /><Field label="Custo" name="cost" type="number" min="0" step="0.01" /><Field label="Estoque inicial" name="stock" type="number" min="0" defaultValue="0" /><Field label="Estoque mínimo" name="min" type="number" min="0" defaultValue="5" /></div><FormActions close={() => setModal('')} /></form>}
      {modal === 'client' && <form onSubmit={createClient}><div className="form-row"><Field label="Nome" name="name" required /><Field label="CPF" name="doc" /><Field label="E-mail" name="email" type="email" /><Field label="Telefone" name="tel" /><Field label="Cidade" name="city" /></div><FormActions close={() => setModal('')} /></form>}
      {modal === 'stock' && <form onSubmit={stockEntry}><div className="form-group"><label className="form-label">Produto</label><select className="form-control" name="product" required>{products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.stock} un.)</option>)}</select></div><div className="form-row"><Field label="Quantidade" name="qty" type="number" min="1" required /><Field label="Novo custo unitário (opcional)" name="cost" type="number" min="0" step="0.01" /></div><FormActions close={() => setModal('')} /></form>}
      {modal === 'fin' && <form onSubmit={createFin}><div className="form-row"><Field label="Descrição" name="desc" required /><div className="form-group"><label className="form-label">Tipo</label><select name="type" className="form-control"><option value="entrada">Entrada</option><option value="saida">Saída</option></select></div><Field label="Categoria" name="category" /><Field label="Valor" name="value" type="number" min="0.01" step="0.01" required /><Field label="Data" name="date" type="date" defaultValue={today()} /></div><FormActions close={() => setModal('')} /></form>}
    </Modal>}
    {toast && <div className="toast-container"><div className="toast success"><i className="fa-solid fa-circle-check" /><span>{toast}</span></div></div>}
  </div>;
}

function Dashboard({ revenue, sales, clients, products, low, go }) {
  const cards = [['Faturamento Total', brl(revenue), 'chart-line', 'blue'], ['Vendas Realizadas', sales.length, 'receipt', 'teal'], ['Clientes Cadastrados', clients.length, 'users', 'yellow'], ['Alertas de Estoque', low, 'boxes-stacked', 'red']];
  const chart = [36, 55, 43, 72, 51, 88, 64];
  return <section className="page active"><div className="section-header"><div><h1>Dashboard</h1><p>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div><button className="btn btn-primary btn-sm" onClick={() => go('pdv')}><i className="fa-solid fa-plus" /> Nova Venda</button></div><div className="kpi-grid">{cards.map(([label, value, icon, color]) => <div className={`kpi-card ${color}`} key={label}><div className="kpi-icon"><i className={`fa-solid fa-${icon}`} /></div><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div><div className="kpi-delta up">Visão geral</div></div>)}</div><div className="grid-60-40 dashboard-row"><div className="card"><div className="card-header"><div><h3>Vendas dos Últimos 7 Dias</h3><p>Indicador demonstrativo</p></div></div><div className="card-body"><div className="chart-bars">{chart.map((height, i) => <div className="chart-bar-wrap" key={i}><div className={`chart-bar ${i % 2 ? 'teal' : ''}`} style={{ height: `${height}px` }} /><span className="chart-bar-label">{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}</span></div>)}</div></div></div><div className="card"><div className="card-header"><div><h3>Estoque</h3><p>Condição atual do catálogo</p></div></div><div className="card-body inventory-summary"><div className="chart-donut" /><div className="chart-legend"><div className="legend-item"><span className="legend-dot" style={{ background: 'var(--success)' }} />Disponíveis: {products.filter((p) => p.stock > p.min).length}</div><div className="legend-item"><span className="legend-dot" style={{ background: 'var(--warning)' }} />Estoque baixo: {products.filter((p) => p.stock > 0 && p.stock <= p.min).length}</div><div className="legend-item"><span className="legend-dot" style={{ background: 'var(--danger)' }} />Esgotados: {products.filter((p) => !p.stock).length}</div></div></div></div></div><div className="card"><div className="card-header"><div><h3>Últimas Vendas</h3><p>Transações recentes</p></div><button className="btn btn-outline btn-sm" onClick={() => go('relatorios')}>Ver todas</button></div><div className="table-wrap"><table><thead><tr><th>Nº</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Pagamento</th><th>Status</th></tr></thead><tbody>{sales.slice(-5).reverse().map((s) => <tr key={s.id}><td>#{String(s.id).padStart(3, '0')}</td><td>{s.client}</td><td>{s.items}</td><td><strong>{brl(s.total)}</strong></td><td><span className="tag tag-neutral">{s.pay}</span></td><td><span className="tag tag-success">Pago</span></td></tr>)}</tbody></table></div></div></section>;
}

function Clients({ clients, allCount, onCreate, onDelete }) { return <section className="page active"><div className="section-header"><div><h1>Clientes</h1><p>{clients.length} de {allCount} cliente(s)</p></div><button className="btn btn-primary" onClick={onCreate}><i className="fa-solid fa-user-plus" /> Novo Cliente</button></div><DataTable headers={['#', 'Nome', 'E-mail', 'Telefone', 'Segmento', 'Total Gasto', 'Ações']}><>{clients.map((c) => <tr key={c.id}><td>{c.id}</td><td><strong>{c.name}</strong></td><td>{c.email || '—'}</td><td>{c.tel || '—'}</td><td><span className={`tag ${c.segment === 'VIP' ? 'tag-warning' : 'tag-info'}`}>{c.segment}</span></td><td>{brl(c.spent)}</td><td><button className="btn btn-danger btn-sm" onClick={() => onDelete(c.id)} title="Excluir"><i className="fa-solid fa-trash" /></button></td></tr>)}</></DataTable></section>; }
function Inventory({ products, all, low, out, onAdd, onEntry, onDelete }) { const value = all.reduce((sum, p) => sum + p.cost * p.stock, 0); return <section className="page active"><div className="section-header"><div><h1>Estoque</h1><p>Controle de inventário</p></div><div className="header-actions"><button className="btn btn-outline btn-sm" onClick={onEntry}><i className="fa-solid fa-arrow-down" /> Entrada</button><button className="btn btn-primary" onClick={onAdd}><i className="fa-solid fa-plus" /> Produto</button></div></div><div className="kpi-grid">{[['Total de SKUs', all.length, 'blue'], ['Estoque Baixo', low, 'yellow'], ['Sem Estoque', out, 'red'], ['Valor em Estoque', brl(value), 'teal']].map(([label, val, color]) => <div className={`kpi-card ${color}`} key={label}><div className="kpi-label">{label}</div><div className="kpi-value">{val}</div></div>)}</div><DataTable headers={['Código', 'Produto', 'Categoria', 'Preço', 'Custo', 'Estoque', 'Mínimo', 'Status', 'Ações']}><>{products.map((p) => <tr key={p.id}><td><code>{p.code}</code></td><td><strong>{p.emoji} {p.name}</strong></td><td>{p.category}</td><td>{brl(p.price)}</td><td>{brl(p.cost)}</td><td>{p.stock}</td><td>{p.min}</td><td><span className={`tag ${p.stock === 0 ? 'tag-danger' : p.stock <= p.min ? 'tag-warning' : 'tag-success'}`}>{p.stock === 0 ? 'Esgotado' : p.stock <= p.min ? 'Baixo' : 'OK'}</span></td><td><button className="btn btn-danger btn-sm" onClick={() => onDelete(p.id)} aria-label="Excluir produto"><i className="fa-solid fa-trash" /></button></td></tr>)}</></DataTable></section>; }
function Products({ products, onAdd, onDelete }) { return <section className="page active"><div className="section-header"><div><h1>Produtos</h1><p>Catálogo completo</p></div><button className="btn btn-primary" onClick={onAdd}><i className="fa-solid fa-plus" /> Novo Produto</button></div><DataTable headers={['Código', 'Nome', 'Categoria', 'Preço Venda', 'Custo', 'Margem', 'Estoque', 'Ações']}><>{products.map((p) => <tr key={p.id}><td><code>{p.code}</code></td><td><strong>{p.emoji} {p.name}</strong></td><td>{p.category}</td><td>{brl(p.price)}</td><td>{brl(p.cost)}</td><td>{p.price ? `${Math.round((p.price - p.cost) / p.price * 100)}%` : '—'}</td><td>{p.stock}</td><td><button className="btn btn-danger btn-sm" onClick={() => onDelete(p.id)} aria-label="Excluir produto"><i className="fa-solid fa-trash" /></button></td></tr>)}</></DataTable></section>; }
function Reports({ sales, products, clients, tab, setTab, exportCsv }) { const revenue = sales.reduce((sum, s) => sum + s.total, 0); return <section className="page active"><div className="section-header"><div><h1>Relatórios</h1><p>Análise e desempenho</p></div><button className="btn btn-outline btn-sm" onClick={exportCsv}><i className="fa-solid fa-download" /> Exportar CSV</button></div><div className="report-tabs">{[['vendas', 'Vendas'], ['produtos', 'Produtos'], ['clientes', 'Clientes']].map(([id, label]) => <button className={`report-tab ${tab === id ? 'active' : ''}`} key={id} onClick={() => setTab(id)}>{label}</button>)}</div>{tab === 'vendas' && <><div className="kpi-grid">{[['Receita Total', brl(revenue)], ['Nº de Vendas', sales.length], ['Ticket Médio', brl(sales.length ? revenue / sales.length : 0)], ['Descontos', brl(sales.reduce((sum, s) => sum + s.subtotal - s.total, 0))]].map(([label, value]) => <div className="kpi-card blue" key={label}><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div></div>)}</div><DataTable headers={['Data', 'Venda', 'Cliente', 'Itens', 'Subtotal', 'Desconto', 'Total', 'Pagamento']}><>{sales.slice().reverse().map((s) => <tr key={s.id}><td>{s.date}</td><td>#{String(s.id).padStart(3, '0')}</td><td>{s.client}</td><td>{s.items}</td><td>{brl(s.subtotal)}</td><td>{s.discount}%</td><td><strong>{brl(s.total)}</strong></td><td>{s.pay}</td></tr>)}</></DataTable></>}{tab === 'produtos' && <DataTable headers={['Produto', 'Preço', 'Estoque', 'Margem']}><>{products.map((p) => <tr key={p.id}><td>{p.emoji} {p.name}</td><td>{brl(p.price)}</td><td>{p.stock}</td><td>{p.price ? `${Math.round((p.price - p.cost) / p.price * 100)}%` : '—'}</td></tr>)}</></DataTable>}{tab === 'clientes' && <DataTable headers={['Cliente', 'Compras registradas', 'Total gasto', 'Segmento']}><>{clients.slice().sort((a, b) => b.spent - a.spent).map((c) => <tr key={c.id}><td><strong>{c.name}</strong></td><td>{sales.filter((s) => s.client === c.name).length}</td><td>{brl(c.spent)}</td><td>{c.segment}</td></tr>)}</></DataTable>}</section>; }
function Finance({ fin, enter, exit, onAdd }) { return <section className="page active"><div className="section-header"><div><h1>Financeiro</h1><p>Entradas, saídas e fluxo de caixa</p></div><button className="btn btn-primary" onClick={onAdd}><i className="fa-solid fa-plus" /> Lançamento</button></div><div className="kpi-grid">{[['Total Entradas', brl(enter), 'teal'], ['Total Saídas', brl(exit), 'red'], ['Saldo', brl(enter - exit), enter >= exit ? 'blue' : 'red']].map(([label, value, color]) => <div className={`kpi-card ${color}`} key={label}><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div></div>)}</div><DataTable headers={['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor']}><>{fin.slice().reverse().map((item) => <tr key={item.id}><td>{item.date}</td><td>{item.desc}</td><td><span className={`tag ${item.type === 'entrada' ? 'tag-success' : 'tag-danger'}`}>{item.type === 'entrada' ? 'Entrada' : 'Saída'}</span></td><td>{item.category}</td><td><strong>{item.type === 'entrada' ? '+' : '−'} {brl(item.value)}</strong></td></tr>)}</></DataTable></section>; }
function Settings({ theme, setTheme, notify }) { return <section className="page active"><div className="section-header"><div><h1>Configurações</h1><p>Personalizar sistema</p></div></div><div className="grid-2 settings-grid"><div className="card"><div className="card-header"><h3>Empresa</h3></div><div className="card-body"><div className="form-group"><label className="form-label">Nome da Empresa</label><input className="form-control" defaultValue="InNovaIdeia" /></div><div className="form-group"><label className="form-label">CNPJ</label><input className="form-control" placeholder="00.000.000/0001-00" /></div><div className="form-group"><label className="form-label">Endereço</label><input className="form-control" placeholder="Rua, Número, Cidade" /></div><div className="form-group"><label className="form-label">Telefone</label><input className="form-control" placeholder="(00) 00000-0000" /></div><button className="btn btn-primary" onClick={() => notify('Configurações salvas.')}><i className="fa-solid fa-floppy-disk" /> Salvar</button></div></div><div className="card"><div className="card-header"><h3>Aparência</h3></div><div className="card-body"><div className="form-group"><label className="form-label">Tema</label><select className="form-control" value={theme} onChange={(e) => setTheme(e.target.value)}><option value="dark">Escuro</option><option value="light">Claro</option></select></div><div className="form-group"><label className="form-label">Versão</label><div className="form-control">InNovaERP v2.1 – InNovaIdeia</div></div></div></div></div></section>; }
function DataTable({ headers, children }) { return <div className="card"><div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div></div>; }
function Field({ label, name, type = 'text', ...props }) { return <div className="form-group"><label className="form-label" htmlFor={name}>{label}</label><input id={name} name={name} type={type} className="form-control" {...props} /></div>; }
function FormActions({ close }) { return <div className="modal-actions"><button className="btn btn-outline" type="button" onClick={close}>Cancelar</button><button className="btn btn-primary" type="submit"><i className="fa-solid fa-floppy-disk" /> Salvar</button></div>; }
function Modal({ title, close, children }) { return <div className="modal-overlay open" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header className="modal-header"><h3 id="modal-title">{title}</h3><button className="modal-close" onClick={close} aria-label="Fechar"><i className="fa-solid fa-xmark" /></button></header><div className="modal-body">{children}</div></section></div>; }

export default App;
