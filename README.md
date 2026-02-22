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

### API (29 routes)
- Auth: register, login, me
- Orders: CRUD, claim, status, available
- Chat: mensagens por order
- Boosters: listagem pública + admin CRUD
- Reviews: criar e listar
- Admin: stats, orders, users, boosters, withdrawals
- Checkout: Stripe session, verify, webhook, sync

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

# Admin seed (opcional)
ADMIN_EMAIL=admin@elodark.com
ADMIN_PASSWORD=admin123
```

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

6 tabelas: `users`, `boosters`, `orders`, `reviews`, `messages`, `withdrawals`

O schema completo está em `scripts/db-setup.ts`.

## Modelo de Negócio

- Cliente cria um pedido de boost e paga via Stripe
- Pedido fica disponível para boosters claimarem
- Booster executa o serviço e marca como concluído
- Booster recebe **60%** do valor do pedido
- Booster solicita saque via **PIX**, admin aprova/rejeita
- Plataforma retém **40%** como receita

## Licença

Privado. Todos os direitos reservados.
