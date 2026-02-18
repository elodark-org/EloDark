// ========== ADMIN ROUTES ==========
const express = require('express');
const bcrypt = require('bcryptjs');
const sql = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(verifyToken, requireRole('admin'));

// POST /api/admin/boosters — Create booster (creates user + booster profile)
router.post('/boosters', async (req, res) => {
    try {
        const { name, email, password, game_name, rank, win_rate, games_played, avatar_emoji } = req.body;

        if (!name || !email || !password || !game_name || !rank) {
            return res.status(400).json({ error: 'name, email, password, game_name e rank são obrigatórios' });
        }

        // Check if email exists
        const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        const hash = await bcrypt.hash(password, 12);

        // Create user with booster role
        const [user] = await sql`
            INSERT INTO users (name, email, password_hash, role)
            VALUES (${name}, ${email}, ${hash}, 'booster')
            RETURNING id, name, email, role
        `;

        // Create booster profile
        const [booster] = await sql`
            INSERT INTO boosters (user_id, game_name, rank, win_rate, games_played, avatar_emoji)
            VALUES (${user.id}, ${game_name}, ${rank}, ${win_rate || 0}, ${games_played || 0}, ${avatar_emoji || '🎮'})
            RETURNING *
        `;

        res.status(201).json({ user, booster });
    } catch (err) {
        console.error('Create booster error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/admin/boosters — List all boosters
router.get('/boosters', async (req, res) => {
    try {
        const boosters = await sql`
            SELECT b.*, u.name, u.email, u.created_at as user_created_at
            FROM boosters b
            JOIN users u ON u.id = b.user_id
            ORDER BY b.created_at DESC
        `;
        res.json({ boosters });
    } catch (err) {
        console.error('List boosters error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PUT /api/admin/boosters/:id — Update booster
router.put('/boosters/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { game_name, rank, win_rate, games_played, avatar_emoji, active } = req.body;

        const [booster] = await sql`
            UPDATE boosters SET
                game_name = COALESCE(${game_name}, game_name),
                rank = COALESCE(${rank}, rank),
                win_rate = COALESCE(${win_rate}, win_rate),
                games_played = COALESCE(${games_played}, games_played),
                avatar_emoji = COALESCE(${avatar_emoji}, avatar_emoji),
                active = COALESCE(${active}, active)
            WHERE id = ${id}
            RETURNING *
        `;

        if (!booster) return res.status(404).json({ error: 'Booster não encontrado' });
        res.json({ booster });
    } catch (err) {
        console.error('Update booster error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE /api/admin/boosters/:id — Delete booster
router.delete('/boosters/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [booster] = await sql`SELECT user_id FROM boosters WHERE id = ${id}`;
        if (!booster) return res.status(404).json({ error: 'Booster não encontrado' });

        // Delete booster profile and user account
        await sql`DELETE FROM boosters WHERE id = ${id}`;
        await sql`DELETE FROM users WHERE id = ${booster.user_id}`;

        res.json({ message: 'Booster removido com sucesso' });
    } catch (err) {
        console.error('Delete booster error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/admin/orders — List all orders
router.get('/orders', async (req, res) => {
    try {
        const { status } = req.query;
        let orders;

        if (status) {
            orders = await sql`
                SELECT o.*, u.name as user_name, u.email as user_email,
                       b.game_name as booster_name
                FROM orders o
                LEFT JOIN users u ON u.id = o.user_id
                LEFT JOIN boosters b ON b.id = o.booster_id
                WHERE o.status = ${status}
                ORDER BY o.created_at DESC
            `;
        } else {
            orders = await sql`
                SELECT o.*, u.name as user_name, u.email as user_email,
                       b.game_name as booster_name
                FROM orders o
                LEFT JOIN users u ON u.id = o.user_id
                LEFT JOIN boosters b ON b.id = o.booster_id
                ORDER BY o.created_at DESC
            `;
        }

        res.json({ orders });
    } catch (err) {
        console.error('List orders error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PUT /api/admin/orders/:id/assign — Assign booster to order
router.put('/orders/:id/assign', async (req, res) => {
    try {
        const { id } = req.params;
        const { booster_id } = req.body;

        if (!booster_id) return res.status(400).json({ error: 'booster_id é obrigatório' });

        const [order] = await sql`
            UPDATE orders SET
                booster_id = ${booster_id},
                status = 'active',
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `;

        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
        res.json({ order });
    } catch (err) {
        console.error('Assign order error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PUT /api/admin/orders/:id/status — Update order status
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'active', 'in_progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Status inválido. Use: ${validStatuses.join(', ')}` });
        }

        const [order] = await sql`
            UPDATE orders SET status = ${status}, updated_at = NOW()
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

// GET /api/admin/stats — Dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const [usersCount] = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'user'`;
        const [boostersCount] = await sql`SELECT COUNT(*) as count FROM boosters WHERE active = true`;
        const [ordersCount] = await sql`SELECT COUNT(*) as count FROM orders`;
        const [pendingCount] = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`;
        const [revenue] = await sql`SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE status = 'completed'`;

        res.json({
            stats: {
                users: parseInt(usersCount.count),
                boosters: parseInt(boostersCount.count),
                orders: parseInt(ordersCount.count),
                pending: parseInt(pendingCount.count),
                revenue: parseFloat(revenue.total)
            }
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/admin/users — List all users
router.get('/users', async (req, res) => {
    try {
        const users = await sql`
            SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC
        `;
        res.json({ users });
    } catch (err) {
        console.error('List users error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
