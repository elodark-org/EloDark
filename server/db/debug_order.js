require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

(async () => {
    try {
        console.log('🔍 verificando pedidos available...');
        const orders = await sql`SELECT id, status, booster_id FROM orders WHERE status = 'available'`;
        console.log('Orders with status=available:', orders);

        console.log('🔍 verificando pedido #7...');
        const order7 = await sql`SELECT id, status, booster_id FROM orders WHERE id = 7`;
        console.log('Order #7:', order7);
    } catch (err) {
        console.error(err);
    }
})();
