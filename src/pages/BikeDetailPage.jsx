import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

const STATUS_COLORS = {
  available:   { bg: '#dcfce7', color: '#15803d' },
  rented:      { bg: '#dbeafe', color: '#1d4ed8' },
  maintenance: { bg: '#fef9c3', color: '#854d0e' },
}

const RENTAL_STATUS_COLORS = {
  active:          { bg: '#dcfce7', color: '#15803d' },
  completed:       { bg: '#dbeafe', color: '#1d4ed8' },
  cancelled:       { bg: '#fee2e2', color: '#dc2626' },
  pending_payment: { bg: '#fef9c3', color: '#854d0e' },
}

export default function BikeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [bike, setBike] = useState(null)
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBike()
    loadRentals()
  }, [id])

  async function loadBike() {
    setLoading(true)
    const { data } = await supabase.from('bikes').select('*').eq('id', id).single()
    setBike(data)
    setForm(data ?? {})
    setLoading(false)
  }

  async function loadRentals() {
    const { data } = await supabase
      .from('rentals')
      .select('id, period_type, status, start_date, end_date, price_total, profiles(full_name, email)')
      .eq('bike_id', id)
      .order('created_at', { ascending: false })
    setRentals(data ?? [])
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('bikes').update({
      name: form.name,
      description: form.description,
      bike_type: form.bike_type,
      status: form.status,
      location: form.location,
    }).eq('id', id)
    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false)
    setEditing(false)
    loadBike()
  }

  async function handleDelete() {
    if (!confirm(t('confirmDelete'))) return
    await supabase.from('bikes').update({ in_archief: true }).eq('id', id)
    navigate('/bikes')
  }

  if (loading) return <div style={styles.page}><p>Laden...</p></div>
  if (!bike) return <div style={styles.page}><p>Fiets niet gevonden.</p></div>

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate('/bikes')}>← {t('back')}</button>

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>{bike.name}</h1>
          <span style={{ ...styles.badge, ...STATUS_COLORS[bike.status] }}>{t(bike.status)}</span>
        </div>
        <div style={styles.btnRow}>
          <button style={styles.editBtn} onClick={() => setEditing(e => !e)}>{editing ? t('cancel') : t('edit')}</button>
          <button style={styles.deleteBtn} onClick={handleDelete}>{t('delete')}</button>
        </div>
      </div>

      {editing ? (
        <div style={styles.card}>
          <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.grid2}>
              <Field label={t('name')}>
                <input style={styles.input} value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </Field>
              <Field label={t('bikeType')}>
                <select style={styles.input} value={form.bike_type ?? 'city'} onChange={e => setForm(f => ({ ...f, bike_type: e.target.value }))}>
                  <option value="city">City</option>
                  <option value="electric">Elektrisch</option>
                  <option value="cargo">Cargo</option>
                </select>
              </Field>
              <Field label={t('location')}>
                <input style={styles.input} value={form.location ?? ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </Field>
              <Field label={t('status')}>
                <select style={styles.input} value={form.status ?? 'available'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="available">{t('available')}</option>
                  <option value="rented">{t('rented')}</option>
                  <option value="maintenance">{t('maintenance')}</option>
                </select>
              </Field>
            </div>
            <Field label={t('description')}>
              <textarea style={{ ...styles.input, minHeight: 80, resize: 'vertical' }} value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </Field>
            {error && <p style={styles.error}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" style={styles.saveBtn} disabled={saving}>{saving ? '...' : t('save')}</button>
            </div>
          </form>
        </div>
      ) : (
        <div style={styles.card}>
          <InfoRow label={t('bikeType')} value={bike.bike_type} />
          <InfoRow label={t('location')} value={bike.location} />
          <InfoRow label={t('description')} value={bike.description} />
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>{t('rentals')}</h2>
        {rentals.length === 0 ? (
          <p style={styles.empty}>{t('noResults')}</p>
        ) : rentals.map(r => (
          <div key={r.id} style={styles.rentalRow} onClick={() => navigate(`/rentals/${r.id}`)}>
            <span>{r.profiles?.full_name ?? r.profiles?.email ?? '—'}</span>
            <span>{r.period_type === '1_day' ? t('oneDay') : t('oneWeek')}</span>
            <span>{r.start_date ? new Date(r.start_date).toLocaleDateString() : '—'}</span>
            <span>€ {(r.price_total ?? 0).toFixed(2)}</span>
            <span style={{ ...styles.badge, ...RENTAL_STATUS_COLORS[r.status] }}>{t(r.status) ?? r.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return <div><label style={styles.label}>{label}</label>{children}</div>
}

function InfoRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value ?? '—'}</span>
    </div>
  )
}

const styles = {
  page: { padding: '32px', maxWidth: 900, margin: '0 auto' },
  backBtn: { background: 'none', border: 'none', color: '#268546', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 16, fontWeight: 600 },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 8 },
  badge: { display: 'inline-block', borderRadius: 20, padding: '3px 12px', fontSize: 13, fontWeight: 600 },
  btnRow: { display: 'flex', gap: 8 },
  editBtn: { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 16px', fontSize: 13, cursor: 'pointer' },
  deleteBtn: { background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '7px 16px', fontSize: 13, color: '#dc2626', cursor: 'pointer' },
  card: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 16, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 },
  input: { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, padding: '8px 10px', boxSizing: 'border-box' },
  error: { color: '#dc2626', fontSize: 13 },
  saveBtn: { background: '#268546', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  infoRow: { display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid #f3f4f6' },
  infoLabel: { fontSize: 13, fontWeight: 600, color: '#6b7280', minWidth: 120 },
  infoValue: { fontSize: 14, color: '#111827' },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 },
  rentalRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '10px 0', borderBottom: '1px solid #f3f4f6', fontSize: 14, cursor: 'pointer', gap: 8, alignItems: 'center' },
  empty: { color: '#9ca3af', fontSize: 14 },
}
