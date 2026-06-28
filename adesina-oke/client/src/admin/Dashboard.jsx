import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MeetingsTab from './MeetingsTab'
import JournalTab from './JournalTab'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('meetings')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabStyle = (tab) => ({
    padding: '14px 20px',
    background: 'none',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? '#B8963E' : 'transparent'}`,
    fontSize: '0.83rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: activeTab === tab ? '#B8963E' : '#888',
    cursor: 'pointer',
    transition: 'all 0.15s',
    marginBottom: '-1px',
    fontFamily: "'Inter',sans-serif",
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f5', paddingTop: '0' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e4dc', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 500, color: '#1A1208' }}>
          Admin Dashboard — Adesina Oke &amp; Associates
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#999' }}>{user?.email}</span>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #d8d0c4', borderRadius: '2px', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B5C42', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
          >
            View Site
          </button>
          <button
            onClick={handleLogout}
            style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #d8d0c4', borderRadius: '2px', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B5C42', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e4dc', padding: '0 32px', display: 'flex' }}>
        <button style={tabStyle('meetings')} onClick={() => setActiveTab('meetings')}>Scheduled Meetings</button>
        <button style={tabStyle('journal')} onClick={() => setActiveTab('journal')}>Journal Management</button>
      </div>

      {/* Content */}
      <div style={{ padding: '32px', maxWidth: '1200px' }}>
        {activeTab === 'meetings' && <MeetingsTab />}
        {activeTab === 'journal' && <JournalTab />}
      </div>
    </div>
  )
}
