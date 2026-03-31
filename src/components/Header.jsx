import { Link, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/feed', icon: '◈', label: 'Fil' },
  { to: '/news', icon: '📣', label: 'News' },
  { to: '/messages', icon: '💬', label: 'Messages' },
  { to: '/jobs', icon: '💼', label: 'Jobs' },
  { to: '/chatbot', icon: '🤖', label: 'IA' },
];

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('novy_token');

  // Récupère le nom de l'utilisateur connecté
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('novy_user')); } catch { return null; }
  })();

  const logout = () => {
    localStorage.removeItem('novy_token');
    localStorage.removeItem('novy_user');
    navigate('/login');
  };

  // Sur la page login : header minimaliste (logo uniquement)
  if (pathname === '/login') {
    return (
      <header style={{
        position: 'sticky', top: 0, zIndex: 999,
        padding: '0 2rem 0 1rem', height: 58,
        display: 'flex', alignItems: 'center',
        background: 'rgba(13,14,18,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(124,58,237,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo_novy.png" alt="Novy Logo" style={{ height: 50, width: 'auto', display: 'block' }} />
        </div>
      </header>
    );
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 999,
      padding: '0 2rem 0 1rem', height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(13,14,18,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(124,58,237,0.15)',
      boxShadow: '0 1px 0 rgba(124,58,237,0.08)',
    }}>
      {/* Logo */}
      <Link to="/feed" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <img src="/logo_novy.png" alt="Novy Logo" style={{ height: 50, width: 'auto', display: 'block' }} />
      </Link>

      {/* Nav — visible seulement si connecté */}
      {isLoggedIn && (
        <nav style={{ display: 'flex', gap: 2 }}>
          {navLinks.map(link => {
            const active = pathname.startsWith(link.to);
            return (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none', fontSize: '0.85rem',
                fontFamily: 'var(--font)',
                fontWeight: active ? 700 : 500,
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                background: active ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(217,70,239,0.2))' : 'transparent',
                border: active ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
                boxShadow: active ? '0 0 12px rgba(124,58,237,0.2)' : 'none',
                transition: 'all 0.2s ease',
              }}>
                <span style={{ fontSize: '0.9rem' }}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Droite — avatar + déconnexion */}
      {isLoggedIn ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Nom utilisateur */}
          {user?.name && (
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
              {user.name.split(' ')[0]}
            </span>
          )}

          {/* Avatar cliquable → profil */}
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 2,
              background: 'conic-gradient(#7c3aed, #d946ef, #06b6d4, #7c3aed)',
              borderRadius: '50%',
            }}>
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed || 'Novy'}&backgroundColor=b6e3f4`}
                alt="avatar"
                style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #0d0e12', display: 'block', objectFit: 'cover' }}
              />
            </div>
          </Link>

          {/* Bouton déconnexion */}
          <button onClick={logout} title="Se déconnecter" style={{
            width: 30, height: 30, borderRadius: '50%', border: 'none',
            background: 'rgba(239,68,68,0.12)',
            color: 'rgba(239,68,68,0.7)',
            cursor: 'pointer', fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = 'rgba(239,68,68,0.7)'; }}
          >
            ⏻
          </button>
        </div>
      ) : (
        /* Non connecté : bouton connexion */
        <Link to="/login" className="btn btn-brand" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem', textDecoration: 'none' }}>
          Se connecter
        </Link>
      )}
    </header>
  );
};

export default Header;
