const express  = require('express');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const router   = express.Router();

const SECRET = process.env.JWT_SECRET || 'novy_secret';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (userId) => jwt.sign({ id: userId }, SECRET, { expiresIn: EXPIRES });

// ── POST /api/auth/register ────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // ── Validation détaillée ────────────────────────────
    if (!name?.trim())
      return res.status(400).json({ error: 'Le nom est requis.', field: 'name' });

    if (name.trim().length < 2)
      return res.status(400).json({ error: 'Le nom doit contenir au moins 2 caractères.', field: 'name' });

    if (!email?.trim())
      return res.status(400).json({ error: 'L\'email est requis.', field: 'email' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: 'Format d\'email invalide (ex: prenom.nom@ynov.com).', field: 'email' });

    if (!password)
      return res.status(400).json({ error: 'Le mot de passe est requis.', field: 'password' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Mot de passe trop court — minimum 6 caractères.', field: 'password' });

    if (!/[A-Z]/.test(password) && !/[0-9]/.test(password))
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins une majuscule ou un chiffre.', field: 'password' });

    // ── Vérification email unique ───────────────────────
    const existing = await User.findByEmail(email.toLowerCase());
    if (existing)
      return res.status(409).json({ error: 'Cet email est déjà utilisé. Tu as peut-être déjà un compte ?', field: 'email' });

    const user = await User.create({ email: email.toLowerCase(), password, name: name.trim(), role });
    const token = signToken(user.id);

    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('[auth/register]', err);
    res.status(500).json({ error: 'Erreur serveur. Réessaie dans un instant.' });
  }
});


// ── POST /api/auth/login ───────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email et mot de passe requis.' });

    const row = await User.findByEmail(email.toLowerCase());
    if (!row)
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const valid = await User.verifyPassword(password, row.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const user = new User(row);
    const token = signToken(user.id);

    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── GET /api/auth/me ───────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Token manquant.' });

    const payload = jwt.verify(auth.slice(7), SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    const skills = await user.getSkills();
    res.json({ user: { ...user.toJSON(), skills } });
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
});

// ── PATCH /api/auth/profile ────────────────────────────────
router.patch('/profile', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Token manquant.' });

    const payload = jwt.verify(auth.slice(7), SECRET);
    const { name, role, bio, skills = [] } = req.body;

    const pool = require('../config/db');

    // Mise à jour des infos de base
    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), role = COALESCE(?, role), bio = COALESCE(?, bio) WHERE id = ?',
      [name || null, role || null, bio !== undefined ? bio : null, payload.id]
    );

    // Mise à jour des compétences
    if (Array.isArray(skills)) {
      await pool.query('DELETE FROM user_skills WHERE user_id = ?', [payload.id]);
      if (skills.length > 0) {
        const rows = skills.map(s => [payload.id, s]);
        await pool.query('INSERT IGNORE INTO user_skills (user_id, skill_name) VALUES ?', [rows]);
      }
    }

    // Retourne l'utilisateur mis à jour
    const user = await User.findById(payload.id);
    const updatedSkills = await user.getSkills();
    const userData = { ...user.toJSON(), skills: updatedSkills };

    // Met à jour aussi le localStorage côté client via la réponse
    res.json({ user: userData });
  } catch (err) {
    console.error('[auth/profile PATCH]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;

