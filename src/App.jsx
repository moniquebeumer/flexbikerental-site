import { useState } from 'react'
import { translations } from './i18n/translations'
import './index.css'

const LANGS = [
  { code: 'nl', label: 'NL' },
  { code: 'en', label: 'EN' },
  { code: 'pl', label: 'PL' },
  { code: 'tr', label: 'TR' },
]

const REGISTER_URL = 'https://app.flexbikerental.nl'

export default function App() {
  const [lang, setLang] = useState('nl')
  const [openFaq, setOpenFaq] = useState(null)
  const t = translations[lang]

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>🚲 FlexBikeRental</div>
          <nav style={styles.nav}>
            {['howItWorks', 'pricing', 'location', 'faq'].map(key => (
              <button key={key} style={styles.navLink} onClick={() => scrollTo(key)}>
                {t.nav[key]}
              </button>
            ))}
          </nav>
          <div style={styles.headerRight}>
            <div style={styles.langSwitcher}>
              {LANGS.map(l => (
                <button key={l.code} style={{ ...styles.langBtn, ...(lang === l.code ? styles.langBtnActive : {}) }} onClick={() => setLang(l.code)}>
                  {l.label}
                </button>
              ))}
            </div>
            <a href={REGISTER_URL} style={styles.ctaBtn}>{t.nav.register}</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>{t.hero.badge}</div>
        <h1 style={styles.heroTitle}>{t.hero.tagline}</h1>
        <p style={styles.heroSub}>{t.hero.sub}</p>
        <a href={REGISTER_URL} style={styles.heroBtn}>{t.hero.cta} →</a>
      </section>

      {/* How it works */}
      <section id="howItWorks" style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>{t.how.title}</h2>
          <div style={styles.stepsGrid}>
            {t.how.steps.map((step, i) => (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepNumber}>{i + 1}</div>
                <div style={styles.stepIcon}>{step.icon}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ ...styles.section, background: '#f0fdf4' }}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>{t.pricing.title}</h2>
          <p style={styles.sectionSub}>{t.pricing.sub}</p>
          <div style={styles.plansGrid}>
            {t.pricing.plans.map((plan, i) => (
              <div key={i} style={{ ...styles.planCard, ...(plan.popular ? styles.planCardPopular : {}) }}>
                {plan.popular && <div style={styles.popularBadge}>⭐ Most popular</div>}
                <div style={styles.planPeriod}>{plan.period}</div>
                <div style={styles.planPrice}>{plan.price}</div>
                <div style={styles.planNote}>{plan.note}</div>
                <a href={REGISTER_URL} style={{ ...styles.planBtn, ...(plan.popular ? styles.planBtnPopular : {}) }}>
                  {t.nav.register}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>{t.location.title}</h2>
          <p style={styles.sectionSub}>{t.location.sub}</p>
          <div style={styles.locationCard}>
            <div style={styles.locationInfo}>
              <div style={styles.locationRow}>
                <span style={styles.locationIcon}>📍</span>
                <span>{t.location.address}</span>
              </div>
              <div style={styles.locationRow}>
                <span style={styles.locationIcon}>🕐</span>
                <span>{t.location.hours}</span>
              </div>
              <div style={{ ...styles.locationRow, marginTop: 8, padding: '12px 16px', background: '#fef9c3', borderRadius: 8, fontSize: 14, color: '#854d0e' }}>
                <span style={styles.locationIcon}>ℹ️</span>
                <span>{t.location.note}</span>
              </div>
            </div>
            <div style={styles.mapPlaceholder}>
              <iframe
                title="Weert locatie"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2487.5!2d5.7089!3d51.2521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zRHIuIFNjaGFlcG1hbnN0cmFhdCA0NUIsIFdlZXJ0!5e0!3m2!1snl!2snl!4v1"
                width="100%"
                height="260"
                style={{ border: 0, borderRadius: 12 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ ...styles.section, background: '#f9fafb' }}>
        <div style={{ ...styles.sectionInner, maxWidth: 720 }}>
          <h2 style={styles.sectionTitle}>{t.faq.title}</h2>
          <div style={styles.faqList}>
            {t.faq.items.map((item, i) => (
              <div key={i} style={styles.faqItem}>
                <button style={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <span style={{ fontSize: 22, color: GREEN, lineHeight: 1, transform: openFaq === i ? 'rotate(45deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openFaq === i && <p style={styles.faqA}>{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section id="aanmelden" style={styles.ctaBanner}>
        <h2 style={styles.ctaBannerTitle}>{t.hero.tagline}</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 32, fontSize: 18, maxWidth: 560, margin: '0 auto 32px' }}>{t.hero.sub}</p>
        <a href="mailto:info@flexbikerental.nl" style={styles.ctaBannerBtn}>{t.hero.cta} →</a>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <div style={styles.footerLogo}>🚲 FlexBikeRental</div>
            <p style={styles.footerTagline}>{t.footer.tagline}</p>
          </div>
          <div>
            <div style={styles.footerHeading}>{t.footer.contact}</div>
            <a href="mailto:info@flexbikerental.nl" style={styles.footerLink}>info@flexbikerental.nl</a>
            <a href="https://www.flexbikerental.nl" style={styles.footerLink}>flexbikerental.nl</a>
          </div>
          <div>
            <div style={styles.footerHeading}>Taal / Language</div>
            {LANGS.map(l => (
              <button key={l.code} style={{ ...styles.footerLink, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div style={styles.footerBottom}>{t.footer.rights}</div>
      </footer>
    </div>
  )
}

const GREEN = '#268546'

const styles = {
  root: { fontFamily: 'system-ui, -apple-system, sans-serif', color: '#374151', lineHeight: 1.6, margin: 0 },
  header: { position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #e5e7eb', zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  headerInner: { maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 20 },
  logo: { fontSize: 18, fontWeight: 800, color: GREEN, whiteSpace: 'nowrap' },
  nav: { display: 'flex', gap: 2, flex: 1, justifyContent: 'center', flexWrap: 'wrap' },
  navLink: { background: 'none', border: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '6px 10px', borderRadius: 6 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  langSwitcher: { display: 'flex', gap: 3 },
  langBtn: { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, color: '#374151', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: '4px 8px' },
  langBtnActive: { background: GREEN, color: '#fff', borderColor: GREEN },
  ctaBtn: { background: GREEN, color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' },
  hero: { background: `linear-gradient(135deg, #064e2a 0%, ${GREEN} 60%, #4ade80 100%)`, padding: '100px 24px 80px', textAlign: 'center', color: '#fff' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '5px 16px', fontSize: 13, fontWeight: 600, marginBottom: 24, backdropFilter: 'blur(4px)' },
  heroTitle: { fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-1.5px', color: '#fff' },
  heroSub: { fontSize: 'clamp(16px, 2vw, 20px)', maxWidth: 580, margin: '0 auto 36px', opacity: 0.9 },
  heroBtn: { background: '#fff', color: GREEN, borderRadius: 10, padding: '14px 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  section: { padding: '80px 24px', background: '#fff' },
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  sectionTitle: { fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#111827', textAlign: 'center', margin: '0 0 12px' },
  sectionSub: { textAlign: 'center', color: '#6b7280', fontSize: 16, maxWidth: 560, margin: '0 auto 48px', display: 'block' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginTop: 48 },
  stepCard: { background: '#f9fafb', borderRadius: 16, padding: '32px 24px', textAlign: 'center', border: '1px solid #e5e7eb' },
  stepNumber: { width: 32, height: 32, borderRadius: '50%', background: GREEN, color: '#fff', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  stepIcon: { fontSize: 40, marginBottom: 16 },
  stepTitle: { fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' },
  stepText: { fontSize: 14, color: '#6b7280', margin: 0 },
  plansGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginTop: 48 },
  planCard: { background: '#fff', borderRadius: 16, padding: '36px 24px 28px', border: '2px solid #e5e7eb', textAlign: 'center', position: 'relative' },
  planCardPopular: { border: `2px solid ${GREEN}`, boxShadow: '0 8px 30px rgba(38,133,70,0.15)', transform: 'scale(1.03)' },
  popularBadge: { position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: GREEN, color: '#fff', borderRadius: 20, padding: '3px 14px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  planPeriod: { fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' },
  planPrice: { fontSize: 42, fontWeight: 800, color: '#111827', marginBottom: 8 },
  planNote: { fontSize: 13, color: '#9ca3af', marginBottom: 28 },
  planBtn: { display: 'block', background: '#f3f4f6', color: '#374151', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid #e5e7eb' },
  planBtnPopular: { background: GREEN, color: '#fff', borderColor: GREEN },
  locationCard: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, marginTop: 40 },
  locationInfo: { display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' },
  locationRow: { display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 16 },
  locationIcon: { fontSize: 22, flexShrink: 0, marginTop: 1 },
  mapPlaceholder: { borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', minHeight: 260 },
  faqList: { marginTop: 40, border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' },
  faqItem: { borderBottom: '1px solid #f3f4f6' },
  faqQ: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#111827', textAlign: 'left' },
  faqA: { padding: '0 24px 18px', fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.7 },
  ctaBanner: { background: `linear-gradient(135deg, #064e2a, ${GREEN})`, padding: '80px 24px', textAlign: 'center', color: '#fff' },
  ctaBannerTitle: { fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '0 0 16px', color: '#fff' },
  ctaBannerBtn: { background: '#fff', color: GREEN, borderRadius: 10, padding: '14px 36px', fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 8 },
  footer: { background: '#111827', color: '#9ca3af', padding: '48px 24px 24px' },
  footerInner: { maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, paddingBottom: 32, borderBottom: '1px solid #374151' },
  footerLogo: { fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 },
  footerTagline: { fontSize: 13, margin: 0, lineHeight: 1.6 },
  footerHeading: { fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.7px' },
  footerLink: { color: '#9ca3af', textDecoration: 'none', fontSize: 14, display: 'block', marginBottom: 6 },
  footerBottom: { maxWidth: 1100, margin: '20px auto 0', fontSize: 13, textAlign: 'center' },
}
