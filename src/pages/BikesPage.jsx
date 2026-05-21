import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

const STATUS_COLORS = {
  available:   { bg: '#dcfce7', color: '#15803d' },
  rented:      { bg: '#dbeafe', color: '#1d4ed8' },
  maintenance: { bg: '#fef9c3', color: '#854d0e' },
}

export default function BikesPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', frame_number: '', description: '', bike_type: 'city', status: 'available', location: 'Weert' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { loadBikes() }, [])

  async function loadBikes() {
    setLoading(true)
    const { data } = await supabase.from('bikes').select('*').eq('in_archief', false).order('name')
    setBikes(data ?? [])
    setLoading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { data, error: err } = await supabase.from('bikes').insert(form).select().single()
    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false)
    setShowForm(false)
    setForm({ name: '', frame_number: '', description: '', bike_type: 'city', status: 'available', location: 'Weert' })
    navigate(`/bikes/${data.id}`)
  }

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>{t('bikes')}</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ {t('newBike')}</button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{t('newBike')}</h2>
          <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.grid2}>
              <Field label={t('name')}>
                <input style={styles.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoFocus />
              </Field>
              <Field label={t('frameNumber')}>
                <input style={styles.input} value={form.frame_number} onChange={e => setForm(f => ({ ...f, frame_number: e.target.value }))} />
              </Field>
              <Field label={t('bikeType')}>
                <select style={styles.input} value={form.bike_type} onChange={e => setForm(f => ({ ...f, bike_type: e.target.value }))}>
                  <option value="city">City</option>
                  <option value="electric">Elektrisch</option>
                  <option value="cargo">Cargo</option>
                </select>
              </Field>
              <Field label={t('location')}>
                <input style={styles.input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </Field>
              <Field label={t('status')}>
                <select style={styles.input} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="available">{t('available')}</option>
                  <option value="maintenance">{t('maintenance')}</option>
                </select>
              </Field>
            </div>
            <Field label={t('description')}>
              <textarea style={{ ...styles.input, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </Field>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.btnRow}>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>{t('cancel')}</button>
              <button type="submit" style={styles.saveBtn} disabled={saving}>{saving ? '...' : t('save')}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={styles.info}>Laden...</p>
      ) : bikes.length === 0 ? (
        <p style={styles.info}>{t('noResults')}</p>
      ) : (
        <div style={styles.grid}>
          {bikes.map(bike => (
            <div key={bike.id} style={styles.card} onClick={() => navigate(`/bikes/${bike.id}`)}>
              {bike.image_url && <img src={bike.image_url} alt={bike.name} style={styles.cardImg} />}
              {!bike.image_url && <div style={styles.cardImgPlaceholder}>🚲</div>}
              <div style={styles.cardBody}>
                <div style={styles.cardName}>{bike.name}</div>
                <div style={styles.cardMeta}>{bike.bike_type} · {bike.location}</div>
                {bike.frame_number && <div style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{bike.frame_number}</div>}
                <span style={{ ...styles.badge, ...STATUS_COLORS[bike.status] }}>
                  {t(bike.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  )
}

const styles = {
  page: { padding: '32px', maxWidth: 1100, margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827' },
  addBtn: { background: '#268546', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  formCard: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 },
  input: { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, padding: '8px 10px', boxSizing: 'border-box' },
  error: { color: '#dc2626', fontSize: 13 },
  btnRow: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  cancelBtn: { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer' },
  saveBtn: { background: '#268546', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  info: { color: '#9ca3af', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 },
  card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow 0.15s' },
  cardImg: { width: '100%', height: 140, objectFit: 'cover' },
  cardImgPlaceholder: { width: '100%', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: '#f9fafb' },
  cardBody: { padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 },
  cardName: { fontWeight: 700, fontSize: 15, color: '#111827' },
  cardMeta: { fontSize: 13, color: '#6b7280' },
  badge: { display: 'inline-block', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, marginTop: 4 },
}
