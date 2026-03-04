-- Migration: Tabelas para o fluxo de email (verificação de conta + reset de senha)
-- Execute no painel do Neon ou via psql antes de usar os endpoints de auth.

-- Registros pendentes de cadastro (aguardando verificação de email)
CREATE TABLE IF NOT EXISTS pending_registrations (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  code          VARCHAR(6) NOT NULL,
  expires_at    TIMESTAMP NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pr_email ON pending_registrations(email);

-- Códigos de reset de senha

CREATE TABLE IF NOT EXISTS password_reset_codes (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code        VARCHAR(6) NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  used        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prc_user_id ON password_reset_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_prc_code    ON password_reset_codes(code);
