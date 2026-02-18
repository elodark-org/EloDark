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

            // Construct config from PricingState
            const state = window.PricingState || {};
            let config = {
                raw_price: priceValue,
                service: serviceType,
                ...state
            };

            // Generate friendly description
            let description = '';
            if (serviceType === 'elo-boost' || serviceType === 'duo-boost') {
                const cName = window.ELO_DATA?.[state.currentElo]?.name || state.currentElo;
                const cDiv = state.currentElo !== 'master' ? window.DIV_NAMES?.[state.currentDiv] || state.currentDiv : '';
                const dName = window.ELO_DATA?.[state.desiredElo]?.name || state.desiredElo;
                const dDiv = state.desiredElo !== 'master' ? window.DIV_NAMES?.[state.desiredDiv] || state.desiredDiv : '';
                description = `${cName} ${cDiv} ➔ ${dName} ${dDiv}`;
            } else if (serviceType === 'md10') {
                description = `MD10 (${state.md10Wins} vitórias)`;
            } else if (serviceType === 'wins') {
                description = `${state.winsCount} Vitórias (${state.winsElo})`;
            } else if (serviceType === 'coach') {
                description = `Coach (${state.coachHours} horas)`;
            }

            config.description = description;

            buyBtn.disabled = true;
            buyBtn.innerHTML = '<span>Processando...</span>';

            const data = await apiRequest('/checkout/create-session', {
                method: 'POST',
                body: JSON.stringify({
                    service_type: serviceType,
                    price: price,
                    config: config
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

    // Show booster panel link for boosters
    if (user.role === 'booster' || user.role === 'admin') {
        const boosterLink = document.getElementById('menu-booster');
        if (boosterLink) {
            boosterLink.style.display = 'flex';
            boosterLink.addEventListener('click', e => {
                e.preventDefault();
                window.location.href = '/booster.html';
            });
        }
    }

    document.getElementById('menu-orders')?.addEventListener('click', async e => {
        e.preventDefault();
        const modalOrders = document.getElementById('modal-orders');
        const container = document.getElementById('my-orders-list');
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:24px">Carregando...</p>';
        openModal(modalOrders);

        try {
            const data = await apiRequest('/orders');
            if (data.orders.length === 0) {
                container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)"><span style="font-size:3rem;display:block;margin-bottom:12px">📦</span>Você não tem pedidos ainda.<br><small>Contrate um serviço para começar!</small></div>';
                return;
            }

            const serviceLabels = { 'elo-boost': 'Elo Boost', 'duo-boost': 'Duo Boost', 'md10': 'MD10', 'wins': 'Vitórias', 'coach': 'Coach' };
            const statusLabels = { pending: '⏳ Pendente', active: '🟢 Ativo', in_progress: '🔄 Em Progresso', completed: '✅ Concluído', cancelled: '❌ Cancelado' };
            const statusColors = { pending: '#f0b132', active: '#58a6ff', in_progress: '#c084fc', completed: '#3fb950', cancelled: '#f85149' };

            container.innerHTML = data.orders.map(o => `
                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:12px">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                        <strong style="font-family:'Orbitron',monospace;font-size:0.8rem;letter-spacing:1px">#${o.id} — ${serviceLabels[o.service_type] || o.service_type}</strong>
                        <span style="color:${statusColors[o.status]};font-size:0.82rem;font-weight:600">${statusLabels[o.status] || o.status}</span>
                    </div>
                    <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.05)">
                        ${o.config?.description || 'Detalhes não disponíveis'}
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:0.88rem;color:var(--text-secondary)">
                        <span>💰 <strong style="color:#f0b132">R$ ${parseFloat(o.price).toFixed(2).replace('.', ',')}</strong></span>
                        <div style="display:flex;gap:8px">
                            <span>🎮 ${o.booster_name || 'Aguardando...'}</span>
                            ${['active', 'in_progress', 'completed'].includes(o.status) ? `<button onclick="openChat(${o.id})" style="background:none;border:none;cursor:pointer;font-size:1.1rem" title="Chat com Booster">💬</button>` : ''}
                        </div>
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:8px">${new Date(o.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            `).join('');
        } catch (err) {
            container.innerHTML = `<p style="text-align:center;color:#f85149;padding:24px">Erro: ${err.message}</p>`;
        }
    });

    // CHAT LOGIC
    window.currentChatOrderId = null;
    window.chatInterval = null;

    window.openChat = async function (orderId) {
        window.currentChatOrderId = orderId;
        const modal = document.getElementById('modal-chat');
        openModal(modal);
        loadMessages();

        if (window.chatInterval) clearInterval(window.chatInterval);
        window.chatInterval = setInterval(loadMessages, 3000); // Poll every 3s
    };

    async function loadMessages() {
        if (!window.currentChatOrderId) return;
        const container = document.getElementById('chat-messages');
        try {
            const data = await apiRequest(`/chat/${window.currentChatOrderId}`);
            const user = JSON.parse(localStorage.getItem('elodark_session') || '{}');

            container.innerHTML = data.messages.map(m => {
                const isSelf = m.user_id === user.id;
                return `
                    <div class="chat-message ${isSelf ? 'self' : 'other'}">
                        ${m.content}
                        <div class="chat-message-meta">
                            <span>${m.sender_name || 'Usuário'}</span>
                            <span>${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                `;
            }).join('');

            // Auto scroll to bottom if near bottom (or first load)
            // container.scrollTop = container.scrollHeight; 
        } catch (err) {
            console.error(err);
        }
    }

    window.sendChatMessage = async function () {
        const input = document.getElementById('chat-input');
        const content = input.value.trim();
        if (!content || !window.currentChatOrderId) return;

        try {
            await apiRequest(`/chat/${window.currentChatOrderId}`, {
                method: 'POST',
                body: JSON.stringify({ content })
            });
            input.value = '';
            loadMessages();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    document.getElementById('menu-profile')?.addEventListener('click', e => {
        e.preventDefault();
        showToast('Edição de perfil em breve!', 'info');
    });
}

// Export for use by other modules
window.EloDarkAuth = { apiRequest, getToken, getSession, clearSession };
