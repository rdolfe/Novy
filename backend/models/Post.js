const pool = require('../config/db');

/**
 * Post model — OOP class
 */
class Post {
  constructor(row) {
    this.id        = row.id;
    this.userId    = row.user_id;
    this.content   = row.content;
    this.imageUrl  = row.image_url;
    this.likes     = row.likes     ?? 0;
    this.comments  = row.comments  ?? 0;
    this.author    = row.author_name;
    this.role      = row.author_role;
    this.avatarSeed= row.avatar_seed;
    this.tags      = row.tags ? row.tags.split(',').filter(Boolean) : [];
    this.liked     = !!(row.liked);
    this.createdAt = row.created_at;
  }

  // ── Static: Get feed ───────────────────────────────────────
  static async getFeed({ limit = 20, offset = 0, currentUserId = null } = {}) {
    const [rows] = await pool.query(`
      SELECT
        p.id, p.user_id, p.content, p.image_url, p.created_at,
        u.name  AS author_name,
        u.role  AS author_role,
        u.avatar_seed,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
        (SELECT COUNT(*) FROM comments   WHERE post_id = p.id) AS comments,
        GROUP_CONCAT(DISTINCT pt.tag_name) AS tags,
        ${currentUserId
          ? '(SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ?) AS liked'
          : '0 AS liked'
        }
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, currentUserId ? [currentUserId, limit, offset] : [limit, offset]);

    return rows.map(r => new Post(r));
  }

  // ── Static: Create ─────────────────────────────────────────
  static async create({ userId, content, imageUrl, tags = [] }) {
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
      [userId, content, imageUrl || null]
    );
    const postId = result.insertId;
    if (tags.length) {
      const vals = tags.map(t => [postId, t]);
      await pool.query('INSERT INTO post_tags (post_id, tag_name) VALUES ?', [vals]);
    }
    // Award XP
    await pool.query('UPDATE users SET xp = LEAST(xp + 5, 100) WHERE id = ?', [userId]);
    const [rows] = await pool.query(`
      SELECT p.*, u.name AS author_name, u.role AS author_role, u.avatar_seed,
             0 AS likes, 0 AS comments, NULL AS tags, 0 AS liked
      FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?
    `, [postId]);
    return new Post(rows[0]);
  }

  // ── Static: Delete ─────────────────────────────────────────
  static async delete(postId, userId) {
    const [r] = await pool.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
    return r.affectedRows > 0;
  }

  // ── Static: Toggle like ────────────────────────────────────
  static async toggleLike(postId, userId) {
    const [existing] = await pool.query(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]
    );
    if (existing.length) {
      await pool.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
      // Deduct XP from post owner
      await pool.query(`
        UPDATE users SET xp = GREATEST(xp - 1, 0)
        WHERE id = (SELECT user_id FROM posts WHERE id = ?)
      `, [postId]);
      return { liked: false };
    }
    await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
    // Award XP to post owner
    await pool.query(`
      UPDATE users SET xp = LEAST(xp + 2, 100)
      WHERE id = (SELECT user_id FROM posts WHERE id = ?)
    `, [postId]);
    return { liked: true };
  }

  toJSON() {
    return {
      id: this.id, userId: this.userId, content: this.content,
      imageUrl: this.imageUrl, likes: this.likes, comments: this.comments,
      author: this.author, role: this.role, avatarSeed: this.avatarSeed,
      tags: this.tags, liked: this.liked, createdAt: this.createdAt,
    };
  }
}

module.exports = Post;
