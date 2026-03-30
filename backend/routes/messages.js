const express = require('express');
const jwt     = require('jsonwebtoken');
const Message = require('../models/Message');
const router  = express.Router();

const auth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Auth requise.' });
  try { req.user = jwt.verify(h.slice(7), process.env.JWT_SECRET || 'novy_secret'); next(); }
  catch { res.status(401).json({ error: 'Token invalide.' }); }
};

// ── GET /api/messages — Conversation list ─────────────────
router.get('/', auth, async (req, res) => {
  try {
    const list = await Message.getConversationList(req.user.id);
    res.json(list);
  } catch (err) {
    console.error('[messages/GET]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── GET /api/messages/:userId — Single conversation ────────
router.get('/:userId', auth, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const msgs = await Message.getConversation(req.user.id, +req.params.userId, { limit: +limit, offset: +offset });
    // Mark as read
    await Message.markRead(+req.params.userId, req.user.id);
    res.json(msgs.map(m => m.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── POST /api/messages/:userId — Send message ──────────────
router.post('/:userId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Contenu vide.' });
    const msg = await Message.send({ senderId: req.user.id, receiverId: +req.params.userId, content });
    res.status(201).json(msg.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
