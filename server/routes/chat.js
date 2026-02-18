// ========== CHAT ROUTES ==========
const express = require('express');
const sql = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/:orderId — List messages for an order
router.get('/:orderId', verifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;

        // Verify access (user must be owner, assigned booster, or admin)
        const [order] = await sql`SELECT user_id, booster_id FROM orders WHERE id = ${orderId}`;
        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

        if (req.user.role !== 'admin' &&
            req.user.id !== order.user_id &&
            (!order.booster_id || req.user.id !== (await sql`SELECT user_id FROM boosters WHERE id = ${order.booster_id}`)[0]?.user_id)) {

            // Check if user is the booster assigned to this order (via boosters table)
            if (req.user.role === 'booster') {
                const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${req.user.id}`;
                if (!booster || booster.id !== order.booster_id) {
                    return res.status(403).json({ error: 'Acesso negado' });
                }
            } else {
                return res.status(403).json({ error: 'Acesso negado' });
            }
        }

        const messages = await sql`
            SELECT m.*, u.name as sender_name, u.role as sender_role
            FROM messages m
            LEFT JOIN users u ON u.id = m.user_id
            WHERE m.order_id = ${orderId}
            ORDER BY m.created_at ASC
        `;

        res.json({ messages });
    } catch (err) {
        console.error('Chat list error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/chat/:orderId — Send a message
router.post('/:orderId', verifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) return res.status(400).json({ error: 'Mensagem vazia' });

        // Verify access
        const [order] = await sql`SELECT user_id, booster_id, status FROM orders WHERE id = ${orderId}`;
        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

        // Check if user is involved
        let isParticipant = false;
        if (req.user.role === 'admin') isParticipant = true;
        if (req.user.id === order.user_id) isParticipant = true;

        if (req.user.role === 'booster') {
            const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${req.user.id}`;
            if (booster && booster.id === order.booster_id) isParticipant = true;
        }

        if (!isParticipant) return res.status(403).json({ error: 'Acesso negado' });

        const [message] = await sql`
            INSERT INTO messages (order_id, user_id, content)
            VALUES (${orderId}, ${req.user.id}, ${content})
            RETURNING *
        `;

        res.status(201).json({ message });
    } catch (err) {
        console.error('Chat send error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
