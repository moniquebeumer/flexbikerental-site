import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

const STATUS_COLORS = {
  in_warehouse:    { bg: '#dcfce7', color: '#15803d' },
  at_the_customer: { bg: '#dbeafe', color: '#1d4ed8' },
  in_repair:       { bg: '#fef9c3', color: '#854d0e' },
}
const STATUS_LABELS = { in_warehouse: 'Beschikbaar', at_the_customer: 'Verhuurd', in_repair: 'Onderhoud' }

export default function BikesPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ frame_number: '', extra_info: '', frame_type: 'other', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { loadBikes() }, [])

  async function loadBikes() {
    setLoading(true)
    const { data } = await supabase
      .from('frame_numbers')
      .select('id, frame_number, frame_type, status, extra_info, notes, in_archief')
      .eq('is_rental_bike', true)
      .eq('in_archief', false)
      .order('frame_number')
    setBikes(data ?? [])
    setLoading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('frame_numbers')
      .insert({ ...form, is_rental_bike: true, status: 'in_warehouse' })
      .select()
      .single()
    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false)
    setShowForm(false)
    setForm({ frame_number: '', extra_info: '', frame_type: 'other', notes: '' })
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
              <Field label={t('frameNumber')}>
                <input style={styles.input} value={form.frame_number} onChange={e => setForm(f => ({ ...f, frame_number: e.target.value }))} required autoFocus />
              </Field>
              <Field label={t('bikeType')}>
                <select style={styles.input} value={form.frame_type} onChange={e => setForm(f => ({ ...f, frame_type: e.target.value }))}>
                  <option value="gen2plus">Gen2+</option>
                  <option value="gen3">Gen3</option>
                  <option value="giant">Giant</option>
                  <option value="popal">Popal</option>
                  <option value="other">Overig</option>
                </select>
              </Field>
            </div>
            <Field label={t('description')}>
              <textarea style={{ ...styles.input, minHeight: 70, resize: 'vertical' }} value={form.extra_info} onChange={e => setForm(f => ({ ...f, extra_info: e.target.value }))} />
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
              <div style={styles.cardImgPlaceholder}>🚲</div>
              <div style={styles.cardBody}>
                <div style={styles.cardName}>{bike.frame_number}</div>
                <div style={styles.cardMeta}>{bike.frame_type} · Weert</div>
                {bike.extra_info && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{bike.extra_info}</div>}
                <span style={{ ...styles.badge, ...(STATUS_COLORS[bike.status] ?? {}) }}>
                  {STATUS_LABELS[bike.status] ?? bike.status}
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
  return <div><label style={styles.label}>{label}</label>{children}</div>
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
  card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer', overflow: 'hidden' },
  cardImgPlaceholder: { width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: '#f9fafb' },
  cardBody: { padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 },
  cardName: { fontWeight: 700, fontSize: 15, color: '#111827', fontFamily: 'monospace' },
  cardMeta: { fontSize: 13, color: '#6b7280' },
  badge: { display: 'inline-block', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, marginTop: 4 },
}
