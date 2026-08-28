# En sund värld – AI Agent Guide

Det här dokumentet ger AI-agenter (Kiro, Cursor, etc.) kontext om projektet så att förslag och ändringar följer föreningens vision och tekniska riktlinjer.

## Vad är projektet?

**En sund värld Ekonomisk Förening** är en statisk webbplats byggd med Astro 4 (SSG). Sajten presenterar föreningen, dess initiativ och tar emot intresseanmälningar via Formspree. Allt innehåll ägs av föreningen och finns i repot – ingen databas, ingen backend.

- **Känsla:** Varm, jordnära, genuin – aldrig säljande eller "amerikanst"
- **Mål:** Nå likasinnade, presentera initiativ, samla intresseanmälningar

## Kiro Steering-filer

Detaljerad kontext finns i `.kiro/steering/`:

| Fil | Innehåll |
|-----|----------|
| `project-context.md` | Fullständig projektkontext – vision, initiativ, design, regler |

## Cursor-regler

Regler i `.cursor/rules/` förtydligar specifika aspekter:

| Fil | Scope |
|-----|-------|
| `project-context.mdc` | Alltid aktiv – övergripande kontext och regler |
| `astro-components.mdc` | Aktiveras för `*.astro`-filer |
| `content-och-ton.mdc` | Aktiveras för `*.astro` och `*.md`-filer |

## Mappstruktur

```
oloflarsson/
  src/
    layouts/BaseLayout.astro     # Sticky header, hamburgermeny, footer
    pages/
      index.astro                # Startsida
      stadgar.astro              # Stadgar §1–13
      projekt/
        olof-larsson.astro       # Projektsida med gårdsbilder
    components/
      InterestForm.astro         # Formspree-formulär (ID: xbgjrqlz)
    styles/
      tokens.css                 # Design tokens – SSOT för all styling
  public/
    images/                      # Äkta foton från Olofs gård
    favicon.svg
  .kiro/steering/                # Kiro-regler (alltid inkluderade)
  .cursor/rules/                 # Cursor MDC-regler
```

## Teknisk stack

- **Framework:** Astro 4 – statisk SSG, ingen server-rendering
- **Styling:** Vanilla CSS med custom properties från `tokens.css`. Ingen Tailwind, inga preprocessorer
- **Formulär:** Formspree ID `xbgjrqlz` via `@formspree/ajax` CDN
- **Inga React, Vue eller klientramverk**
- **Build:** `npm run build` → `dist/`

## Designsystem – snabbreferens

```css
--accent:   #1a7a72  /* teal – primärfärg */
--coral:    #d4603a  /* terrakotta – CTA-knappar */
--bg:       #f5f4f0  /* varm ljusgrå bakgrund */
--bg-dark:  #1d3a37  /* hero och footer */
--text:     #1a2624  /* brödtext */
```

Typsnitt: **Inter** (UI) + **Lora** (citat, ingress)

## Föreningens initiativ

### Olof Larssons Gård (pågående) – `/projekt/olof-larsson`
Olof Larsson är en nära vän som i 20+ år bott off-grid på sin barndomsgård. Föreningen vill förvärva gården för att trygga hans ålderdom och återställa platsen med vördnad. Inga moderna villor – kulturmiljön och gårdens själ bevaras.

### Ekoby & Markförvärv (pågående)
Föreningen söker aktivt mark för gemensam ekoby med bostäder, odling och delade resurser.

### Gemensamma odlingar & Workshops (planerat)
Kurser i ekologisk odling, frösparande och naturbyggande.

## Regler för agenten

1. **Läs `tokens.css`** innan du ändrar eller lägger till styling
2. **Ny sida** → lägg alltid till i `navLinks`-arrayen i `BaseLayout.astro`
3. **Ny knapp** → använd `.btn-primary` (terrakotta CTA) eller `.btn-outline` (teal)
4. **Text om Olof** → värdig, respektfull, aldrig välgörenhetsframing
5. **Bilder** i `public/images/` är personliga – använd bara på relevanta sidor
6. **Håll det enkelt** – om du funderar på att lägga till ett bibliotek, fråga först
7. **Tillgänglighet** – alt-texter, heading-hierarki, aria-attribut är obligatoriska
8. **Verifiera alltid** med `npm run build` efter ändringar

## Vad projektet INTE är

- Inte ett CMS – inga databaser, ingen backend
- Inte ett React-projekt – inga klientramverk
- Inte en marknadsföringsplattform – inga stockfoton, inga buzzwords
- Inte ett monorepo – fristående projekt i eget repo
