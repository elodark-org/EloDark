require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

(async () => {
    await sql('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check');
    await sql("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending','active','available','in_progress','completed','cancelled'))");
    console.log('✅ Migration done: added available status');
    process.exit(0);
})();
