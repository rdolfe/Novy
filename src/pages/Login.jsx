import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin, apiRegister } from '../api';

// ── Validation côté client ────────────────────────────────
const validate = (form, isReg) => {
  const errors = {};

  if (isReg) {
    if (!form.name.trim())
      errors.name = 'Le nom est requis.';
    else if (form.name.trim().length < 2)
      errors.name = 'Le nom doit avoir au moins 2 caractères.';
  }

  if (!form.email.trim())
    errors.email = 'L\'email est requis.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Format invalide. Ex : prenom.nom@ynov.com';

  if (!form.password)
    errors.password = 'Le mot de passe est requis.';
  else if (isReg && form.password.length < 6)
    errors.password = 'Minimum 6 caractères.';
  else if (isReg && !/[A-Z]/.test(form.password) && !/[0-9]/.test(form.password))
    errors.password = 'Doit contenir au moins une majuscule ou un chiffre.';

  return errors;
};

// ── Composant champ input ─────────────────────────────────
const Field = ({ label, type, placeholder, value, onChange, error, id }) => (
  <div>
    <label htmlFor={id} style={{
      fontSize: '0.78rem', fontWeight: 600,
      color: error ? '#fca5a5' : 'rgba(255,255,255,0.45)',
      display: 'block', marginBottom: 6,
    }}>{label}</label>
    <input
      id={id}
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        borderColor: error ? 'rgba(239,68,68,0.5)' : undefined,
        boxShadow: error ? '0 0 0 2px rgba(239,68,68,0.15)' : undefined,
      }}
    />
    {error && (
      <p style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
        ⚠️ {error}
      </p>
    )}
  </div>
);

