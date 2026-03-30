import { useState, useRef, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';

const SUGGESTIONS = [
  '💼 Comment trouver un stage en data science ?',
  '📅 Quels sont les prochains événements du campus ?',
  '🎓 Conseils pour mon projet de fin d\'année',
  '🤝 Comment trouver des coéquipiers sur Novy ?',
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Salut 👋 Je suis **NovyBot**, ton assistant IA du campus Ynov. Comment puis-je t\'aider aujourd\'hui ?' },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (textArg) => {
    const msg = (textArg || input).trim();
    if (!msg || loading) return;
    setInput('');

    const newUserMsg = { role: 'user', text: msg };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // Build history (skip initial greeting)
      const history = messages.slice(1).map(m => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erreur ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      console.error('[NovyBot]', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `⚠️ ${err.message || 'Une erreur est survenue. Le backend est-il démarré ?'}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (t) =>
    t
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.5rem 1rem', height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.25rem',
        padding: '1rem 1.25rem',
        background: 'var(--bg-800)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(124,58,237,0.2)',
        boxShadow: 'var(--shadow-glow-violet)',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--novy-violet), var(--novy-pink))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', boxShadow: 'var(--shadow-glow-violet)',
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff', margin: 0 }}>NovyBot</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: 0 }}>
            Propulsé par Groq × Llama 3 • Ultra-rapide
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--novy-green)', display: 'block', boxShadow: '0 0 8px var(--novy-green)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--novy-green)', fontWeight: 600 }}>En ligne</span>
        </div>
      </div>

      {/* Chat window */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: 'var(--bg-800)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex', flexDirection: 'column', gap: '0.85rem',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end', gap: 8,
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--novy-violet), var(--novy-pink))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
              }}>🤖</div>
            )}
            <div
              dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
              style={{
                maxWidth: '75%', padding: '0.75rem 1.1rem',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, var(--novy-violet), var(--novy-pink))'
                  : 'rgba(255,255,255,0.07)',
                color: '#f1f2f6', fontSize: '0.9rem', lineHeight: 1.65,
                boxShadow: msg.role === 'user' ? 'var(--shadow-glow-violet)' : 'none',
                fontFamily: 'var(--font)',
              }}
            />
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--novy-violet), var(--novy-pink))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
            }}>🤖</div>
            <div style={{
              padding: '0.75rem 1.1rem', borderRadius: '18px 18px 18px 4px',
              background: 'rgba(255,255,255,0.07)',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(j => (
                <span key={j} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--novy-violet-light)', display: 'block',
                  animation: `heartbeat 1.2s ${j * 0.2}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (only at start) */}
      {messages.length === 1 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0.75rem 0' }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{
              padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(124,58,237,0.3)',
              background: 'rgba(124,58,237,0.08)', color: 'var(--novy-violet-light)',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ display: 'flex', gap: 8, marginTop: '0.5rem' }}>
        <input
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && send()}
          placeholder="Pose ta question à NovyBot…"
          style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '0.7rem 1.2rem' }}
          disabled={loading}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="btn btn-brand"
          style={{
            borderRadius: 'var(--radius-full)', padding: '0.7rem 1.25rem',
            fontSize: '1rem', opacity: (loading || !input.trim()) ? 0.5 : 1,
          }}
        >➤</button>
      </div>
    </div>
  );
};

export default Chatbot;
