const sql = require('./server/config/db');
const jwt = require('jsonwebtoken');

const BOOSTER_ID_TO_TEST = 8; // From user report
// We need to find a booster and their assigned order to test this effectively.
// Or we can mock the user token.

async function test() {
    try {
        console.log('--- DIAGNOSTIC START ---');

        // 1. Get the order details
        const [order] = await sql`SELECT id, user_id, booster_id, status FROM orders WHERE id = ${BOOSTER_ID_TO_TEST}`;
        if (!order) {
            console.error('Order #8 not found!');
            process.exit(1);
        }
        console.log('Order:', order);

        if (!order.booster_id) {
            console.error('Order #8 has no booster assigned!');
            // process.exit(1); // Keep going to see what else
        }

        // 2. Get the booster details associated with this order (if any)
        if (order.booster_id) {
            const [booster] = await sql`SELECT * FROM boosters WHERE id = ${order.booster_id}`;
            console.log('Assigned Booster:', booster);

            // 3. Simulate the check logic from chat.js
            console.log('--- SIMULATING CHECK ---');

            // req.user.id would be the booster's user_id
            const mockReqUser = { id: booster.user_id, role: 'booster' };
            console.log('Mock Req User:', mockReqUser);

            // Re-run the query from chat.js
            const [boosterCheck] = await sql`SELECT id FROM boosters WHERE user_id = ${mockReqUser.id}`;
            console.log('Booster Lookup Result:', boosterCheck);

            const isMatch = boosterCheck && boosterCheck.id === order.booster_id;
            console.log(`Comparison: ${boosterCheck.id} === ${order.booster_id} => ${isMatch}`);

            if (!isMatch) {
                console.error('❌ CHECK FAILED: Mismatch in IDs');
            } else {
                console.log('✅ CHECK PASSED');
            }
        } else {
            console.log('Skipping booster check simulation as no booster is assigned.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

test();
