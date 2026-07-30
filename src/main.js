import './styles.css';

const STORAGE_KEY = 'moneymate.fullstack.demo.v1';
const today = new Date('2026-07-30T08:00:00Z');

const uid = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const seedState = {
  auth: { status: 'guest' },
  user: {
    id: 'usr_01',
    name: 'Nguyen Van A',
    email: 'a@example.com',
    currency: 'VND',
    language: 'VI',
    theme: 'light',
    monthlyIncome: 28000000,
  },
  wallets: [
    { id: 'w_cash', name: 'Tiền mặt', type: 'Cash', balance: 3600000 },
    { id: 'w_bank', name: 'Vietcombank', type: 'Bank Account', balance: 24500000 },
    { id: 'w_momo', name: 'Momo', type: 'E-Wallet', balance: 2500000 },
    { id: 'w_credit', name: 'Thẻ tín dụng', type: 'Credit Card', balance: -1850000 },
  ],
  categories: [
    { id: 'cat_salary', name: 'Lương', type: 'income', icon: '💼', color: '#22c55e' },
    { id: 'cat_freelance', name: 'Freelance', type: 'income', icon: '💻', color: '#14b8a6' },
    { id: 'cat_food', name: 'Ăn uống', type: 'expense', icon: '🍜', color: '#f97316' },
    { id: 'cat_rent', name: 'Nhà ở', type: 'expense', icon: '🏠', color: '#8b5cf6' },
    { id: 'cat_shop', name: 'Mua sắm', type: 'expense', icon: '🛍️', color: '#ec4899' },
    { id: 'cat_entertainment', name: 'Giải trí', type: 'expense', icon: '🎬', color: '#06b6d4' },
    { id: 'cat_transport', name: 'Di chuyển', type: 'expense', icon: '🚌', color: '#eab308' },
    { id: 'cat_transfer', name: 'Chuyển ví', type: 'transfer', icon: '🔁', color: '#64748b' },
  ],
  transactions: [
    { id: 'tx_101', amount: 24500000, type: 'income', categoryId: 'cat_salary', walletId: 'w_bank', date: '2026-07-28T08:00', method: 'Bank', note: 'Lương tháng 7', receiptUrl: '', tags: ['salary'] },
    { id: 'tx_102', amount: 1260000, type: 'expense', categoryId: 'cat_food', walletId: 'w_momo', date: '2026-07-27T19:20', method: 'Momo', note: 'Siêu thị cuối tuần', receiptUrl: '', tags: ['food', 'family'] },
    { id: 'tx_103', amount: 6500000, type: 'expense', categoryId: 'cat_rent', walletId: 'w_bank', date: '2026-07-25T09:00', method: 'Bank', note: 'Thanh toán tiền nhà', receiptUrl: '', tags: ['rent'] },
    { id: 'tx_104', amount: 3800000, type: 'income', categoryId: 'cat_freelance', walletId: 'w_bank', date: '2026-07-24T15:00', method: 'Bank', note: 'Dự án freelance', receiptUrl: '', tags: ['client'] },
    { id: 'tx_105', amount: 320000, type: 'expense', categoryId: 'cat_transport', walletId: 'w_cash', date: '2026-07-22T07:30', method: 'Cash', note: 'Đổ xăng', receiptUrl: '', tags: ['bike'] },
    { id: 'tx_106', amount: 1700000, type: 'expense', categoryId: 'cat_shop', walletId: 'w_credit', date: '2026-07-18T20:10', method: 'Credit Card', note: 'Giày chạy bộ', receiptUrl: '', tags: ['shopping'] },
    { id: 'tx_107', amount: 900000, type: 'expense', categoryId: 'cat_entertainment', walletId: 'w_momo', date: '2026-06-20T18:30', method: 'Momo', note: 'Vé xem phim và ăn nhẹ', receiptUrl: '', tags: ['weekend'] },
    { id: 'tx_108', amount: 23000000, type: 'income', categoryId: 'cat_salary', walletId: 'w_bank', date: '2026-06-28T08:00', method: 'Bank', note: 'Lương tháng 6', receiptUrl: '', tags: ['salary'] },
  ],
  budgets: [
    { id: 'b_food', categoryId: 'cat_food', limit: 5000000, month: '2026-07' },
    { id: 'b_rent', categoryId: 'cat_rent', limit: 7000000, month: '2026-07' },
    { id: 'b_shop', categoryId: 'cat_shop', limit: 2500000, month: '2026-07' },
    { id: 'b_ent', categoryId: 'cat_entertainment', limit: 2000000, month: '2026-07' },
  ],
  reminders: [
    { id: 'r_1', title: 'Internet FPT', amount: 275000, categoryId: 'cat_entertainment', walletId: 'w_bank', frequency: 'monthly', dueDate: '2026-08-01' },
    { id: 'r_2', title: 'Netflix', amount: 260000, categoryId: 'cat_entertainment', walletId: 'w_credit', frequency: 'monthly', dueDate: '2026-07-31' },
    { id: 'r_3', title: 'Tiền nhà', amount: 6500000, categoryId: 'cat_rent', walletId: 'w_bank', frequency: 'monthly', dueDate: '2026-08-03' },
  ],
  goals: [
    { id: 'g_1', name: 'Quỹ khẩn cấp', current: 18000000, target: 50000000, deadline: '2026-12-31' },
    { id: 'g_2', name: 'Du lịch Đà Lạt', current: 6500000, target: 12000000, deadline: '2026-10-15' },
  ],
  filters: { search: '', type: 'all', category: 'all', wallet: 'all', range: 'month', sort: 'newest', page: 1 },
};

