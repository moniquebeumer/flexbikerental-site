import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

export default function DashboardPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ available: 0, active: 0, revenue: 0 })
  const [recentRentals, setRecentRentals] = useState([])

  useEffect(() => {
    loadStats()
    loadRecentRentals()
  }, [])

  async function loadStats() {
    const [{ count: available }, { count: active }, { data: revenue }] = await Promise.all([
      supabase.from('frame_numbers').select('*', { count: 'exact', head: true }).eq('is_rental_bike', true).eq('status', 'in_warehouse').eq('in_archief', false),
      supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('rentals').select('price_total').eq('status', 'completed'),
    ])
    const total = (revenue ?? []).reduce((sum, r) => sum + (r.price_total ?? 0), 0)
    setStats({ available: available ?? 0, active: active ?? 0, revenue: total })
  }

  async function loadRecentRentals() {
    const { data } = await supabase
      .from('rentals')
      .select('id, period_type, status, start_date, price_total, rental_profiles(full_name, email), frame_numbers(frame_number)')
      .order('created_at', { ascending: false })
      .limit(5)
    setRecentRentals(data ?? [])
  }

  const STATUS_COLORS = {
    active: { bg: '#dcfce7', color: '#15803d' },
    completed: { bg: '#dbeafe', color: '#1d4ed8' },
    cancelled: { bg: '#fee2e2', color: '#dc2626' },
    pending_payment: { bg: '#fef9c3', color: '#854d0e' },
  }

  const STATUS_LABELS = {
    active: t('active'),
    completed: t('completed'),
    cancelled: t('cancelled'),
    pending_payment: t('pendingPayment'),
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{t('dashboard')}</h1>

      <div style={styles.statsGrid}>
        <StatCard label={t('availableBikes')} value={stats.available} color="#268546" />
        <StatCard label={t('activeRentals')} value={stats.active} color="#1d4ed8" />
        <StatCard label={t('totalRevenue')} value={`€ ${stats.revenue.toFixed(2)}`} color="#7e22ce" />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{t('recentRentals')}</h2>
        {recentRentals.length === 0 ? (
          <p style={styles.empty}>{t('noResults')}</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>{t('renter')}</span>
              <span>{t('bikes')}</span>
              <span>{t('period')}</span>
              <span>{t('price')}</span>
              <span>{t('status')}</span>
            </div>
            {recentRentals.map(r => (
              <div key={r.id} style={styles.tableRow} onClick={() => navigate(`/rentals/${r.id}`)}>
                <span>{r.rental_profiles?.full_name ?? r.rental_profiles?.email ?? '—'}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{r.frame_numbers?.frame_number ?? '—'}</span>
                <span>{{ '1_day': t('oneDay'), '1_week': t('oneWeek'), 'monthly': t('oneMonth') }[r.period_type] ?? r.period_type}</span>
                <span>€ {(r.price_total ?? 0).toFixed(2)}</span>
                <span>
                  <span style={{ ...styles.badge, background: STATUS_COLORS[r.status]?.bg, color: STATUS_COLORS[r.status]?.color }}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statValue, color }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  )
}

const styles = {
  page: { padding: '32px', maxWidth: 1100, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 24 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 },
  statCard: { background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' },
  statValue: { fontSize: 32, fontWeight: 800, marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#6b7280' },
  section: { background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 },
  empty: { color: '#9ca3af', fontSize: 14 },
  table: { display: 'flex', flexDirection: 'column', gap: 0 },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px', fontSize: 14, color: '#374151', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', borderRadius: 6 },
  badge: { borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 },
}
