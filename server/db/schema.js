// ========== DATABASE SCHEMA ==========
const sql = require('../config/db');

async function createTables() {
    console.log('🔧 Criando tabelas...');

    // Users table
    await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'booster', 'admin')),
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;
    console.log('  ✅ Tabela users criada');

    // Boosters table
    await sql`
        CREATE TABLE IF NOT EXISTS boosters (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            game_name VARCHAR(100) NOT NULL,
            rank VARCHAR(50) NOT NULL,
            win_rate DECIMAL(5,2) DEFAULT 0,
            games_played INTEGER DEFAULT 0,
            avatar_emoji VARCHAR(10) DEFAULT '🎮',
            active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;
    console.log('  ✅ Tabela boosters criada');

    // Orders table
    await sql`
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            booster_id INTEGER REFERENCES boosters(id) ON DELETE SET NULL,
            service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('elo-boost', 'duo-boost', 'md10', 'wins', 'coach')),
            config JSONB NOT NULL DEFAULT '{}',
            price DECIMAL(10,2) NOT NULL,
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'in_progress', 'completed', 'cancelled')),
            notes TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `;
    console.log('  ✅ Tabela orders criada');

    // Reviews table
    await sql`
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
            rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
            text TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;
    console.log('  ✅ Tabela reviews criada');

    console.log('🎉 Todas as tabelas criadas com sucesso!');
}

module.exports = createTables;
