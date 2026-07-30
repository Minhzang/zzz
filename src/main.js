import './styles.css';

const transactions = [
  { name: 'Lương tháng 7', category: 'Thu nhập', date: '28/07/2026', amount: 24500000, type: 'income' },
  { name: 'Siêu thị cuối tuần', category: 'Ăn uống', date: '27/07/2026', amount: 1260000, type: 'expense' },
  { name: 'Thanh toán tiền nhà', category: 'Nhà ở', date: '25/07/2026', amount: 6500000, type: 'expense' },
  { name: 'Dự án freelance', category: 'Thu nhập', date: '24/07/2026', amount: 3800000, type: 'income' },
  { name: 'Đổ xăng', category: 'Di chuyển', date: '22/07/2026', amount: 320000, type: 'expense' },
];

const budgets = [
  { label: 'Ăn uống', spent: 4200000, limit: 6000000, color: '#0ea5e9' },
  { label: 'Nhà ở', spent: 6500000, limit: 7000000, color: '#8b5cf6' },
  { label: 'Giải trí', spent: 1850000, limit: 3000000, color: '#f97316' },
  { label: 'Tiết kiệm', spent: 5000000, limit: 8000000, color: '#22c55e' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

const totals = transactions.reduce(
  (result, item) => {
    result[item.type] += item.amount;
    return result;
  },
  { income: 0, expense: 0 },
);
totals.balance = totals.income - totals.expense;

const txMarkup = transactions
  .map(
    (item) => `
      <article class="transaction">
        <div class="tx-icon ${item.type}">${item.type === 'income' ? '↗' : '↘'}</div>
        <div><strong>${item.name}</strong><span>${item.category} • ${item.date}</span></div>
        <strong class="${item.type}">${item.type === 'income' ? '+' : '-'}${formatCurrency(item.amount)}</strong>
      </article>`,
  )
  .join('');

const budgetMarkup = budgets
  .map((budget) => {
    const percent = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
    return `
      <article class="budget">
        <div><strong>${budget.label}</strong><span>${formatCurrency(budget.spent)} / ${formatCurrency(budget.limit)}</span></div>
        <div class="progress"><span style="width: ${percent}%; background: ${budget.color}"></span></div>
        <small>${percent}% đã sử dụng</small>
      </article>`;
  })
  .join('');

const app = document.querySelector('#root');
app.innerHTML = `
  <div class="app-shell">
    <main class="dashboard">
      <nav class="sidebar" aria-label="Điều hướng chính">
        <div class="brand"><span>💰</span><span>MoneyMate</span></div>
        <a class="active" href="#overview">📊 Tổng quan</a>
        <a href="#transactions">🧾 Giao dịch</a>
        <a href="#budgets">🥧 Ngân sách</a>
        <a href="#goals">🎯 Mục tiêu</a>
        <a href="#cards">💳 Ví & thẻ</a>
        <a href="#settings">⚙️ Cài đặt</a>
      </nav>

      <section class="content">
        <header class="topbar">
          <div>
            <p class="eyebrow">Bảng điều khiển</p>
            <h1>Quản lí chi tiêu cá nhân</h1>
          </div>
          <div class="top-actions">
            <div class="search">🔎<input placeholder="Tìm giao dịch..." /></div>
            <button class="ghost-button" aria-label="Thông báo">🔔</button>
            <button class="primary-button compact">＋ Thêm giao dịch</button>
          </div>
        </header>

        <section class="hero-grid" id="overview">
          <div class="balance-card">
            <p>Số dư hiện tại</p>
            <h2>${formatCurrency(totals.balance)}</h2>
            <span>↗ Tăng 12,5% so với tháng trước</span>
          </div>
          <div class="metric green"><div>⬆</div><p>Tổng thu</p><h3>${formatCurrency(totals.income)}</h3></div>
          <div class="metric red"><div>⬇</div><p>Tổng chi</p><h3>${formatCurrency(totals.expense)}</h3></div>
        </section>

        <section class="main-grid">
          <div class="panel" id="transactions">
            <div class="panel-header"><div><p class="eyebrow">Gần đây</p><h3>Giao dịch mới nhất</h3></div><button class="ghost-button">Xem tất cả</button></div>
            <div class="transaction-list">${txMarkup}</div>
          </div>
          <div class="panel" id="budgets">
            <div class="panel-header"><div><p class="eyebrow">Kế hoạch</p><h3>Ngân sách tháng</h3></div><span>📅</span></div>
            <div class="budget-list">${budgetMarkup}</div>
          </div>
        </section>

        <section class="feature-row">
          <article class="feature"><div>✅</div><h4>Nhắc hóa đơn</h4><p>Tự động cảnh báo trước hạn thanh toán tiền nhà, điện, internet.</p></article>
          <article class="feature"><div>📈</div><h4>Báo cáo trực quan</h4><p>Biểu đồ thu chi theo danh mục giúp nhìn rõ thói quen tài chính.</p></article>
          <article class="feature"><div>🎯</div><h4>Mục tiêu tiết kiệm</h4><p>Theo dõi tiến độ mua nhà, du lịch hoặc quỹ khẩn cấp.</p></article>
        </section>
      </section>
    </main>

    <section class="auth-card" aria-label="Khu vực đăng nhập và đăng kí">
      <div class="auth-tabs">
        <button class="active" data-mode="login">Đăng nhập</button>
        <button data-mode="register">Đăng kí</button>
      </div>
      <div class="auth-copy">
        <span class="eyebrow">🛡️ Bảo mật 2 lớp</span>
        <h2 id="auth-title">Chào mừng bạn quay lại!</h2>
        <p id="auth-description">Theo dõi thu chi, ngân sách và mục tiêu tiết kiệm trong một bảng điều khiển trực quan.</p>
      </div>
      <form class="auth-form">
        <label class="register-only is-hidden">Họ và tên<span>👤<input type="text" placeholder="Nguyễn Minh Anh" /></span></label>
        <label>Email<span>✉️<input type="email" placeholder="ban@email.com" /></span></label>
        <label>Mật khẩu<span>🔒<input id="password" type="password" placeholder="••••••••" /><button type="button" class="icon-button" id="toggle-password" aria-label="Hiện hoặc ẩn mật khẩu">👁️</button></span></label>
        <label class="register-only is-hidden">Xác nhận mật khẩu<span>🔒<input type="password" placeholder="••••••••" /></span></label>
        <div class="form-row"><label class="check"><input type="checkbox" checked /> Ghi nhớ đăng nhập</label><a id="forgot-link" href="#forgot">Quên mật khẩu?</a></div>
        <button class="primary-button" type="button" id="submit-auth">Đăng nhập ngay ›</button>
      </form>
    </section>
  </div>`;

const authTabs = document.querySelectorAll('.auth-tabs button');
const registerOnlyFields = document.querySelectorAll('.register-only');
const authTitle = document.querySelector('#auth-title');
const authDescription = document.querySelector('#auth-description');
const submitAuth = document.querySelector('#submit-auth');
const forgotLink = document.querySelector('#forgot-link');
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('#toggle-password');

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const isRegister = tab.dataset.mode === 'register';
    authTabs.forEach((item) => item.classList.toggle('active', item === tab));
    registerOnlyFields.forEach((field) => field.classList.toggle('is-hidden', !isRegister));
    authTitle.textContent = isRegister ? 'Tạo tài khoản MoneyMate' : 'Chào mừng bạn quay lại!';
    authDescription.textContent = isRegister
      ? 'Bắt đầu quản lí tiền cá nhân với báo cáo tự động và nhắc nhở chi tiêu thông minh.'
      : 'Theo dõi thu chi, ngân sách và mục tiêu tiết kiệm trong một bảng điều khiển trực quan.';
    submitAuth.textContent = isRegister ? 'Tạo tài khoản ›' : 'Đăng nhập ngay ›';
    forgotLink.classList.toggle('is-hidden', isRegister);
  });
});

togglePassword.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  togglePassword.textContent = show ? '🙈' : '👁️';
});
