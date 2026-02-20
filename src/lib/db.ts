import { neon } from "@neondatabase/serverless";

function createSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não configurada. Configure no arquivo .env.local");
  }
  return neon(url);
}

export const sql = createSql();
