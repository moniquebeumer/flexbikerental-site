const GREEN = '#268546'
const MARKETING_URL = 'https://flexbikerental.nl'

export default function TermsPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Algemene Voorwaarden</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>Versie: 1.0 &mdash; Datum: juni 2026</p>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 40 }}>
          De Algemene Voorwaarden moeten eenmalig worden geaccepteerd wanneer u uw eerste betaalde bestelling in de app plaatst.
          De Algemene Voorwaarden zijn van toepassing op ieder volgend gebruik van een dienst in de app.
        </p>

        <Section title="Artikel 1 – Definities">
          <ul>
            <li><strong>FlexBikeRental:</strong> de verhuurder van elektrische fietsen (e-bikes), een dienst van Bikeservicing Nederland B.V., gevestigd aan De Bloemendaal 6B, 5221 EC 's-Hertogenbosch, KvK-nummer 84398701.</li>
            <li><strong>Huurder:</strong> de natuurlijke of rechtspersoon die een e-bike huurt via het platform van FlexBikeRental.</li>
            <li><strong>Huurperiode:</strong> de overeengekomen periode waarvoor de e-bike wordt gehuurd.</li>
            <li><strong>E-bike:</strong> de elektrische fiets inclusief accu, oplader en slot die door FlexBikeRental ter beschikking wordt gesteld.</li>
          </ul>
        </Section>

        <Section title="Artikel 2 – Identiteit & leeftijd">
          <p>2.1 De huurder dient minimaal 18 jaar oud te zijn.</p>
          <p>2.2 Bij het aanmaken van een account dient de huurder zich eenmalig te identificeren via een biometrische verificatie (Veriff). Deze verificatie is uitsluitend bestemd voor het vaststellen van de identiteit en wordt niet voor andere doeleinden gebruikt. De persoonsgegevens die via Veriff worden verwerkt, worden na drie maanden automatisch verwijderd. Na succesvolle verificatie en aanmaak van het account zal de huurder niet opnieuw worden gevraagd zich te identificeren.</p>
          <p>2.3 FlexBikeRental verwerkt persoonsgegevens conform de Algemene Verordening Gegevensbescherming (AVG). Meer informatie hierover is te vinden in onze <a href="/privacy" style={{ color: GREEN }}>Privacyverklaring</a>.</p>
        </Section>

        <Section title="Artikel 3 – Gebruik van de e-bike">
          <p>3.1 De e-bike mag uitsluitend worden gebruikt door de huurder zelf. Uitlenen of overdragen aan derden is niet toegestaan.</p>
          <p>3.2 Er mag maximaal één persoon tegelijk op de e-bike rijden. Het vervoeren van passagiers of het slepen van een aanhanger is niet toegestaan.</p>
          <p>3.3 Het is verboden de e-bike te gebruiken onder invloed van alcohol, drugs of medicijnen die de rijvaardigheid beïnvloeden.</p>
          <p>3.4 De huurder wordt geacht de nationale wetgeving met betrekking tot fietsen en e-bikes in het wegverkeer te kennen en na te leven.</p>
          <p>3.5 Het is niet toegestaan aanpassingen aan de e-bike te verrichten of onderdelen te verwijderen, blokkeren of te manipuleren.</p>
          <p>3.6 De e-bike dient uitsluitend te worden opgeladen met de meegeleverde originele oplader.</p>
          <p>3.7 De huurder mag nooit zelf reparaties aan de e-bike uitvoeren.</p>
        </Section>

        <Section title="Artikel 4 – Beveiliging">
          <p>4.1 De huurder is verplicht de e-bike bij het stallen altijd af te sluiten met het meegeleverde slot.</p>
          <p>4.2 Bij diefstal terwijl het slot aantoonbaar is gebruikt, geldt een eigen risico van <strong>€ 500,–</strong>.</p>
          <p>4.3 Indien bij diefstal blijkt dat de e-bike niet was afgesloten met het meegeleverde slot, is de huurder volledig aansprakelijk voor de schade.</p>
          <p>4.4 Verlies van het meegeleverde slot of de sleutel wordt in rekening gebracht bij de huurder.</p>
        </Section>

        <Section title="Artikel 5 – Diefstal">
          <p>5.1 De e-bikes van FlexBikeRental zijn verzekerd tegen diefstal.</p>
          <p>5.2 Bij diefstal is de huurder verplicht onmiddellijk aangifte te doen bij de politie en een kopie van het proces-verbaal te overhandigen aan FlexBikeRental.</p>
          <p>5.3 Zonder aangifte bij de politie vervalt de verzekeringsdekking en is de huurder volledig aansprakelijk.</p>
        </Section>

        <Section title="Artikel 6 – Schade">
          <p>6.1 Schade aan de e-bike veroorzaakt door de huurder — door onzorgvuldig gebruik, een val of anderszins — zal volledig in rekening worden gebracht bij de huurder.</p>
          <p>6.2 FlexBikeRental is niet aansprakelijk voor schade die de huurder toebrengt aan derden. De huurder dient hiervoor zelf een (rechtsbijstand)verzekering af te sluiten.</p>
          <p>6.3 Bij schade aan derden is de huurder verplicht een schadeformulier in te vullen. Dit formulier is op te vragen via <a href="mailto:info@bikeservicing.nl" style={{ color: GREEN }}>info@bikeservicing.nl</a>.</p>
        </Section>

        <Section title="Artikel 7 – Storingen & service">
          <p>7.1 Eventuele defecten aan de e-bike dienen onmiddellijk te worden gemeld bij FlexBikeRental.</p>
          <p>7.2 FlexBikeRental biedt 24/7 service voor reparaties en storingen. De huurder kan contact opnemen via:</p>
          <ul>
            <li>📞 <a href="tel:+31613920910" style={{ color: GREEN }}>+31 6 13 92 09 10</a></li>
            <li>📞 <a href="tel:+31657203024" style={{ color: GREEN }}>+31 6 57 20 30 24</a></li>
            <li>✉️ <a href="mailto:info@bikeservicing.nl" style={{ color: GREEN }}>info@bikeservicing.nl</a></li>
          </ul>
          <p>7.3 Bij een ongeluk of schade — aan de e-bike of aan derden — dient de huurder onmiddellijk contact op te nemen met FlexBikeRental via bovenstaande contactgegevens.</p>
        </Section>

        <Section title="Artikel 8 – Huurperiode & betaling">
          <p>8.1 De huurperiode vangt aan op de datum en tijd zoals overeengekomen bij de reservering en eindigt op de afgesproken einddatum en -tijd.</p>
          <p>8.2 De e-bike dient uiterlijk op de laatste dag van de huurperiode te worden ingeleverd op de afgesproken locatie.</p>
          <p>8.3 Bij te laat inleveren worden de kosten voor de overschreden termijn in rekening gebracht tegen een tarief van <strong>€ 6,– per dag</strong>.</p>
          <p>8.4 FlexBikeRental behoudt zich het recht voor het account van de huurder te blokkeren indien de e-bike niet tijdig wordt ingeleverd of betalingsverplichtingen niet worden nagekomen.</p>
        </Section>

        <Section title="Artikel 9 – Annulering">
          <p>9.1 De huurder kan een reservering annuleren via een e-mail naar <a href="mailto:info@bikeservicing.nl" style={{ color: GREEN }}>info@bikeservicing.nl</a>.</p>
          <p>9.2 Het reeds betaalde bedrag zal na annulering worden teruggestort op de rekening van de huurder.</p>
        </Section>

        <Section title="Artikel 10 – Aansprakelijkheid FlexBikeRental">
          <p>10.1 FlexBikeRental stelt bij aanvang van de huurperiode een deugdelijke en goed functionerende e-bike ter beschikking.</p>
          <p>10.2 FlexBikeRental is niet aansprakelijk voor lichamelijk letsel, gevolgschade of andere schade die voortvloeit uit het gebruik van de e-bike, tenzij er sprake is van opzet of grove nalatigheid aan de zijde van FlexBikeRental.</p>
        </Section>

        <Section title="Artikel 11 – Toepasselijk recht & geschillen">
          <p>11.1 Op deze algemene voorwaarden is uitsluitend het Nederlands recht van toepassing.</p>
          <p>11.2 Geschillen die voortvloeien uit of verband houden met deze voorwaarden worden voorgelegd aan de bevoegde Nederlandse rechter.</p>
        </Section>

        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 48, borderTop: '1px solid #e5e7eb', paddingTop: 24 }}>
          FlexBikeRental — een dienst van Bikeservicing Nederland B.V. &bull; De Bloemendaal 6B, 5221 EC 's-Hertogenbosch &bull; KvK 84398701 &bull;{' '}
          <a href="mailto:info@bikeservicing.nl" style={{ color: GREEN }}>info@bikeservicing.nl</a>
        </p>

        <div style={{ marginTop: 24 }}>
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
