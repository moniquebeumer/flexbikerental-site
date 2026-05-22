const GREEN = '#268546'
const MARKETING_URL = 'https://flexbikerental.nl'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center' }}>
        <a href={MARKETING_URL} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo.svg" alt="FlexBikeRental" style={{ height: 36, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 16, color: GREEN }}>FlexBikeRental</span>
        </a>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Privacyverklaring</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 40 }}>Laatst bijgewerkt: mei 2025</p>

        <Section title="1. Wie zijn wij?">
          <p>FlexBikeRental is een dienst van BikeServicing, gevestigd aan Dr. Schaepmanstraat 45B, 6004 AD Weert, Nederland. Voor vragen over privacy kun je contact opnemen via <a href="mailto:info@flexbikerental.nl" style={{ color: GREEN }}>info@flexbikerental.nl</a>.</p>
        </Section>

        <Section title="2. Welke gegevens verzamelen wij?">
          <p>Bij het huren van een fiets verwerken wij de volgende persoonsgegevens:</p>
          <ul>
            <li><strong>Naam en contactgegevens</strong> — voornaam, achternaam, e-mailadres en telefoonnummer</li>
            <li><strong>Accountgegevens</strong> — e-mailadres en versleuteld wachtwoord</li>
            <li><strong>Identiteitsgegevens</strong> — legitimatiebewijs (paspoort of ID-kaart), verwerkt via Veriff of gecontroleerd op locatie</li>
            <li><strong>Betalingsgegevens</strong> — betalingsstatus, verwerkt via Mollie (wij slaan geen betaalkaartgegevens op)</li>
            <li><strong>Huurgegevens</strong> — gekozen huurperiode, startdatum, einddatum en bijbehorend framenummer</li>
          </ul>
        </Section>

        <Section title="3. Waarom verwerken wij uw gegevens?">
          <p>Wij verwerken uw gegevens voor de volgende doeleinden:</p>
          <ul>
            <li><strong>Uitvoering van de huurovereenkomst</strong> — om de fiets te kunnen verhuren en het contract te beheren</li>
            <li><strong>Wettelijke identificatieplicht</strong> — wij zijn verplicht uw identiteit te verifiëren voordat wij een fiets verhuren</li>
            <li><strong>Betaling verwerken</strong> — via onze betaaldienstverlener Mollie</li>
            <li><strong>Communicatie</strong> — bevestigingen, ophaalinstructies en statusupdates per e-mail</li>
          </ul>
        </Section>

        <Section title="4. Hoe lang bewaren wij uw gegevens?">
          <p>Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk:</p>
          <ul>
            <li>Huurcontracten en bijbehorende gegevens: <strong>7 jaar</strong> (wettelijke bewaarplicht voor financiële administratie)</li>
            <li>Accountgegevens: tot <strong>2 jaar na de laatste activiteit</strong>, tenzij u eerder verzoekt om verwijdering</li>
            <li>Identiteitsverificatiegegevens: verwerkt door Veriff conform hun eigen bewaarbeleid (max. 30 dagen na verificatie)</li>
          </ul>
        </Section>

        <Section title="5. Delen wij uw gegevens met derden?">
          <p>Wij delen uw gegevens uitsluitend met:</p>
          <ul>
            <li><strong>Veriff</strong> — voor online identiteitsverificatie (gevestigd in de EU, AVG-compliant)</li>
            <li><strong>Mollie</strong> — voor betalingsverwerking (gevestigd in Nederland, PCI DSS-gecertificeerd)</li>
            <li><strong>Supabase</strong> — voor beveiligde opslag van uw gegevens (servers in de EU)</li>
          </ul>
          <p>Wij verkopen uw gegevens nooit aan derden.</p>
        </Section>

        <Section title="6. Uw rechten">
          <p>Op grond van de Algemene Verordening Gegevensbescherming (AVG) heeft u de volgende rechten:</p>
          <ul>
            <li><strong>Recht op inzage</strong> — u kunt opvragen welke gegevens wij van u verwerken</li>
            <li><strong>Recht op correctie</strong> — u kunt onjuiste gegevens laten aanpassen</li>
            <li><strong>Recht op verwijdering</strong> — u kunt verzoeken uw gegevens te laten verwijderen, tenzij wij wettelijk verplicht zijn ze te bewaren</li>
            <li><strong>Recht op bezwaar</strong> — u kunt bezwaar maken tegen de verwerking van uw gegevens</li>
            <li><strong>Recht op dataportabiliteit</strong> — u kunt uw gegevens in een gestructureerd formaat opvragen</li>
          </ul>
          <p>Stuur uw verzoek naar <a href="mailto:info@flexbikerental.nl" style={{ color: GREEN }}>info@flexbikerental.nl</a>. Wij reageren binnen 30 dagen.</p>
        </Section>

        <Section title="7. Beveiliging">
          <p>Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beveiligen, waaronder versleutelde verbindingen (HTTPS), beveiligde opslag en beperkte toegang tot uw gegevens.</p>
        </Section>

        <Section title="8. Klachten">
          <p>Als u niet tevreden bent over hoe wij met uw gegevens omgaan, kunt u een klacht indienen bij de Autoriteit Persoonsgegevens via <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" style={{ color: GREEN }}>autoriteitpersoonsgegevens.nl</a>.</p>
        </Section>

        <div style={{ marginTop: 48 }}>
          <a href={MARKETING_URL} style={{ color: GREEN, fontWeight: 600, fontSize: 14 }}>← Terug naar FlexBikeRental</a>
        </div>
      </main>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.8 }}>{children}</div>
    </div>
  )
}
