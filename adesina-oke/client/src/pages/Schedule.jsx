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

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

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
  const [message, setMessage] = useState(null) // { type: 'success'|'error', text }

  // Fetch available slots whenever date changes
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
    setSubmitting(true)
    setMessage(null)
    try {
      await api.post('/meetings', form)
      setMessage({ type: 'success', text: `Thank you, ${firstName}. Your consultation request for ${new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${time} has been received. We will confirm shortly.` })
      setForm({ firstName: '', lastName: '', email: '', phone: '', area: '', date: '', time: '', matter: '' })
      setAvailableSlots([])
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ paddingTop: '68px' }}>
      <section style={{ background: '#1A1208', padding: '100px 5vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start', maxWidth: '1000px' }}>

          {/* Left */}
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8963E', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '30px', height: '1px', background: '#B8963E', display: 'block' }} />
              Consultations
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 500, color: '#fff', marginBottom: '1.5rem' }}>
              Schedule a<br />Consultation
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '1rem' }}>
              We welcome new clients across all our practice areas. Submit your preferred time and we will confirm availability.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem' }}>
              All consultations are treated with absolute confidentiality.
            </p>
            <ul style={{ listStyle: 'none' }}>
              {[
                'No double-bookings — clash detection built in',
                'Email & SMS confirmation sent within 24 hours',
                'In-person and virtual options available',
                'Initial consultation may be complimentary for public interest matters',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#B8963E', fontWeight: 600, flexShrink: 0 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,150,62,0.2)', borderRadius: '4px', padding: '36px' }}>
            {message && (
              <div style={{
                padding: '12px 16px', borderRadius: '2px', fontSize: '0.85rem', marginBottom: '1.25rem',
                background: message.type === 'success' ? 'rgba(30,120,70,0.2)' : 'rgba(180,40,40,0.2)',
                color: message.type === 'success' ? '#6dd9a0' : '#f4a0a0',
                border: `1px solid ${message.type === 'success' ? 'rgba(30,120,70,0.3)' : 'rgba(180,40,40,0.3)'}`,
              }}>
                {message.text}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="First Name">
                <input style={inputStyle} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Chukwuma" />
              </Field>
              <Field label="Last Name">
                <input style={inputStyle} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Okafor" />
              </Field>
            </div>

            <Field label="Email Address">
              <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
            </Field>

            <Field label="Phone Number">
              <input style={inputStyle} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 800 000 0000" />
            </Field>

            <Field label="Practice Area of Interest">
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.area} onChange={e => set('area', e.target.value)}>
                <option value="">– Select –</option>
                {AREAS.map(a => <option key={a} value={a} style={{ background: '#1A1208' }}>{a}</option>)}
              </select>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Preferred Date">
                <input style={inputStyle} type="date" min={today} value={form.date} onChange={e => set('date', e.target.value)} />
              </Field>
              <Field label={loadingSlots ? 'Loading slots…' : 'Available Times'}>
                <select
                  style={{ ...inputStyle, cursor: availableSlots.length ? 'pointer' : 'not-allowed', opacity: availableSlots.length ? 1 : 0.5 }}
                  value={form.time}
                  onChange={e => set('time', e.target.value)}
                  disabled={!availableSlots.length || loadingSlots}
                >
                  <option value="">{form.date ? (availableSlots.length ? '– Select –' : 'No slots available') : '– Pick date first –'}</option>
                  {availableSlots.map(t => <option key={t} value={t} style={{ background: '#1A1208' }}>{t}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Brief Description of Matter">
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
                value={form.matter}
                onChange={e => set('matter', e.target.value)}
                placeholder="Briefly describe your legal matter or query…"
              />
            </Field>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ width: '100%', padding: '15px', background: submitting ? '#8a6f2e' : '#B8963E', color: '#1A1208', border: 'none', borderRadius: '2px', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            >
              {submitting ? 'Submitting…' : 'Request Consultation →'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
