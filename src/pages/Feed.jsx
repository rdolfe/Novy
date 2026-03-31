import { useState, useEffect } from 'react';
import PostModal from '../components/PostModal';
import UserProfileModal from '../components/UserProfileModal';
import { apiFeed, apiLikePost } from '../api';

// ── Données Feed ──────────────────────────────────────────
const AVATARS = {
  'Alex Dupont':   'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
  'Emma Bernard':  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=ffd5dc',
  'Karim Ndiaye':  'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim&backgroundColor=d1f4cc',
  'Sophie Martin': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=c0aede',
};

const STORIES = [
  { name: 'Alex',   seed: 'Alex',   bg: '#b6e3f4', hasUpdate: true  },
  { name: 'Emma',   seed: 'Emma',   bg: '#ffd5dc', hasUpdate: true  },
  { name: 'Karim',  seed: 'Karim',  bg: '#d1f4cc', hasUpdate: false },
  { name: 'Sophie', seed: 'Sophie', bg: '#c0aede', hasUpdate: true  },
  { name: 'Lucas',  seed: 'Lucas',  bg: '#b6e3f4', hasUpdate: false },
  { name: 'Léa',    seed: 'Lea',    bg: '#ffd5dc', hasUpdate: true  },
];

const initPosts = [
  {
    id: 1, author: 'Alex Dupont', role: 'CyberSécurité • B2',
    content: '🔐 On vient de finir notre write-up sur le challenge CTF "Phantom" — 72h de hacking non-stop. Une expérience de ouf ! Quelqu\'un d\'autre a participé ?',
    time: 'Il y a 3h', likes: 47, comments: 12, liked: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    tags: ['CTF', 'CyberSec'],
  },
  {
    id: 2, author: 'Emma Bernard', role: 'DevOps • Intervenante',
    content: '🎨 Besoin de retours sur mes maquettes Figma pour le projet Ynov ! L\'UX du dashboard a été entièrement repensée. Volontaires pour un test utilisateur ? 👇',
    time: 'Il y a 5h', likes: 31, comments: 8, liked: false,
    tags: ['UX', 'Figma', 'Design'],
  },
  {
    id: 3, author: 'Sophie Martin', role: 'IA & Data • B2',
    content: '🤖 Notre modèle de détection d\'anomalies atteint 94% de précision après fine-tuning sur les données du campus. Prochain step : déploiement sur les serveurs Ynov 🚀',
    time: 'Hier', likes: 89, comments: 21, liked: true,
    tags: ['IA', 'ML', 'Python'],
  },
];

// ── Données News Ynov ──────────────────────────────────────
const NEWS_ITEMS = [
  {
    id: 1, category: 'Événement', emoji: '🎯', badgeCls: 'badge-violet', hot: true,
    title: 'Challenge 48H — Ynov Campus',
    date: '30–31 Mars', participants: 120,
    desc: 'Créez le réseau social du campus en 48h !',
  },
  {
    id: 2, category: 'BDS', emoji: '⚽', badgeCls: 'badge-cyan',
    title: 'Tournoi Football inter-promos',
    date: '5 Avril', participants: 64,
    desc: '8 équipes en compétition, inscriptions ouvertes !',
  },
  {
    id: 3, category: 'BDE', emoji: '🎉', badgeCls: 'badge-pink', hot: true,
    title: 'Soirée Networking & Portfolio',
    date: '12 Avril', participants: 200,
    desc: 'Entreprises partenaires présentes. Dress-code smart casual.',
  },
  {
    id: 4, category: 'Pédagogie', emoji: '🧠', badgeCls: 'badge-gold',
    title: 'Conférence IA & Éthique',
    date: '18 Avril', participants: 150,
    desc: 'Animée par des chercheurs del\'INRIA — ouvert à tous.',
  },
];

