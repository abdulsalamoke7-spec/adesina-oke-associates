import { useState, useEffect, useCallback } from 'react'
import api from '../api'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Toast({ message, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 4000)
    return () => clearTimeout(t)
  }, [onHide])
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: '#1A1208', color: '#fff', padding: '14px 20px', borderRadius: '4px', borderLeft: '3px solid #B8963E', fontSize: '0.85rem', maxWidth: '340px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
      {message}
    </div>
  )
}

const inputStyle = { width: '100%', border: '1px solid #e0d8cc', borderRadius: '2px', padding: '10px 14px', fontFamily: "'Inter',sans-serif", fontSize: '0.9rem', color: '#1A1208', outline: 'none', background: '#fff', marginBottom: '12px', transition: 'border-color 0.2s' }

export default function JournalTab() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', category: '', body: '' })
  const [saving, setSaving] = useState(false)
  const [versions, setVersions] = useState(null) // { entryTitle, list }

  const fetchEntries = useCallback(() => {
    setLoading(true)
    // Admin fetches include version counts — we need to hit journal with auth
    api.get('/journal')
      .then(res => setEntries(res.data))
      .catch(() => setToast('Failed to load entries.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const clearForm = () => {
    setForm({ title: '', category: '', body: '' })
    setEditingId(null)
  }

  const startEdit = (entry) => {
    setForm({ title: entry.title, category: entry.category, body: entry.body })
    setEditingId(entry._id)
    setVersions(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveEntry = async () => {
    if (!form.title.trim() || !form.body.trim()) { setToast('Title and content are required.'); return }
    setSaving(true)
    try {
      if (editingId) {
        const res = await api.put(`/journal/${editingId}`, form)
        setEntries(prev => prev.map(e => e._id === editingId ? res.data : e))
        setToast('✏️ Entry updated. Previous version saved automatically.')
      } else {
        const res = await api.post('/journal', form)
        setEntries(prev => [res.data, ...prev])
        setToast('📝 New entry published.')
      }
      clearForm()
    } catch (err) {
      setToast(err.response?.data?.error || 'Failed to save entry.')
    } finally {
      setSaving(false)
    }
  }

  const deleteEntry = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await api.delete(`/journal/${id}`)
      setEntries(prev => prev.filter(e => e._id !== id))
      setToast('🗑 Entry deleted.')
      if (editingId === id) clearForm()
    } catch {
      setToast('Failed to delete entry.')
    }
  }

  const revert = async (id) => {
    if (!confirm('Revert this entry to its previous version?')) return
    try {
      const res = await api.post(`/journal/${id}/revert`)
      setEntries(prev => prev.map(e => e._id === id ? res.data.entry : e))
      setToast('↩ Entry reverted to previous version.')
      if (editingId === id) clearForm()
      setVersions(null)
    } catch (err) {
      setToast(err.response?.data?.error || 'No previous version to revert to.')
    }
  }

  const showVersions = async (entry) => {
    try {
      const res = await api.get(`/journal/${entry._id}/versions`)
      setVersions({ entryTitle: entry.title, entryId: entry._id, list: res.data.versions })
    } catch {
      setToast('Failed to load version history.')
    }
  }

  return (
    <div>
      {toast && <Toast message={toast} onHide={() => setToast('')} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Editor */}
        <div style={{ background: '#fff', border: '1px solid #e8e4dc', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8e4dc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 500, color: '#1A1208' }}>
              {editingId ? 'Edit Entry' : 'New Entry'}
            </h2>
            {editingId && (
              <button onClick={clearForm} style={{ fontSize: '0.75rem', color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕ Cancel edit
              </button>
            )}
          </div>
          <div style={{ padding: '24px' }}>
            {editingId && (
              <div style={{ background: '#FFF8EC', border: '1px solid #F4D08A', borderRadius: '2px', padding: '8px 12px', fontSize: '0.8rem', color: '#92650B', marginBottom: '16px' }}>
                ✏️ Editing existing entry — a version snapshot will be saved automatically on publish.
              </div>
            )}
            <input
              style={inputStyle}
              placeholder="Article title"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#B8963E'}
              onBlur={e => e.target.style.borderColor = '#e0d8cc'}
            />
            <input
              style={inputStyle}
              placeholder="Category (e.g. Governance, Commentary, Research)"
              value={form.category}
              onChange={e => set('category', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#B8963E'}
              onBlur={e => e.target.style.borderColor = '#e0d8cc'}
            />
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '260px', marginBottom: '16px' }}
              placeholder="Write the article content here…"
              value={form.body}
              onChange={e => set('body', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#B8963E'}
              onBlur={e => e.target.style.borderColor = '#e0d8cc'}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={saveEntry}
                disabled={saving}
                style={{ flex: 1, padding: '11px', background: saving ? '#8a6f2e' : '#B8963E', color: '#1A1208', border: 'none', borderRadius: '2px', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", fontWeight: 500 }}
              >
                {saving ? 'Saving…' : (editingId ? 'Update Entry' : 'Publish Entry')}
              </button>
              {(form.title || form.body) && (
                <button onClick={clearForm} style={{ padding: '11px 16px', background: 'transparent', color: '#6B5C42', border: '1px solid #d8d0c4', borderRadius: '2px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Entries list */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #e8e4dc', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8e4dc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 500, color: '#1A1208' }}>Published Entries</h2>
              <span style={{ fontSize: '0.78rem', color: '#999' }}>{entries.length} entries</span>
            </div>

            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#B8963E' }}>Loading…</div>
            ) : entries.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#999' }}>No entries yet. Write your first entry.</div>
            ) : (
              entries.map(e => (
                <div key={e._id} style={{ padding: '16px 24px', borderBottom: '1px solid #f0ece4', background: editingId === e._id ? '#FFF8EC' : 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, color: '#1A1208', fontSize: '0.88rem', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#999' }}>
                        {e.category} · {formatDate(e.publishedAt)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => startEdit(e)} style={{ padding: '5px 10px', background: 'transparent', color: '#6B5C42', border: '1px solid #d8d0c4', borderRadius: '2px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Edit</button>
                      <button onClick={() => showVersions(e)} style={{ padding: '5px 10px', background: 'transparent', color: '#6B5C42', border: '1px solid #d8d0c4', borderRadius: '2px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>History</button>
                      <button onClick={() => deleteEntry(e._id, e.title)} style={{ padding: '5px 10px', background: 'transparent', color: '#c0392b', border: '1px solid #f0c0ba', borderRadius: '2px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Version history panel */}
          {versions && (
            <div style={{ background: '#fff', border: '1px solid #e8e4dc', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '14px 24px', borderBottom: '1px solid #e8e4dc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.95rem', fontWeight: 500, color: '#1A1208' }}>Version History</h3>
                <button onClick={() => setVersions(null)} style={{ fontSize: '0.72rem', color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Close</button>
              </div>
              <div style={{ padding: '8px 0' }}>
                <div style={{ padding: '10px 24px', fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
                  {versions.list.length === 0
                    ? 'No previous versions — this entry has never been edited.'
                    : `${versions.list.length} previous version${versions.list.length > 1 ? 's' : ''} for: "${versions.entryTitle}"`}
                </div>
                {versions.list.map((v, i) => (
                  <div key={i} style={{ padding: '12px 24px', borderBottom: '1px solid #f8f6f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#1A1208', fontWeight: 500 }}>{v.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#999' }}>Saved: {new Date(v.savedAt).toLocaleString('en-GB')}</div>
                    </div>
                    {i === 0 && (
                      <button
                        onClick={() => revert(versions.entryId)}
                        style={{ padding: '5px 12px', background: 'transparent', color: '#B8963E', border: '1px solid rgba(184,150,62,0.4)', borderRadius: '2px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
                      >
                        ↩ Revert to this
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
