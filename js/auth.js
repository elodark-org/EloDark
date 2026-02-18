// ========== AUTH.JS - Login/Signup System (API-connected) ==========
const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    checkSession();
});

function getToken() {
    return localStorage.getItem('elodark_token');
}

function getSession() {
    const data = localStorage.getItem('elodark_session');
    return data ? JSON.parse(data) : null;
}

function saveSession(user, token) {
    localStorage.setItem('elodark_session', JSON.stringify(user));
    localStorage.setItem('elodark_token', token);
}

function clearSession() {
    localStorage.removeItem('elodark_session');
    localStorage.removeItem('elodark_token');
}

async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
}

function initAuth() {
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const modalLogin = document.getElementById('modal-login');
    const modalSignup = document.getElementById('modal-signup');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');

    btnLogin?.addEventListener('click', () => openModal(modalLogin));
    btnSignup?.addEventListener('click', () => openModal(modalSignup));
    switchToSignup?.addEventListener('click', e => { e.preventDefault(); closeModal(modalLogin); openModal(modalSignup); });
    switchToLogin?.addEventListener('click', e => { e.preventDefault(); closeModal(modalSignup); openModal(modalLogin); });

    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => closeModal(document.getElementById(btn.dataset.close)));
    });
    [modalLogin, modalSignup].forEach(m => {
        m?.addEventListener('click', e => { if (e.target === m) closeModal(m); });
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            input.type = input.type === 'password' ? 'text' : 'password';
            btn.textContent = input.type === 'password' ? '👁' : '🙈';
        });
    });

    // Login form
    document.getElementById('form-login')?.addEventListener('submit', async e => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Entrando...';

            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            saveSession(data.user, data.token);
            closeModal(modalLogin);
            showLoggedInState(data.user);
            showToast(`Bem-vindo de volta, ${data.user.name}!`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
        }
    });

    // Signup form
    document.getElementById('form-signup')?.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        const terms = document.getElementById('accept-terms').checked;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        if (password.length < 6) { showToast('A senha deve ter no mínimo 6 caracteres.', 'error'); return; }
        if (password !== confirm) { showToast('As senhas não coincidem.', 'error'); return; }
        if (!terms) { showToast('Aceite os termos para continuar.', 'error'); return; }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Criando conta...';

            const data = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });

            saveSession(data.user, data.token);
            closeModal(modalSignup);
            showLoggedInState(data.user);
            showToast(`Conta criada com sucesso! Bem-vindo, ${data.user.name}!`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Criar Conta';
        }
    });

    // Buy button — Stripe Checkout
    document.getElementById('btn-buy')?.addEventListener('click', async () => {
        const session = getSession();
        if (!session) {
            showToast('Faça login para continuar com a compra.', 'info');
            openModal(modalLogin);
            return;
        }

        const buyBtn = document.getElementById('btn-buy');
        const priceValue = document.getElementById('price-value')?.textContent || 'R$ 0,00';
        const activeTab = document.querySelector('.pricing-tab.active');
        const serviceType = activeTab?.dataset.tab || 'elo-boost';

        try {
            const price = parseFloat(priceValue.replace('R$', '').replace('.', '').replace(',', '.').trim());
            if (price <= 0) { showToast('Configure o pedido antes de continuar.', 'error'); return; }

            buyBtn.disabled = true;
            buyBtn.innerHTML = '<span>Processando...</span>';

            const data = await apiRequest('/checkout/create-session', {
                method: 'POST',
                body: JSON.stringify({
                    service_type: serviceType,
                    price: price,
                    config: { raw_price: priceValue, service: serviceType }
                })
            });

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                showToast('Erro ao redirecionar para o pagamento.', 'error');
            }
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            buyBtn.disabled = false;
            buyBtn.innerHTML = '<span>Contratar Agora</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    });
}

function openModal(modal) {
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
}

function checkSession() {
    const session = getSession();
    if (session) {
        // Verify token is still valid
        apiRequest('/auth/me').then(data => {
            saveSession(data.user, getToken());
            showLoggedInState(data.user);
        }).catch(() => {
            clearSession();
        });
    }
}

function showLoggedInState(user) {
    const actions = document.querySelector('.header-actions');
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnSignup) btnSignup.style.display = 'none';

    // Remove existing user btn if any
    const existing = document.getElementById('user-btn');
    if (existing) existing.remove();

    const userBtn = document.createElement('button');
    userBtn.className = 'user-btn';
    userBtn.id = 'user-btn';

    const roleBadge = user.role === 'admin' ? ' 👑' : user.role === 'booster' ? ' 🎮' : '';
    userBtn.innerHTML = `<span class="user-avatar-small">${user.name.charAt(0).toUpperCase()}</span><span>${user.name.split(' ')[0]}${roleBadge}</span>`;
    actions.insertBefore(userBtn, document.getElementById('menu-toggle'));

    const dropdown = document.getElementById('user-menu-dropdown');
    userBtn.addEventListener('click', e => {
        e.stopPropagation();
        const rect = userBtn.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 8) + 'px';
        dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => { dropdown.style.display = 'none'; });

    document.getElementById('menu-logout')?.addEventListener('click', e => {
        e.preventDefault();
        clearSession();
        location.reload();
    });

    // Show admin panel link for admins
    if (user.role === 'admin') {
        const adminLink = document.getElementById('menu-admin');
        if (adminLink) {
            adminLink.style.display = 'flex';
            adminLink.addEventListener('click', e => {
                e.preventDefault();
                window.location.href = '/admin.html';
            });
        }
    }

    document.getElementById('menu-orders')?.addEventListener('click', async e => {
        e.preventDefault();
        try {
            const data = await apiRequest('/orders');
            if (data.orders.length === 0) {
                showToast('Você não tem pedidos ainda.', 'info');
            } else {
                showToast(`Você tem ${data.orders.length} pedido(s). Painel completo em breve!`, 'info');
            }
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    document.getElementById('menu-profile')?.addEventListener('click', e => {
        e.preventDefault();
        showToast('Edição de perfil em breve!', 'info');
    });
}

// Export for use by other modules
window.EloDarkAuth = { apiRequest, getToken, getSession, clearSession };
