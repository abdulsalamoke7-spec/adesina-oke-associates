import { useState, useEffect } from 'react'
import api from '../api'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Modal({ entry, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(10,6,2,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '4px', maxWidth: '680px', width: '100%', maxHeight: '88vh', overflowY: 'auto', padding: '48px 40px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '1.4rem', color: '#999', cursor: 'pointer' }}>✕</button>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '0.75rem' }}>
          {entry.category} · {formatDate(entry.publishedAt)}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', fontWeight: 500, color: '#1A1208', marginBottom: '1.5rem', lineHeight: 1.25 }}>{entry.title}</h2>
        <div style={{ color: '#6B5C42', lineHeight: 1.85, fontSize: '0.97rem' }}>
          {entry.body.split('\n').filter(p => p.trim()).map((p, i) => <p key={i} style={{ marginBottom: '1rem' }}>{p}</p>)}
        </div>
      </div>
    </div>
  )
}

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/journal')
      .then(res => setEntries(res.data))
      .catch(() => setError('Could not load journal entries. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ paddingTop: '68px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#B8963E', fontFamily: "'Playfair Display',serif", fontSize: '1.1rem' }}>Loading journal…</div>
    </div>
  )

  return (
    <div style={{ paddingTop: '68px' }}>
      <section style={{ background: '#fff', padding: '100px 5vw' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '30px', height: '1px', background: '#B8963E', display: 'block' }} />
              The Chambers Journal
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 500, color: '#1A1208' }}>Legal Insight &amp; Commentary</h1>
          </div>
        </div>

        {error && <p style={{ color: '#c0392b', marginBottom: '2rem' }}>{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#999', border: '1px solid #F0EAE0' }}>
            No journal entries published yet.
          </div>
        )}

        {entries.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '1px', background: '#F0EAE0', border: '1px solid #F0EAE0' }}>
            {entries.map((e, i) => {
              const featured = i === 0
              return (
                <button
                  key={e._id}
                  onClick={() => setSelected(e)}
                  style={{
                    background: '#fff', padding: '32px 28px', border: 'none', textAlign: 'left',
                    cursor: 'pointer', width: '100%', transition: 'background 0.15s',
                    gridColumn: featured ? '1 / -1' : 'auto',
                    display: featured ? 'grid' : 'block',
                    gridTemplateColumns: featured ? '1fr 2fr' : 'none',
                    gap: featured ? '32px' : '0',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '0.75rem' }}>
                      {e.category} <span style={{ color: '#6B5C42' }}>·</span> {formatDate(e.publishedAt)}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: featured ? '1.5rem' : '1.1rem', fontWeight: 500, color: '#1A1208', marginBottom: '0.75rem', lineHeight: 1.35 }}>{e.title}</h3>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.88rem', color: '#6B5C42', lineHeight: 1.7 }}>
                      {e.body.replace(/\n/g, ' ').slice(0, 200)}…
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '1rem', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8963E', fontWeight: 500 }}>
                      Read full entry →
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {selected && <Modal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
