// ========== BOOSTERS ROUTES (public) ==========
const express = require('express');
const sql = require('../config/db');

const router = express.Router();

// GET /api/boosters — Public list of active boosters
router.get('/', async (req, res) => {
    try {
        const boosters = await sql`
            SELECT b.id, b.game_name, b.rank, b.win_rate, b.games_played, b.avatar_emoji
            FROM boosters b
            WHERE b.active = true
            ORDER BY b.win_rate DESC
        `;
        res.json({ boosters });
    } catch (err) {
        console.error('List boosters error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/boosters/:id — Single booster profile
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [booster] = await sql`
            SELECT b.id, b.game_name, b.rank, b.win_rate, b.games_played, b.avatar_emoji,
                   u.name, b.created_at
            FROM boosters b
            JOIN users u ON u.id = b.user_id
            WHERE b.id = ${id} AND b.active = true
        `;
        if (!booster) return res.status(404).json({ error: 'Booster não encontrado' });
        res.json({ booster });
    } catch (err) {
        console.error('Get booster error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
