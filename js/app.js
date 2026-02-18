// ========== APP.JS - Main Application ==========
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initParticles();
    initCountUp();
    initScrollReveal();
    initFAQ();
    initBoosters();
    initReviews();
    initMobileMenu();
});

// Header scroll effect
function initHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    });
}

// Hero particles
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 6 + 2;
        p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*6}s;animation-duration:${Math.random()*4+4}s;opacity:${Math.random()*0.2+0.05}`;
        container.appendChild(p);
    }
}

// Animated count up
function initCountUp() {
    const nums = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = parseInt(el.dataset.count);
                animateCount(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    nums.forEach(n => observer.observe(n));
}

function animateCount(el, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString('pt-BR');
        if (target < 100) el.textContent += '%';
        else el.textContent += '+';
    }, 25);
}

// Scroll reveal
function initScrollReveal() {
    const els = document.querySelectorAll('.service-card, .step-card, .advantage-card, .review-card, .booster-card, .faq-item, .cta-box');
    els.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
}

// FAQ Accordion
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });
}

// Mobile menu
function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        toggle.classList.toggle('active');
    });
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => { nav.classList.remove('open'); toggle.classList.remove('active'); });
    });
}

// Boosters data
function initBoosters() {
    const grid = document.getElementById('boosters-grid');
    if (!grid) return;
    const boosters = [
        { name: 'StormBlade', rank: 'Desafiante', winRate: '94%', games: '2.4k', emoji: '⚔️' },
        { name: 'PhoenixRise', rank: 'Grão-Mestre', winRate: '92%', games: '1.8k', emoji: '🔥' },
        { name: 'NightHawk', rank: 'Desafiante', winRate: '96%', games: '3.1k', emoji: '🦅' },
        { name: 'IceVenom', rank: 'Mestre', winRate: '91%', games: '1.5k', emoji: '❄️' },
        { name: 'ShadowLord', rank: 'Desafiante', winRate: '95%', games: '2.7k', emoji: '🌑' },
        { name: 'DragonFury', rank: 'Grão-Mestre', winRate: '93%', games: '2.0k', emoji: '🐉' },
        { name: 'CyberWolf', rank: 'Desafiante', winRate: '97%', games: '3.5k', emoji: '🐺' },
        { name: 'ArcaneKing', rank: 'Mestre', winRate: '90%', games: '1.2k', emoji: '👑' }
    ];
    grid.innerHTML = boosters.map(b => `
        <div class="booster-card">
            <div class="booster-avatar">${b.emoji}</div>
            <h3>${b.name}</h3>
            <div class="booster-rank">${b.rank}</div>
            <div class="booster-stats">
                <div class="booster-stat"><strong>${b.winRate}</strong>Win Rate</div>
                <div class="booster-stat"><strong>${b.games}</strong>Jogos</div>
            </div>
        </div>
    `).join('');
}

// Reviews data
function initReviews() {
    const carousel = document.getElementById('reviews-carousel');
    if (!carousel) return;
    const reviews = [
        { name: 'Lucas M.', service: 'Elo Boost', stars: 5, text: 'Serviço incrível! Saí do Prata e cheguei no Diamante em 3 dias. O booster foi muito profissional e manteve um win rate absurdo.' },
        { name: 'Ana P.', service: 'Duo Boost', stars: 5, text: 'Melhor experiência de duo boost! Aprendi muito jogando junto com o booster. Recomendo demais para quem quer evoluir.' },
        { name: 'Rafael S.', service: 'Coach', stars: 5, text: 'As aulas de coaching mudaram minha visão de jogo completamente. Em 2 sessões já subi de elo sozinho.' },
        { name: 'Bruno K.', service: 'MD10', stars: 5, text: 'Garantiram 8 vitórias nas MD10 da season. Comecei a season já no Ouro! Muito satisfeito com o resultado.' },
        { name: 'Mariana L.', service: 'Elo Boost', stars: 5, text: 'Suporte 24h de verdade! Tive uma dúvida às 3 da manhã e me responderam na hora. Serviço completo.' },
        { name: 'Diego R.', service: 'Vitórias', stars: 4, text: 'Contratei 5 vitórias no Diamante e entregaram em menos de 24h. Preço justo e resultado garantido.' }
    ];
    carousel.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${r.name.charAt(0)}</div>
                <div><div class="review-name">${r.name}</div><div class="review-service">${r.service}</div></div>
            </div>
            <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
            <div class="review-text">${r.text}</div>
        </div>
    `).join('');
}

// Toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
