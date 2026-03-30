import { useState } from 'react';
import { apiCreatePost } from '../api';

const PostModal = ({ isOpen, onClose, onAddPost }) => {
  const [content, setContent] = useState('');
  const [tag, setTag]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const user = (() => { try { return JSON.parse(localStorage.getItem('novy_user')); } catch { return null; } })();

  if (!isOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    try {
      const post = await apiCreatePost({ content, tags: tag ? [tag] : [] });
      onAddPost(post); // post vient du backend avec vrai ID
    } catch (err) {
      setError(err.message || 'Erreur lors de la publication.');
    } finally {
      setLoading(false);
      setContent('');
      setTag('');
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 540,
        background: 'var(--bg-800)',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: 'var(--radius-xl)', padding: '2rem',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.12)',
        animation: 'fadeUp 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <div style={{ padding: 2.5, background: 'conic-gradient(#7c3aed, #d946ef, #06b6d4, #7c3aed)', borderRadius: '50%' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Novy'}&backgroundColor=b6e3f4`} alt="me"
              style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--bg-800)', display: 'block' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{user?.name || 'Moi'}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Partager avec la communauté Novy ✨</p>
          </div>
          <button onClick={onClose} style={{
            marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', border: 'none',
            color: 'rgba(255,255,255,0.5)', width: 32, height: 32, borderRadius: 'var(--radius-full)',
            cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {error && <p style={{ color: '#fca5a5', fontSize: '0.82rem', marginBottom: 10 }}>⚠️ {error}</p>}

        <form onSubmit={submit}>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Quoi de neuf ? Partage un projet, un event, une question… 🚀"
            rows={5} className="input"
            style={{ resize: 'vertical', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', lineHeight: 1.6 }}
          />
          <input className="input" value={tag} onChange={e => setTag(e.target.value)}
            placeholder="Tag (optionnel — ex: React, CTF, IA…)"
            style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}>
              Annuler
            </button>
            <button type="submit" className="btn btn-brand" disabled={loading || !content.trim()}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.55rem 1.4rem', fontSize: '0.88rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Publication…' : '✦ Publier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
