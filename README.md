# ⚡ EloDark — Plataforma de Elojob para League of Legends

EloDark é uma plataforma completa de serviços de boosting para League of Legends, com sistema de pedidos, pagamentos via Stripe, chat em tempo real entre cliente e booster, e painel financeiro para boosters solicitarem saques.

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                          NAVEGADOR (Cliente)                        │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  index.html  │  │ booster.html │  │      admin.html          │  │
│  │  (Loja /     │  │  (Painel     │  │   (Painel Administrativo)│  │
│  │   Checkout)  │  │   Booster)   │  │                          │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘  │
│         │                 │                        │                │
│  ┌──────▼─────────────────▼────────────────────────▼─────────────┐  │
│  │              JS (js/auth.js · js/app.js · js/chat.js          │  │
│  │                   js/pricing.js · js/booster.js)              │  │
│  └──────────────────────────────┬──────────────────────────────┘   │
└─────────────────────────────────┼───────────────────────────────────┘
                                  │  HTTP / REST API (Bearer JWT)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     NODE.JS + EXPRESS (server/)                     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   server/index.js (porta 3000)              │    │
│  │          Serve arquivos estáticos + roteamento de API       │    │
│  └──┬──────────┬──────────┬──────────┬──────────┬─────────────┘    │
│     │          │          │          │          │                   │
│  ┌──▼──┐  ┌───▼──┐  ┌────▼──┐  ┌───▼──┐  ┌───▼────────────────┐  │
│  │auth │  │orders│  │admin  │  │wallet│  │checkout · chat     │  │
│  │     │  │      │  │       │  │      │  │boosters · reviews  │  │
│  └──┬──┘  └───┬──┘  └────┬──┘  └───┬──┘  └───┬────────────────┘  │
│     │         │           │         │          │                   │
│  ┌──▼─────────▼───────────▼─────────▼──────────▼─────────────────┐ │
│  │            middleware/auth.js (verifyToken · requireRole)      │ │
│  └──────────────────────────────┬──────────────────────────────── ┘ │
│                                 │                                   │
│  ┌──────────────────────────────▼──────────────────────────────── ┐ │
│  │               server/config/db.js (@neondatabase/serverless)   │ │
│  └──────────────────────────────┬──────────────────────────────── ┘ │
└─────────────────────────────────┼───────────────────────────────────┘
                                  │  SQL (via HTTPS/WebSocket)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  NEON DATABASE (PostgreSQL Serverless)               │
│                                                                     │
│   users · boosters · orders · reviews · messages                    │
│   booster_earnings · withdrawal_requests                            │
└─────────────────────────────────────────────────────────────────────┘
                                  ▲
                                  │  Webhooks / API
┌─────────────────────────────────┴───────────────────────────────────┐
│                          STRIPE                                     │
│            Checkout Sessions · Webhooks · Payment Verify            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo Completo de um Pedido

```
Cliente              Admin               Booster
   │                   │                    │
   │ 1. Configura       │                    │
   │    serviço +       │                    │
   │    Checkout Stripe │                    │
   │──────────────────►│                    │
   │                   │ 2. Pagamento       │
   │                   │    confirmado      │
   │                   │    (status:active) │
   │                   │                    │
   │                   │ 3. Admin libera    │
   │                   │    (status:        │
   │                   │     available)     │
   │                   │───────────────────►│
   │                   │                    │ 4. Booster pega
   │                   │                    │    o serviço
   │                   │                    │    (status:in_progress)
   │◄──────────────────────────────────────│
   │ 5. Chat em        │                    │
   │    tempo real      │                    │
   │◄─────────────────────────────────────►│
   │                   │                    │ 6. Booster conclui
   │                   │                    │    (status:completed)
   │                   │                    │    → earning creditado
   │ 7. Cliente        │                    │
   │    avalia          │                    │
   │───────────────────►│                    │
   │                   │                    │ 8. Booster solicita
   │                   │                    │    saque + chave Pix
   │                   │◄───────────────────│
   │                   │ 9. Admin           │
   │                   │    aprova/rejeita  │
   │                   │───────────────────►│
```

---

## 🗄️ Schema do Banco de Dados

