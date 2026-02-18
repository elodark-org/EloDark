// ========== BOOSTER PANEL LOGIC ==========

const API = '/api';
let boosterToken = localStorage.getItem('elodark_token');
let currentChatOrderId = null;
let chatInterval = null;

// --- UTILS ---
window.showToast = function (message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'error' ? '❌' : '✅'}</span><span>${message}</span>`;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.style.transform = 'translateY(0) scale(1)');

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// --- GLOBAL EXPORTS ---
// Must be available for onclick events in HTML
window.openBoosterChat = function (orderId, clientName = 'Cliente') {
    console.log('🚀 Open Chat Clicked:', orderId);
    try {
        if (!orderId) throw new Error('ID inválido');

        currentChatOrderId = orderId;
        const modal = document.getElementById('modal-chat');
        if (!modal) throw new Error('Modal não encontrado');

        // Update Title
        const titleEl = modal.querySelector('.modal-title');
        if (titleEl) titleEl.textContent = `💬 Chat - Pedido #${orderId} - ${clientName}`;

        modal.style.display = 'flex';
        loadBoosterMessages();

        // Restart interval
        if (window.chatInterval) clearInterval(window.chatInterval);
        window.chatInterval = setInterval(() => {
            if (modal.style.display === 'flex') loadBoosterMessages();
        }, 3000);

    } catch (err) {
        console.error('Chat Error:', err);
        showToast('Erro ao abrir chat: ' + err.message, 'error');
    }
};

window.closeBoosterChat = function () {
    const modal = document.getElementById('modal-chat');
    if (modal) modal.style.display = 'none';
    if (window.chatInterval) clearInterval(window.chatInterval);
    currentChatOrderId = null;
};

