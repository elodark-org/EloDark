// ========== PRICING.JS - Price Simulator ==========
const ELO_DATA = {
    iron: { name: 'Ferro', order: 0, price: 8 },
    bronze: { name: 'Bronze', order: 1, price: 10 },
    silver: { name: 'Prata', order: 2, price: 15 },
    gold: { name: 'Ouro', order: 3, price: 22 },
    platinum: { name: 'Platina', order: 4, price: 32 },
    emerald: { name: 'Esmeralda', order: 5, price: 48 },
    diamond: { name: 'Diamante', order: 6, price: 75 },
    master: { name: 'Mestre', order: 7, price: 150 }
};

const DIV_NAMES = { 4: 'IV', 3: 'III', 2: 'II', 1: 'I' };
const ELO_COLORS = {
    iron: '#7c7c7c', bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700',
    platinum: '#00cec9', emerald: '#00b894', diamond: '#74b9ff', master: '#a29bfe'
};

let currentState = {
    service: 'elo-boost',
    currentElo: 'silver', currentDiv: 3,
    desiredElo: 'gold', desiredDiv: 4,
    lpRange: '41-60', queue: 'solo', server: 'br',
    extras: { flash: false, champs: false, offline: false, priority: false },
    md10Wins: 7, md10Elo: 'silver',
    winsElo: 'silver', winsCount: 3,
    coachElo: 'silver', coachHours: 2
};

document.addEventListener('DOMContentLoaded', () => {
    initPricingTabs();
    initEloSelectors();
    initOptions();
    updatePrice();
});

function initPricingTabs() {
    document.querySelectorAll('.pricing-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.pricing-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const service = tab.dataset.tab;
            currentState.service = service;
            // duo-boost uses same panel as elo-boost
            const panelId = service === 'duo-boost' ? 'panel-elo-boost' : `panel-${service}`;
            document.getElementById(panelId).classList.add('active');
            updatePrice();
        });
    });
}

function initEloSelectors() {
    // Current elo tiers
    document.querySelectorAll('#current-elo .elo-tier-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#current-elo .elo-tier-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.currentElo = btn.dataset.elo;
            updateDivisions('current');
            updateEloBadge('current');
            updatePrice();
        });
    });
    // Current divisions
    document.querySelectorAll('#current-divisions .div-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#current-divisions .div-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.currentDiv = parseInt(btn.dataset.div);
            updateEloBadge('current');
            updatePrice();
        });
    });
    // Desired elo tiers
    document.querySelectorAll('#desired-elo .elo-tier-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#desired-elo .elo-tier-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.desiredElo = btn.dataset.elo;
            updateDivisions('desired');
            updateEloBadge('desired');
            updatePrice();
        });
    });
    // Desired divisions
    document.querySelectorAll('#desired-divisions .div-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#desired-divisions .div-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.desiredDiv = parseInt(btn.dataset.div);
            updateEloBadge('desired');
            updatePrice();
        });
    });
    // Hide divisions for Master
    updateDivisions('current');
    updateDivisions('desired');
    updateEloBadge('current');
    updateEloBadge('desired');
}

function updateDivisions(type) {
    const elo = type === 'current' ? currentState.currentElo : currentState.desiredElo;
    const divContainer = document.getElementById(`${type === 'current' ? 'current' : 'desired'}-divisions`);
    divContainer.style.display = elo === 'master' ? 'none' : 'flex';
    if (elo === 'master') {
        if (type === 'current') currentState.currentDiv = 1;
        else currentState.desiredDiv = 1;
    }
}

function updateEloBadge(type) {
    const elo = type === 'current' ? currentState.currentElo : currentState.desiredElo;
    const div = type === 'current' ? currentState.currentDiv : currentState.desiredDiv;
    const nameEl = document.getElementById(`${type === 'current' ? 'current' : 'desired'}-elo-name`);
    const imgEl = document.getElementById(`${type === 'current' ? 'current' : 'desired'}-elo-img`);
    const badgeEl = document.getElementById(`${type === 'current' ? 'current' : 'desired'}-elo-badge`);
    const eloName = ELO_DATA[elo].name;
    const divName = elo === 'master' ? '' : ` ${DIV_NAMES[div]}`;
    nameEl.textContent = `${eloName}${divName}`;
    imgEl.style.display = 'none';
    badgeEl.style.borderColor = ELO_COLORS[elo];
    badgeEl.style.background = `${ELO_COLORS[elo]}15`;
}

