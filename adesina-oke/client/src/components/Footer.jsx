import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#1A1208', padding: '60px 5vw 40px', borderTop: '1px solid rgba(184,150,62,0.2)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '60px', marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", color: '#B8963E', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Adesina Oke &amp; Associates
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.8 }}>
            Legal counsel grounded in expertise, guided by principle, and committed to the advancement of justice in Nigeria and across the continent.
          </p>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '1rem' }}>Navigate</div>
          <ul style={{ listStyle: 'none' }}>
            {[['/', 'Home'], ['/about', 'About the Firm'], ['/founder', 'Meet the Founder'], ['/journal', 'Journal'], ['/schedule', 'Schedule']].map(([to, label]) => (
              <li key={to} style={{ marginBottom: '0.6rem' }}>
                <Link to={to} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', transition: 'color 0.2s' }}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '1rem' }}>Contact</div>
          <ul style={{ listStyle: 'none' }}>
            {['Abuja, Nigeria', 'askadesinaoke@yahoo.co.uk', '+234 802 312 3618'].map(t => (
              <li key={t} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>© 2025 Adesina Oke &amp; Associates. All rights reserved.</span>
        <Link to="/admin/login" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', letterSpacing: '0.1em', transition: 'color 0.3s' }}>Admin Access</Link>
      </div>
    </footer>
  )
}
