// ========== SEED ADMIN ==========
const sql = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL || 'admin@elodark.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
        console.log('  ⚠️  Admin já existe, pulando seed.');
        return;
    }

    const hash = await bcrypt.hash(password, 12);
    await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Admin', ${email}, ${hash}, 'admin')
    `;
    console.log(`  ✅ Admin criado: ${email}`);
}

module.exports = seedAdmin;
