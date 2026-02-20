
const http = require('http');

const PORT = 3000;

function request(path, method, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function testChat() {
    console.log('🧪 Testing Chat API (User: chat_test@elodark.com)...');

    // 1. Login
    console.log('1. Logging in...');
    const authRes = await request('/auth/login', 'POST', {
        email: 'chat_test@elodark.com',
        password: 'password123'
    });

    if (authRes.status !== 200) {
        console.error('   ❌ Login failed:', authRes.data);
        return;
    }
    console.log('   ✅ Login successful');
    const token = authRes.data.token;

    // 2. Find Order
    console.log('2. Finding order...');
    const ordersRes = await request('/orders', 'GET', null, { 'Authorization': `Bearer ${token}` });

    let orderId;
    if (ordersRes.data.orders && ordersRes.data.orders.length > 0) {
        orderId = ordersRes.data.orders[0].id;
        console.log(`   ✅ Found order #${orderId}`);
    } else {
        console.error('   ❌ No orders found for this user.');
        return;
    }

    // 3. Send Message
    console.log(`3. Sending message to #${orderId}...`);
    const msgRes = await request(`/chat/${orderId}`, 'POST', { content: 'Automated Test Message' }, { 'Authorization': `Bearer ${token}` });

    if (msgRes.status === 201) {
        console.log('   ✅ Message sent:', msgRes.data);
    } else {
        console.error('   ❌ Send failed:', msgRes.status, msgRes.data);
    }

    // 4. List Messages
    console.log(`4. Listing messages...`);
    const listRes = await request(`/chat/${orderId}`, 'GET', null, { 'Authorization': `Bearer ${token}` });

    if (listRes.status === 200) {
        const msgs = listRes.data.messages;
        console.log(`   ✅ Retrieved ${msgs.length} messages`);
        const methodWork = msgs.some(m => m.content === 'Automated Test Message');
        if (methodWork) {
            console.log('   🎉 SUCCESS: The message was sent and retrieved correctly!');
        } else {
            console.error('   ❌ FAILURE: Message sent but not found in list.');
        }
    } else {
        console.error('   ❌ List failed:', listRes.status, listRes.data);
    }
}

testChat().catch(console.error);