// ── Composant PostCard ────────────────────────────────────
const PostCard = ({ post, onUserClick }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [anim, setAnim] = useState(false);

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikes(l => l + (next ? 1 : -1));
    setAnim(true);
    setTimeout(() => setAnim(false), 400);
  };

  const avatar = AVATARS[post.author] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}&backgroundColor=b6e3f4`;

  return (
    <div className="fade-up" style={{
      background: 'var(--bg-800)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(124,58,237,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem 0.75rem' }}>
        <div 
          onClick={() => onUserClick && onUserClick(post)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 8px', borderRadius: 'var(--radius-lg)', marginLeft: '-8px', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div className="story-ring" style={{ width: 44, height: 44 }}>
            <img src={avatar} alt={post.author} className="avatar" style={{ width: '100%', height: '100%' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', margin: 0 }}>{post.author}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--novy-violet-light)', fontStyle: 'italic', margin: 0 }}>{post.role}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {post.tags?.map(t => (
            <span key={t} style={{
              fontSize: '0.68rem', fontWeight: 700, padding: '0.18rem 0.55rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(124,58,237,0.15)', color: 'var(--novy-violet-light)',
              border: '1px solid rgba(124,58,237,0.25)',
            }}>{t}</span>
          ))}
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{post.time}</span>
        </div>
      </div>

      <div style={{ padding: '0 1.25rem 0.75rem' }}>
        <p style={{ lineHeight: 1.65, color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{post.content}</p>
      </div>

      {post.image && (
        <div style={{ overflow: 'hidden', maxHeight: 260 }}>
          <img src={post.image} alt="post" style={{ width: '100%', objectFit: 'cover', maxHeight: 260, display: 'block', transition: 'transform 0.3s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        </div>
      )}

      <div style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={handleLike} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
          background: liked ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)',
          color: liked ? '#ef4444' : 'rgba(255,255,255,0.5)',
          fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font)',
          transition: 'all 0.2s ease',
        }}>
          <span className={anim ? 'like-active' : ''} style={{ fontSize: '1.1rem', display: 'block' }}>
            {liked ? '❤️' : '🤍'}
          </span>
          {likes}
        </button>

        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
          fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font)', transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          💬 {post.comments}
        </button>

        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
          fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font)',
          marginLeft: 'auto', transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          ↗ Partager
        </button>
      </div>
    </div>
  );
};

// ── Composant NewsSidebar ─────────────────────────────────
const NewsSidebar = () => (
  <div style={{
    background: 'var(--bg-800)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    position: 'sticky',
    top: '80px',
  }}>
    {/* Header */}
    <div style={{
      padding: '1rem 1.1rem 0.75rem',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ fontSize: '1.1rem' }}>📣</span>
      <div>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          Actualités <span className="glow-text">Ynov</span>
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          Événements du campus
        </p>
      </div>
    </div>

    {/* News list */}
    <div style={{ padding: '0.5rem 0' }}>
      {NEWS_ITEMS.map((item, i) => (
        <div key={item.id} style={{
          padding: '0.85rem 1.1rem',
          borderBottom: i < NEWS_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            {/* Emoji icon */}
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
            }}>
              {item.emoji}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3, flexWrap: 'wrap' }}>
                <span className={`badge ${item.badgeCls}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.45rem' }}>
                  {item.category}
                </span>
                {item.hot && (
                  <span className="badge badge-gold" style={{ fontSize: '0.62rem', padding: '0.1rem 0.45rem' }}>
                    🔥 En cours
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', margin: '0 0 2px', lineHeight: 1.3 }}>
                {item.title}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                📅 {item.date} · 👥 {item.participants}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Footer link */}
    <div style={{ padding: '0.75rem 1.1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <a href="/news" style={{
        display: 'block', textAlign: 'center',
        fontSize: '0.78rem', color: 'var(--novy-violet-light)',
        fontWeight: 600, textDecoration: 'none',
      }}>
        Voir toutes les actualités →
      </a>
    </div>
  </div>
);

