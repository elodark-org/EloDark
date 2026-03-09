import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

let _client: Sql | undefined;

function getClient(): Sql {
  if (!_client) {
    const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "POSTGRES_URL não configurada. Configure no arquivo .env.local ou nas variáveis de ambiente do Vercel."
      );
    }
    _client = postgres(url, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require",
    });
  }
  return _client;
}

// Lazy proxy — the postgres client is only instantiated on the first actual request,
// not at module evaluation time, so Next.js build succeeds without env vars.
export const sql: Sql = new Proxy(function () {} as unknown as Sql, {
  apply(_t, _this, args) {
    return (getClient() as unknown as (...a: unknown[]) => unknown).apply(_this, args);
  },
  get(_t, prop) {
    return getClient()[prop as keyof Sql];
  },
});
