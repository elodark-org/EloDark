// ========== CHAT.JS - Real-time Chat Widget ==========
document.addEventListener('DOMContentLoaded', () => {
    initChat();
});

const BOT_RESPONSES = [
    'Olá! Bem-vindo ao EloDark! Como posso ajudar? 😊',
    'Nossos boosters estão disponíveis 24h! Qual serviço te interessa?',
    'Para Elo Boost, os preços começam a partir de R$ 8 por divisão no Ferro!',
    'O Duo Boost é ótimo para quem quer aprender enquanto sobe. Recomendo! 🎮',
    'Seu pedido é processado em até 30 minutos após o pagamento. ⚡',
    'Todos os nossos boosters são Mestre+ com win rate acima de 90%.',
    'Garantimos a segurança da sua conta com VPN e modo offline. 🔒',
    'Tem mais alguma dúvida? Estou aqui para ajudar!',
    'Nosso serviço de Coach é perfeito para evoluir de verdade no jogo! 🎓',
    'Aceitamos PIX, cartão e boleto. O pagamento é 100% seguro! 💰'
];

const GREETING = 'Olá! 👋 Sou o assistente da EloDark. Como posso te ajudar hoje?';

function initChat() {
    const toggle = document.getElementById('chat-toggle');
    const window_ = document.getElementById('chat-window');
    const minimize = document.getElementById('chat-minimize');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const badge = document.getElementById('chat-badge');

    let isOpen = false;
    let messages = JSON.parse(localStorage.getItem('elodark_chat') || '[]');

    // Show badge after 3 seconds  
    setTimeout(() => {
        if (!isOpen && messages.length === 0) {
            badge.style.display = 'flex';
            badge.textContent = '1';
        }
    }, 3000);

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        window_.classList.toggle('open', isOpen);
        badge.style.display = 'none';
        if (isOpen && messages.length === 0) {
            addBotMessage(GREETING);
        } else {
            renderMessages();
        }
        if (isOpen) input.focus();
    });

    minimize.addEventListener('click', () => {
        isOpen = false;
        window_.classList.remove('open');
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        addUserMessage(text);
        input.value = '';
        // Simulate typing
        setTimeout(() => {
            const response = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
            addBotMessage(response);
        }, 800 + Math.random() * 1200);
    });

    function addUserMessage(text) {
        const msg = { type: 'user', text, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
        messages.push(msg);
        saveMessages();
        renderMessages();
    }

    function addBotMessage(text) {
        const msg = { type: 'bot', text, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
        messages.push(msg);
        saveMessages();
        renderMessages();
    }

    function renderMessages() {
        const container = document.getElementById('chat-messages');
        container.innerHTML = messages.map(m => `
            <div class="chat-msg ${m.type}">
                ${m.text}
                <span class="msg-time">${m.time}</span>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    }

    function saveMessages() {
        localStorage.setItem('elodark_chat', JSON.stringify(messages));
    }
}