let state = loadState();
let editingTransactionId = null;
const app = document.querySelector('#root');

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(seedState);
  try {
    return { ...structuredClone(seedState), ...JSON.parse(saved) };
  } catch {
    return structuredClone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function category(id) { return state.categories.find((item) => item.id === id) || state.categories[0]; }
function wallet(id) { return state.wallets.find((item) => item.id === id) || state.wallets[0]; }
function currency(value) {
  return new Intl.NumberFormat(state.user.language === 'VI' ? 'vi-VN' : 'en-US', {
    style: 'currency', currency: state.user.currency, maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
function monthKey(date) { return new Date(date).toISOString().slice(0, 7); }
function isThisMonth(tx) { return monthKey(tx.date) === '2026-07'; }
function isLastMonth(tx) { return monthKey(tx.date) === '2026-06'; }
function txSignedAmount(tx) { return tx.type === 'expense' ? -tx.amount : tx.type === 'income' ? tx.amount : 0; }
function calculateTrend(current, previous) { return previous ? Math.round(((current - previous) / previous) * 100) : 100; }
function byType(type, monthPredicate) { return state.transactions.filter((tx) => tx.type === type && monthPredicate(tx)).reduce((sum, tx) => sum + Number(tx.amount), 0); }
function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function metrics() {
  const income = byType('income', isThisMonth);
  const expense = byType('expense', isThisMonth);
  const lastIncome = byType('income', isLastMonth);
  const lastExpense = byType('expense', isLastMonth);
  const balance = state.wallets.reduce((sum, item) => sum + Number(item.balance), 0);
  const goalCurrent = state.goals.reduce((sum, goal) => sum + Number(goal.current), 0);
  const goalTarget = state.goals.reduce((sum, goal) => sum + Number(goal.target), 0);
  return { income, expense, balance, incomeTrend: calculateTrend(income, lastIncome), expenseTrend: calculateTrend(expense, lastExpense), goalPercent: Math.round((goalCurrent / goalTarget) * 100) };
}

function expenseByCategory() {
  const rows = state.categories.filter((cat) => cat.type === 'expense').map((cat) => ({
    ...cat,
    total: state.transactions.filter((tx) => tx.type === 'expense' && tx.categoryId === cat.id && isThisMonth(tx)).reduce((sum, tx) => sum + Number(tx.amount), 0),
  })).filter((item) => item.total > 0);
  const total = rows.reduce((sum, row) => sum + row.total, 0) || 1;
  return rows.map((row) => ({ ...row, percent: Math.round((row.total / total) * 100) }));
}

function filteredTransactions() {
  const { search, type, category: catId, wallet: walletId, range, sort } = state.filters;
  const now = today.getTime();
  const dayMs = 86400000;
  return state.transactions
    .filter((tx) => {
      const text = `${tx.note} ${category(tx.categoryId).name} ${tx.tags.join(' ')}`.toLowerCase();
      const txTime = new Date(tx.date).getTime();
      const rangeMatch = range === 'all' || (range === 'today' && Math.abs(now - txTime) <= dayMs) || (range === 'week' && now - txTime <= dayMs * 7) || (range === 'month' && isThisMonth(tx));
      return text.includes(search.toLowerCase()) && (type === 'all' || tx.type === type) && (catId === 'all' || tx.categoryId === catId) && (walletId === 'all' || tx.walletId === walletId) && rangeMatch;
    })
    .sort((a, b) => {
      if (sort === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sort === 'amount-desc') return b.amount - a.amount;
      if (sort === 'amount-asc') return a.amount - b.amount;
      return new Date(b.date) - new Date(a.date);
    });
}

function render() {
  document.documentElement.dataset.theme = state.user.theme;
  const m = metrics();
  const notifications = state.reminders.filter((item) => (new Date(item.dueDate) - today) / 86400000 <= 3).length;
  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar(notifications)}
      <main class="content">
        ${renderTopbar()}
        ${renderDashboard(m)}
        ${renderTransactions()}
        ${renderPlanning()}
        ${renderWalletsGoals()}
        ${renderDataTools()}
        ${renderSettings()}
      </main>
      ${renderAuthPanel()}
      ${renderTransactionModal()}
      <nav class="mobile-nav"><a href="#overview">📊</a><a href="#transactions">🧾</a><a href="#planning">🥧</a><a href="#wallets">💳</a><a href="#settings">⚙️</a></nav>
    </div>`;
  bindEvents();
}

function renderSidebar(notifications) {
  return `<aside class="sidebar"><div class="brand"><span>💰</span><strong>MoneyMate</strong></div>
    <a href="#overview">📊 Tổng quan</a><a href="#transactions">🧾 Giao dịch</a><a href="#planning">🥧 Ngân sách <b>${notifications}</b></a><a href="#wallets">💳 Ví & thẻ</a><a href="#goals">🎯 Mục tiêu</a><a href="#data">📤 Dữ liệu</a><a href="#settings">⚙️ Cài đặt</a></aside>`;
}

function renderTopbar() {
  return `<header class="topbar"><div><p class="eyebrow">Offline-first demo</p><h1>Quản lí chi tiêu thông minh</h1><span class="muted">CRUD, biểu đồ, ví, ngân sách, mục tiêu và xuất nhập dữ liệu trong LocalStorage.</span></div>
    <div class="top-actions"><button class="ghost-button" data-action="guest">👤 Guest Mode</button><button class="primary-button" data-open-modal>＋ Thêm giao dịch</button></div></header>`;
}

function renderDashboard(m) {
  return `<section class="hero-grid" id="overview">
    <article class="balance-card"><span>Tổng số dư</span><h2>${currency(m.balance)}</h2><p>${state.wallets.length} ví đang hoạt động • ${state.user.currency}</p></article>
    <article class="metric green"><div>⬆</div><p>Thu tháng này</p><h3>${currency(m.income)}</h3><small>${m.incomeTrend >= 0 ? '+' : ''}${m.incomeTrend}% so với tháng trước</small></article>
    <article class="metric red"><div>⬇</div><p>Chi tháng này</p><h3>${currency(m.expense)}</h3><small>${m.expenseTrend >= 0 ? '+' : ''}${m.expenseTrend}% so với tháng trước</small></article>
    <article class="metric blue"><div>🎯</div><p>Tiến độ tiết kiệm</p><h3>${m.goalPercent}%</h3><div class="progress"><span style="width:${m.goalPercent}%"></span></div></article>
    <div class="panel chart-card"><div class="panel-header"><h3>Chi tiêu theo danh mục</h3><span>Donut</span></div>${renderDonutChart()}</div>
    <div class="panel chart-card"><div class="panel-header"><h3>Thu vs Chi 6 tháng</h3><span>Bar</span></div>${renderBarChart()}</div>
  </section>`;
}

function renderDonutChart() {
  const rows = expenseByCategory();
  let offset = 0;
  const circles = rows.map((row) => {
    const dash = `${row.percent} ${100 - row.percent}`;
    const circle = `<circle r="15.9" cx="20" cy="20" fill="transparent" stroke="${row.color}" stroke-width="8" stroke-dasharray="${dash}" stroke-dashoffset="-${offset}" />`;
    offset += row.percent;
    return circle;
  }).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 40 40" class="donut">${circles}<text x="20" y="22" text-anchor="middle">${rows.length}</text></svg><div class="legend">${rows.map((row) => `<span><i style="background:${row.color}"></i>${row.icon} ${row.name} <b>${row.percent}%</b></span>`).join('')}</div></div>`;
}

function renderBarChart() {
  const months = ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'];
  const max = Math.max(...state.transactions.map((tx) => tx.amount), 1);
  return `<div class="bars">${months.map((month) => {
    const income = state.transactions.filter((tx) => tx.type === 'income' && monthKey(tx.date) === month).reduce((s, tx) => s + tx.amount, 0);
    const expense = state.transactions.filter((tx) => tx.type === 'expense' && monthKey(tx.date) === month).reduce((s, tx) => s + tx.amount, 0);
    return `<div class="bar-month"><div class="bar-pair"><span class="income-bar" style="height:${Math.max(8, income / max * 120)}px"></span><span class="expense-bar" style="height:${Math.max(8, expense / max * 120)}px"></span></div><small>${month.slice(5)}</small></div>`;
  }).join('')}</div>`;
}

function renderTransactions() {
  const rows = filteredTransactions();
  const pageSize = 5;
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  state.filters.page = Math.min(state.filters.page, pages);
  const pageRows = rows.slice((state.filters.page - 1) * pageSize, state.filters.page * pageSize);
  return `<section class="panel" id="transactions"><div class="panel-header"><div><p class="eyebrow">Transaction CRUD</p><h2>Giao dịch</h2></div><button class="primary-button" data-open-modal>＋ Thêm</button></div>
    <div class="filters"><input id="filter-search" placeholder="Tìm ghi chú, danh mục, tag..." value="${state.filters.search}">${select('filter-type', [['all','Tất cả loại'],['income','Thu'],['expense','Chi'],['transfer','Chuyển ví']], state.filters.type)}${select('filter-category', [['all','Tất cả danh mục'], ...state.categories.map((c) => [c.id, c.name])], state.filters.category)}${select('filter-wallet', [['all','Tất cả ví'], ...state.wallets.map((w) => [w.id, w.name])], state.filters.wallet)}${select('filter-range', [['today','Hôm nay'],['week','Tuần này'],['month','Tháng này'],['all','Tất cả']], state.filters.range)}${select('filter-sort', [['newest','Mới nhất'],['oldest','Cũ nhất'],['amount-desc','Tiền cao → thấp'],['amount-asc','Tiền thấp → cao']], state.filters.sort)}</div>
    <div class="transaction-list">${pageRows.map(renderTransaction).join('') || '<p class="empty">Không có giao dịch phù hợp.</p>'}</div>
    <div class="pagination"><button data-page="prev">‹ Trước</button><span>Trang ${state.filters.page}/${pages}</span><button data-page="next">Sau ›</button></div></section>`;
}

function renderTransaction(tx) {
  const cat = category(tx.categoryId);
  const wal = wallet(tx.walletId);
  return `<article class="transaction"><div class="tx-icon ${tx.type}">${cat.icon}</div><div><strong>${tx.note}</strong><span>${cat.name} • ${wal.name} • ${new Date(tx.date).toLocaleString('vi-VN')} • ${tx.tags.join(', ')}</span></div><strong class="${tx.type}">${txSignedAmount(tx) >= 0 ? '+' : '-'}${currency(Math.abs(txSignedAmount(tx)))}</strong><div class="row-actions"><button data-edit="${tx.id}">Sửa</button><button data-delete="${tx.id}">Xóa</button></div></article>`;
}

function renderPlanning() {
  return `<section class="planning-grid" id="planning"><div class="panel"><div class="panel-header"><h2>Ngân sách danh mục</h2><button data-action="add-budget">＋ Budget</button></div>${state.budgets.map((budget) => {
    const cat = category(budget.categoryId);
    const spent = state.transactions.filter((tx) => tx.type === 'expense' && tx.categoryId === budget.categoryId && monthKey(tx.date) === budget.month).reduce((sum, tx) => sum + tx.amount, 0);
    const percent = Math.round((spent / budget.limit) * 100);
    const tone = percent > 90 ? 'danger' : percent >= 70 ? 'warn' : 'ok';
    return `<article class="budget ${tone}"><div><strong>${cat.icon} ${cat.name}</strong><span>${currency(spent)} / ${currency(budget.limit)}</span></div><div class="progress"><span style="width:${Math.min(percent, 100)}%"></span></div><small>${percent}% ${percent > 90 ? '• Cảnh báo vượt ngân sách' : ''}</small></article>`;
  }).join('')}</div><div class="panel"><div class="panel-header"><h2>Nhắc hóa đơn</h2><span class="badge">${state.reminders.length}</span></div>${state.reminders.map((item) => `<article class="reminder"><strong>${item.title}</strong><span>${currency(item.amount)} • ${item.frequency} • hạn ${item.dueDate}</span></article>`).join('')}</div></section>`;
}

function renderWalletsGoals() {
  return `<section class="planning-grid" id="wallets"><div class="panel"><div class="panel-header"><h2>Ví & tài khoản</h2><button data-action="transfer">🔁 Chuyển ví</button></div><div class="wallet-grid">${state.wallets.map((item) => `<article class="wallet-card"><span>${item.type}</span><h3>${item.name}</h3><strong>${currency(item.balance)}</strong></article>`).join('')}</div></div><div class="panel" id="goals"><div class="panel-header"><h2>Mục tiêu tiết kiệm</h2><button data-action="add-goal">＋ Goal</button></div>${state.goals.map((goal) => {
    const percent = Math.round((goal.current / goal.target) * 100);
    const days = Math.max(1, Math.ceil((new Date(goal.deadline) - today) / 86400000));
    return `<article class="goal"><div><strong>${goal.name}</strong><span>Cần ${currency(Math.ceil((goal.target - goal.current) / days))}/ngày đến ${goal.deadline}</span></div><div class="progress"><span style="width:${Math.min(percent, 100)}%"></span></div><small>${currency(goal.current)} / ${currency(goal.target)} (${percent}%)</small></article>`;
  }).join('')}</div></section>`;
}

function renderDataTools() {
  return `<section class="panel" id="data"><div class="panel-header"><div><p class="eyebrow">Export / Import</p><h2>Dữ liệu</h2></div></div><div class="tool-grid"><button data-action="export-csv">Xuất CSV</button><button data-action="export-json">Xuất JSON/PDF report</button><label class="file-button">Nhập CSV<input id="csv-import" type="file" accept=".csv"></label><button class="danger-button" data-action="reset">Reset dữ liệu</button></div><textarea id="export-output" readonly placeholder="Dữ liệu export sẽ xuất hiện ở đây..."></textarea></section>`;
}

function renderSettings() {
  return `<section class="panel" id="settings"><div class="panel-header"><h2>Hồ sơ & cài đặt</h2><span>${state.auth.status}</span></div><form class="settings-grid" id="settings-form"><label>Tên<input name="name" value="${state.user.name}"></label><label>Email<input name="email" value="${state.user.email}"></label><label>Thu nhập cơ sở<input name="monthlyIncome" inputmode="numeric" value="${state.user.monthlyIncome}"></label><label>Tiền tệ${select('currency', [['VND','VND'],['USD','USD'],['EUR','EUR']], state.user.currency)}</label><label>Ngôn ngữ${select('language', [['VI','VI'],['EN','EN']], state.user.language)}</label><label>Giao diện${select('theme', [['light','Light'],['dark','Dark']], state.user.theme)}</label><button class="primary-button">Lưu cài đặt</button></form></section>`;
}

function renderAuthPanel() {
  return `<aside class="auth-card"><div class="auth-tabs"><button class="active" data-auth-tab="signin">Đăng nhập</button><button data-auth-tab="signup">Đăng kí</button><button data-auth-tab="reset">Reset</button></div><form id="auth-form" class="auth-form"><h2 id="auth-title">Chào mừng quay lại</h2><label class="signup-field is-hidden">Họ tên<span>👤<input name="authName" placeholder="Nguyễn Minh Anh"></span></label><label>Email<span>✉️<input name="authEmail" type="email" required placeholder="ban@email.com"></span></label><label>Mật khẩu<span>🔒<input id="auth-password" name="authPassword" type="password" placeholder="••••••••"><button type="button" id="toggle-password">👁️</button></span><small class="form-error" id="auth-error"></small></label><button class="primary-button" id="auth-submit">Đăng nhập</button><button type="button" class="ghost-button" data-action="guest">Tiếp tục với Guest Mode</button></form></aside>`;
}

function renderTransactionModal() {
  const tx = editingTransactionId ? state.transactions.find((item) => item.id === editingTransactionId) : null;
  return `<div class="modal is-hidden" id="tx-modal"><form class="modal-card" id="tx-form"><div class="panel-header"><h2>${tx ? 'Sửa' : 'Thêm'} giao dịch</h2><button type="button" data-close-modal>✕</button></div><div class="form-grid"><label>Số tiền<input name="amount" inputmode="numeric" required value="${tx?.amount || ''}" placeholder="1,000,000 ₫"><small class="form-error"></small></label><label>Loại${select('type', [['expense','Chi'],['income','Thu'],['transfer','Chuyển ví']], tx?.type || 'expense')}</label><label>Danh mục${select('categoryId', state.categories.map((c) => [c.id, `${c.icon} ${c.name}`]), tx?.categoryId || 'cat_food')}</label><label>Ví${select('walletId', state.wallets.map((w) => [w.id, w.name]), tx?.walletId || 'w_cash')}</label><label>Ngày giờ<input name="date" type="datetime-local" required value="${tx?.date || '2026-07-30T08:00'}"></label><label>Phương thức${select('method', [['Cash','Cash'],['Credit Card','Credit Card'],['Bank','Bank'],['Momo','Momo'],['ZaloPay','ZaloPay']], tx?.method || 'Cash')}</label><label class="wide">Ghi chú<input name="note" required value="${tx?.note || ''}" placeholder="Mô tả giao dịch"></label><label>Receipt URL<input name="receiptUrl" value="${tx?.receiptUrl || ''}" placeholder="https://..."></label><label>Tags<input name="tags" value="${tx?.tags?.join(', ') || ''}" placeholder="food, work"></label></div><button class="primary-button">Lưu giao dịch</button></form></div>`;
}

function select(name, options, value) {
  return `<select name="${name}" id="${name}">${options.map(([val, label]) => `<option value="${val}" ${val === value ? 'selected' : ''}>${label}</option>`).join('')}</select>`;
}

function bindEvents() {
  document.querySelectorAll('[data-open-modal]').forEach((btn) => btn.addEventListener('click', () => { editingTransactionId = null; render(); document.querySelector('#tx-modal').classList.remove('is-hidden'); }));
  document.querySelector('[data-close-modal]')?.addEventListener('click', () => document.querySelector('#tx-modal').classList.add('is-hidden'));
  document.querySelector('#tx-form')?.addEventListener('submit', saveTransaction);
  document.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => { editingTransactionId = btn.dataset.edit; render(); document.querySelector('#tx-modal').classList.remove('is-hidden'); }));
  document.querySelectorAll('[data-delete]').forEach((btn) => btn.addEventListener('click', () => deleteTransaction(btn.dataset.delete)));
  ['search', 'type', 'category', 'wallet', 'range', 'sort'].forEach((key) => {
    const el = document.querySelector(`#filter-${key}`);
    if (el) el.addEventListener('input', () => { state.filters[key] = el.value; state.filters.page = 1; saveState(); render(); });
  });
  document.querySelectorAll('[data-page]').forEach((btn) => btn.addEventListener('click', () => { state.filters.page += btn.dataset.page === 'next' ? 1 : -1; if (state.filters.page < 1) state.filters.page = 1; render(); }));
  document.querySelector('#settings-form')?.addEventListener('submit', saveSettings);
  document.querySelectorAll('[data-auth-tab]').forEach((btn) => btn.addEventListener('click', () => switchAuth(btn.dataset.authTab)));
  document.querySelector('#auth-form')?.addEventListener('submit', submitAuth);
  document.querySelector('#toggle-password')?.addEventListener('click', () => { const input = document.querySelector('#auth-password'); input.type = input.type === 'password' ? 'text' : 'password'; });
  document.querySelectorAll('[data-action]').forEach((btn) => btn.addEventListener('click', () => handleAction(btn.dataset.action)));
  document.querySelector('#csv-import')?.addEventListener('change', importCsv);
  document.querySelector('input[name="amount"]')?.addEventListener('input', (event) => { event.target.value = event.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','); });
}

