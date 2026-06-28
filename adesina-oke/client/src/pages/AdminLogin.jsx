import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true); setError('')
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'rgba(26,18,8,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '4px', padding: '52px 44px', width: '400px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", color: '#B8963E', fontSize: '1rem', marginBottom: '0.5rem' }}>Adesina Oke &amp; Associates</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 500, color: '#1A1208', marginBottom: '0.5rem' }}>Admin Access</h1>
        <p style={{ color: '#6B5C42', fontSize: '0.88rem', marginBottom: '2rem' }}>Enter your credentials to access the management dashboard.</p>

        {error && (
          <div style={{ background: '#fff0ee', color: '#c0392b', border: '1px solid #f8c0ba', borderRadius: '2px', padding: '10px 14px', fontSize: '0.83rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', border: '1px solid #e0d8cc', borderRadius: '2px', padding: '11px 14px', fontSize: '0.9rem', marginBottom: '12px', outline: 'none', fontFamily: "'Inter',sans-serif" }}
          onFocus={e => e.target.style.borderColor = '#B8963E'}
          onBlur={e => e.target.style.borderColor = '#e0d8cc'}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', border: '1px solid #e0d8cc', borderRadius: '2px', padding: '11px 14px', fontSize: '0.9rem', marginBottom: '20px', outline: 'none', fontFamily: "'Inter',sans-serif" }}
          onFocus={e => e.target.style.borderColor = '#B8963E'}
          onBlur={e => e.target.style.borderColor = '#e0d8cc'}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '13px', background: loading ? '#8a6f2e' : '#B8963E', color: '#1A1208', border: 'none', borderRadius: '2px', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Signing in…' : 'Access Dashboard'}
        </button>

        <a href="/" style={{ display: 'block', marginTop: '16px', color: '#999', fontSize: '0.82rem', textDecoration: 'none' }}>← Back to site</a>
      </div>
    </div>
  )
}
