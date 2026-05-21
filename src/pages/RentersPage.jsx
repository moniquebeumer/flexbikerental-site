import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const VERIFF_COLORS = {
  approved: { bg: '#dcfce7', color: '#15803d' },
  declined:  { bg: '#fee2e2', color: '#dc2626' },
  pending:   { bg: '#fef9c3', color: '#854d0e' },
}
const VERIFF_LABELS = { approved: 'Goedgekeurd', declined: 'Afgewezen', pending: 'In behandeling' }

export default function RentersPage() {
  const navigate = useNavigate()
  const [renters, setRenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadRenters() }, [])

  async function loadRenters() {
    setLoading(true)
    const { data } = await supabase
      .from('rental_profiles')
      .select(`
        id, full_name, email, phone, veriff_status, created_at,
        rentals(id, status)
      `)
      .order('created_at', { ascending: false })
    setRenters(data ?? [])
    setLoading(false)
  }

  const filtered = renters.filter(r => {
    const matchesQuery = !query ||
      r.full_name?.toLowerCase().includes(query.toLowerCase()) ||
      r.email?.toLowerCase().includes(query.toLowerCase()) ||
      r.phone?.includes(query)
    const matchesFilter = filter === 'all' || r.veriff_status === filter
    return matchesQuery && matchesFilter
  })

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Huurders</h1>

      <div style={styles.toolbar}>
        <input
          style={styles.search}
          placeholder="Zoek op naam, e-mail of telefoon..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div style={styles.filters}>
          {['all', 'approved', 'pending', 'declined'].map(s => (
            <button
              key={s}
              style={{ ...styles.filterBtn, ...(filter === s ? styles.filterBtnActive : {}) }}
              onClick={() => setFilter(s)}
            >
              {{ all: 'Alles', approved: 'Goedgekeurd', pending: 'In behandeling', declined: 'Afgewezen' }[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={styles.info}>Laden...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.info}>Geen huurders gevonden.</p>
      ) : (
        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <span>Naam</span>
            <span>E-mail</span>
            <span>Telefoon</span>
            <span>Verificatie</span>
            <span>Verhuren</span>
            <span>Lid sinds</span>
          </div>
          {filtered.map(r => {
            const activeRentals = r.rentals?.filter(x => x.status === 'active').length ?? 0
            const totalRentals = r.rentals?.length ?? 0
            return (
              <div key={r.id} style={styles.tableRow} onClick={() => navigate(`/renters/${r.id}`)}>
                <span style={{ fontWeight: 600, color: '#111827' }}>{r.full_name ?? '—'}</span>
                <span style={{ color: '#6b7280' }}>{r.email ?? '—'}</span>
                <span style={{ color: '#6b7280' }}>{r.phone ?? '—'}</span>
                <span>
                  <span style={{ ...styles.badge, ...(VERIFF_COLORS[r.veriff_status] ?? VERIFF_COLORS.pending) }}>
                    {VERIFF_LABELS[r.veriff_status] ?? 'In behandeling'}
                  </span>
                </span>
                <span style={{ color: '#374151' }}>
                  {activeRentals > 0
                    ? <span style={{ color: '#15803d', fontWeight: 600 }}>{activeRentals} actief</span>
                    : <span style={{ color: '#9ca3af' }}>{totalRentals} totaal</span>
                  }
                </span>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>
                  {new Date(r.created_at).toLocaleDateString('nl-NL')}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: '32px', maxWidth: 1100, margin: '0 auto' },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 20 },
  toolbar: { display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  search: { flex: 1, minWidth: 240, border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, padding: '8px 12px' },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 20, padding: '5px 14px', fontSize: 13, cursor: 'pointer', color: '#374151' },
  filterBtnActive: { background: '#268546', color: '#fff', borderColor: '#268546' },
  card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr', padding: '12px 16px', fontSize: 14, borderBottom: '1px solid #f3f4f6', cursor: 'pointer', alignItems: 'center' },
  badge: { display: 'inline-block', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 },
  info: { color: '#9ca3af', fontSize: 14 },
}
