import { useState } from 'react';

const newsItems = [
  {
    id: 1, category: 'Événement',
    title: 'Challenge 48H — Paris Ynov Campus',
    date: '30–31 Mars 2026',
    desc: 'Créez le réseau social du campus en équipe de 4 ! Présentez votre MVP devant un jury composé d\'intervenants professionnels.',
    emoji: '🎯', badgeCls: 'badge-violet', participants: 120, hot: true,
  },
  {
    id: 2, category: 'BDS',
    title: 'Tournoi de Football inter-promos',
    date: '5 Avril 2026',
    desc: 'Le BDS organise son premier tournoi de foot entre les différentes promotions. 8 équipes en compétition, inscriptions encore ouvertes !',
    emoji: '⚽', badgeCls: 'badge-cyan', participants: 64,
  },
  {
    id: 3, category: 'BDE',
    title: 'Soirée Networking & Portfolio',
    date: '12 Avril 2026',
    desc: 'Soirée dédiée au networking et à la présentation de vos portfolios. Entreprises partenaires présentes. Dress-code smart casual.',
    emoji: '🎉', badgeCls: 'badge-pink', participants: 200, hot: true,
  },
  {
    id: 4, category: 'Pédagogie',
    title: 'Conférence IA & Éthique',
    date: '18 Avril 2026',
    desc: 'Conférence ouverte à tous les étudiants, animée par des chercheurs de l\'INRIA. Inscription obligatoire sur le portail Ynov.',
    emoji: '🧠', badgeCls: 'badge-gold', participants: 150,
  },
];

const News = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
    <div style={{ marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>
        Actualités <span className="glow-text">Ynov</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Reste informé de tout ce qui se passe sur le campus</p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {newsItems.map((item, i) => (
        <div key={item.id} className="fade-up" style={{
          background: 'var(--bg-800)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          transition: 'transform 0.25s, box-shadow 0.25s',
          animationDelay: `${i * 0.07}s`,
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', gap: 16, padding: '1.4rem' }}>
            {/* Icon */}
            <div style={{
              width: 58, height: 58, borderRadius: 14, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(217,70,239,0.15))',
              border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem',
            }}>
              {item.emoji}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span className={`badge ${item.badgeCls}`}>{item.category}</span>
                {item.hot && <span className="badge badge-gold">🔥 En cours</span>}
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>📅 {item.date}</span>
              </div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{item.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.87rem', lineHeight: 1.6, marginBottom: 10 }}>{item.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                  👥 {item.participants} participants
                </span>
                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}>
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default News;
