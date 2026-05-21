import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

export default function PricingPage() {
  const { t } = useLanguage()
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => { loadPricing() }, [])

  async function loadPricing() {
    setLoading(true)
    const { data } = await supabase.from('pricing').select('*').order('period_type')
    setPricing(data ?? [])
    setLoading(false)
  }

  async function handleSave(item) {
    setSaving(item.id)
    await supabase.from('pricing').update({ price: item.price }).eq('id', item.id)
    setSaving(null)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  function updatePrice(id, value) {
    setPricing(prev => prev.map(p => p.id === id ? { ...p, price: value } : p))
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{t('pricing')}</h1>
      {success && <div style={styles.success}>Opgeslagen!</div>}

      {loading ? (
        <p style={styles.info}>Laden...</p>
      ) : (
        <div style={styles.card}>
          {pricing.map(item => (
            <div key={item.id} style={styles.row}>
              <div>
                <div style={styles.periodLabel}>
                  {item.period_type === '1_day' ? t('oneDay') : item.period_type === '1_week' ? t('oneWeek') : t('oneMonth')}
                </div>
                <div style={styles.periodSub}>{item.period_type}</div>
              </div>
              <div style={styles.priceRow}>
                <span style={styles.euro}>€</span>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={e => updatePrice(item.id, e.target.value)}
                />
                <button
                  style={styles.saveBtn}
                  onClick={() => handleSave(item)}
                  disabled={saving === item.id}
                >
                  {saving === item.id ? '...' : t('save')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: '32px', maxWidth: 600, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 24 },
  success: { background: '#dcfce7', color: '#15803d', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 14, fontWeight: 600 },
  card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' },
  periodLabel: { fontSize: 16, fontWeight: 700, color: '#111827' },
  periodSub: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  priceRow: { display: 'flex', alignItems: 'center', gap: 8 },
  euro: { fontSize: 16, color: '#374151', fontWeight: 600 },
  input: { border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, padding: '7px 10px', width: 100, textAlign: 'right' },
  saveBtn: { background: '#268546', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  info: { color: '#9ca3af', fontSize: 14 },
}