function saveTransaction(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const amount = Number(String(form.get('amount')).replace(/\D/g, ''));
  if (!amount || amount < 0) { toast('Số tiền không hợp lệ'); return; }
  if (!form.get('note')) { toast('Vui lòng nhập ghi chú'); return; }
  const tx = { id: editingTransactionId || uid('tx'), amount, type: form.get('type'), categoryId: form.get('categoryId'), walletId: form.get('walletId'), date: form.get('date'), method: form.get('method'), note: form.get('note'), receiptUrl: form.get('receiptUrl'), tags: String(form.get('tags')).split(',').map((tag) => tag.trim()).filter(Boolean) };
  if (editingTransactionId) state.transactions = state.transactions.map((item) => item.id === editingTransactionId ? tx : item);
  else state.transactions.unshift(tx);
  recalculateWallets(); editingTransactionId = null; saveState(); render(); toast('Đã lưu giao dịch thành công');
}

function deleteTransaction(id) { state.transactions = state.transactions.filter((tx) => tx.id !== id); recalculateWallets(); saveState(); render(); toast('Đã xóa giao dịch'); }
function recalculateWallets() { state.wallets = seedState.wallets.map((base) => ({ ...base, balance: seedState.wallets.find((w) => w.id === base.id).balance + state.transactions.filter((tx) => tx.walletId === base.id).reduce((s, tx) => s + txSignedAmount(tx), 0) })); }
function saveSettings(event) { event.preventDefault(); const f = new FormData(event.currentTarget); state.user = { ...state.user, name: f.get('name'), email: f.get('email'), monthlyIncome: Number(f.get('monthlyIncome')), currency: f.get('currency'), language: f.get('language'), theme: f.get('theme') }; saveState(); render(); toast('Đã lưu hồ sơ'); }
function switchAuth(mode) { document.querySelectorAll('[data-auth-tab]').forEach((btn) => btn.classList.toggle('active', btn.dataset.authTab === mode)); document.querySelector('#auth-title').textContent = mode === 'signup' ? 'Tạo tài khoản' : mode === 'reset' ? 'Đặt lại mật khẩu' : 'Chào mừng quay lại'; document.querySelector('#auth-submit').textContent = mode === 'signup' ? 'Đăng kí' : mode === 'reset' ? 'Gửi email reset' : 'Đăng nhập'; document.querySelectorAll('.signup-field').forEach((field) => field.classList.toggle('is-hidden', mode !== 'signup')); }
function submitAuth(event) { event.preventDefault(); const email = new FormData(event.currentTarget).get('authEmail'); if (!email.includes('@')) { document.querySelector('#auth-error').textContent = 'Email không hợp lệ'; return; } state.auth.status = 'signed-in'; state.user.email = email; saveState(); render(); toast('Xác thực thành công'); }
function handleAction(action) { if (action === 'guest') { state.auth.status = 'guest'; toast('Đang dùng Guest Mode'); } if (action === 'export-csv') exportCsv(); if (action === 'export-json') document.querySelector('#export-output').value = JSON.stringify(state, null, 2); if (action === 'reset') { state = structuredClone(seedState); saveState(); render(); toast('Đã reset dữ liệu'); } if (action === 'transfer') addTransfer(); if (action === 'add-goal') addGoal(); if (action === 'add-budget') addBudget(); }
function exportCsv() { const header = 'id,type,amount,category,wallet,date,note,tags'; const rows = state.transactions.map((tx) => [tx.id, tx.type, tx.amount, category(tx.categoryId).name, wallet(tx.walletId).name, tx.date, `"${tx.note}"`, `"${tx.tags.join('|')}"`].join(',')); document.querySelector('#export-output').value = [header, ...rows].join('\n'); toast('Đã xuất CSV'); }
function importCsv(event) { const file = event.target.files[0]; if (!file) return; file.text().then((text) => { const lines = text.trim().split('\n').slice(1); lines.forEach((line) => { const [id, type, amount,, , date, note] = line.split(','); state.transactions.push({ id: id || uid('tx'), type, amount: Number(amount), categoryId: type === 'income' ? 'cat_salary' : 'cat_food', walletId: 'w_cash', date, method: 'Cash', note: note?.replaceAll('"', '') || 'Imported', receiptUrl: '', tags: ['import'] }); }); saveState(); render(); toast('Đã nhập CSV'); }); }
function addTransfer() { state.transactions.unshift({ id: uid('tx'), amount: 1000000, type: 'transfer', categoryId: 'cat_transfer', walletId: 'w_bank', date: '2026-07-30T10:00', method: 'Bank', note: 'Chuyển nội bộ Bank → Cash', receiptUrl: '', tags: ['transfer'] }); saveState(); render(); toast('Đã tạo giao dịch chuyển ví mẫu'); }
function addGoal() { state.goals.push({ id: uid('g'), name: 'Mua iPhone', current: 2000000, target: 25000000, deadline: '2026-11-30' }); saveState(); render(); toast('Đã thêm mục tiêu mẫu'); }
function addBudget() { state.budgets.push({ id: uid('b'), categoryId: 'cat_transport', limit: 1500000, month: '2026-07' }); saveState(); render(); toast('Đã thêm ngân sách mẫu'); }

render();
