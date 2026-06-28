import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: 'rgba(26,18,8,0.96)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(184,150,62,0.3)',
    padding: '0 5vw',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '68px',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    color: '#B8963E',
    fontSize: '1.05rem',
    letterSpacing: '0.02em',
    textDecoration: 'none',
  },
  links: {
    display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center',
  },
  link: {
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    fontSize: '0.82rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    transition: 'color 0.2s',
  },
  cta: {
    background: 'transparent',
    border: '1px solid #B8963E',
    color: '#B8963E',
    padding: '8px 20px',
    borderRadius: '2px',
    fontSize: '0.78rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
}

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{ ...styles.nav, boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none' }}>
      <Link to="/" style={styles.logo}>Adesina Oke &amp; Associates</Link>
      <ul style={styles.links}>
        {[
          { to: '/', label: 'Home' },
          { to: '/about', label: 'About' },
          { to: '/founder', label: 'Founder' },
          { to: '/journal', label: 'Journal' },
        ].map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              style={{
                ...styles.link,
                color: isActive(to) ? '#B8963E' : 'rgba(255,255,255,0.75)',
              }}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/schedule" style={styles.cta}>Schedule a Meeting</Link>
        </li>
      </ul>
    </nav>
  )
}
