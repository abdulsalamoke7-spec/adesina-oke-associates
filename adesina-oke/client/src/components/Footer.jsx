import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#1A1208', padding: '48px 5vw 32px', borderTop: '1px solid rgba(184,150,62,0.2)', overflowX: 'hidden' }}>
      <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", color: '#B8963E', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
          Adesina Oke &amp; Associates
        </div>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.8, maxWidth: '420px', marginBottom: '2rem' }}>
          Legal counsel grounded in expertise, guided by principle, and committed to the advancement of justice in Nigeria.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '0.75rem' }}>Navigate</div>
            <ul style={{ listStyle: 'none' }}>
              {[['/', 'Home'], ['/about', 'About'], ['/founder', 'Founder'], ['/journal', 'Journal'], ['/schedule', 'Schedule']].map(([to, label]) => (
                <li key={to} style={{ marginBottom: '0.5rem' }}>
                  <Link to={to} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '0.75rem' }}>Contact</div>
            <ul style={{ listStyle: 'none' }}>
              {['Abuja, Nigeria', 'askadesinaoke@yahoo.co.uk', '+234 802 232 3618'].map(t => (
                <li key={t} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.5rem', wordBreak: 'break-word' }}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>© 2025 Adesina Oke &amp; Associates.</span>
        <Link to="/admin/login" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>Admin</Link>
      </div>
    </footer>
  )
}