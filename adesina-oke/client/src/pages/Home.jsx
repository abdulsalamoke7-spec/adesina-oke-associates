import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: '#1A1208', padding: 'calc(68px + 60px) 5vw 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(184,150,62,0.06) 79px,rgba(184,150,62,0.06) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(184,150,62,0.06) 79px,rgba(184,150,62,0.06) 80px)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'block', width: '40px', height: '1px', background: '#B8963E' }} />
            Legal Counsel · Civil Society · Governance
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.6rem,5vw,4rem)', lineHeight: 1.15, color: '#fff', marginBottom: '1.5rem', fontWeight: 500 }}>
            Principled Law.<br />
            <em style={{ fontStyle: 'italic', color: '#D4AF6A' }}>Purposeful Advocacy.</em>
          </h1>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', lineHeight: 1.8, maxWidth: '520px' }}>
            Where legal excellence meets a commitment to justice, transparency, and the advancement of civil society in Nigeria and beyond.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/schedule" style={{ background: '#B8963E', color: '#1A1208', border: 'none', padding: '14px 32px', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', fontWeight: 500, textDecoration: 'none' }}>
              Schedule a Consultation
            </Link>
            <Link to="/about" style={{ background: 'transparent', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 32px', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none' }}>
              Our Practice
            </Link>
          </div>
        </div>

        {/* Decorative seal */}
        <div style={{ position: 'absolute', right: '8vw', top: '50%', transform: 'translateY(-50%)', width: '260px', height: '260px', border: '1px solid rgba(184,150,62,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
          <div style={{ position: 'absolute', inset: '12px', border: '1px solid rgba(184,150,62,0.35)', borderRadius: '50%' }} />
          <div style={{ fontFamily: "'Playfair Display', serif", color: '#B8963E', textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.9 }}>
            Adesina Oke<br />&amp; Associates<br />──────<br />Est. in Pursuit<br />of Justice
          </div>
        </div>
      </section>

      {/* Practice preview strip */}
      <section style={{ background: '#fff', padding: '80px 5vw' }}>
        <div style={{ maxWidth: '1100px' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '30px', height: '1px', background: '#B8963E', display: 'block' }} />
            What We Do
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 500, marginBottom: '3rem', color: '#1A1208' }}>
            A Focused Practice. A Principled Approach.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '0', border: '1px solid #F0EAE0' }}>
            {[
              ['Civil Litigation', 'Strategic representation at all court levels'],
              ['Corporate & Commercial', 'Business counsel and transactional advisory'],
              ['Anti-Corruption', 'Governance, compliance, and civil society law'],
              ['Human Rights', 'Constitutional rights and public interest law'],
              ['Policy & Legislation', 'Legal analysis for NGOs and public bodies'],
            ].map(([title, desc], i) => (
              <div key={i} style={{ padding: '32px 28px', borderRight: i < 4 ? '1px solid #F0EAE0' : 'none' }}>
                <div style={{ width: '32px', height: '2px', background: '#B8963E', marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 500, color: '#1A1208', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.83rem', color: '#6B5C42', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
