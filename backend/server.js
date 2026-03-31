require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pool = require('./config/db');

// ── Express App ───────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/news', require('./routes/news'));
app.use('/api/ai', require('./routes/ai'));

// ── Health check ─────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', version: '1.0.0', env: process.env.NODE_ENV });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// ── 404 ───────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route introuvable.' }));

// ── Error handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Novy API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Env   : ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
