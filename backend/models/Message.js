const pool = require('../config/db');

/**
 * Message model — OOP class
 */
class Message {
  constructor(row) {
    this.id         = row.id;
    this.senderId   = row.sender_id;
    this.receiverId = row.receiver_id;
    this.content    = row.content;
    this.isRead     = row.is_read;
    this.createdAt  = row.created_at;
    // Join fields
    this.senderName    = row.sender_name;
    this.senderAvatar  = row.sender_avatar;
    this.receiverName  = row.receiver_name;
    this.receiverAvatar= row.receiver_avatar;
  }

  // ── Static: Get conversation ───────────────────────────────
  static async getConversation(userA, userB, { limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.query(`
      SELECT m.*,
             s.name AS sender_name,   s.avatar_seed AS sender_avatar,
             r.name AS receiver_name, r.avatar_seed AS receiver_avatar
      FROM messages m
      JOIN users s ON s.id = m.sender_id
      JOIN users r ON r.id = m.receiver_id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
      LIMIT ? OFFSET ?
    `, [userA, userB, userB, userA, limit, offset]);
    return rows.map(r => new Message(r));
  }

  // ── Static: Get conversation list for user ─────────────────
  static async getConversationList(userId) {
    const [rows] = await pool.query(`
      SELECT DISTINCT
        other.id, other.name, other.role, other.avatar_seed,
        (SELECT content FROM messages
         WHERE (sender_id = ? AND receiver_id = other.id)
            OR (sender_id = other.id AND receiver_id = ?)
         ORDER BY created_at DESC LIMIT 1) AS last_message,
        (SELECT COUNT(*) FROM messages
         WHERE receiver_id = ? AND sender_id = other.id AND is_read = 0) AS unread
      FROM users other
      WHERE other.id IN (
        SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
      )
    `, [userId, userId, userId, userId, userId, userId]);
    return rows;
  }

  // ── Static: Send ──────────────────────────────────────────
  static async send({ senderId, receiverId, content }) {
    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [senderId, receiverId, content]
    );
    const [rows] = await pool.query(`
      SELECT m.*, s.name AS sender_name, s.avatar_seed AS sender_avatar,
             r.name AS receiver_name, r.avatar_seed AS receiver_avatar
      FROM messages m
      JOIN users s ON s.id = m.sender_id
      JOIN users r ON r.id = m.receiver_id
      WHERE m.id = ?
    `, [result.insertId]);
    return new Message(rows[0]);
  }

  // ── Static: Mark as read ───────────────────────────────────
  static async markRead(senderId, receiverId) {
    await pool.query(
      'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
      [senderId, receiverId]
    );
  }

  toJSON() {
    return {
      id: this.id, senderId: this.senderId, receiverId: this.receiverId,
      content: this.content, isRead: this.isRead, createdAt: this.createdAt,
      senderName: this.senderName, senderAvatar: this.senderAvatar,
      receiverName: this.receiverName, receiverAvatar: this.receiverAvatar,
    };
  }
}

module.exports = Message;
