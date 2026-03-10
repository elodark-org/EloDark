import postgres from "postgres";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ POSTGRES_URL ou DATABASE_URL não configurada no .env.local");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: "require", max: 1 });

async function createTables() {
  console.log("🔧 Criando tabelas...");

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
  console.log("  ✅ Tabela users criada");

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
  console.log("  ✅ Tabela boosters criada");

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      booster_id INTEGER REFERENCES boosters(id) ON DELETE SET NULL,
      service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('elo-boost', 'duo-boost', 'md10', 'wins', 'coach')),
      config JSONB NOT NULL DEFAULT '{}',
      price DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'available', 'in_progress', 'awaiting_approval', 'completed', 'cancelled')),
      notes TEXT,
      completion_image_url TEXT,
      admin_approved BOOLEAN DEFAULT FALSE,
      admin_approved_by INTEGER REFERENCES users(id),
      admin_approved_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("  ✅ Tabela orders criada");

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
  console.log("  ✅ Tabela reviews criada");

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
  console.log("  ✅ Tabela messages criada");

  await sql`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id SERIAL PRIMARY KEY,
      booster_id INTEGER REFERENCES boosters(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
      pix_key VARCHAR(255) NOT NULL,
      pix_type VARCHAR(10) NOT NULL CHECK (pix_type IN ('cpf', 'email', 'phone', 'random')),
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      processed_at TIMESTAMP
    )
  `;
  console.log("  ✅ Tabela withdrawals criada");

  await sql`
    CREATE TABLE IF NOT EXISTS pending_registrations (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(100) NOT NULL,
      email         VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      code          VARCHAR(6) NOT NULL,
      expires_at    TIMESTAMP NOT NULL,
      created_at    TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  console.log("  ✅ Tabela pending_registrations criada");

  await sql`
    CREATE INDEX IF NOT EXISTS idx_pr_email ON pending_registrations(email)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_codes (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      code       VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used       BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  console.log("  ✅ Tabela password_reset_codes criada");

  await sql`
    CREATE INDEX IF NOT EXISTS idx_prc_user_id ON password_reset_codes(user_id)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_prc_code ON password_reset_codes(code)
  `;

  console.log("🎉 Todas as tabelas criadas com sucesso!");
}

async function migrateServiceTypes() {
  // Atualiza o CHECK constraint de service_type para os nomes atuais do app
  // (md10 → md5, wins → vitorias)
  await sql`
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_service_type_check
  `;
  await sql`
    ALTER TABLE orders ADD CONSTRAINT orders_service_type_check
      CHECK (service_type IN ('elo-boost', 'duo-boost', 'md5', 'vitorias', 'coach'))
  `;
  console.log("  ✅ Constraint service_type atualizado (md5, vitorias)");
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@elodark.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    console.log("  ⚠️  Admin já existe, pulando seed.");
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES ('Admin', ${email}, ${hash}, 'admin')
  `;
  console.log(`  ✅ Admin criado: ${email}`);
}

async function setup() {
  try {
    console.log("🚀 EloDark - Configurando banco de dados...\n");
    await createTables();
    console.log("");
    await migrateServiceTypes();
    console.log("");
    await seedAdmin();
    console.log("\n✅ Setup concluído!");
    await sql.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro no setup:", err);
    await sql.end();
    process.exit(1);
  }
}

setup();
