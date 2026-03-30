const COMPANY_LOGOS = {
  'TechCorp Paris':         'https://api.dicebear.com/7.x/initials/svg?seed=TC&backgroundColor=7c3aed&textColor=ffffff',
  'Agence Numérique Alpha': 'https://api.dicebear.com/7.x/initials/svg?seed=AN&backgroundColor=d946ef&textColor=ffffff',
  'DataHub France':         'https://api.dicebear.com/7.x/initials/svg?seed=DH&backgroundColor=06b6d4&textColor=ffffff',
  'InfraCloud SAS':         'https://api.dicebear.com/7.x/initials/svg?seed=IC&backgroundColor=10b981&textColor=ffffff',
  'Creative Lab':           'https://api.dicebear.com/7.x/initials/svg?seed=CL&backgroundColor=f59e0b&textColor=ffffff',
};

const jobs = [
  {
    id: 1, title: 'Développeur Full-Stack', company: 'TechCorp Paris',
    location: 'Paris – Hybride', type: 'Alternance',
    salary: '1 200 €/mois', desc: 'Rejoins une équipe agile sur des projets React/Node.js à fort impact.',
    tags: ['React', 'Node.js', 'PostgreSQL'], new: true,
  },
  {
    id: 2, title: 'UX/UI Designer', company: 'Agence Numérique Alpha',
    location: 'Paris – Présentiel', type: 'Stage',
    salary: '600 €/mois', desc: 'Concevoir des interfaces innovantes pour nos clients grands comptes.',
    tags: ['Figma', 'Adobe XD', 'Design System'], new: true,
  },
  {
    id: 3, title: 'Data Analyst', company: 'DataHub France',
    location: 'Remote', type: 'Stage',
    salary: '800 €/mois', desc: 'Analyse de données et construction de dashboards Power BI interactifs.',
    tags: ['Python', 'SQL', 'Power BI'],
  },
  {
    id: 4, title: 'DevOps Engineer', company: 'InfraCloud SAS',
    location: 'La Défense – Hybride', type: 'Alternance',
    salary: '1 400 €/mois', desc: 'Automatisation CI/CD, Kubernetes et gestion de l\'infrastructure cloud.',
    tags: ['Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    id: 5, title: 'Motion Designer', company: 'Creative Lab',
    location: 'Paris – Remote possible', type: 'Stage',
    salary: '700 €/mois', desc: 'Création de contenus motion pour les réseaux sociaux et branding vidéo.',
    tags: ['After Effects', 'Premiere', 'Blender'], new: true,
  },
];

const TYPE = {
  Alternance: { label: 'Alternance', cls: 'badge-violet' },
  Stage:      { label: 'Stage',      cls: 'badge-cyan'   },
};

const JobBoard = () => (
  <div style={{ maxWidth: 920, margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0 }}>
          Job Board <span className="glow-text">Ymatch</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', marginTop: 4 }}>
          Offres sélectionnées pour les étudiants Paris Ynov — mises à jour en temps réel
        </p>
      </div>
      <a href="https://www.ymatch.fr" target="_blank" rel="noopener noreferrer"
        className="btn btn-brand" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
        ✦ Toutes les offres →
      </a>
    </div>

    {/* Stats */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: '2rem' }}>
      {[
        { icon: '💼', val: '247', label: 'Offres actives', color: 'var(--novy-violet)' },
        { icon: '🏢', val: '89',  label: 'Entreprises',    color: 'var(--novy-cyan)'   },
        { icon: '✅', val: '34',  label: 'Etudiants placés', color: 'var(--novy-green)' },
      ].map(s => (
        <div key={s.label} style={{
          padding: '1rem', borderRadius: 'var(--radius-md)',
          background: 'var(--bg-800)', border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
          <div>
            <p style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Job cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1rem' }}>
      {jobs.map(job => (
        <div key={job.id} style={{
          background: 'var(--bg-800)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem',
          display: 'flex', flexDirection: 'column', gap: 12,
          transition: 'transform 0.25s, box-shadow 0.25s',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5), 0 0 24px rgba(124,58,237,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {/* Glow strip */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: job.type === 'Alternance' ? 'var(--grad-brand)' : 'var(--grad-cyan)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <img src={COMPANY_LOGOS[job.company]} alt={job.company}
                style={{ width: 44, height: 44, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }} />
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>{job.title}</h2>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{job.company}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <span className={`badge ${TYPE[job.type].cls}`}>{TYPE[job.type].label}</span>
              {job.new && <span className="badge badge-gold">🔥 Nouveau</span>}
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>{job.desc}</p>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {job.tags.map(t => (
              <span key={t} style={{
                fontSize: '0.72rem', fontWeight: 600,
                padding: '0.18rem 0.6rem', borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>{t}</span>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>📍 {job.location}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--novy-gold-light)', fontWeight: 600 }}>💰 {job.salary}</span>
            </div>
            <button className="btn btn-brand" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)' }}>
              Postuler →
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default JobBoard;