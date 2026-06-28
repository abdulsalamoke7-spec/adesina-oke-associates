import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/founder', label: 'Founder' },
    { to: '/journal', label: 'Journal' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(26,18,8,0.97)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(184,150,62,0.3)',
        padding: '0 5vw',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '68px',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
      }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display', serif", color: '#B8963E', fontSize: '1rem', letterSpacing: '0.02em', textDecoration: 'none', flexShrink: 0 }}>
          Adesina Oke &amp; Associates
        </Link>

        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }} className="desktop-nav">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} style={{ color: isActive(to) ? '#B8963E' : 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/schedule" style={{ background: 'transparent', border: '1px solid #B8963E', color: '#B8963E', padding: '8px 20px', borderRadius: '2px', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Schedule
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none', flexDirection: 'column', gap: '5px' }}
          aria-label="Toggle menu"
        >
          <span style={{ display: 'block', width: '24px', height: '1.5px', background: 'rgba(255,255,255,0.8)', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ display: 'block', width: '24px', height: '1.5px', background: '#B8963E', opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: '24px', height: '1.5px', background: 'rgba(255,255,255,0.8)', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 999,
          background: 'rgba(26,18,8,0.98)',
          borderBottom: '1px solid rgba(184,150,62,0.2)',
          padding: '8px 0 20px',
        }}>
          {[...navLinks, { to: '/schedule', label: 'Schedule a Meeting' }].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              display: 'block', padding: '14px 5vw',
              color: isActive(to) ? '#B8963E' : 'rgba(255,255,255,0.8)',
              textDecoration: 'none', fontSize: '0.88rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
