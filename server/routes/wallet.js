// ========== WALLET ROUTES (booster) ==========
const express = require('express');
const sql = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação como booster ou admin
router.use(verifyToken, requireRole('booster', 'admin'));

// Helper: pega o booster_id a partir do user_id
async function getBoosterId(userId) {
    const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${userId}`;
    return booster ? booster.id : null;
}

// GET /api/wallet/balance — Saldo disponível, ganhos totais e saques pendentes
router.get('/balance', async (req, res) => {
    try {
        const boosterId = await getBoosterId(req.user.id);
        if (!boosterId) return res.status(404).json({ error: 'Perfil de booster não encontrado' });

        const [earned] = await sql`
            SELECT COALESCE(SUM(amount), 0) as total
            FROM booster_earnings
            WHERE booster_id = ${boosterId}
        `;

        const [withdrawn] = await sql`
            SELECT COALESCE(SUM(amount), 0) as total
            FROM withdrawal_requests
            WHERE booster_id = ${boosterId} AND status IN ('approved', 'pending')
        `;

        const [pending] = await sql`
            SELECT COALESCE(SUM(amount), 0) as total
            FROM withdrawal_requests
            WHERE booster_id = ${boosterId} AND status = 'pending'
        `;

        const totalEarned = parseFloat(earned.total);
        const totalWithdrawn = parseFloat(withdrawn.total);
        const totalPending = parseFloat(pending.total);
        const available = totalEarned - totalWithdrawn;

        res.json({
            balance: {
                available: available < 0 ? 0 : available,
                total_earned: totalEarned,
                total_pending: totalPending
            }
        });
    } catch (err) {
        console.error('Wallet balance error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/wallet/history — Histórico de saques
router.get('/history', async (req, res) => {
    try {
        const boosterId = await getBoosterId(req.user.id);
        if (!boosterId) return res.status(404).json({ error: 'Perfil de booster não encontrado' });

        const withdrawals = await sql`
            SELECT id, amount, status, admin_notes, created_at, processed_at
            FROM withdrawal_requests
            WHERE booster_id = ${boosterId}
            ORDER BY created_at DESC
        `;

        res.json({ withdrawals });
    } catch (err) {
        console.error('Wallet history error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/wallet/withdraw — Solicitar saque
router.post('/withdraw', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || parseFloat(amount) <= 0) {
            return res.status(400).json({ error: 'Valor inválido para saque' });
        }

        const boosterId = await getBoosterId(req.user.id);
        if (!boosterId) return res.status(404).json({ error: 'Perfil de booster não encontrado' });

        // Calcular saldo disponível
        const [earned] = await sql`
            SELECT COALESCE(SUM(amount), 0) as total FROM booster_earnings WHERE booster_id = ${boosterId}
        `;
        const [withdrawn] = await sql`
            SELECT COALESCE(SUM(amount), 0) as total FROM withdrawal_requests
            WHERE booster_id = ${boosterId} AND status IN ('approved', 'pending')
        `;

        const available = parseFloat(earned.total) - parseFloat(withdrawn.total);

        if (parseFloat(amount) > available) {
            return res.status(400).json({ error: `Saldo insuficiente. Disponível: R$ ${available.toFixed(2)}` });
        }

        const pixKey = req.body.pix_key ? req.body.pix_key.trim() : null;
        if (!pixKey) {
            return res.status(400).json({ error: 'Chave Pix é obrigatória' });
        }

        const [withdrawal] = await sql`
            INSERT INTO withdrawal_requests (booster_id, amount, pix_key)
            VALUES (${boosterId}, ${parseFloat(amount)}, ${pixKey})
            RETURNING *
        `;

        res.status(201).json({ withdrawal });
    } catch (err) {
        console.error('Withdraw request error:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
