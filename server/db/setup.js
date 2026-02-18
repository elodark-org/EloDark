// ========== DB SETUP (run once) ==========
require('dotenv').config();
const createTables = require('./schema');
const seedAdmin = require('./seed');

async function setup() {
    try {
        console.log('🚀 EloDark - Configurando banco de dados...\n');
        await createTables();
        console.log('');
        await seedAdmin();
        console.log('\n✅ Setup concluído!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Erro no setup:', err.message);
        process.exit(1);
    }
}

setup();
