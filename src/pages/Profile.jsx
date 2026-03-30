import { useState, useEffect } from 'react';
import { apiMe, apiUpdateProfile } from '../api';

const SKILL_META = {
  React:      { icon: '⚛️', color: '#61dafb' },
  'Node.js':  { icon: '🟢', color: '#68a063' },
  Python:     { icon: '🐍', color: '#3572a5' },
  Docker:     { icon: '🐳', color: '#2496ed' },
  Figma:      { icon: '🎨', color: '#f24e1e' },
  SQL:        { icon: '🗃️', color: '#336791' },
  CyberSec:   { icon: '🔐', color: '#ef4444' },
  TypeScript: { icon: '🔷', color: '#3178c6' },
  'C++':      { icon: '⚙️', color: '#a8b9cc' },
  Java:       { icon: '☕', color: '#f89820' },
};
const ALL_SKILLS = Object.keys(SKILL_META);

const BADGES = [
  { icon: '🏆', label: 'Top Contributeur', color: 'var(--novy-gold)'         },
  { icon: '⚡', label: 'Fast Learner',      color: 'var(--novy-cyan)'         },
  { icon: '🎯', label: 'Projet Leader',     color: 'var(--novy-violet-light)' },
];

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(null);

  // ─── Chargement des données réelles depuis la BDD ───────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // 1. Charge immédiatement depuis localStorage (pas de flash)
        const cached = JSON.parse(localStorage.getItem('novy_user') || '{}');
        if (cached?.name) {
          setProfile({ ...cached, skills: cached.skills || [] });
        }
        // 2. Rafraîchit depuis l'API (données à jour)
        const data = await apiMe();
        const user = { ...data.user, skills: data.user.skills || [] };
        setProfile(user);
        // Met à jour le cache localStorage
        localStorage.setItem('novy_user', JSON.stringify(user));
      } catch (err) {
        console.error('[Profile] Erreur chargement:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const startEdit = () => {
    setDraft({ ...profile });
    setEdit(true);
    setSaveMsg('');
  };

  const cancelEdit = () => {
    setEdit(false);
    setSaveMsg('');
  };

  // ─── Sauvegarde en BDD ───────────────────────────────────
  const save = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const data = await apiUpdateProfile({
        name:   draft.name,
        role:   draft.role,
        bio:    draft.bio,
        skills: draft.skills,
      });
      const updated = { ...data.user, skills: data.user.skills || draft.skills };
      setProfile(updated);
      // Sync localStorage pour que le Header affiche le bon prénom
      localStorage.setItem('novy_user', JSON.stringify(updated));
      setEdit(false);
      setSaveMsg('✅ Profil sauvegardé !');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (s) => {
    setDraft(d => ({
      ...d,
      skills: d.skills.includes(s)
        ? d.skills.filter(x => x !== s)
        : [...d.skills, s],
    }));
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
        Chargement du profil…
      </div>
    </div>
  );

  if (!profile) return null;

  const cur = edit ? draft : profile;
  const avatarSeed = profile.avatarSeed || profile.name?.replace(' ', '') || 'Novy';
  const avatarUrl  = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4`;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>

      {/* Banner */}
      <div style={{
        height: 200, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        background: 'linear-gradient(135deg, #1e1333 0%, #2d1155 40%, #1a2a4a 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)' }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
          {BADGES.map(b => (
            <div key={b.label} title={b.label} style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
              border: `1px solid ${b.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', boxShadow: `0 0 10px ${b.color}40`,
            }}>{b.icon}</div>
          ))}
        </div>

        {/* Email affiché dans la bannière */}
        <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', background: 'rgba(0,0,0,0.3)', padding: '3px 10px', borderRadius: 99 }}>
            {profile.email}
          </span>
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: 'var(--bg-800)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
        padding: '0 1.75rem 1.75rem',
        position: 'relative',
      }}>
        {/* Avatar + boutons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div style={{ marginTop: -52 }}>
            <div style={{ padding: 3, background: 'conic-gradient(#7c3aed, #d946ef, #06b6d4, #7c3aed)', borderRadius: '50%', display: 'inline-block' }}>
              <img src={avatarUrl} alt="avatar"
                style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid var(--bg-800)', display: 'block' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: '0.5rem' }}>
            {saveMsg && <span style={{ fontSize: '0.82rem', color: saveMsg.startsWith('✅') ? 'var(--novy-green)' : '#fca5a5' }}>{saveMsg}</span>}
            <button onClick={edit ? save : startEdit}
              className="btn btn-brand" style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem', opacity: saving ? 0.7 : 1 }}
              disabled={saving}>
              {saving ? '⏳ Sauvegarde…' : edit ? '✓ Sauvegarder' : '✏️ Modifier'}
            </button>
            {edit && (
              <button onClick={cancelEdit} className="btn btn-ghost" style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}>
                Annuler
              </button>
            )}
          </div>
        </div>

        {/* Nom & rôle */}
        {edit ? (
          <>
            <input className="input" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })}
              style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }} placeholder="Ton prénom et nom" />
            <input className="input" value={draft.role || ''} onChange={e => setDraft({ ...draft, role: e.target.value })}
              style={{ fontSize: '0.9rem' }} placeholder="Ta filière (ex : Dev B1, CyberSec B2…)" />
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 2 }}>{profile.name}</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--novy-cyan-light)', marginBottom: 12 }}>
              {profile.role || 'Étudiant Paris Ynov Campus'}
            </p>
          </>
        )}

        {/* XP Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>XP Campus</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--novy-violet-light)', fontWeight: 700 }}>{profile.xp || 0}/100</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${profile.xp || 0}%` }} />
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>À propos</h3>
          {edit
            ? <textarea className="input" value={draft.bio || ''} onChange={e => setDraft({ ...draft, bio: e.target.value })}
                rows={3} style={{ resize: 'vertical' }} placeholder="Parle un peu de toi, tes projets, tes passions…" />
            : <p style={{ color: profile.bio ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)', lineHeight: 1.65, fontSize: '0.93rem', fontStyle: profile.bio ? 'normal' : 'italic' }}>
                {profile.bio || 'Clique sur Modifier pour ajouter une bio.'}
              </p>
          }
        </div>

        {/* Compétences */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Compétences {edit && <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, fontSize: '0.7rem', textTransform: 'none' }}>— clique pour ajouter/retirer</span>}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_SKILLS.map(s => {
              const meta   = SKILL_META[s];
              const active = cur.skills?.includes(s);
              return (
                <button key={s} onClick={() => edit && toggleSkill(s)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)',
                  border: `1px solid ${active ? meta.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  background: active ? `${meta.color}18` : 'transparent',
                  color: active ? meta.color : 'rgba(255,255,255,0.35)',
                  fontWeight: 600, fontSize: '0.82rem',
                  cursor: edit ? 'pointer' : 'default',
                  transition: 'all 0.2s', fontFamily: 'var(--font)',
                  boxShadow: active ? `0 0 10px ${meta.color}30` : 'none',
                }}>
                  <span>{meta.icon}</span> {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { val: profile.postsCount || 0,  label: 'Posts',      icon: '📝', grad: 'linear-gradient(135deg, #7c3aed22, #d946ef11)' },
            { val: profile.followersCount || 0, label: 'Followers', icon: '🤝', grad: 'linear-gradient(135deg, #06b6d422, #7c3aed11)' },
            { val: profile.xp || 0,           label: 'XP gagnés',  icon: '⚡', grad: 'linear-gradient(135deg, #f59e0b22, #ef444411)' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '1rem', borderRadius: 'var(--radius-md)',
              background: s.grad, border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
              <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;