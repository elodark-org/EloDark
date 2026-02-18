// ========== REVIEWS ROUTES ==========
const express = require('express');
const sql = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews — Public list of reviews
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const reviews = await sql`
            SELECT r.id, r.rating, r.text, r.created_at,
                   u.name as user_name,
                   o.service_type
            FROM reviews r
            LEFT JOIN users u ON u.id = r.user_id
            LEFT JOIN orders o ON o.id = r.order_id
            ORDER BY r.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const [{ count }] = await sql`SELECT COUNT(*) as count FROM reviews`;

        res.json({ reviews, total: parseInt(count) });
    } catch (err) {
        console.error('List reviews error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/reviews — Create review (must have completed order)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { order_id, rating, text } = req.body;

        if (!order_id || !rating) {
            return res.status(400).json({ error: 'order_id e rating são obrigatórios' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating deve ser entre 1 e 5' });
        }

        // Verify order belongs to user and is completed
        const [order] = await sql`
            SELECT id FROM orders
            WHERE id = ${order_id} AND user_id = ${req.user.id} AND status = 'completed'
        `;
        if (!order) {
            return res.status(400).json({ error: 'Pedido não encontrado ou ainda não foi concluído' });
        }

        // Check if already reviewed
        const existing = await sql`SELECT id FROM reviews WHERE order_id = ${order_id}`;
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Este pedido já foi avaliado' });
        }

        const [review] = await sql`
            INSERT INTO reviews (user_id, order_id, rating, text)
            VALUES (${req.user.id}, ${order_id}, ${rating}, ${text || null})
            RETURNING *
        `;

        res.status(201).json({ review });
    } catch (err) {
        console.error('Create review error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
