require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

(async () => {
    console.log('🔧 Criando tabela messages...');
    await sql`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            content TEXT NOT NULL,
            is_system BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;
    console.log('✅ Tabela messages criada com sucesso!');
    process.exit(0);
})();
