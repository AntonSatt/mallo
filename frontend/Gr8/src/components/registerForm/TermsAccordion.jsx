import react, { useState } from "react";

const accordionData = {
  användarvillkor: {
    label: "Användarvillkoren",
    title: "Användarvillkor",
    subtitle: "Mallo · Senast uppdaterad: maj 2026",
    sections: [
      {
        heading: "1. Om Mallo och dessa villkor",
        body: "Mallo är en mobilapplikation som syftar till att koppla samman verifierade människor nära dig för hjälp i ord och i handling. Genom Mallo kan du delta i forum, skapa och delta i aktiviteter, kommunicera via chatt samt ge och ta emot tjänster i ditt lokalsamhälle.\n\nGenom att skapa ett konto och använda Mallo accepterar du dessa användarvillkor i sin helhet. Om du inte accepterar villkoren har du inte rätt att använda tjänsten. Villkoren utgör ett bindande avtal mellan dig och Mallo.",
      },
      {
        heading: "2. Ålderskrav",
        body: "Du måste vara minst 18 år för att använda Mallo. Genom att skapa ett konto intygar du att du uppfyller detta krav. Vi samlar in ditt personnummer för att verifiera din ålder. Om det framkommer att du är under 18 år förbehåller vi oss rätten att omedelbart stänga ditt konto och radera dina uppgifter.",
      },
      {
        heading: "3. Konto och ansvar",
        body: "För att använda Mallo behöver du skapa ett konto med ett användarnamn och en e-postadress. Du ansvarar för att de uppgifter du anger är korrekta och uppdaterade.\n\nDu är ansvarig för all aktivitet som sker via ditt konto. Du ska hålla dina inloggningsuppgifter hemliga, omedelbart meddela oss om du misstänker obehörig användning, och använda Mallo på ett sätt som respekterar andra användare och gällande lagar.\n\nDu kan när som helst ta bort ditt konto via profilsidan i appen.",
      },
      {
        heading: "4. Användningsregler och innehåll",
        body: "Du får publicera innehåll som är ärligt, respektfullt och relevant för appens syfte.\n\nDet är förbjudet att publicera innehåll som är kränkande, trakasserande, hotfullt eller diskriminerande, innehåller personuppgifter om andra utan deras samtycke, är vilseledande eller bedrägligt, marknadsför kommersiella produkter utan Mallos godkännande, eller bryter mot gällande svensk lagstiftning.\n\nAnvändare kan anmäla inlägg som bryter mot dessa villkor. Mallo granskar anmälda inlägg och agerar skyndsamt.",
      },
      {
        heading: "5. Anonymitet",
        body: "Mallo erbjuder möjligheten att publicera inlägg anonymt. Även om ditt namn inte syns för andra användare är ditt konto alltid kopplat till ditt inlägg i våra system. Anonymiteten skyddar dig gentemot andra användare, men inte gentemot Mallo eller myndigheter.\n\nVid begäran från behörig myndighet kan Mallo vara skyldig att lämna ut uppgifter om kontot bakom ett anonymt inlägg.",
      },
      {
        heading: "6. Immateriella rättigheter",
        body: "Allt innehåll som du publicerar på Mallo ägs av dig. Genom att publicera innehåll ger du Mallo en icke-exklusiv, royaltyfri rätt att visa och distribuera innehållet inom tjänsten i syfte att driva och utveckla appen.\n\nMallos varumärke, logotyp, design och källkod tillhör Mallo och får inte användas utan skriftligt tillstånd.",
      },
      {
        heading: "7. Platsdata",
        body: "Mallo kan använda din platsdata för att visa lokalt relevant innehåll och aktiviteter nära dig. Användning av platsdata är frivillig och kan när som helst stängas av eller på via profilsidan i appen. Se vår integritetspolicy för mer information om hur platsdata hanteras.",
      },
      {
        heading: "8. Ansvarsbegränsning",
        body: "Mallo tillhandahålls i befintligt skick. Vi ansvarar inte för innehåll som publiceras av användare, skador som uppstår till följd av möten eller transaktioner som arrangerats via appen, eller tekniska avbrott eller fel i tjänsten.\n\nMallo är en plattform för kommunikation och koordinering. Vi är inte part i de avtal eller överenskommelser som ingås mellan användare.",
      },
      {
        heading: "9. Ändringar av villkoren",
        body: "Vi förbehåller oss rätten att när som helst uppdatera dessa villkor. Vid väsentliga ändringar informeras du via appen eller e-post. Fortsatt användning av Mallo efter att ändringar trätt i kraft innebär att du accepterar de nya villkoren.",
      },
      {
        heading: "10. Tillämplig lag och tvister",
        body: "Dessa villkor regleras av svensk rätt. Eventuella tvister ska i första hand lösas genom dialog. Om en tvist inte kan lösas i godo kan den hänskjutas till allmän domstol i Sverige.",
      },
      {
        heading: "11. Kontakt",
        body: "Har du frågor om dessa användarvillkor är du välkommen att kontakta oss via appen.",
      },
    ],
  },
  integritetspolicy: {
    label: "Integritetspolicyn",
    title: "Integritetspolicy",
    subtitle: "Mallo · Senast uppdaterad: maj 2026",
    sections: [
      {
        heading: "Introduktion",
        body: "Mallo värnar om din integritet. Denna integritetspolicy förklarar vilka personuppgifter vi samlar in, varför vi samlar in dem, hur vi hanterar dem och vilka rättigheter du har. Policyn gäller för användning av Mallos mobilapplikation och relaterade tjänster.\n\nMallo följer EU:s dataskyddsförordning (GDPR) och svensk dataskyddslagstiftning.",
      },
      {
        heading: "1. Personuppgiftsansvarig",
        body: "Mallo ansvarar för behandlingen av dina personuppgifter. Har du frågor om hur vi hanterar dina uppgifter är du välkommen att kontakta oss via appen.",
      },
      {
        heading: "2. Vilka uppgifter samlar vi in?",
        body: "Vid registrering och användning av Mallo samlar vi in:\n• Personnummer — för att verifiera att du är 18 år eller äldre\n• E-postadress — för inloggning och kommunikation\n• Användarnamn — visas för andra användare\n• Profilbild (valfri)\n• Innehåll du publicerar — inlägg, kommentarer och chattmeddelanden\n• Bilder du laddar upp\n\nVi kan även samla in platsdata (om du aktiverat platstjänster) och teknisk data såsom enhetstyp och operativsystem.",
      },
      {
        heading: "3. Varför samlar vi in dina uppgifter?",
        body: "Vi behandlar dina personuppgifter för:\n• Åldersverifiering — personnummer används för att säkerställa 18-årskravet\n• Tillhandahålla tjänsten — för konto, innehåll, aktiviteter och kommunikation\n• Lokalanpassning — platsdata används för att visa aktiviteter nära dig\n• Moderation och säkerhet — för att hantera anmälningar och en trygg miljö\n• Juridiska förpliktelser — för att uppfylla krav från myndigheter",
      },
      {
        heading: "4. Rättslig grund för behandlingen",
        body: "Vi behandlar dina personuppgifter med stöd av:\n• Avtal — behandling nödvändig för att tillhandahålla tjänsten\n• Rättslig förpliktelse — exempelvis vid begäran från myndigheter\n• Berättigat intresse — för att förbättra och säkra tjänsten\n• Samtycke — för platsdata, som du när som helst kan återkalla",
      },
      {
        heading: "5. Platsdata",
        body: "Användning av platsdata är helt frivillig. Du väljer själv om du vill dela din plats via profilsidan i appen. Platstjänster kan när som helst aktiveras eller avaktiveras.\n\nOm du väljer att dela din plats används den enbart för att visa relevant innehåll och aktiviteter nära dig. Vi delar inte din platsdata med tredje part.",
      },
      {
        heading: "6. Hur länge sparar vi dina uppgifter?",
        body: "Vi sparar dina personuppgifter så länge ditt konto är aktivt. När du tar bort ditt konto via profilsidan raderas dina personuppgifter från våra system. Observera att innehåll du publicerat anonymt kan kvarstå i en avidentifierad form.\n\nUppgifter som vi är skyldiga att spara enligt lag kan behållas under den tid lagen kräver, även efter att kontot tagits bort.",
      },
      {
        heading: "7. Delas dina uppgifter med någon?",
        body: "Ditt användarnamn och eventuell profilbild visas för andra användare. Om du väljer att publicera anonymt visas inte ditt namn, men ditt konto är alltid kopplat till inlägget i våra system.\n\nMallo kan lämna ut personuppgifter till behöriga myndigheter om vi är skyldiga att göra det enligt lag — detta gäller även anonyma inlägg.\n\nVi säljer inte dina personuppgifter till tredje part och delar dem inte i marknadsföringssyfte.",
      },
      {
        heading: "8. Säkerhet",
        body: "Vi vidtar tekniska och organisatoriska åtgärder för att skydda dina personuppgifter mot obehörig åtkomst, förlust eller missbruk. Trots detta kan ingen digital tjänst garantera fullständig säkerhet.\n\nOm en säkerhetsincident inträffar som berör dina uppgifter kommer vi att informera dig och berörda myndigheter i enlighet med GDPR.",
      },
      {
        heading: "9. Dina rättigheter",
        body: "Du har följande rättigheter:\n• Rätt till tillgång — information om vilka uppgifter vi har om dig\n• Rätt till rättelse — begär att felaktiga uppgifter korrigeras\n• Rätt till radering — sker automatiskt när du tar bort ditt konto\n• Rätt till dataportabilitet — få ut dina uppgifter i maskinläsbart format\n• Rätt att invända — mot viss behandling av dina uppgifter\n• Rätt att återkalla samtycke — för exempelvis platsdata\n\nFör att utöva dina rättigheter, kontakta oss via appen. Du har också rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY).",
      },
      {
        heading: "10. Cookies och spårning",
        body: "Mallo är en mobilapplikation och använder inte cookies på traditionellt sätt. Vi kan använda liknande tekniker för att förbättra appens prestanda och användarupplevelse, dock aldrig i marknadsföringssyfte.",
      },
      {
        heading: "11. Ändringar av integritetspolicyn",
        body: "Vi kan komma att uppdatera denna integritetspolicy. Vid väsentliga ändringar informeras du via appen eller e-post. Fortsatt användning av Mallo efter att ändringar trätt i kraft innebär att du accepterar den uppdaterade policyn.",
      },
      {
        heading: "12. Kontakt",
        body: "Har du frågor om hur vi hanterar dina personuppgifter är du välkommen att kontakta oss via appen.",
      },
    ],
  },
};

