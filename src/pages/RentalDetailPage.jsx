import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

const STATUS_COLORS = {
  active:          { bg: '#dcfce7', color: '#15803d' },
  completed:       { bg: '#dbeafe', color: '#1d4ed8' },
  cancelled:       { bg: '#fee2e2', color: '#dc2626' },
  pending_payment: { bg: '#fef9c3', color: '#854d0e' },
  pending_pickup:  { bg: '#ede9fe', color: '#6d28d9' },
}

const VERIFF_COLORS = {
  approved: { bg: '#dcfce7', color: '#15803d' },
  declined: { bg: '#fee2e2', color: '#dc2626' },
  pending:  { bg: '#fef9c3', color: '#854d0e' },
}

export default function RentalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [rental, setRental] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [availableBikes, setAvailableBikes] = useState([])
  const [selectedBikeId, setSelectedBikeId] = useState('')

  useEffect(() => { loadRental() }, [id])

  async function loadRental() {
    setLoading(true)
    const { data } = await supabase
      .from('rentals')
      .select('*, rental_profiles(full_name, email, phone, veriff_status), frame_numbers(id, frame_number, frame_type, status)')
      .eq('id', id)
      .single()
    setRental(data)
    setSelectedBikeId(data?.frame_number_id ?? '')
    setLoading(false)
  }

  async function loadAvailableBikes() {
    const { data } = await supabase
      .from('bikes')
      .select('id, frame_number')
      .eq('is_rental_bike', true)
      .eq('in_archief', false)
      .eq('status', 'in_warehouse')
      .order('frame_number')
    setAvailableBikes(data ?? [])
  }

  async function updateStatus(status) {
    setSaving(true)
    await supabase.from('rentals').update({ status }).eq('id', id)
    await loadRental()
    setSaving(false)
  }

  async function confirmPickup() {
    setSaving(true)
    const updates = { status: 'active' }
    if (selectedBikeId && selectedBikeId !== rental.frame_number_id) {
      updates.frame_number_id = selectedBikeId
      if (rental.frame_number_id) {
        await supabase.from('frame_numbers').update({ status: 'in_warehouse' }).eq('id', rental.frame_number_id)
      }
      await supabase.from('frame_numbers').update({ status: 'at_the_customer' }).eq('id', selectedBikeId)
    } else if (rental.frame_number_id) {
      await supabase.from('frame_numbers').update({ status: 'at_the_customer' }).eq('id', rental.frame_number_id)
    }
    await supabase.from('rentals').update(updates).eq('id', id)
    await loadRental()
    setSaving(false)
  }

  async function completeRental() {
    setSaving(true)
    await supabase.from('rentals').update({ status: 'completed', end_date: new Date().toISOString() }).eq('id', id)
    if (rental.frame_number_id) {
      await supabase.from('frame_numbers').update({ status: 'in_warehouse' }).eq('id', rental.frame_number_id)
    }
    await loadRental()
    setSaving(false)
  }

  const PERIOD_LABEL = { '1_day': t('oneDay'), '1_week': t('oneWeek'), 'monthly': t('oneMonth') }
  const STATUS_LABELS = {
    active: t('active'),
    completed: t('completed'),
    cancelled: t('cancelled'),
    pending_payment: t('pendingPayment'),
    pending_pickup: t('pendingPickup'),
  }

  if (loading) return <div style={styles.page}><p>Laden...</p></div>
  if (!rental) return <div style={styles.page}><p>Verhuur niet gevonden.</p></div>

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate('/rentals')}>← {t('back')}</button>

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Verhuur #{id.slice(0, 8).toUpperCase()}</h1>
          <span style={{ ...styles.badge, ...STATUS_COLORS[rental.status] }}>
            {STATUS_LABELS[rental.status] ?? rental.status}
          </span>
        </div>
        <div style={styles.btnRow}>
          {rental.status === 'pending_payment' && (
            <button style={styles.actionBtn} onClick={() => updateStatus('pending_pickup')} disabled={saving}>
              ✓ Betaling ontvangen
            </button>
          )}
          {rental.status === 'pending_pickup' && (
            <button style={styles.actionBtn} onClick={confirmPickup} disabled={saving || (!selectedBikeId && !rental.frame_number_id)}>
              ✓ {t('confirmPickup')}
            </button>
          )}
          {rental.status === 'active' && (
            <button style={styles.actionBtn} onClick={completeRental} disabled={saving}>
              ✓ Fiets retour
            </button>
          )}
          {['pending_payment', 'pending_pickup', 'active'].includes(rental.status) && (
            <button style={styles.cancelBtn} onClick={() => updateStatus('cancelled')} disabled={saving}>
              Annuleren
            </button>
          )}
        </div>
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>{t('renter')}</h2>
          <InfoRow label="Naam" value={rental.rental_profiles?.full_name} />
          <InfoRow label={t('email')} value={rental.rental_profiles?.email} />
          <InfoRow label="Telefoon" value={rental.rental_profiles?.phone} />
          <InfoRow label={t('veriffStatus')} value={
            <span style={{ ...styles.badge, ...VERIFF_COLORS[rental.rental_profiles?.veriff_status] }}>
              {t(rental.rental_profiles?.veriff_status ?? 'pending')}
            </span>
          } />
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>{t('bikes')}</h2>
          {rental.status === 'pending_pickup' ? (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={styles.fieldLabel}>{t('assignBike')}</label>
                <select
                  style={styles.select}
                  value={selectedBikeId}
                  onFocus={loadAvailableBikes}
                  onChange={e => setSelectedBikeId(e.target.value)}
                >
                  <option value="">{t('selectBike')}</option>
                  {rental.frame_number_id && rental.frame_numbers && (
                    <option value={rental.frame_number_id}>{rental.frame_numbers.frame_number} (huidig)</option>
                  )}
                  {availableBikes.filter(b => b.id !== rental.frame_number_id).map(b => (
                    <option key={b.id} value={b.id}>{b.frame_number}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <InfoRow label={t('frameNumber')} value={<span style={{ fontFamily: 'monospace' }}>{rental.frame_numbers?.frame_number}</span>} />
              <InfoRow label={t('bikeType')} value={rental.frame_numbers?.frame_type} />
              <InfoRow label={t('location')} value="Weert" />
            </>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Boeking</h2>
        <InfoRow label={t('period')} value={PERIOD_LABEL[rental.period_type] ?? rental.period_type} />
        <InfoRow label={t('startDate')} value={rental.start_date ? new Date(rental.start_date).toLocaleString('nl-NL') : '—'} />
        <InfoRow label={t('endDate')} value={rental.end_date ? new Date(rental.end_date).toLocaleString('nl-NL') : '—'} />
        <InfoRow label={t('price')} value={`€ ${(rental.price_total ?? 0).toFixed(2)}`} />
        <InfoRow label={t('paymentStatus')} value={rental.mollie_payment_status ?? '—'} />
      </div>
    </div>
  )
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
  btnRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  actionBtn: { background: '#268546', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  cancelBtn: { background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: '#dc2626', cursor: 'pointer' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 16, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 },
  infoRow: { display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' },
  infoLabel: { fontSize: 13, fontWeight: 600, color: '#6b7280', minWidth: 130 },
  infoValue: { fontSize: 14, color: '#111827' },
  fieldLabel: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 },
  select: { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, padding: '8px 10px', boxSizing: 'border-box' },
}
