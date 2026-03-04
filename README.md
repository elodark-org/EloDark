# EloDark

Plataforma de elo boosting para jogos competitivos. Conecta clientes que querem subir de rank com boosters profissionais.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Banco de Dados | Neon PostgreSQL |
| Autenticação | JWT |
| Pagamento | Stripe Checkout |
| Email | Resend |

## Features

### Landing Page
- Hero section com CTA
- Catálogo de jogos
- Listagem de boosters
- Reviews de clientes
- FAQ
- Configurador de boost por jogo

### Dashboard — Cliente (`/dashboard`)
- Visão geral com stats (pedidos, gastos)
- Lista e detalhe de pedidos
- Sistema de avaliação (1-5 estrelas)
- Chat direto com booster (apenas em orders ativas)

### Dashboard — Booster (`/dashboard/booster`)
- Serviços disponíveis para claim
- Meus pedidos com ações de status
- Carteira: ganhos (comissão 60%), saldo, saques via PIX
- Chat com clientes

### Dashboard — Admin (`/dashboard/admin`)
- Stats da plataforma (users, orders, revenue)
- Gestão de pedidos (status, assign booster, release)
- CRUD de boosters
- Listagem de usuários
- Aprovação/rejeição de saques

### API (33 routes)
- Auth: register, verify-email, login, me, forgot-password, reset-password
- Orders: CRUD, claim, status, available
- Chat: mensagens por order
- Boosters: listagem pública + admin CRUD
- Reviews: criar e listar
- Admin: stats, orders, users, boosters, withdrawals
- Checkout: Stripe session, verify, webhook, sync

### Serviço de Email (Resend)
Todos os emails são enviados via [Resend](https://resend.com) de forma assíncrona (fire-and-forget).

| Evento | Função | Endpoint |
|--------|--------|----------|
| Cadastro — verificação | `sendVerificationEmail` | `POST /api/auth/register` |
| Conta criada | `sendWelcomeEmail` | `POST /api/auth/verify-email` |
| Reset de senha | `sendPasswordResetEmail` | `POST /api/auth/forgot-password` |
| Confirmação de pedido | `sendOrderConfirmation` | webhook Stripe |
| Atualização de status | `sendOrderStatusUpdate` | `PATCH /api/orders/[id]/status` |

#### Fluxo de Cadastro
1. `POST /api/auth/register` — valida dados, salva registro pendente e envia código de 6 dígitos por email (expira em 15 min)
2. `POST /api/auth/verify-email` — valida o código, cria a conta e retorna o JWT token

#### Fluxo de Reset de Senha
1. `POST /api/auth/forgot-password` — recebe `{ email }`, envia código de 6 dígitos (expira em 15 min)
2. `POST /api/auth/reset-password` — recebe `{ email, code, newPassword }`, valida e redefine a senha

## Setup

### Pré-requisitos
- Node.js 20+
- Conta no [Neon](https://neon.tech) (PostgreSQL)
- Conta no [Stripe](https://stripe.com) (pagamentos)

### Instalação

```bash
# Clonar e instalar
git clone https://github.com/elodark-org/EloDark.git
cd EloDark
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Criar tabelas no banco
npm run setup-db

# Rodar dev server
npm run dev
```

### Variáveis de Ambiente

```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# JWT
JWT_SECRET=sua_chave_secreta

# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (email)
RESEND_API_KEY=re_...

# Admin seed (opcional)
ADMIN_EMAIL=admin@elodark.com
ADMIN_PASSWORD=admin123
```

> Se `RESEND_API_KEY` não estiver configurada, os emails são silenciosamente ignorados e um aviso é logado. O sistema funciona normalmente sem ela.

## Comandos

```bash
npm run dev          # Dev server (http://localhost:3000)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npm run setup-db     # Criar tabelas e seed admin
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/              # Login e registro
│   ├── api/                 # 29 API routes
│   ├── boost/[game]/        # Configurador de boost
│   ├── checkout/            # Fluxo Stripe
│   ├── dashboard/
│   │   ├── admin/           # Admin: orders, boosters, users, withdrawals
│   │   ├── booster/         # Booster: available, orders, wallet, chat
│   │   ├── orders/          # Client: order list + detail
│   │   └── chat/            # Client chat
│   ├── boosters/            # Listagem pública
│   └── games/               # Catálogo de jogos
├── components/
│   ├── dashboard/           # StatCard, DataTable, StatusBadge, PageHeader, ChatView
│   ├── landing/             # Hero, FAQ, Reviews, HowItWorks, GameGrid
│   ├── layout/              # Navbar, Footer, DashboardSidebar
│   └── ui/                  # Button, Input, Icon, Badge, Toggle
├── hooks/                   # useAuth, useRoleGuard
├── lib/                     # api, auth, db, stripe, utils, logger, validation
└── types/                   # TypeScript interfaces
```

## Banco de Dados

8 tabelas: `users`, `boosters`, `orders`, `reviews`, `messages`, `withdrawals`, `pending_registrations`, `password_reset_codes`

| Tabela | Descrição |
|--------|-----------|
| `users` | Contas confirmadas |
| `boosters` | Perfis de boosters |
| `orders` | Pedidos de boost |
| `reviews` | Avaliações |
| `messages` | Chat por pedido |
| `withdrawals` | Saques via PIX |
| `pending_registrations` | Cadastros aguardando verificação de email (15 min) |
| `password_reset_codes` | Códigos de reset de senha (15 min) |

O schema completo está em `scripts/db-setup.ts`. A migration das tabelas de email está em `migrations/001_password_reset_codes.sql`.

## Modelo de Negócio

- Cliente cria um pedido de boost e paga via Stripe
- Pedido fica disponível para boosters claimarem
- Booster executa o serviço e marca como concluído
- Booster recebe **60%** do valor do pedido
- Booster solicita saque via **PIX**, admin aprova/rejeita
- Plataforma retém **40%** como receita

## Licença

Privado. Todos os direitos reservados.