export function Accordion({ id, onClose }) {
  const [openIndex, setOpenIndex] = useState(null);
  const data = accordionData[id];
  if (!data) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>{data.title}</h2>
            <p style={styles.modalSubtitle}>{data.subtitle}</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Stäng">
            ✕
          </button>
        </div>
        <div style={styles.modalBody}>
          {data.sections.map((section, i) => (
            <div key={i} style={styles.item}>
              <button
                style={{
                  ...styles.itemHeader,
                  ...(openIndex === i ? styles.itemHeaderOpen : {}),
                }}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{section.heading}</span>
                <span
                  style={{
                    ...styles.chevron,
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </button>
              <div
                style={{
                  ...styles.itemBody,
                  maxHeight: openIndex === i ? "400px" : "0px",
                  opacity: openIndex === i ? 1 : 0,
                  paddingTop: openIndex === i ? "12px" : "0px",
                  paddingBottom: openIndex === i ? "16px" : "0px",
                }}
              >
                {section.body.split("\n").map((line, j) => (
                  <p key={j} style={{ ...styles.bodyText, marginBottom: line === "" ? "8px" : "4px" }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.caption}>
          Jag godkänner{" "}
          <button style={styles.link} onClick={() => setOpen("användarvillkor")}>
            användarvillkoren
          </button>{" "}
          och{" "}
          <button style={styles.link} onClick={() => setOpen("integritetspolicy")}>
            integritetspolicyn
          </button>
        </p>
      </div>
      {open && <Accordion id={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

const PRIMARY = "var(--color-primary, #4f6ef7)";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f6fa",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px 32px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
  },
  caption: {
    fontSize: "13px",
    color: "#555",
    margin: 0,
    lineHeight: 1.6,
  },
  link: {
    background: "none",
    border: "none",
    padding: 0,
    color: PRIMARY,
    cursor: "pointer",
    fontSize: "13px",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    fontFamily: "inherit",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  },
  modal: {
    background: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "520px",
    margin: "16px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    maxHeight: "85vh",
  },
  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "20px 24px 14px",
    borderBottom: "1px solid #f0f0f0",
    flexShrink: 0,
  },
  modalTitle: {
    margin: "0 0 2px 0",
    fontSize: "17px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  modalSubtitle: {
    margin: 0,
    fontSize: "11px",
    color: "#aaa",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "16px",
    color: "#888",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    lineHeight: 1,
    flexShrink: 0,
  },
  modalBody: {
    padding: "12px 16px 16px",
    overflowY: "auto",
  },
  item: {
    borderRadius: "8px",
    marginBottom: "6px",
    overflow: "hidden",
    border: "1px solid #ececec",
  },
  itemHeader: {
    width: "100%",
    background: "#fafafa",
    border: "none",
    padding: "13px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    color: "#1a1a1a",
    textAlign: "left",
    fontFamily: "inherit",
  },
  itemHeaderOpen: {
    background: "#f0f3ff",
    color: PRIMARY,
  },
  chevron: {
    fontSize: "16px",
    color: "#aaa",
    transition: "transform 0.2s ease",
    flexShrink: 0,
    marginLeft: "8px",
  },
  itemBody: {
    overflow: "hidden",
    transition: "max-height 0.25s ease, opacity 0.2s ease, padding 0.2s ease",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  bodyText: {
    margin: 0,
    fontSize: "13px",
    color: "#555",
    lineHeight: 1.65,
  },
};
