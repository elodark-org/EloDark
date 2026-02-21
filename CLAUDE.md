# EloDark — Instruções para Claude Code

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Linguagem**: TypeScript strict mode
- **Estilo**: Tailwind CSS v4 (CSS-first com `@theme`)
- **Banco**: Neon PostgreSQL (serverless, `@neondatabase/serverless`)
- **Auth**: JWT Bearer Token (jsonwebtoken + bcryptjs)
- **Pagamento**: Stripe Checkout
- **Deploy**: Vercel

## Estrutura de Pastas

```
src/
  app/
    (auth)/         # Login e registro
    api/            # 29 API routes (auth, orders, chat, admin, booster, checkout)
    boost/          # Configurador de boost por jogo
    checkout/       # Fluxo de pagamento Stripe
    dashboard/      # Dashboards role-based
      admin/        # Gestão de orders, boosters, users, withdrawals
      booster/      # Available orders, wallet, chat
      orders/       # Client order list e detalhe
    boosters/       # Listagem pública de boosters
    games/          # Catálogo de jogos
  components/
    dashboard/      # StatCard, DataTable, StatusBadge, PageHeader, ChatView
    landing/        # Hero, FAQ, Reviews, HowItWorks, GameGrid
    layout/         # Navbar, Footer, DashboardSidebar, SearchOverlay
    ui/             # Button, Input, Icon, Badge, Toggle
  hooks/            # useAuth, useRoleGuard
  lib/              # api, auth, db, stripe, utils, logger, validation
  types/            # Interfaces (Order, Booster, Withdrawal, etc.)
scripts/
  db-setup.ts       # Cria tabelas + seed admin
```

## Arquitetura

### Roles (3 perfis)
- **user**: cliente que compra boost
- **booster**: jogador que executa o serviço (comissão 40%)
- **admin**: gestão completa da plataforma

### Auth Flow
1. Register/Login → API gera JWT (expira 7d) → armazena em `localStorage`
2. `src/lib/api.ts` injeta `Authorization: Bearer <token>` automaticamente
3. Backend: `requireAuth()` e `requireRole()` em `src/lib/auth.ts`
4. Frontend: `useAuth()` para estado, `useRoleGuard()` para proteger rotas

### Banco de Dados (6 tabelas)
- `users` (id, name, email, password_hash, role)
- `boosters` (id, user_id, game_name, rank, win_rate, active)
- `orders` (id, user_id, booster_id, service_type, config, price, status)
- `reviews` (id, user_id, order_id, rating, text)
- `messages` (id, order_id, user_id, content, is_system)
- `withdrawals` (id, booster_id, amount, pix_key, pix_type, status)

### Status de Orders
`pending` → `active` → `available` → `in_progress` → `completed`/`cancelled`

## Convenções

### Código
- TypeScript strict, sem `any` (exceto generics com `Record<string, any>`)
- Tailwind v4 CSS-first
- Server Components por padrão; "use client" só quando necessário
- API routes usam `logger` e `validation` de `src/lib/`
- Dinheiro formatado como `R$ X.XX` (Real brasileiro)

### Estilo Visual
- Dark theme: `bg-bg-primary`, `glass-card`, `border-white/5`
- Cores: `text-primary` (azul), `text-accent-purple`, `text-accent-cyan`
- Texto secundário: `text-white/40`, `text-white/60`
- Cards: `glass-card rounded-2xl p-6 border border-white/5`

### Git
- Commits em inglês, formato: `type: description`
- Types: `feat`, `fix`, `chore`, `refactor`
- Branch principal: `main`

## Comandos

```bash
npm run dev          # Dev server (porta 3000)
npm run build        # Build de produção
npm run lint         # ESLint
npm run setup-db     # Criar tabelas no Neon DB
```

## Variáveis de Ambiente (.env.local)

```
DATABASE_URL=postgresql://...        # Neon connection string
JWT_SECRET=...                       # Segredo para assinar JWT
STRIPE_SECRET_KEY=...                # Stripe server key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Stripe client key
ADMIN_EMAIL=admin@elodark.com        # Email do admin seed
ADMIN_PASSWORD=...                   # Senha do admin seed
```

## Regras

1. Leia a issue/contexto completamente antes de codar
2. **DRY**: reutilize componentes de `src/components/dashboard/` e `src/components/ui/`
3. **YAGNI**: implemente apenas o solicitado
4. **KISS**: solução mais simples que resolve
5. Rode `npm run build` após mudanças multi-arquivo
6. Não adicione dependências sem necessidade clara
7. API routes: sempre use `requireAuth`/`requireRole` de `src/lib/auth.ts`
