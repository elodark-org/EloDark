import postgres from "postgres";

function createSql() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("POSTGRES_URL não configurada. Configure no arquivo .env.local ou nas variáveis de ambiente do Vercel.");
  }
  return postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: "require",
  });
}

export const sql = createSql();
