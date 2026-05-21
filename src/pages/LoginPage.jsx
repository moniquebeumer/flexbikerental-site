import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signIn(email, password)
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>BikeRental</div>
        <p style={styles.sub}>Admin</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>{t('email')}</label>
          <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          <label style={styles.label}>{t('password')}</label>
          <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? '...' : t('login')}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f3f4f6',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 380,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 800,
    color: '#268546',
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    textAlign: 'left',
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginTop: 4,
  },
  input: {
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    padding: '9px 12px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: {
    color: '#dc2626',
    fontSize: 13,
    margin: '4px 0',
  },
  btn: {
    marginTop: 8,
    background: '#268546',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
}
