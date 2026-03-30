import { useState, useEffect, useRef } from 'react';
import { apiConvList, apiConv, apiSendMsg } from '../api';

const Messaging = () => {
  const [contacts, setContacts]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [msgs, setMsgs]           = useState([]);
  const [input, setInput]         = useState('');
  const [loadingConv, setLoadingConv] = useState(false);
  const [sending, setSending]     = useState(false);
  const bottomRef = useRef(null);

  const me = (() => { try { return JSON.parse(localStorage.getItem('novy_user')); } catch { return null; } })();

  // ── Charger la liste des conversations ──────────────────
  useEffect(() => {
    apiConvList()
      .then(data => {
        setContacts(data || []);
        if (data?.length > 0) setSelected(data[0]);
      })
      .catch(() => {
        // Fallback statique si pas de conversations en BDD
        const fallback = [
          { id: 1, name: 'Alex Dupont',   role: 'CyberSec B2',  avatarSeed: 'Alex',   bg: 'b6e3f4', online: true  },
          { id: 2, name: 'Emma Bernard',  role: 'DevOps',        avatarSeed: 'Emma',   bg: 'ffd5dc', online: true  },
          { id: 3, name: 'Karim Ndiaye',  role: 'Dev B1',        avatarSeed: 'Karim',  bg: 'd1f4cc', online: false },
          { id: 4, name: 'Sophie Martin', role: 'IA & Data B2',  avatarSeed: 'Sophie', bg: 'c0aede', online: true  },
        ];
        setContacts(fallback);
        setSelected(fallback[0]);
      });
  }, []);

  // ── Charger les messages de la conversation sélectionnée
  useEffect(() => {
    if (!selected) return;
    setLoadingConv(true);
    apiConv(selected.id)
      .then(data => setMsgs(data || []))
      .catch(() => setMsgs([]))
      .finally(() => setLoadingConv(false));
  }, [selected?.id]);

  // ── Scroll auto en bas ───────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  // ── Envoyer un message ───────────────────────────────────
  const send = async () => {
    if (!input.trim() || !selected || sending) return;
    const text = input;
    setInput('');
    // Affichage optimiste
    setMsgs(prev => [...prev, { senderId: me?.id, content: text, createdAt: new Date().toISOString() }]);
    setSending(true);
    try {
      await apiSendMsg(selected.id, text);
    } catch (err) {
      console.warn('[Messaging] Erreur envoi:', err.message);
    } finally {
      setSending(false);
    }
  };

  const getAvatar = (c) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.avatarSeed || c.name}&backgroundColor=${c.bg || 'b6e3f4'}`;

  const isFromMe = (msg) => msg.senderId === me?.id || msg.from === 'me';

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem 1rem', height: 'calc(100vh - 90px)', display: 'flex', gap: '1rem' }}>

      {/* ── Sidebar contacts ────────────────────────────── */}
      <div style={{
        width: 260, flexShrink: 0,
        background: 'var(--bg-800)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Messages</h2>
          <input className="input" placeholder="Rechercher…" style={{ marginTop: 10, padding: '0.5rem 0.8rem', fontSize: '0.82rem' }} />
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
          {contacts.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', padding: '2rem 1rem', fontSize: '0.82rem' }}>
              Aucune conversation.<br />Envoie un message à quelqu'un !
            </p>
          )}
          {contacts.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-md)',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              background: selected?.id === c.id ? 'rgba(124,58,237,0.18)' : 'transparent',
              transition: 'background 0.2s', fontFamily: 'var(--font)',
            }}
              onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={getAvatar(c)} alt={c.name}
                  style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)' }} />
                {c.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: 'var(--novy-green)', border: '2px solid var(--bg-800)' }} />}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{c.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.role || 'Étudiant Ynov'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Zone de chat ──────────────────────────────────── */}
      {selected ? (
        <div style={{
          flex: 1, background: 'var(--bg-800)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Header conversation */}
          <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <img src={getAvatar(selected)} alt={selected.name} style={{ width: 38, height: 38, borderRadius: '50%' }} />
              {selected.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: 'var(--novy-green)', border: '2px solid var(--bg-800)' }} />}
            </div>
            <div>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{selected.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{selected.online ? '🟢 En ligne' : '⚪ Hors ligne'}</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loadingConv ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'rgba(255,255,255,0.3)' }}>⏳ Chargement…</div>
            ) : msgs.length === 0 ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>👋</div>
                Dis bonjour à {selected.name} !
              </div>
            ) : (
              msgs.map((m, i) => {
                const fromMe = isFromMe(m);
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: fromMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '68%', padding: '0.6rem 1rem',
                      borderRadius: fromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: fromMe
                        ? 'linear-gradient(135deg, var(--novy-violet), var(--novy-pink))'
                        : 'rgba(255,255,255,0.07)',
                      color: '#f1f2f6', fontSize: '0.9rem', lineHeight: 1.5,
                      boxShadow: fromMe ? 'var(--shadow-glow-violet)' : 'none',
                    }}>
                      {m.content || m.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 8 }}>
            <input className="input" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={`Écrire à ${selected.name}…`}
              style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '0.6rem 1rem' }}
            />
            <button onClick={send} className="btn btn-brand"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.1rem', fontSize: '1rem', opacity: sending ? 0.6 : 1 }}>
              ➤
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>💬</div>
            Sélectionne une conversation
          </div>
        </div>
      )}
    </div>
  );
};

export default Messaging;