// --- API HELPER ---
async function apiFetch(endpoint, opts = {}) {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${boosterToken}` };
    try {
        const res = await fetch(`${API}${endpoint}`, { ...opts, headers });

        // Clone response to read text if json fails
        const text = await res.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('API Non-JSON Response:', text.substring(0, 200)); // Log first 200 chars
            throw new Error(`Erro de API (HTML recebido): ${res.status} - Verifique o console.`);
        }

        if (!res.ok) throw new Error(data.error || 'Erro na requisição');
        return data;
    } catch (err) {
        throw err;
    }
}

// --- AUTH ---
async function checkBoosterAuth() {
    if (!boosterToken) { window.location.href = '/'; return; }
    try {
        const res = await apiFetch('/auth/me');
        if (res.user.role !== 'booster' && res.user.role !== 'admin') {
            showToast('Acesso negado. Área restrita.', 'error');
            setTimeout(() => window.location.href = '/', 2000);
            return;
        }
        document.getElementById('booster-name').textContent = `🎮 ${res.user.name}`;
        window.currentUserId = res.user.id; // Store ID for chat
    } catch {
        localStorage.removeItem('elodark_token');
        window.location.href = '/';
    }
}

// --- PAGES ---
const serviceLabels = { 'elo-boost': 'Elo Boost', 'duo-boost': 'Duo Boost', 'md10': 'MD10', 'wins': 'Vitórias', 'coach': 'Coach' };
const serviceIcons = { 'elo-boost': '⚔️', 'duo-boost': '👥', 'md10': '🎯', 'wins': '🏆', 'coach': '🎓' };
const statusLabels = { in_progress: 'Em Progresso', completed: 'Concluído', available: 'Disponível', active: 'Ativo' };

async function loadAvailable() {
    const container = document.getElementById('available-orders');
    if (!container) return;
    container.innerHTML = '<div class="empty-state"><span>⏳</span>Carregando...</div>';

    try {
        const { orders } = await apiFetch('/orders/available');
        if (!orders || orders.length === 0) {
            container.innerHTML = '<div class="empty-state"><span>😴</span>Nenhum serviço disponível.</div>';
            return;
        }

        container.innerHTML = orders.map(o => renderOrderCard(o)).join('');
    } catch (err) {
        container.innerHTML = `<div class="empty-state"><span>❌</span>${err.message}</div>`;
    }
}

async function loadMyOrders() {
    const container = document.getElementById('my-orders-table');
    if (!container) return;

    try {
        const { orders } = await apiFetch('/orders');
        if (!orders || orders.length === 0) {
            container.innerHTML = '<div class="empty-state">Sem pedidos atribuídos.</div>';
            return;
        }

        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr><th>#</th><th>Serviço</th><th>Cliente</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
                ${orders.map(o => renderOrderRow(o)).join('')}
            </tbody>
        </table>`;
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// --- RENDERING ---
function renderOrderCard(o) {
    return `
    <div class="order-card">
        <div class="order-card-header">
            <span class="order-card-id">#${o.id}</span>
            <span class="order-card-price">R$ ${parseFloat(o.price).toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="order-card-service">${serviceIcons[o.service_type] || '🎮'} ${serviceLabels[o.service_type] || o.service_type}</div>
        <div class="order-card-meta">
            <span>👤 Cliente: ${o.user_name || 'Anônimo'}</span>
            <span>📅 ${new Date(o.created_at).toLocaleDateString()}</span>
        </div>
        <div class="order-card-actions">
            <button class="btn-claim" onclick="claimOrder(${o.id})">🎮 Pegar Serviço</button>
        </div>
    </div>`;
}

function renderOrderRow(o) {
    const isChatable = ['in_progress', 'completed'].includes(o.status);
    return `
    <tr>
        <td><strong>#${o.id}</strong></td>
        <td>
            ${serviceLabels[o.service_type] || o.service_type}
            <br><small style="color:var(--text-muted)">${o.config?.description || ''}</small>
        </td>
        <td>${o.user_name || '—'}</td>
        <td><span class="badge badge-${o.status}">${statusLabels[o.status] || o.status}</span></td>
        <td style="display:flex;gap:8px">
            ${o.status === 'in_progress' ? `<button type="button" class="btn btn-sm btn-primary" onclick="window.completeOrder(${o.id})">✅ Concluir</button>` : ''}
            ${isChatable ? `<button type="button" class="btn btn-sm btn-outline" onclick="console.log('Click ID ${o.id}'); window.openBoosterChat(${o.id})">💬 Chat</button>` : ''}
        </td>
    </tr>`;
}

// --- ACTIONS ---
window.claimOrder = async function (orderId) {
    if (!confirm(`Confirmar serviço #${orderId}?`)) return;
    try {
        await apiFetch(`/orders/${orderId}/claim`, { method: 'POST' });
        showToast(`Serviço #${orderId} aceito!`, 'success');
        loadAvailable();
    } catch (err) { showToast(err.message, 'error'); }
};

window.completeOrder = async function (orderId) {
    if (!confirm(`Finalizar serviço #${orderId}?`)) return;
    try {
        await apiFetch(`/orders/${orderId}/complete`, { method: 'POST' });
        showToast(`Serviço #${orderId} concluído!`, 'success');
        loadMyOrders(); // Refresh status
    } catch (err) { showToast(err.message, 'error'); }
};

// --- CHAT MESSAGING ---
async function loadBoosterMessages() {
    if (!currentChatOrderId) return;
    const container = document.getElementById('booster-chat-messages');
    if (!container) {
        console.error('❌ Chat container not found!');
        return;
    }

    try {
        console.log('Fetching messages for order:', currentChatOrderId);
        const data = await apiFetch(`/chat/${currentChatOrderId}`);
        console.log('Messages received:', data);

        if (!data || !data.messages || !Array.isArray(data.messages)) {
            console.warn('⚠️ No messages array in response:', data);
            container.innerHTML = '<div style="padding:10px;text-align:center;color:#ccc">Nenhuma mensagem ainda.</div>';
            return;
        }

        if (data.messages.length === 0) {
            container.innerHTML = '<div style="padding:10px;text-align:center;color:#ccc">Nenhuma mensagem ainda.</div>';
            return;
        }

        container.innerHTML = data.messages.map(m => {
            const isSelf = m.user_id === window.currentUserId;
            // Fallback for missing name
            const sender = m.sender_name || (isSelf ? 'Você' : 'Cliente');

            return `
                <div class="chat-message ${isSelf ? 'self' : 'other'}" 
                     style="${isSelf ? 'align-self:flex-end;background:linear-gradient(135deg,var(--cyan),var(--accent));color:#fff' : 'align-self:flex-start;background:rgba(255,255,255,0.08);color:var(--text-primary)'}">
                    ${m.content}
                    <div class="chat-message-meta">
                        <span>${sender}</span>
                        <span>${new Date(m.created_at).toLocaleTimeString([], { timeStyle: 'short' })}</span>
                    </div>
                </div>`;
        }).join('');
        container.scrollTop = container.scrollHeight;
    } catch (err) {
        console.error('Load Msg Error:', err);
        container.innerHTML = `<div style="color:red;padding:10px">Erro ao carregar: ${err.message}</div>`;
    }
}

async function sendBoosterMessage() {
    const input = document.getElementById('booster-chat-input');
    if (!input || !currentChatOrderId) return;

    const content = input.value.trim();
    if (!content) return;

    try {
        await apiFetch(`/chat/${currentChatOrderId}`, {
            method: 'POST',
            body: JSON.stringify({ content })
        });
        input.value = '';
        input.focus();
        loadBoosterMessages();
    } catch (err) { showToast(err.message, 'error'); }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    checkBoosterAuth();
    loadAvailable();

    // Navigation
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            document.querySelectorAll('.booster-page').forEach(p => p.classList.remove('active'));
            document.getElementById(`page-${link.dataset.page}`).classList.add('active');

            if (link.dataset.page === 'available') loadAvailable();
            else if (link.dataset.page === 'my-orders') loadMyOrders();
        });
    });

    // Chat Listeners
    const bInput = document.getElementById('booster-chat-input');
    const bSend = document.getElementById('booster-chat-send');

    if (bInput) {
        bInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); sendBoosterMessage(); }
        });
    }
    if (bSend) {
        bSend.addEventListener('click', (e) => {
            e.preventDefault(); sendBoosterMessage();
        });
    }

    // Logout
    document.getElementById('btn-booster-logout')?.addEventListener('click', () => {
        localStorage.removeItem('elodark_token');
        window.location.href = '/';
    });
});

window.loadAvailable = loadAvailable;
window.loadMyOrders = loadMyOrders;