```
┌──────────────────┐         ┌──────────────────────┐
│      users       │         │       boosters       │
├──────────────────┤         ├──────────────────────┤
│ id (PK)          │◄────────│ user_id (FK)         │
│ name             │         │ id (PK)              │
│ email (UNIQUE)   │         │ game_name            │
│ password_hash    │         │ rank                 │
│ role             │         │ win_rate             │
│   user/booster   │         │ games_played         │
│   /admin         │         │ avatar_emoji         │
│ created_at       │         │ active               │
└──────────────────┘         └──────────┬───────────┘
         │                              │
         │   ┌──────────────────────────┘
         │   │
         ▼   ▼
┌──────────────────────────────────────────┐
│                 orders                   │
├──────────────────────────────────────────┤
│ id (PK)                                  │
│ user_id (FK → users)                     │
│ booster_id (FK → boosters)               │
│ service_type                             │
│   elo-boost/duo-boost/md10/wins/coach    │
│ config (JSONB)                           │
│ price (DECIMAL)                          │
│ status                                   │
│   pending→active→available              │
│   →in_progress→completed/cancelled      │
│ notes                                    │
│ created_at · updated_at                  │
└──────────┬───────────────────────────────┘
           │
    ┌──────┴─────────────────┐
    │                        │
    ▼                        ▼
┌────────────────┐   ┌────────────────────┐
│    reviews     │   │     messages       │
├────────────────┤   ├────────────────────┤
│ id (PK)        │   │ id (PK)            │
│ user_id (FK)   │   │ order_id (FK)      │
│ order_id (FK)  │   │ user_id (FK)       │
│ rating (1-5)   │   │ content            │
│ text           │   │ is_system          │
│ created_at     │   │ created_at         │
└────────────────┘   └────────────────────┘

┌──────────────────────┐     ┌───────────────────────────┐
│   booster_earnings   │     │   withdrawal_requests     │
├──────────────────────┤     ├───────────────────────────┤
│ id (PK)              │     │ id (PK)                   │
│ booster_id (FK)      │     │ booster_id (FK)           │
│ order_id (FK)        │     │ amount (DECIMAL)          │
│ amount (DECIMAL)     │     │ pix_key                   │
│ created_at           │     │ status                    │
└──────────────────────┘     │   pending/approved        │
                             │   /rejected               │
                             │ admin_notes               │
                             │ created_at                │
                             │ processed_at              │
                             └───────────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
EloDark/
├── index.html               # Página principal (loja + checkout)
├── booster.html             # Painel do booster
├── admin.html               # Painel administrativo
├── checkout-success.html    # Página de sucesso de pagamento
├── checkout-cancel.html     # Página de cancelamento de pagamento
├── package.json
├── .env.example
├── .gitignore
│
├── styles/
│   └── main.css             # Estilos globais (dark theme)
│
├── js/
│   ├── app.js               # Lógica principal da loja
│   ├── auth.js              # Autenticação (login/registro/logout)
│   ├── booster.js           # Lógica do painel booster
│   ├── chat.js              # Chat em tempo real (polling)
│   └── pricing.js           # Calculadora de preços dinâmica
│
└── server/
    ├── index.js             # Entry point do servidor Express
    │
    ├── config/
    │   └── db.js            # Conexão com NeonDB (PostgreSQL)
    │
    ├── middleware/
    │   └── auth.js          # JWT verifyToken + requireRole
    │
    ├── db/
    │   ├── schema.js        # Criação das tabelas
    │   ├── seed.js          # Seed inicial (admin)
    │   ├── setup.js         # Executa schema + seed
    │   └── migrate.js       # Migrações auxiliares
    │
    └── routes/
        ├── auth.js          # /api/auth — login, register, me
        ├── orders.js        # /api/orders — CRUD de pedidos
        ├── boosters.js      # /api/boosters — lista pública
        ├── admin.js         # /api/admin — gestão completa
        ├── checkout.js      # /api/checkout — Stripe
        ├── chat.js          # /api/chat — mensagens por pedido
        ├── reviews.js       # /api/reviews — avaliações
        └── wallet.js        # /api/wallet — saldo e saques
```

---

## 🔌 API Endpoints

### Autenticação — `/api/auth`
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/register` | Público | Cadastra novo usuário |
| POST | `/login` | Público | Login e retorna JWT |
| GET | `/me` | Autenticado | Retorna dados do usuário logado |

### Pedidos — `/api/orders`
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/` | Usuário | Cria pedido |
| GET | `/` | Autenticado | Lista pedidos do usuário/booster |
| GET | `/available` | Booster/Admin | Lista pedidos disponíveis para pegar |
| GET | `/:id` | Autenticado | Detalhe de um pedido |
| PUT | `/:id/status` | Booster/Admin | Atualiza status (in_progress, completed) |
| POST | `/:id/claim` | Booster | Booster pega o pedido |

