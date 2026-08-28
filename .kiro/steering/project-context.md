---
inclusion: always
---

# En sund värld – Projektkontext för AI-agenter

Det här dokumentet ger Kiro och andra AI-agenter fullständig kontext om projektet så att förslag och ändringar alltid följer föreningens vision, ton och tekniska riktlinjer.

## 1. Vad är projektet?

**En sund värld Ekonomisk Förening** är en statisk webbplats byggd med Astro (SSG). Sajten presenterar föreningen, dess initiativ och möjliggör intresseanmälningar via Formspree.

- **Repo:** `/Users/jonsundberg/dev/repositories/oloflarsson`
- **Stack:** Astro 4, Vanilla CSS, Formspree (formulär), statisk hosting
- **Språk:** Svenska i all UI-text och innehåll

## 2. Föreningens vision och värdegrund

"En sund värld" är en **ekonomisk paraplyförening** med syfte att:
- Vårda, vörda och sköta om jorden
- Bilda hållbara livsmiljöer baserade på **permakultur**, självförsörjning och lokalresiliens
- Fungera som samlande plattform för medlemmar, initiativ, markförvärv och förvaltningsuppdrag

**Ton:** Varm, jordnära, respektfull och genuin. Aldrig säljande, aldrig klinisk. Texten ska kännas skriven av människor som faktiskt bryr sig.

## 3. Aktiva projekt och initiativ

### Olof Larssons Gård (pågående)
- Olof Larsson är en nära vän som i 20+ år bott på sin barndomsgård utan vatten och avlopp
- Gården är förfallen; Olof har det kämpigt på ålderns höst
- **Syfte:** Föreningen köper marken medan Olof lever – gör hans vardag dräglig, underlättar ålderdom, återställer gården
- **Riktlinje:** Bevara gårdens själ och kulturmiljö. Inga moderna villor, inga swimmingpooler. Permakultur, hållbara material, respekt för platsen
- Olof bor kvar med full nyttjanderätt livet ut
- URL: `/projekt/olof-larsson`

### Ekoby & Markförvärv (pågående)
- Föreningen söker aktivt mark för gemensam ekoby
- Bostäder, odling och delade resurser; medlemmar erbjuds nyttjanderätt
- URL: `/#projekt` (startsidan)

### Gemensamma odlingar & Workshops (planerat)
- Kurser i ekologisk odling, frösparande, naturbyggande
- Öppet för medlemmar och grannar

## 4. Medlemskapsmodell (tvåstegsmodell)

För att inkludera människor med olika ekonomiska förutsättningar:

1. **Låg tröskel** – grundläggande medlemsinsats + årsavgift för att gå med i föreningen
2. **Riktade projektinsatser** – frivilliga tillskott eller medlemslån för specifika markköp/byggnationer för de som vill och kan investera aktivt i ett projekt

## 5. Teknisk stack och struktur

```
oloflarsson/
  src/
    layouts/BaseLayout.astro     # Sticky header, hamburgermeny (JS), footer
    pages/
      index.astro                # Startsida
      stadgar.astro              # Stadgar §1–13
      projekt/
        olof-larsson.astro       # Projektsida med bilder från gården
    components/
      InterestForm.astro         # Formspree-formulär (ID: xbgjrqlz)
    styles/
      tokens.css                 # Design tokens – ALL styling utgår härifrån
  public/
    images/                      # Egna bilder från Olofs gård
    favicon.svg
```

## 6. Design tokens – färgpalett

| Token | Värde | Användning |
|---|---|---|
| `--accent` | `#1a7a72` | Teal – primärfärg, rubriker, aktiv nav |
| `--coral` | `#d4603a` | Terrakotta – CTA-knappar |
| `--bg` | `#f5f4f0` | Varm ljusgrå bakgrund |
| `--bg-dark` | `#1d3a37` | Hero och footer |
| `--text` | `#1a2624` | Brödtext |
| `--text-muted` | `#5a6b68` | Sekundärtext |

**Typsnitt:** Inter (display/body) + Lora (citat, ingress-text)

## 7. Designprinciper

1. Bygg så lite som möjligt – undvik abstraktioner som inte ger direkt värde
2. Inga externa bibliotek utan tydlig anledning – ingen Tailwind, ingen React
3. Semantisk HTML och god tillgänglighet (WCAG AA) i allt som byggs
4. Jordnär och genuin ton – aldrig "amerikanst och säljande"
5. Bilder från `public/images/` är autentiska gårdsbilder – använd med respekt
6. Formulär går via Formspree (ID: `xbgjrqlz`) med `@formspree/ajax` CDN

## 8. Sidor och navigation

| Sida | URL | Status |
|---|---|---|
| Startsida | `/` | ✅ Klar |
| Olof Larssons Gård | `/projekt/olof-larsson` | ✅ Klar |
| Stadgar | `/stadgar` | ✅ Klar |
| Intresseanmälan | `/#anmalan` | ✅ Klar (komponent) |

## 9. Vad projektet INTE är

- Inte ett CMS eller SaaS
- Inte en marknadsföringsplattform med stockfoton och buzzwords
- Inte ett React-projekt – inga klientside-ramverk
- Inte ett databas-drivet system – allt är statiska filer