// ── Page Login/Register ───────────────────────────────────
const Login = () => {
  const [isReg, setIsReg]     = useState(false);
  const [form, setForm]       = useState({ email: '', password: '', name: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    // Effacer l'erreur du champ dès que l'utilisateur tape
    if (fieldErrors[key]) setFieldErrors(fe => ({ ...fe, [key]: '' }));
    setServerError('');
  };

  const switchTab = (reg) => {
    setIsReg(reg);
    setFieldErrors({});
    setServerError('');
  };

  const submit = async (e) => {
    e.preventDefault();

    // Validation locale d'abord
    const errors = validate(form, isReg);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      const fn   = isReg ? apiRegister : apiLogin;
      const body = isReg ? form : { email: form.email, password: form.password };
      const data = await fn(body);
      localStorage.setItem('novy_token', data.token);
      localStorage.setItem('novy_user',  JSON.stringify(data.user));
      navigate('/feed');
    } catch (err) {
      // Le backend renvoie { error, field } — on l'affiche au bon endroit
      const msg   = err.message || 'Une erreur est survenue.';
      const field = null; // Si on avait le field depuis l'API on pourrait l'utiliser

      // Détecte le champ concerné via le message
      if (msg.toLowerCase().includes('email'))
        setFieldErrors(fe => ({ ...fe, email: msg }));
      else if (msg.toLowerCase().includes('mot de passe') || msg.toLowerCase().includes('password'))
        setFieldErrors(fe => ({ ...fe, password: msg }));
      else if (msg.toLowerCase().includes('nom'))
        setFieldErrors(fe => ({ ...fe, name: msg }));
      else
        setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p || !isReg) return null;
    if (p.length < 6) return { label: 'Trop court', color: '#ef4444', w: '20%' };
    if (p.length < 8 || (!/[A-Z]/.test(p) && !/[0-9]/.test(p)))
      return { label: 'Faible', color: '#f59e0b', w: '45%' };
    if (p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p))
      return { label: 'Fort 💪', color: '#10b981', w: '100%' };
    return { label: 'Moyen', color: '#06b6d4', w: '70%' };
  })();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-900)',
      backgroundImage: `
        radial-gradient(ellipse 700px 600px at 25% 30%, rgba(124,58,237,0.15) 0%, transparent 70%),
        radial-gradient(ellipse 600px 500px at 75% 70%, rgba(217,70,239,0.1) 0%, transparent 70%),
        radial-gradient(ellipse 400px 400px at 60% 10%, rgba(6,182,212,0.06) 0%, transparent 60%)
      `,
      padding: '1rem',
    }}>
      {/* Blobs décoratifs */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,70,239,0.2) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: 'rgba(19,20,26,0.9)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.1)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 900, color: '#fff',
            boxShadow: '0 0 32px rgba(124,58,237,0.5)',
          }}>N</div>
          <h1 style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-1px', background: 'linear-gradient(135deg, #a78bfa, #f0abfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Novy</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: 4 }}>Le réseau social de Paris Ynov Campus</p>
        </div>

        {/* Onglets Connexion / Inscription */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-full)', padding: 4, marginBottom: '1.5rem' }}>
          {['Connexion', 'Inscription'].map((l, i) => (
            <button key={l} onClick={() => switchTab(i === 1)} style={{
              flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-full)',
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.88rem',
              background: (i === 1) === isReg ? 'linear-gradient(135deg, #7c3aed, #d946ef)' : 'transparent',
              color: (i === 1) === isReg ? '#fff' : 'rgba(255,255,255,0.45)',
              boxShadow: (i === 1) === isReg ? 'var(--shadow-glow-violet)' : 'none',
              transition: 'all 0.25s',
            }}>{l}</button>
          ))}
        </div>

        {/* Erreur globale serveur */}
        {serverError && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-md)', padding: '0.65rem 0.9rem',
            marginBottom: '1rem', fontSize: '0.85rem', color: '#fca5a5',
          }}>
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }} noValidate>
          {isReg && (
            <Field id="name" label="Prénom & Nom" type="text"
              placeholder="Alex Dupont"
              value={form.name} onChange={set('name')}
              error={fieldErrors.name}
            />
          )}

          <Field id="email" label="Email Ynov" type="email"
            placeholder="prenom.nom@ynov.com"
            value={form.email} onChange={set('email')}
            error={fieldErrors.email}
          />

          <div>
            <Field id="password" label="Mot de passe" type="password"
              placeholder={isReg ? 'Min. 6 car., 1 majuscule ou chiffre' : '••••••••'}
              value={form.password} onChange={set('password')}
              error={fieldErrors.password}
            />
            {/* Barre de force du mot de passe */}
            {strength && (
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: strength.w, background: strength.color, borderRadius: 99, transition: 'width 0.4s, background 0.4s' }} />
                </div>
                <p style={{ fontSize: '0.72rem', color: strength.color, marginTop: 4, fontWeight: 600 }}>
                  Force : {strength.label}
                </p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-brand"
            style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.95rem', marginTop: '0.25rem', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ En cours…' : isReg ? '✨ Créer mon compte' : '→ Se connecter'}
          </button>
        </form>

        {/* Hint comptes démo */}
        {!isReg && (
          <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(124,58,237,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontWeight: 600 }}>
              💡 Comptes de démonstration
            </p>
            {[
              { email: 'moi@ynov.com', pw: 'Novy2026!' },
              { email: 'alex.dupont@ynov.com', pw: 'password123' },
            ].map(c => (
              <button key={c.email} onClick={() => setForm(f => ({ ...f, email: c.email, password: c.pw }))}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '2px 0', fontFamily: 'var(--font)',
                }}>
                <code style={{ fontSize: '0.72rem', color: 'var(--novy-cyan-light)' }}>{c.email}</code>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}> / {c.pw}</span>
              </button>
            ))}
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>
              Clique sur un compte pour le remplir automatiquement
            </p>
          </div>
        )}

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', marginTop: '1.25rem' }}>
          Challenge 48H — Paris Ynov Campus 🎓
        </p>
      </div>
    </div>
  );
};

export default Login;
