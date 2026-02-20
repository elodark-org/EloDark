
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

(async () => {
    try {
        console.log('🌱 Forcing order creation for User 5...');

        const [order] = await sql`
            INSERT INTO orders (user_id, service_type, price, status, config)
            VALUES (5, 'elo-boost', 50.00, 'active', '{"description":"Test Order - Chat"}')
            RETURNING *
        `;

        console.log(`   Order Created: #${order.id}`);
        console.log('✅ Done.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err);
        process.exit(1);
    }
})();
