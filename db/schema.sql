-- ══════════════════════════════════════════════════════
-- NOVY — Campus Social Network
-- MySQL / MariaDB Schema v1.0
-- Compatible XAMPP / MariaDB 10.4+
-- ══════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS novy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE novy;

SET FOREIGN_KEY_CHECKS = 0;

-- ── Users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)     NOT NULL,
  password_hash VARCHAR(255)     NOT NULL,
  name          VARCHAR(120)     NOT NULL,
  role          VARCHAR(120)     DEFAULT 'Etudiant Ynov',
  bio           TEXT,
  avatar_seed   VARCHAR(60)      DEFAULT NULL,
  xp            SMALLINT UNSIGNED DEFAULT 0,
  created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Skills ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_skills (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  skill_name VARCHAR(80)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_skill (user_id, skill_name),
  CONSTRAINT fk_skills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Posts ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id         INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED     NOT NULL,
  content    TEXT             NOT NULL,
  image_url  VARCHAR(512)     DEFAULT NULL,
  created_at TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id),
  KEY idx_created_at (created_at),
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Post Tags ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_tags (
  id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id  INT UNSIGNED NOT NULL,
  tag_name VARCHAR(60)  NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_tags_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Likes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_likes (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id    INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_like (post_id, user_id),
  CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Comments ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id    INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NOT NULL,
  content    TEXT         NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_post_id (post_id),
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Messages ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sender_id   INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  content     TEXT         NOT NULL,
  is_read     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_conv (sender_id, receiver_id),
  KEY idx_created (created_at),
  CONSTRAINT fk_msg_sender   FOREIGN KEY (sender_id)   REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── News Items ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  category     VARCHAR(30)  NOT NULL DEFAULT 'Autre',
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  emoji        VARCHAR(10)  DEFAULT '!',
  event_date   DATE,
  participants INT UNSIGNED DEFAULT 0,
  is_hot       TINYINT(1)   DEFAULT 0,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Badges ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_badges (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  badge_icon VARCHAR(10)  NOT NULL,
  badge_name VARCHAR(80)  NOT NULL,
  earned_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_badges_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Follows ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  follower_id INT UNSIGNED NOT NULL,
  followed_id INT UNSIGNED NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_follow (follower_id, followed_id),
  CONSTRAINT fk_follow_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_follow_followed FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ══════════════════════════════════════════════════════
-- Seed Data
-- ══════════════════════════════════════════════════════

INSERT IGNORE INTO users (email, password_hash, name, role, bio, avatar_seed, xp) VALUES
('alex.dupont@ynov.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alex Dupont',   'CyberSecurite B2', 'Passionne de CTF et de reverse engineering', 'Alex',   85),
('emma.bernard@ynov.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Emma Bernard',  'DevOps Intervenante', 'DevOps engineer, fan de Kubernetes', 'Emma',   92),
('karim.ndiaye@ynov.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Karim Ndiaye',  'Developpeur B1', 'Je code, je breakdance, parfois les deux', 'Karim',  45),
('sophie.martin@ynov.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sophie Martin', 'IA & Data B2', 'ML engineer en devenir, passionnee par les transformers', 'Sophie', 72);

INSERT IGNORE INTO news (category, title, description, emoji, event_date, participants, is_hot) VALUES
('Evenement', 'Challenge 48H Paris Ynov Campus', 'Creez le reseau social du campus en equipe de 4 !', '!', '2026-03-31', 120, 1),
('BDS', 'Tournoi de Football inter-promos', 'Le BDS organise son premier tournoi de foot.', 'o', '2026-04-05', 64, 0),
('BDE', 'Soiree Networking & Portfolio', 'Soiree dediee au networking et a la presentation de portfolios.', '*', '2026-04-12', 200, 1),
('Pedagogie', 'Conference IA & Ethique', 'Conference ouverte sur IA responsable.', '?', '2026-04-18', 150, 0);

INSERT IGNORE INTO posts (user_id, content) VALUES
(1, 'Super workshop sur la cybersecurite aujourd hui ! On a appris a cracker des hashes MD5 en live. Si vous voulez apprendre, venez me voir !'),
(2, 'Nouveau pipeline CI/CD en place pour notre projet de fin dannee. GitHub Actions + Docker = bonheur total.'),
(3, 'Je cherche des colocs pour le Challenge 48H ! On cherche un designer et un dev back. DM moi !'),
(4, 'Mon modele de recommandation de stages vient d atteindre 87% de precision. Prochain objectif : 90% !');

INSERT IGNORE INTO user_skills (user_id, skill_name) VALUES
(1, 'Python'), (1, 'Kali Linux'), (1, 'CTF'),
(2, 'Docker'), (2, 'Kubernetes'), (2, 'CI/CD'),
(3, 'React'), (3, 'Node.js'), (3, 'MongoDB'),
(4, 'Python'), (4, 'TensorFlow'), (4, 'Data Science');