### Checkout — `/api/checkout`
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/create-session` | Usuário | Cria sessão Stripe |
| POST | `/webhook` | Stripe | Webhook de confirmação de pagamento |
| GET | `/verify/:sessionId` | Usuário | Verifica e sincroniza pagamento |
| POST | `/sync` | Autenticado | Sincroniza pedidos pendentes |

### Carteira — `/api/wallet`
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/balance` | Booster | Saldo disponível, total ganho, em análise |
| GET | `/history` | Booster | Histórico de saques |
| POST | `/withdraw` | Booster | Solicita saque (valor + chave Pix) |

### Boosters — `/api/boosters`
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/` | Público | Lista boosters ativos |
| GET | `/:id` | Público | Perfil de um booster |

### Chat — `/api/chat`
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/:orderId` | Participante | Lista mensagens do pedido |
| POST | `/:orderId` | Participante | Envia mensagem |

### Avaliações — `/api/reviews`
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/` | Público | Lista avaliações |
| POST | `/` | Usuário | Avalia pedido concluído (1-5 estrelas) |

### Admin — `/api/admin`
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/stats` | Admin | Estatísticas do dashboard |
| GET/POST | `/boosters` | Admin | Lista e cria boosters |
| PUT/DELETE | `/boosters/:id` | Admin | Edita e remove booster |
| GET | `/orders` | Admin | Lista todos os pedidos |
| PUT | `/orders/:id/assign` | Admin | Atribui booster ao pedido |
| PUT | `/orders/:id/status` | Admin | Altera status do pedido |
| PUT | `/orders/:id/release` | Admin | Libera pedido para boosters |
| GET | `/users` | Admin | Lista todos os usuários |
| GET | `/withdrawals` | Admin | Lista solicitações de saque |
| PUT | `/withdrawals/:id` | Admin | Aprova ou rejeita saque |

---

## 👥 Papéis (Roles)

| Role | Descrição | Acesso |
|------|-----------|--------|
| `user` | Cliente da plataforma | Compra serviços, faz chat, avalia |
| `booster` | Executante dos serviços | Pega pedidos, conclui, solicita saque |
| `admin` | Administrador | Controle total da plataforma |

---

## 💰 Sistema Financeiro do Booster

Quando o booster **conclui um pedido** (`status: completed`), o valor total do pedido é automaticamente creditado em `booster_earnings`. O booster pode consultar:

- **Saldo disponível** = Total ganho − (saques aprovados + saques pendentes)
- **Solicitar saque** informando valor e chave Pix
- **Histórico** com status de cada solicitação

O admin visualiza todas as solicitações com a chave Pix e pode aprovar ou rejeitar com uma observação.

---

## 🛒 Serviços Disponíveis

| Serviço | Código | Descrição |
|---------|--------|-----------|
| Elo Boost | `elo-boost` | Subida de elo pelo booster |
| Duo Boost | `duo-boost` | Subida de elo jogando junto |
| MD10 | `md10` | Partidas de posicionamento |
| Vitórias | `wins` | Número de vitórias garantidas |
| Coach | `coach` | Aulas com coach profissional |

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- Conta no [Neon](https://neon.tech) (PostgreSQL serverless)
- Conta no [Stripe](https://stripe.com) (pagamentos)

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/elodark-org/EloDark.git
cd EloDark
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=seu-segredo-forte-aqui
PORT=3000
ADMIN_EMAIL=admin@elodark.com
ADMIN_PASSWORD=suasenha
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Criar as tabelas no banco

```bash
npm run setup-db
```

### 4. Rodar o servidor

```bash
# Produção
npm start

# Desenvolvimento (com hot reload)
npm run dev
```

Acesse em: **http://localhost:3000**

---

## 🔐 Segurança

- Senhas armazenadas com **bcrypt** (12 rounds)
- Autenticação via **JWT** com expiração de 7 dias
- Rotas protegidas por middleware `verifyToken` e `requireRole`
- Variáveis sensíveis isoladas no `.env` (nunca versionado)

---

## 🧰 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Node.js, Express.js |
| Banco de Dados | PostgreSQL via Neon (serverless) |
| ORM/Query | @neondatabase/serverless (tagged template SQL) |
| Autenticação | JWT (jsonwebtoken) + bcryptjs |
| Pagamentos | Stripe Checkout |
| Hospedagem | Qualquer VPS/PaaS (Railway, Render, etc.) |

---

## 📜 Licença

Projeto privado — todos os direitos reservados © EloDark
