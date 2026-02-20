const sql = require('./server/config/db');

const ORDER_ID = 8;

async function check() {
    console.log(`\n🔍 CHECKING ORDER #${ORDER_ID}\n`);
    try {
        // 1. Get Order
        const [order] = await sql`SELECT * FROM orders WHERE id = ${ORDER_ID}`;
        if (!order) {
            console.error('❌ Order not found');
            process.exit(1);
        }
        console.log(`📦 Order: ID=${order.id}, BoosterID=${order.booster_id}, Status=${order.status}`);

        if (!order.booster_id) {
            console.log('⚠️ Order has no booster assigned. Only Admin or Owner can access.');
            process.exit(0);
        }

        // 2. Get Assigned Booster Profile
        const [assignedBooster] = await sql`SELECT * FROM boosters WHERE id = ${order.booster_id}`;
        if (!assignedBooster) {
            console.error(`❌ Booster ID ${order.booster_id} (assigned to order) does not exist in boosters table!`);
            process.exit(1);
        }
        console.log(`👤 Assigned Booster: ID=${assignedBooster.id}, UserID=${assignedBooster.user_id}, Name=${assignedBooster.nickname || 'N/A'}`);

        // 3. User Lookup (The user who is logged in and trying to access)
        const [user] = await sql`SELECT * FROM users WHERE id = ${assignedBooster.user_id}`;
        console.log(`🔑 Login User: ID=${user.id}, Role=${user.role}, Name=${user.name}`);

        // 4. Simulate Logic
        console.log('\n--- SIMULATION ---');
        console.log(`Attempting access as User ID ${user.id} (Role: ${user.role})...`);

        if (user.role === 'booster') {
            const [myBoosterProfile] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
            console.log(`My Booster Profile ID: ${myBoosterProfile?.id}`);

            if (myBoosterProfile && myBoosterProfile.id === order.booster_id) {
                console.log('✅ ACCESS GRANTED (Matched Booster ID)');
            } else {
                console.log('❌ ACCESS DENIED (Booster ID Mismatch)');
            }
        } else {
            console.log('⚠️ User is not role "booster".');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

check();
