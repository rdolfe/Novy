const express = require('express');
const jwt     = require('jsonwebtoken');
const Post    = require('../models/Post');
const ai      = require('../services/aiService');
const router  = express.Router();

// ── JWT middleware ─────────────────────────────────────────
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Authentification requise.' });
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'novy_secret');
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide.' });
  }
};

// ── GET /api/posts — Feed ──────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const userId = req.headers.authorization
      ? jwt.verify(req.headers.authorization.slice(7), process.env.JWT_SECRET || 'novy_secret').id
      : null;
    const posts = await Post.getFeed({ limit: +limit, offset: +offset, currentUserId: userId });
    res.json(posts.map(p => p.toJSON()));
  } catch (err) {
    console.error('[posts/GET]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── POST /api/posts — Create post ─────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { content, imageUrl, tags = [] } = req.body;
    if (!content?.trim())
      return res.status(400).json({ error: 'Le contenu est requis.' });

    // AI moderation
    const mod = await ai.moderate(content).catch(() => ({ safe: true }));
    if (!mod.safe)
      return res.status(422).json({ error: `Contenu non approprié : ${mod.reason}` });

    const post = await Post.create({ userId: req.user.id, content, imageUrl, tags });
    res.status(201).json(post.toJSON());
  } catch (err) {
    console.error('[posts/POST]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── DELETE /api/posts/:id ──────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const ok = await Post.delete(+req.params.id, req.user.id);
    if (!ok) return res.status(403).json({ error: 'Impossible de supprimer ce post.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── POST /api/posts/:id/like — Toggle like ─────────────────
router.post('/:id/like', auth, async (req, res) => {
  try {
    const result = await Post.toggleLike(+req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