// ── Page Feed ─────────────────────────────────────────────
const Feed = () => {
  const [posts, setPosts]             = useState([]);
  const [modalOpen, setModalOpen]     = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [profileUser, setProfileUser] = useState(null);

  // Infos de l'utilisateur connecté
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('novy_user')); } catch { return null; }
  })();

  // ── Chargement des posts depuis la BDD ──────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFeed();
        // data est un tableau de posts du backend
        setPosts(data.map(p => ({
          id:           p.id,
          author:       p.authorName || p.author || 'Anonyme',
          userId:       p.userId     || null,
          role:         p.authorRole || p.role   || 'Étudiant Ynov',
          content:      p.content,
          time:         p.time || new Date(p.createdAt || p.created_at).toLocaleDateString('fr-FR'),
          likes:        p.likesCount  ?? p.likes    ?? 0,
          comments:     p.commentsCount ?? p.comments ?? 0,
          liked:        p.likedByMe   ?? p.liked    ?? false,
          image:        p.imageUrl    ?? p.image    ?? null,
          tags:         p.tags        || [],
          authorAvatar: p.avatarUrl   || null,
          seed:         p.authorSeed  || p.author,
        })));
      } catch (err) {
        console.warn('[Feed] Erreur API, données offline:', err.message);
        // Fallback : données statiques si l'API échoue
        setPosts(initPosts);
      } finally {
        setLoadingFeed(false);
      }
    };
    load();
  }, []);

  // ── Like toggleé via API ─────────────────────────────────
  const handleLikeFromFeed = async (postId, currentlyLiked) => {
    try {
      await apiLikePost(postId);
    } catch (err) {
      console.warn('[Like] Erreur:', err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── LEFT: Feed ─────────────────────────────── */}
        <div>
          {/* Stories */}
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
            {STORIES.map(s => (
              <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 }}>
                <div style={{
                  padding: 2.5, borderRadius: '50%',
                  background: s.hasUpdate ? 'conic-gradient(#7c3aed, #d946ef, #06b6d4, #7c3aed)' : 'var(--bg-600)',
                }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.seed}&backgroundColor=${s.bg.slice(1)}`}
                    alt={s.name} style={{ width: 52, height: 52, borderRadius: '50%', border: '2.5px solid #0d0e12', display: 'block' }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{s.name}</span>
              </div>
            ))}
          </div>

          {/* Barre "créer un post" */}
          <div style={{
            background: 'var(--bg-800)', border: '1px solid rgba(124,58,237,0.15)',
            borderRadius: 'var(--radius-lg)', padding: '0.9rem 1.1rem',
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: '1.5rem', cursor: 'pointer', transition: 'border-color 0.25s',
          }}
            onClick={() => setModalOpen(true)}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.45)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)'}
          >
            <div style={{ padding: 2, borderRadius: '50%', background: 'conic-gradient(#7c3aed, #d946ef, #06b6d4, #7c3aed)' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'Novy'}&backgroundColor=b6e3f4`}
                alt="me" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #0d0e12', display: 'block' }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', flex: 1 }}>
              Quoi de neuf sur le campus ? ✨
            </span>
            <button className="btn btn-brand" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)' }}>
              Publier
            </button>
          </div>

          {/* Liste des posts */}
          {loadingFeed ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
              Chargement du fil…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {posts.map((p, i) => (
                <div key={p.id} style={{ animationDelay: `${i * 0.06}s` }}>
                  <PostCard 
                    post={p} 
                    onLikeApi={handleLikeFromFeed} 
                    onUserClick={(post) => setProfileUser({ id: post.userId || Date.now(), name: post.author, role: post.role, seed: post.seed })}
                  />
                </div>
              ))}
              {posts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
                  Aucun post pour l'instant. Sois le premier !
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: News Ynov sidebar ───────────────── */}
        <NewsSidebar />
      </div>

      <PostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddPost={p => {
          // Le post vient du backend (déjà sauvegardé) ou local en fallback
          const normalized = {
            id:       p.id || Date.now(),
            author:   p.authorName || currentUser?.name || 'Moi',
            userId:   p.userId     || currentUser?.id   || null,
            role:     p.authorRole || currentUser?.role  || 'Étudiant Ynov',
            content:  p.content,
            time:     'À l\'instant',
            likes:    0,
            comments: 0,
            liked:    false,
            image:    p.imageUrl || null,
            tags:     p.tags     || [],
            authorAvatar: currentUser?.avatarUrl || null,
            seed:     currentUser?.avatarSeed || currentUser?.name || 'Novy'
          };
          setPosts(prev => [normalized, ...prev]);
          setModalOpen(false);
        }}
      />

      <UserProfileModal 
        user={profileUser}
        isOpen={!!profileUser}
        onClose={() => setProfileUser(null)}
      />
    </div>
  );
};

export default Feed;
