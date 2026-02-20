// using global fetch (Node 18+)

(async () => {
    const API = 'http://localhost:3000/api';

    // 1. Login as Admin
    console.log('🔑 Logging in as admin...');
    const loginRes = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@elodark.com', password: 'admin123' }) // Correct creds
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
        console.error('Login failed:', loginData);
        process.exit(1);
    }
    const token = loginData.token;
    console.log('✅ Logged in. Token:', token.substring(0, 20) + '...');

    // 2. Fetch Available Orders
    console.log('📦 Fetching /orders/available...');
    const ordersRes = await fetch(`${API}/orders/available`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const ordersData = await ordersRes.json();

    console.log('Status:', ordersRes.status);
    console.log('Orders:', JSON.stringify(ordersData, null, 2));

})();
