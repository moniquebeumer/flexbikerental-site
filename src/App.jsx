import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppHeader from './components/AppHeader'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BikesPage from './pages/BikesPage'
import BikeDetailPage from './pages/BikeDetailPage'
import RentalsPage from './pages/RentalsPage'
import RentalDetailPage from './pages/RentalDetailPage'
import PricingPage from './pages/PricingPage'

function AppRoutes() {
  const { session, loading } = useAuth()
  if (loading) return null
  if (!session) return <LoginPage />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader />
      <main style={{ flex: 1, background: '#f3f4f6' }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/bikes" element={<BikesPage />} />
          <Route path="/bikes/:id" element={<BikeDetailPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/rentals/:id" element={<RentalDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
