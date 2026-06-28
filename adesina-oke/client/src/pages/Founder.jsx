export default function Founder() {
  return (
    <div style={{ paddingTop: '68px' }}>
      <section style={{ background: '#FAF7F2', padding: '100px 5vw' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '30px', height: '1px', background: '#B8963E', display: 'block' }} />
          Meet the Founder
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '60px', alignItems: 'start', maxWidth: '1000px' }}>
          {/* Card */}
          <div style={{ background: '#1A1208', borderRadius: '4px', padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#B8963E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: '#1A1208', margin: '0 auto 1.25rem' }}>TAO</div>
            <div style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.2rem', fontWeight: 500, marginBottom: '4px' }}>Taslim Adesina Oke</div>
            <div style={{ fontSize: '0.78rem', color: '#D4AF6A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Esq. – Principal Partner</div>
            <div style={{ width: '40px', height: '1px', background: 'rgba(184,150,62,0.4)', margin: '20px auto' }} />
            <ul style={{ listStyle: 'none', textAlign: 'left' }}>
              {[
                'Legal Director, CISLAC',
                'National Chapter Lead, Transparency International – Nigeria',
                'Participant, World Bank & IMF Annual Meetings',
                'Civil Society Legislative Advocacy',
                'Anti-Corruption & Governance Specialist',
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#B8963E', flexShrink: 0 }}>–</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Bio */}
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 500, color: '#1A1208', marginBottom: '1.5rem' }}>Adesina Oke, Esq.</h1>
            <p style={{ color: '#6B5C42', marginBottom: '1.25rem', fontSize: '0.97rem' }}>
              Taslim Adesina Oke is a Nigerian legal professional whose career bridges the courtroom and the corridors of policy. As the Legal Director for the Civil Society Legislative Advocacy Centre (CISLAC) — which serves as Nigeria's national chapter for Transparency International — he has been at the forefront of transparency and anti-corruption advocacy at both national and international levels.
            </p>
            <p style={{ color: '#6B5C42', marginBottom: '1.25rem', fontSize: '0.97rem' }}>
              His work has brought him to the highest levels of global economic governance, including the World Bank and IMF Annual Meetings, where he has represented civil society perspectives on issues of fiscal transparency, governance reform, and institutional accountability.
            </p>
            <p style={{ color: '#6B5C42', marginBottom: '1.5rem', fontSize: '0.97rem' }}>
              Mr. Oke brings this depth of experience to the firm he founded — an institution built not only on legal expertise but on a genuine commitment to justice as a public good.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                '⚖ Legal Director, CISLAC',
                '🌍 Transparency International – Nigeria',
                '🏛 World Bank Forum Participant',
                '📜 Anti-Corruption Advocate',
              ].map(badge => (
                <span key={badge} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5EDD6', border: '1px solid rgba(184,150,62,0.3)', borderRadius: '2px', padding: '6px 14px', fontSize: '0.78rem', color: '#3D3020', letterSpacing: '0.04em' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
