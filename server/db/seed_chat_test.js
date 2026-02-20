require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const sql = neon(process.env.DATABASE_URL);

(async () => {
    try {
        console.log('🌱 Seeding chat test data...');

        // 1. Create/Get User
        const email = 'chat_test@elodark.com';
        const passwordHash = await bcrypt.hash('password123', 10);

        let [user] = await sql`SELECT * FROM users WHERE email = ${email}`;

        if (!user) {
            console.log('   Creating user...');
            [user] = await sql`
                INSERT INTO users (name, email, password_hash, role)
                VALUES ('Chat Tester', ${email}, ${passwordHash}, 'user')
                RETURNING *
            `;
        }

        console.log(`   User ID: ${user.id}`);

        // 2. Create Order
        console.log('   Creating order...');
        const [order] = await sql`
            INSERT INTO orders (user_id, service_type, price, status, config)
            VALUES (${user.id}, 'elo-boost', 50.00, 'active', '{"description":"Test Order - Chat"}')
            RETURNING *
        `;

        console.log(`   Order Created: #${order.id}`);
        console.log('✅ Seed done.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    }
})();
