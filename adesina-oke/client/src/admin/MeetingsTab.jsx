import { useState, useEffect, useCallback } from 'react'
import api from '../api'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Toast({ message, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 4000)
    return () => clearTimeout(t)
  }, [onHide])

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: '#1A1208', color: '#fff', padding: '14px 20px',
      borderRadius: '4px', borderLeft: '3px solid #B8963E',
      fontSize: '0.85rem', maxWidth: '340px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    }}>
      {message}
    </div>
  )
}

const StatusBadge = ({ status }) => {
  const map = {
    pending:   { bg: '#FFF8EC', color: '#92650B', border: '#F4D08A', label: 'Pending' },
    confirmed: { bg: '#F0FAF4', color: '#1B6B3A', border: '#A0DCBA', label: 'Confirmed' },
    cancelled: { bg: '#FFF0EE', color: '#c0392b', border: '#f8c0ba', label: 'Cancelled' },
  }
  const s = map[status] || map.pending
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '2px', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  )
}

export default function MeetingsTab() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchMeetings = useCallback(() => {
    setLoading(true)
    api.get('/meetings')
      .then(res => setMeetings(res.data))
      .catch(() => setToast('Failed to load meetings.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchMeetings() }, [fetchMeetings])

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/meetings/${id}`, { status })
      setMeetings(prev => prev.map(m => m._id === id ? res.data : m))
      setToast(status === 'confirmed' ? `✅ Meeting confirmed — client notified by email & SMS.` : `Meeting cancelled — client notified.`)
    } catch {
      setToast('Failed to update meeting status.')
    }
  }

  const deleteMeeting = async (id, name) => {
    if (!confirm(`Permanently delete meeting with ${name}?`)) return
    try {
      await api.delete(`/meetings/${id}`)
      setMeetings(prev => prev.filter(m => m._id !== id))
      setToast('Meeting record deleted.')
    } catch {
      setToast('Failed to delete meeting.')
    }
  }

  const filtered = meetings.filter(m => filter === 'all' || m.status === filter)

  const thStyle = { textAlign: 'left', padding: '12px 20px', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', borderBottom: '1px solid #f0ece4', fontWeight: 500 }
  const tdStyle = { padding: '14px 20px', borderBottom: '1px solid #f8f6f2', color: '#3D3020', verticalAlign: 'top', fontSize: '0.87rem' }

  return (
    <div>
      {toast && <Toast message={toast} onHide={() => setToast('')} />}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          ['Total', meetings.length, '#1A1208'],
          ['Pending', meetings.filter(m => m.status === 'pending').length, '#92650B'],
          ['Confirmed', meetings.filter(m => m.status === 'confirmed').length, '#1B6B3A'],
          ['Cancelled', meetings.filter(m => m.status === 'cancelled').length, '#c0392b'],
        ].map(([label, count, color]) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e8e4dc', borderRadius: '4px', padding: '20px 24px' }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}>{label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 500, color }}>{count}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', background: filter === f ? '#B8963E' : 'transparent', color: filter === f ? '#1A1208' : '#6B5C42', border: '1px solid', borderColor: filter === f ? '#B8963E' : '#d8d0c4', borderRadius: '2px', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'capitalize', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontWeight: filter === f ? 500 : 400 }}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button onClick={fetchMeetings} style={{ marginLeft: 'auto', padding: '7px 16px', background: 'transparent', color: '#6B5C42', border: '1px solid #d8d0c4', borderRadius: '2px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
          ↻ Refresh
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e8e4dc', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e4dc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 500, color: '#1A1208' }}>Consultations</h2>
          <span style={{ fontSize: '0.78rem', color: '#999' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#B8963E' }}>Loading meetings…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>No meetings found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Client</th>
                  <th style={thStyle}>Date &amp; Time</th>
                  <th style={thStyle}>Practice Area</th>
                  <th style={thStyle}>Contact</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m._id} onMouseEnter={e => e.currentTarget.style.background = '#faf9f7'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={tdStyle}>
                      <strong style={{ display: 'block', color: '#1A1208' }}>{m.firstName} {m.lastName}</strong>
                      {m.matter && <span style={{ fontSize: '0.8rem', color: '#999' }}>{m.matter.slice(0, 60)}{m.matter.length > 60 ? '…' : ''}</span>}
                    </td>
                    <td style={tdStyle}>
                      <strong style={{ display: 'block' }}>{formatDate(m.date)}</strong>
                      <span style={{ fontSize: '0.82rem', color: '#888' }}>{m.time}</span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.83rem', maxWidth: '160px' }}>{m.area}</td>
                    <td style={tdStyle}>
                      <span style={{ display: 'block', fontSize: '0.82rem' }}>{m.email}</span>
                      <span style={{ fontSize: '0.82rem', color: '#888' }}>{m.phone}</span>
                    </td>
                    <td style={tdStyle}><StatusBadge status={m.status} /></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {m.status === 'pending' && (
                          <button onClick={() => updateStatus(m._id, 'confirmed')} style={{ padding: '6px 12px', background: '#B8963E', color: '#1A1208', border: '1px solid #B8963E', borderRadius: '2px', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>
                            Confirm
                          </button>
                        )}
                        {m.status !== 'cancelled' && (
                          <button onClick={() => updateStatus(m._id, 'cancelled')} style={{ padding: '6px 12px', background: 'transparent', color: '#c0392b', border: '1px solid #f0c0ba', borderRadius: '2px', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                            Cancel
                          </button>
                        )}
                        <button onClick={() => deleteMeeting(m._id, `${m.firstName} ${m.lastName}`)} style={{ padding: '6px 12px', background: 'transparent', color: '#999', border: '1px solid #e8e4dc', borderRadius: '2px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
