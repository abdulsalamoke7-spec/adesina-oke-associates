export default function About() {
  return (
    <div style={{ paddingTop: '68px' }}>
      <section style={{ background: '#fff', padding: '100px 5vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start', maxWidth: '1100px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '30px', height: '1px', background: '#B8963E', display: 'block' }} />
              The Firm
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 500, color: '#1A1208', marginBottom: '1.5rem' }}>
              A Legacy of Law in Service of Society
            </h1>
            <p style={{ color: '#6B5C42', marginBottom: '1.25rem', fontSize: '0.97rem' }}>
              Adesina Oke & Associates is a Nigerian law firm rooted in the belief that the practice of law carries a social responsibility — to individuals, to institutions, and to the fabric of democracy itself.
            </p>
            <p style={{ color: '#6B5C42', marginBottom: '1.25rem', fontSize: '0.97rem' }}>
              We provide rigorous legal counsel informed by years of engagement with governance, civil society, and international advocacy frameworks. Our work spans civil litigation, corporate advisory, regulatory compliance, and policy-facing legal work.
            </p>
            <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontStyle: 'italic', color: '#3D3020', borderLeft: '2px solid #B8963E', paddingLeft: '1.5rem', margin: '2rem 0', lineHeight: 1.6 }}>
              "Justice is not merely a legal outcome — it is a standard of governance to which every institution must be held."
            </blockquote>
            <p style={{ color: '#6B5C42', fontSize: '0.97rem' }}>
              We bring that standard to every matter we handle, large or small.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '30px', height: '1px', background: '#B8963E', display: 'block' }} />
              Practice Areas
            </div>
            {[
              ['Civil Litigation & Dispute Resolution', 'Strategic representation before courts and tribunals at all levels'],
              ['Corporate & Commercial Law', 'Business formation, contracts, mergers, and transactional counsel'],
              ['Anti-Corruption & Governance', 'Compliance, regulatory frameworks, and civil society legal support'],
              ['Human Rights & Public Interest Law', 'Constitutional rights, public advocacy, and access to justice'],
              ['Policy & Legislative Advisory', 'Legal analysis and drafting for NGOs, civil society, and public bodies'],
            ].map(([title, desc], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i < 4 ? '1px solid #F0EAE0' : 'none' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B8963E', marginTop: '8px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#1A1208', marginBottom: '2px' }}>{title}</strong>
                  <span style={{ fontSize: '0.83rem', color: '#6B5C42' }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
