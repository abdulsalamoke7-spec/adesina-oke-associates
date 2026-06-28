import { useState, useEffect } from 'react'
import api from '../api'

const AREAS = [
  'Civil Litigation & Dispute Resolution',
  'Corporate & Commercial Law',
  'Anti-Corruption & Governance',
  'Human Rights & Public Interest Law',
  'Policy & Legislative Advisory',
  'Other',
]

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', padding: '11px 14px', borderRadius: '2px', fontSize: '0.9rem', outline: 'none',
  fontFamily: "'Inter',sans-serif", transition: 'border-color 0.2s',
}

export default function Schedule() {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', area: '', date: '', time: '', matter: '' })
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (!form.date) { setAvailableSlots([]); return }
    setLoadingSlots(true)
    setForm(f => ({ ...f, time: '' }))
    api.get(`/meetings/slots?date=${form.date}`)
      .then(res => setAvailableSlots(res.data.available))
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [form.date])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    const { firstName, lastName, email, phone, area, date, time } = form
    if (!firstName || !lastName || !email || !phone || !area || !date || !time) {
      setMessage({ type: 'error', text: 'Please complete all required fields.' })
      return
    }
    setSubmitting(true); setMessage(null)
    try {
      await api.post('/meetings', form)
      setMessage({ type: 'success', text: `Thank you, ${firstName}. Your consultation request for ${new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${time} has been received.` })
      setForm({ firstName: '', lastName: '', email: '', phone: '', area: '', date: '', time: '', matter: '' })
      setAvailableSlots([])
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Something went wrong. Please try again.' })
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ paddingTop: '68px' }}>
      <section style={{ background: '#1A1208', padding: '60px 5vw', minHeight: 'calc(100vh - 68px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '48px', alignItems: 'start', maxWidth: '1000px' }}>

          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '30px', height: '1px', background: '#B8963E', display: 'block' }} />
              Consultations
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,5vw,2.6rem)', fontWeight: 500, color: '#fff', marginBottom: '1.5rem' }}>
              Schedule a Consultation
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              We welcome new clients across all our practice areas. All consultations are treated with absolute confidentiality.
            </p>
            <ul style={{ listStyle: 'none', marginTop: '1.5rem' }}>
              {['No double-bookings — clash detection built in', 'Email & SMS confirmation within 24 hours', 'In-person and virtual options available', 'Complimentary for public interest matters'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#B8963E', fontWeight: 600, flexShrink: 0 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,150,62,0.2)', borderRadius: '4px', padding: '28px 24px' }}>
            {message && (
              <div style={{ padding: '12px 16px', borderRadius: '2px', fontSize: '0.85rem', marginBottom: '1.25rem', background: message.type === 'success' ? 'rgba(30,120,70,0.2)' : 'rgba(180,40,40,0.2)', color: message.type === 'success' ? '#6dd9a0' : '#f4a0a0', border: `1px solid ${message.type === 'success' ? 'rgba(30,120,70,0.3)' : 'rgba(180,40,40,0.3)'}` }}>
                {message.text}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[['firstName','First Name','Chukwuma'],['lastName','Last Name','Okafor']].map(([key, label, ph]) => (
                <div key={key} style={{ marginBottom: '0' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>{label}</label>
                  <input style={inputStyle} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={ph} />
                </div>
              ))}
            </div>

            {[
              { key: 'email', label: 'Email Address', type: 'email', ph: 'you@example.com' },
              { key: 'phone', label: 'Phone Number', type: 'tel', ph: '+234 800 000 0000' },
            ].map(({ key, label, type, ph }) => (
              <div key={key} style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>{label}</label>
                <input style={inputStyle} type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={ph} />
              </div>
            ))}

            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Practice Area</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.area} onChange={e => set('area', e.target.value)}>
                <option value="">– Select –</option>
                {AREAS.map(a => <option key={a} value={a} style={{ background: '#1A1208' }}>{a}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Date</label>
                <input style={inputStyle} type="date" min={today} value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>{loadingSlots ? 'Loading…' : 'Time'}</label>
                <select style={{ ...inputStyle, cursor: availableSlots.length ? 'pointer' : 'not-allowed', opacity: availableSlots.length ? 1 : 0.5 }} value={form.time} onChange={e => set('time', e.target.value)} disabled={!availableSlots.length || loadingSlots}>
                  <option value="">{form.date ? (availableSlots.length ? '– Select –' : 'No slots') : '– Pick date –'}</option>
                  {availableSlots.map(t => <option key={t} value={t} style={{ background: '#1A1208' }}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Brief Description</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={form.matter} onChange={e => set('matter', e.target.value)} placeholder="Briefly describe your legal matter…" />
            </div>

            <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', padding: '14px', marginTop: '16px', background: submitting ? '#8a6f2e' : '#B8963E', color: '#1A1208', border: 'none', borderRadius: '2px', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Submitting…' : 'Request Consultation →'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}