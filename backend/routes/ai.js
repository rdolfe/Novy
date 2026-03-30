const express = require('express');
const ai      = require('../services/aiService');
const router  = express.Router();

// ── POST /api/ai/chat ──────────────────────────────────────
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim())
      return res.status(400).json({ error: 'Message vide.' });

    const reply = await ai.chat(history, message);
    res.json({ reply });
  } catch (err) {
    console.error('[ai/chat]', err);
    res.status(500).json({ error: 'Erreur IA. Réessaie dans un moment.' });
  }
});

// ── POST /api/ai/moderate ──────────────────────────────────
router.post('/moderate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Texte manquant.' });
    const result = await ai.moderate(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur modération.' });
  }
});

// ── POST /api/ai/summary — Generate profile summary ────────
router.post('/summary', async (req, res) => {
  try {
    const { name, role, skills = [], bio } = req.body;
    const prompt = `Génère un résumé de profil professionnel et inspirant en 2 phrases pour cet étudiant Ynov :
Nom: ${name}, Filière: ${role}, Compétences: ${skills.join(', ')}, Bio: ${bio || 'non renseignée'}.
Le résumé doit être en français, moderne, et donner envie de collaborer.`;
    const summary = await ai.chat([], prompt);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: 'Erreur génération.' });
  }
});

module.exports = router;
