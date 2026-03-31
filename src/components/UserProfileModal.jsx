import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileModal = ({ user, isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen || !user) return null;

  const handleMessageClick = () => {
    // Navigate to messages with the selected user
    navigate('/messages', { state: { targetUser: user } });
    onClose();
  };

  const getAvatar = () =>
    user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.seed || user.avatarSeed || user.name}&backgroundColor=b6e3f4`;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      opacity: 1, animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: 'var(--bg-800)',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: 'var(--radius-xl)',
        width: '90%', maxWidth: 400,
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Cover Video/Gradient */}
        <div style={{
          height: 120,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(6,182,212,0.8))',
          position: 'relative'
        }}>
          {/* Close button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff',
            width: 30, height: 30, borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', backdropFilter: 'blur(4px)'
          }}>
            ✕
          </button>
        </div>

        {/* Profile Info */}
        <div style={{ padding: '0 2rem 2rem', textAlign: 'center', marginTop: '-45px' }}>
          <div style={{
            width: 90, height: 90, margin: '0 auto 10px',
            borderRadius: '50%', padding: 4,
            background: '#0d0e12', position: 'relative'
          }}>
            <img src={getAvatar()} alt={user.name} style={{
              width: '100%', height: '100%', borderRadius: '50%',
              objectFit: 'cover', background: 'rgba(255,255,255,0.1)'
            }} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 5px', color: '#fff' }}>
            {user.name}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--novy-violet-light)', fontWeight: 600, margin: '0 0 15px' }}>
            {user.role}
          </p>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 20px', lineHeight: 1.5 }}>
            Étudiant(e) à Ynov Campus. Membre actif du réseau social Novy.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            {/* If it's not the current user, show message button and profile button */}
            {user.id !== JSON.parse(localStorage.getItem('novy_user'))?.id ? (
              <>
                <button 
                  onClick={() => { navigate(`/profile/${user.id}`); onClose(); }}
                  className="btn btn-ghost"
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  👤 Voir le profil
                </button>
                <button 
                  onClick={handleMessageClick}
                  className="btn btn-brand" 
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  <span>💬</span> Message
                </button>
              </>
            ) : (
              <button 
                onClick={() => { navigate('/profile'); onClose(); }}
                className="btn btn-brand"
                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-full)' }}
              >
                👤 Mon Profil
              </button>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default UserProfileModal;
