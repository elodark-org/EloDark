// ========== ORDERS ROUTES ==========
const express = require('express');
const sql = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — Create order (authenticated user)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { service_type, config, price } = req.body;

        if (!service_type || !price) {
            return res.status(400).json({ error: 'service_type e price são obrigatórios' });
        }

        const validServices = ['elo-boost', 'duo-boost', 'md10', 'wins', 'coach'];
        if (!validServices.includes(service_type)) {
            return res.status(400).json({ error: `Serviço inválido. Use: ${validServices.join(', ')}` });
        }

        const [order] = await sql`
            INSERT INTO orders (user_id, service_type, config, price)
            VALUES (${req.user.id}, ${service_type}, ${JSON.stringify(config || {})}, ${price})
            RETURNING *
        `;

        res.status(201).json({ order });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/orders — List orders for current user (or booster's assigned orders)
router.get('/', verifyToken, async (req, res) => {
    try {
        let orders;

        if (req.user.role === 'booster') {
            // Booster sees their assigned orders
            const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${req.user.id}`;
            if (!booster) return res.json({ orders: [] });

            orders = await sql`
                SELECT o.*, u.name as user_name
                FROM orders o
                LEFT JOIN users u ON u.id = o.user_id
                WHERE o.booster_id = ${booster.id}
                ORDER BY o.created_at DESC
            `;
        } else {
            // User sees their own orders
            orders = await sql`
                SELECT o.*, b.game_name as booster_name
                FROM orders o
                LEFT JOIN boosters b ON b.id = o.booster_id
                WHERE o.user_id = ${req.user.id}
                ORDER BY o.created_at DESC
            `;
        }

        res.json({ orders });
    } catch (err) {
        console.error('List orders error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/orders/:id — Get single order
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [order] = await sql`
            SELECT o.*, u.name as user_name, u.email as user_email,
                   b.game_name as booster_name, b.rank as booster_rank
            FROM orders o
            LEFT JOIN users u ON u.id = o.user_id
            LEFT JOIN boosters b ON b.id = o.booster_id
            WHERE o.id = ${id}
        `;

        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

        // Only allow access to own orders (or admin/assigned booster)
        if (req.user.role === 'user' && order.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        res.json({ order });
    } catch (err) {
        console.error('Get order error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PUT /api/orders/:id/status — Booster updates order status
router.put('/:id/status', verifyToken, requireRole('booster', 'admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const validStatuses = ['in_progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Status inválido. Booster pode usar: ${validStatuses.join(', ')}` });
        }

        // If booster, verify they are assigned to this order
        if (req.user.role === 'booster') {
            const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${req.user.id}`;
            const [order] = await sql`SELECT booster_id FROM orders WHERE id = ${id}`;
            if (!order || !booster || order.booster_id !== booster.id) {
                return res.status(403).json({ error: 'Você não está atribuído a este pedido' });
            }
        }

        const [order] = await sql`
            UPDATE orders SET
                status = ${status},
                notes = COALESCE(${notes}, notes),
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `;

        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
        res.json({ order });
    } catch (err) {
        console.error('Update order status error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/orders/available — List orders available for boosters to claim
router.get('/available', verifyToken, requireRole('booster', 'admin'), async (req, res) => {
    try {
        const orders = await sql`
            SELECT o.id, o.service_type, o.config, o.price, o.created_at,
                   u.name as user_name
            FROM orders o
            LEFT JOIN users u ON u.id = o.user_id
            WHERE o.status = 'available'
            ORDER BY o.created_at ASC
        `;
        res.json({ orders });
    } catch (err) {
        console.error('Available orders error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/orders/:id/claim — Booster claims an available order
router.post('/:id/claim', verifyToken, requireRole('booster', 'admin'), async (req, res) => {
    try {
        const { id } = req.params;

        // Get booster profile
        const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${req.user.id}`;
        if (!booster) return res.status(400).json({ error: 'Perfil de booster não encontrado' });

        // Atomically claim (only if still available)
        const [order] = await sql`
            UPDATE orders SET
                booster_id = ${booster.id},
                status = 'in_progress',
                updated_at = NOW()
            WHERE id = ${id} AND status = 'available'
            RETURNING *
        `;

        if (!order) {
            return res.status(409).json({ error: 'Este pedido não está mais disponível' });
        }

        console.log(`🎮 Booster #${booster.id} pegou o pedido #${id}`);
        res.json({ order });
    } catch (err) {
        console.error('Claim order error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
