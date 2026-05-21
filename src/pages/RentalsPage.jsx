import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

const STATUS_COLORS = {
  active:          { bg: '#dcfce7', color: '#15803d' },
  completed:       { bg: '#dbeafe', color: '#1d4ed8' },
  cancelled:       { bg: '#fee2e2', color: '#dc2626' },
  pending_payment: { bg: '#fef9c3', color: '#854d0e' },
  pending_pickup:  { bg: '#ede9fe', color: '#6d28d9' },
}

export default function RentalsPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [customers, setCustomers] = useState([])
  const [bikes, setBikes] = useState([])
  const [form, setForm] = useState({ renter_id: '', bike_id: '', period_type: 'monthly', start_date: new Date().toISOString().slice(0, 10) })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [pricing, setPricing] = useState([])

  useEffect(() => { loadRentals() }, [])

  async function loadRentals() {
    setLoading(true)
    const { data } = await supabase
      .from('rentals')
      .select('id, period_type, status, start_date, end_date, price_total, created_at, rental_profiles(full_name, email), frame_numbers(frame_number)')
      .order('created_at', { ascending: false })
    setRentals(data ?? [])
    setLoading(false)
  }

  async function openNewRental() {
    const [{ data: c }, { data: b }, { data: p }] = await Promise.all([
      supabase.from('rental_profiles').select('id, full_name, email').order('full_name'),
      supabase.from('frame_numbers').select('id, frame_number, status').eq('is_rental_bike', true).eq('in_archief', false).eq('status', 'in_warehouse').order('name'),
      supabase.from('rental_pricing').select('*').order('period_type'),
    ])
    setCustomers(c ?? [])
    setBikes(b ?? [])
    setPricing(p ?? [])
    setShowForm(true)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    const priceRow = pricing.find(p => p.period_type === form.period_type)
    const { data, error } = await supabase.from('rentals').insert({
      renter_id: form.renter_id,
      frame_number_id: form.bike_id || null,
      period_type: form.period_type,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      status: 'pending_pickup',
      price_total: priceRow?.price ?? null,
    }).select().single()
    if (error) { setFormError(error.message); setSaving(false); return }
    if (form.bike_id) {
      await supabase.from('frame_numbers').update({ status: 'at_the_customer' }).eq('id', form.bike_id)
    }
    setSaving(false)
    setShowForm(false)
    navigate(`/rentals/${data.id}`)
  }

  const PERIOD_LABEL = { '1_day': t('oneDay'), '1_week': t('oneWeek'), 'monthly': t('oneMonth') }

  const STATUS_LABELS = {
    active: t('active'),
    completed: t('completed'),
    cancelled: t('cancelled'),
    pending_payment: t('pendingPayment'),
    pending_pickup: t('pendingPickup'),
    all: 'Alles',
  }

  const filtered = filter === 'all' ? rentals : rentals.filter(r => r.status === filter)

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>{t('rentals')}</h1>
        <button style={styles.addBtn} onClick={openNewRental}>+ {t('newRental')}</button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{t('newRental')}</h2>
          <form onSubmit={handleCreate} style={styles.form}>
            <div style={styles.grid2}>
              <Field label={t('customer')}>
                <select style={styles.input} value={form.renter_id} onChange={e => setForm(f => ({ ...f, renter_id: e.target.value }))} required>
                  <option value="">{t('selectCustomer')}</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.full_name || c.email}</option>)}
                </select>
              </Field>
              <Field label={t('period')}>
                <select style={styles.input} value={form.period_type} onChange={e => setForm(f => ({ ...f, period_type: e.target.value }))}>
                  <option value="1_day">{t('oneDay')} — € {pricing.find(p => p.period_type === '1_day')?.price ?? '—'}</option>
                  <option value="1_week">{t('oneWeek')} — € {pricing.find(p => p.period_type === '1_week')?.price ?? '—'}</option>
                  <option value="monthly">{t('oneMonth')} — € {pricing.find(p => p.period_type === 'monthly')?.price ?? '—'}</option>
                </select>
              </Field>
              <Field label={t('startDate')}>
                <input style={styles.input} type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} required />
              </Field>
              <Field label={t('assignBike')}>
                <select style={styles.input} value={form.bike_id} onChange={e => setForm(f => ({ ...f, bike_id: e.target.value }))}>
                  <option value="">{t('selectBike')}</option>
                  {bikes.map(b => <option key={b.id} value={b.id}>{b.name}{b.frame_number ? ` — ${b.frame_number}` : ''}</option>)}
                </select>
              </Field>
            </div>
            {formError && <p style={styles.error}>{formError}</p>}
            <div style={styles.btnRow}>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>{t('cancel')}</button>
              <button type="submit" style={styles.saveBtn} disabled={saving}>{saving ? '...' : t('save')}</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.filters}>
        {['all', 'pending_pickup', 'active', 'pending_payment', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            style={{ ...styles.filterBtn, ...(filter === s ? styles.filterBtnActive : {}) }}
            onClick={() => setFilter(s)}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.info}>Laden...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.info}>{t('noResults')}</p>
      ) : (
        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <span>{t('renter')}</span>
            <span>{t('bikes')}</span>
            <span>{t('period')}</span>
            <span>{t('startDate')}</span>
            <span>{t('price')}</span>
            <span>{t('status')}</span>
          </div>
          {filtered.map(r => (
            <div key={r.id} style={styles.tableRow} onClick={() => navigate(`/rentals/${r.id}`)}>
              <span>{r.rental_profiles?.full_name ?? r.rental_profiles?.email ?? '—'}</span>
              <span>{r.frame_numbers?.frame_number ?? '—'}{false ? <span style={{ display: 'block', fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{r.bikes.frame_number}</span> : null}</span>
              <span>{PERIOD_LABEL[r.period_type] ?? r.period_type}</span>
              <span>{r.start_date ? new Date(r.start_date).toLocaleDateString() : '—'}</span>
              <span>€ {(r.price_total ?? 0).toFixed(2)}</span>
              <span>
                <span style={{ ...styles.badge, ...STATUS_COLORS[r.status] }}>
                  {STATUS_LABELS[r.status] ?? r.status}
                </span>
              </span>
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
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827' },
  addBtn: { background: '#268546', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  formCard: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 },
  input: { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, padding: '8px 10px', boxSizing: 'border-box' },
  error: { color: '#dc2626', fontSize: 13 },
  btnRow: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  cancelBtn: { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer' },
  saveBtn: { background: '#268546', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  filters: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  filterBtn: { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 20, padding: '5px 14px', fontSize: 13, cursor: 'pointer', color: '#374151' },
  filterBtnActive: { background: '#268546', color: '#fff', borderColor: '#268546' },
  card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '12px 16px', fontSize: 14, color: '#374151', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', alignItems: 'center' },
  badge: { display: 'inline-block', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 },
  info: { color: '#9ca3af', fontSize: 14 },
}
