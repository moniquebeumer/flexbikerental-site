import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function AppHeader() {
  const { signOut } = useAuth()
  const { t, lang, toggleLang } = useLanguage()

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={styles.logo}>BikeRental</span>
        <nav style={styles.nav}>
          <NavLink to="/" end style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}>
            {t('dashboard')}
          </NavLink>
          <NavLink to="/bikes" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}>
            {t('bikes')}
          </NavLink>
          <NavLink to="/rentals" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}>
            {t('rentals')}
          </NavLink>
          <NavLink to="/renters" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}>
            Huurders
          </NavLink>
          <NavLink to="/pricing" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}>
            {t('pricing')}
          </NavLink>
        </nav>
      </div>
      <div style={styles.right}>
        <button style={styles.langBtn} onClick={toggleLang}>{lang === 'nl' ? '🇬🇧 EN' : '🇳🇱 NL'}</button>
        <button style={styles.logoutBtn} onClick={signOut}>{t('logout')}</button>
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: 56,
    background: '#268546',
    flexShrink: 0,
    flexWrap: 'wrap',
    gap: 8,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  logo: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.3px',
  },
  nav: {
    display: 'flex',
    gap: 4,
  },
  link: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    padding: '6px 12px',
    borderRadius: 6,
    transition: 'background 0.15s',
  },
  linkActive: {
    color: '#fff',
    background: 'rgba(255,255,255,0.2)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 6,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 12,
    padding: '4px 10px',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 6,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 13,
    padding: '4px 12px',
  },
}