function initOptions() {
    document.getElementById('lp-range').addEventListener('change', e => { currentState.lpRange = e.target.value; updatePrice(); });
    document.getElementById('queue-type').addEventListener('change', e => { currentState.queue = e.target.value; updatePrice(); });
    document.getElementById('server').addEventListener('change', e => { currentState.server = e.target.value; updatePrice(); });
    // Extras
    ['flash', 'champs', 'offline', 'priority'].forEach(ex => {
        document.getElementById(`extra-${ex}`).addEventListener('change', e => { currentState.extras[ex] = e.target.checked; updatePrice(); });
    });
    // MD10
    document.querySelectorAll('.win-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.win-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.md10Wins = parseInt(btn.dataset.wins);
            updatePrice();
        });
    });
    document.getElementById('md10-previous-elo')?.addEventListener('change', e => { currentState.md10Elo = e.target.value; updatePrice(); });
    // Wins
    document.getElementById('wins-elo')?.addEventListener('change', e => { currentState.winsElo = e.target.value; updatePrice(); });
    document.getElementById('wins-count')?.addEventListener('change', e => { currentState.winsCount = parseInt(e.target.value) || 1; updatePrice(); });
    // Coach
    document.getElementById('coach-elo')?.addEventListener('change', e => { currentState.coachElo = e.target.value; updatePrice(); });
    document.getElementById('coach-hours')?.addEventListener('change', e => { currentState.coachHours = parseInt(e.target.value) || 1; updatePrice(); });
}

function calculateBoostPrice() {
    const cElo = ELO_DATA[currentState.currentElo];
    const dElo = ELO_DATA[currentState.desiredElo];
    if (!cElo || !dElo) return 0;
    const cOrder = cElo.order * 4 + (4 - currentState.currentDiv);
    const dOrder = dElo.order * 4 + (4 - currentState.desiredDiv);
    if (dOrder <= cOrder) return 0;
    let total = 0;
    for (let i = cOrder; i < dOrder; i++) {
        const eloIdx = Math.floor(i / 4);
        const eloKey = Object.keys(ELO_DATA)[eloIdx];
        total += ELO_DATA[eloKey].price;
    }
    // LP modifier
    const lpMod = { '0-20': 1.15, '21-40': 1.08, '41-60': 1.0, '61-80': 0.95, '81-100': 0.9 };
    total *= lpMod[currentState.lpRange] || 1;
    // Queue modifier
    if (currentState.queue === 'flex') total *= 0.9;
    // Duo boost premium
    if (currentState.service === 'duo-boost') total *= 1.35;
    // Extras
    if (currentState.extras.flash) total *= 1.05;
    if (currentState.extras.champs) total *= 1.10;
    if (currentState.extras.offline) total *= 1.10;
    if (currentState.extras.priority) total *= 1.20;
    return Math.max(total, 0);
}

function calculateMD10Price() {
    const eloBase = ELO_DATA[currentState.md10Elo]?.price || 15;
    return eloBase * currentState.md10Wins * 0.9;
}

function calculateWinsPrice() {
    const eloBase = ELO_DATA[currentState.winsElo]?.price || 15;
    return eloBase * currentState.winsCount * 1.5;
}

function calculateCoachPrice() {
    return currentState.coachHours * 65;
}

function updatePrice() {
    let price = 0;
    switch (currentState.service) {
        case 'elo-boost': case 'duo-boost': price = calculateBoostPrice(); break;
        case 'md10': price = calculateMD10Price(); break;
        case 'wins': price = calculateWinsPrice(); break;
        case 'coach': price = calculateCoachPrice(); break;
    }
    const priceEl = document.getElementById('price-value');
    const targetText = `R$ ${price.toFixed(2).replace('.', ',')}`;
    // Animate price change
    priceEl.style.transform = 'scale(1.1)';
    priceEl.style.color = '#fbbf24';
    setTimeout(() => {
        priceEl.textContent = targetText;
        priceEl.style.transform = 'scale(1)';
        priceEl.style.color = '';
    }, 150);
    // Update details
    const detailsEl = document.getElementById('price-details');
    if (currentState.service === 'elo-boost' || currentState.service === 'duo-boost') {
        const cName = `${ELO_DATA[currentState.currentElo].name} ${currentState.currentElo !== 'master' ? DIV_NAMES[currentState.currentDiv] : ''}`;
        const dName = `${ELO_DATA[currentState.desiredElo].name} ${currentState.desiredElo !== 'master' ? DIV_NAMES[currentState.desiredDiv] : ''}`;
        detailsEl.innerHTML = `<span style="color:var(--text-muted)">${currentState.service === 'duo-boost' ? 'Duo Boost' : 'Elo Boost'}: ${cName.trim()} → ${dName.trim()}</span>`;
    } else {
        detailsEl.innerHTML = '';
    }
    // Buy button
    document.getElementById('btn-buy').querySelector('span').textContent = price > 0 ? `Contratar (R$ ${price.toFixed(2).replace('.', ',')})` : 'Selecione o serviço';
}

// Expose for auth.js checkout
window.PricingState = currentState;
window.ELO_DATA = ELO_DATA;
window.DIV_NAMES = DIV_NAMES;
