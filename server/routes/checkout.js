// ========== CHECKOUT / STRIPE ROUTES ==========
const express = require('express');
const sql = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// POST /api/checkout/create-session — Create Stripe Checkout Session
router.post('/create-session', verifyToken, async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({ error: 'Stripe não configurado. Defina STRIPE_SECRET_KEY no .env' });
        }

        const { service_type, config, price } = req.body;

        if (!service_type || !price) {
            return res.status(400).json({ error: 'service_type e price são obrigatórios' });
        }

        const serviceNames = {
            'elo-boost': 'Elo Boost',
            'duo-boost': 'Duo Boost',
            'md10': 'MD10 (Placement)',
            'wins': 'Vitórias',
            'coach': 'Coach'
        };

        // Create order in DB first (status: pending)
        const [order] = await sql`
            INSERT INTO orders (user_id, service_type, config, price, status)
            VALUES (${req.user.id}, ${service_type}, ${JSON.stringify(config || {})}, ${price}, 'pending')
            RETURNING *
        `;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: `EloDark - ${serviceNames[service_type] || service_type}`,
                        description: config?.description || `Serviço de ${serviceNames[service_type]} para League of Legends`,
                    },
                    unit_amount: Math.round(price * 100), // Stripe uses cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin || 'http://localhost:3000'}/checkout-success.html?order_id=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin || 'http://localhost:3000'}/checkout-cancel.html?order_id=${order.id}`,
            metadata: {
                order_id: order.id.toString(),
                user_id: req.user.id.toString(),
                service_type
            },
            customer_email: req.user.email
        });

        res.json({ sessionId: session.id, url: session.url, order_id: order.id });
    } catch (err) {
        console.error('Stripe session error:', err);
        res.status(500).json({ error: 'Erro ao criar sessão de pagamento' });
    }
});

// POST /api/checkout/webhook — Stripe webhook (payment confirmation)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) return res.status(500).send('Stripe not configured');

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } else {
            event = JSON.parse(req.body);
        }
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.order_id;

        if (orderId) {
            await sql`
                UPDATE orders SET status = 'active', updated_at = NOW()
                WHERE id = ${orderId}
            `;
            console.log(`✅ Pedido #${orderId} pago com sucesso via Stripe`);
        }
    }

    res.json({ received: true });
});

// GET /api/checkout/verify/:sessionId — Verify payment status + sync DB
router.get('/verify/:sessionId', verifyToken, async (req, res) => {
    try {
        if (!stripe) return res.status(500).json({ error: 'Stripe não configurado' });

        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        const orderId = session.metadata?.order_id;

        // If paid, sync order status in DB
        if (session.payment_status === 'paid' && orderId) {
            const [order] = await sql`SELECT status FROM orders WHERE id = ${orderId}`;
            if (order && order.status === 'pending') {
                await sql`UPDATE orders SET status = 'active', updated_at = NOW() WHERE id = ${orderId}`;
                console.log(`✅ Pedido #${orderId} sincronizado como pago via verify`);
            }
        }

        res.json({
            payment_status: session.payment_status,
            status: session.status,
            order_id: orderId
        });
    } catch (err) {
        console.error('Verify error:', err);
        res.status(500).json({ error: 'Erro ao verificar pagamento' });
    }
});

// POST /api/checkout/sync — Sync all pending orders with Stripe
router.post('/sync', verifyToken, async (req, res) => {
    try {
        if (!stripe) return res.status(500).json({ error: 'Stripe não configurado' });

        // Get recent checkout sessions from Stripe
        const sessions = await stripe.checkout.sessions.list({ limit: 50 });

        let synced = 0;
        for (const session of sessions.data) {
            if (session.payment_status === 'paid' && session.metadata?.order_id) {
                const orderId = session.metadata.order_id;
                const [order] = await sql`SELECT status FROM orders WHERE id = ${orderId}`;
                if (order && order.status === 'pending') {
                    await sql`UPDATE orders SET status = 'active', updated_at = NOW() WHERE id = ${orderId}`;
                    synced++;
                    console.log(`✅ Pedido #${orderId} sincronizado`);
                }
            }
        }

        res.json({ message: `${synced} pedido(s) sincronizado(s)`, synced });
    } catch (err) {
        console.error('Sync error:', err);
        res.status(500).json({ error: 'Erro ao sincronizar' });
    }
});

module.exports = router;
