const express = require('express');
const pool    = require('../config/db');
const router  = express.Router();

// ── GET /api/news ──────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news ORDER BY is_hot DESC, event_date ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('[news/GET]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
