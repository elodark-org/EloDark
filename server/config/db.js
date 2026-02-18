// ========== DB CONNECTION ==========
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

let sql;

if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL);
} else {
    console.warn('⚠️  DATABASE_URL não configurada. Endpoints de API com banco vão falhar.');
    sql = () => { throw new Error('DATABASE_URL não configurada. Configure no arquivo .env'); };
    sql.query = sql;
}

module.exports = sql;
