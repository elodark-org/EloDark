// ========== AUTH.JS - Login/Signup System ==========
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    checkSession();
});

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
    document.getElementById('form-login')?.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('elodark_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('elodark_session', JSON.stringify(user));
            closeModal(modalLogin);
            showLoggedInState(user);
            showToast(`Bem-vindo de volta, ${user.name}!`, 'success');
        } else {
            showToast('Email ou senha incorretos.', 'error');
        }
    });

    // Signup form
    document.getElementById('form-signup')?.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        const terms = document.getElementById('accept-terms').checked;

        if (password.length < 6) { showToast('A senha deve ter no mínimo 6 caracteres.', 'error'); return; }
        if (password !== confirm) { showToast('As senhas não coincidem.', 'error'); return; }
        if (!terms) { showToast('Aceite os termos para continuar.', 'error'); return; }

        const users = JSON.parse(localStorage.getItem('elodark_users') || '[]');
        if (users.find(u => u.email === email)) { showToast('Este email já está cadastrado.', 'error'); return; }

        const user = { name, email, password, createdAt: new Date().toISOString() };
        users.push(user);
        localStorage.setItem('elodark_users', JSON.stringify(users));
        localStorage.setItem('elodark_session', JSON.stringify(user));
        closeModal(modalSignup);
        showLoggedInState(user);
        showToast(`Conta criada com sucesso! Bem-vindo, ${name}!`, 'success');
    });

    // Buy button
    document.getElementById('btn-buy')?.addEventListener('click', () => {
        const session = JSON.parse(localStorage.getItem('elodark_session'));
        if (!session) {
            showToast('Faça login para continuar com a compra.', 'info');
            openModal(modalLogin);
        } else {
            showToast('Pedido registrado! Entraremos em contato em breve. 🚀', 'success');
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
    const session = JSON.parse(localStorage.getItem('elodark_session'));
    if (session) showLoggedInState(session);
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
    userBtn.innerHTML = `<span class="user-avatar-small">${user.name.charAt(0).toUpperCase()}</span><span>${user.name.split(' ')[0]}</span>`;
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
        localStorage.removeItem('elodark_session');
        location.reload();
    });

    document.getElementById('menu-orders')?.addEventListener('click', e => {
        e.preventDefault();
        showToast('Painel de pedidos em breve!', 'info');
    });

    document.getElementById('menu-profile')?.addEventListener('click', e => {
        e.preventDefault();
        showToast('Edição de perfil em breve!', 'info');
    });
}
