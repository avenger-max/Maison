// frontend/api.js
// Automatically uses correct API URL for local dev or production

const API_BASE = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://maison-api.onrender.com/api'; // ← UPDATE THIS to your Render URL after deploying

// ─── Auth Helpers ──────────────────────────────────────────────
const Auth = {
    getToken:  () => localStorage.getItem('token'),
    getUser:   () => JSON.parse(localStorage.getItem('user') || 'null'),
    isLoggedIn:() => !!localStorage.getItem('token'),
    save: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
};

// ─── Fetch Wrapper ─────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
}

// ─── Toast ─────────────────────────────────────────────────────
function showToast(message, type = '') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    });
}

// ─── Cart Badge ────────────────────────────────────────────────
async function updateCartBadge() {
    if (!Auth.isLoggedIn()) return;
    try {
        const data = await apiFetch('/cart');
        const count = data.items.reduce((sum, i) => sum + i.quantity, 0);
        document.querySelectorAll('.cart-badge').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    } catch (_) {}
}

// ─── Navbar ────────────────────────────────────────────────────
function renderNavbar(activePage = '') {
    const user = Auth.getUser();
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    navbar.innerHTML = `
        <div class="navbar-inner">
            <a href="index.html" class="navbar-logo">Maison</a>
            <nav class="navbar-links">
                <a href="index.html" ${activePage === 'home' ? 'class="active"' : ''}>Shop</a>
                <a href="cart.html" ${activePage === 'cart' ? 'class="active"' : ''}>Cart</a>
            </nav>
            <div class="navbar-actions">
                ${user ? `
                    <span style="font-size:0.82rem;color:#888;">Hi, ${user.name.split(' ')[0]}</span>
                    <button onclick="Auth.logout()" class="btn btn-outline" style="padding:8px 16px;font-size:0.8rem;">Sign Out</button>
                ` : `
                    <div class="auth-links">
                        <a href="login.html">Sign In</a>
                        <span class="divider">|</span>
                        <a href="register.html">Register</a>
                    </div>
                `}
                <a href="cart.html" class="cart-icon-btn">
                    🛍
                    <span class="cart-badge" style="display:none;">0</span>
                </a>
            </div>
        </div>
    `;
    updateCartBadge();
}
