const bcrypt = require('bcryptjs');
const pool   = require('../config/db');

/**
 * User model — OOP class wrapping MySQL queries
 */
class User {
  constructor(row) {
    this.id        = row.id;
    this.email     = row.email;
    this.name      = row.name;
    this.role      = row.role;
    this.bio       = row.bio;
    this.avatarSeed= row.avatar_seed;
    this.xp        = row.xp;
    this.createdAt = row.created_at;
  }

  // ── Static: Find by ID ─────────────────────────────────────
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] ? new User(rows[0]) : null;
  }

  // ── Static: Find by email ──────────────────────────────────
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null; // return raw row so password_hash is accessible
  }

  // ── Static: Create ─────────────────────────────────────────
  static async create({ email, password, name, role = 'Étudiant Ynov' }) {
    const hash = await bcrypt.hash(password, 10);
    const seed = name.split(' ')[0];
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, name, role, avatar_seed) VALUES (?, ?, ?, ?, ?)',
      [email, hash, name, role, seed]
    );
    return User.findById(result.insertId);
  }

  // ── Static: Verify password ────────────────────────────────
  static async verifyPassword(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }

  // ── Instance: Get skills ───────────────────────────────────
  async getSkills() {
    const [rows] = await pool.query('SELECT skill_name FROM user_skills WHERE user_id = ?', [this.id]);
    return rows.map(r => r.skill_name);
  }

  // ── Instance: Set skills ───────────────────────────────────
  async setSkills(skills = []) {
    await pool.query('DELETE FROM user_skills WHERE user_id = ?', [this.id]);
    if (skills.length === 0) return;
    const values = skills.map(s => [this.id, s]);
    await pool.query('INSERT INTO user_skills (user_id, skill_name) VALUES ?', [values]);
  }

  // ── Instance: Update profile ───────────────────────────────
  async update({ name, role, bio }) {
    await pool.query(
      'UPDATE users SET name = ?, role = ?, bio = ? WHERE id = ?',
      [name || this.name, role || this.role, bio ?? this.bio, this.id]
    );
    return User.findById(this.id);
  }

  // ── Instance: Serialize (safe, no password) ────────────────
  toJSON() {
    return {
      id:        this.id,
      email:     this.email,
      name:      this.name,
      role:      this.role,
      bio:       this.bio,
      avatarSeed:this.avatarSeed,
      xp:        this.xp,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
