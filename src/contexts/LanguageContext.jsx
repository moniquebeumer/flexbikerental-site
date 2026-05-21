import { createContext, useContext, useState } from 'react'

const translations = {
  nl: {
    dashboard: 'Dashboard',
    bikes: 'Fietsen',
    rentals: 'Verhuren',
    pricing: 'Tarieven',
    logout: 'Uitloggen',
    login: 'Inloggen',
    email: 'E-mailadres',
    password: 'Wachtwoord',
    save: 'Opslaan',
    cancel: 'Annuleren',
    edit: 'Bewerken',
    delete: 'Verwijderen',
    add: 'Toevoegen',
    back: 'Terug',
    name: 'Naam',
    status: 'Status',
    available: 'Beschikbaar',
    rented: 'Verhuurd',
    maintenance: 'Onderhoud',
    location: 'Locatie',
    description: 'Omschrijving',
    bikeType: 'Type fiets',
    actions: 'Acties',
    noResults: 'Geen resultaten',
    errorLoad: 'Fout bij laden',
    renter: 'Huurder',
    startDate: 'Startdatum',
    endDate: 'Einddatum',
    period: 'Periode',
    oneDay: '1 dag',
    oneWeek: '1 week',
    price: 'Prijs',
    paymentStatus: 'Betalingstatus',
    active: 'Actief',
    completed: 'Afgerond',
    cancelled: 'Geannuleerd',
    pendingPayment: 'Wacht op betaling',
    newBike: 'Nieuwe fiets',
    editBike: 'Fiets bewerken',
    confirmDelete: 'Weet je zeker dat je dit wilt verwijderen?',
    veriffStatus: 'Verificatiestatus',
    approved: 'Goedgekeurd',
    declined: 'Afgewezen',
    pending: 'In behandeling',
    totalRevenue: 'Totale omzet',
    activeRentals: 'Actieve verhuren',
    availableBikes: 'Beschikbare fietsen',
    recentRentals: 'Recente verhuren',
    oneMonth: '1 maand',
    pendingPickup: 'Wacht op ophalen',
    newRental: 'Nieuwe verhuur',
    frameNumber: 'Framenummer',
    assignBike: 'Fiets toewijzen',
    confirmPickup: 'Ophalen bevestigen',
    customer: 'Klant',
    selectCustomer: '— Kies klant —',
    selectBike: '— Kies fiets —',
    rentalCreated: 'Verhuur aangemaakt',
  },
  en: {
    dashboard: 'Dashboard',
    bikes: 'Bikes',
    rentals: 'Rentals',
    pricing: 'Pricing',
    logout: 'Log out',
    login: 'Log in',
    email: 'Email address',
    password: 'Password',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    back: 'Back',
    name: 'Name',
    status: 'Status',
    available: 'Available',
    rented: 'Rented',
    maintenance: 'Maintenance',
    location: 'Location',
    description: 'Description',
    bikeType: 'Bike type',
    actions: 'Actions',
    noResults: 'No results',
    errorLoad: 'Error loading data',
    renter: 'Renter',
    startDate: 'Start date',
    endDate: 'End date',
    period: 'Period',
    oneDay: '1 day',
    oneWeek: '1 week',
    price: 'Price',
    paymentStatus: 'Payment status',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pendingPayment: 'Pending payment',
    newBike: 'New bike',
    editBike: 'Edit bike',
    confirmDelete: 'Are you sure you want to delete this?',
    veriffStatus: 'Verification status',
    approved: 'Approved',
    declined: 'Declined',
    pending: 'Pending',
    totalRevenue: 'Total revenue',
    activeRentals: 'Active rentals',
    availableBikes: 'Available bikes',
    recentRentals: 'Recent rentals',
    oneMonth: '1 month',
    pendingPickup: 'Pending pickup',
    newRental: 'New rental',
    frameNumber: 'Frame number',
    assignBike: 'Assign bike',
    confirmPickup: 'Confirm pickup',
    customer: 'Customer',
    selectCustomer: '— Select customer —',
    selectBike: '— Select bike —',
    rentalCreated: 'Rental created',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'nl')

  function toggleLang() {
    const next = lang === 'nl' ? 'en' : 'nl'
    setLang(next)
    localStorage.setItem('lang', next)
  }

  function t(key) {
    return translations[lang][key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
