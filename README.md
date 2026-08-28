# En sund värld – Ekonomisk Förening

Webbplats för **En sund värld Ekonomisk Förening** – en paraplyorganisation för hållbara initiativ, ekobyar, permakultur och gemensam markförvaltning.

## Om projektet

Statisk webbplats byggd med [Astro](https://astro.build). Presenterar föreningen, dess pågående initiativ och tar emot intresseanmälningar via Formspree.

Aktiva initiativ:
- **Olof Larssons Gård** – förvärv och varsamt återställande av en historisk gård
- **Ekoby & Markförvärv** – söker mark för gemensam ekoby

## Kom igång

```bash
npm install
npm run dev       # startar dev-server på http://localhost:4321
npm run build     # bygger till dist/
npm run preview   # förhandsgranska bygget lokalt
```

## Struktur

```
src/
  layouts/BaseLayout.astro        # Gemensam layout med header och footer
  pages/
    index.astro                   # Startsida
    stadgar.astro                 # Föreningens stadgar §1–13
    projekt/olof-larsson.astro    # Projektsida med gårdsbilder
  components/
    InterestForm.astro            # Intresseanmälan via Formspree
  styles/
    tokens.css                    # Design tokens (färger, typografi, spacing)
public/
  images/                         # Foton från Olofs gård
```

## Stack

- [Astro 4](https://astro.build) – statisk SSG
- Vanilla CSS med custom properties
- [Formspree](https://formspree.io) – formulärhantering

## Deploy

Projektet deployas automatiskt till [Vercel](https://vercel.com) vid push till `main`.

## AI-agenter

Projektkontext för Kiro och Cursor finns i:
- `.kiro/steering/project-context.md` – fullständig kontext (laddas automatiskt i Kiro)
- `.cursor/rules/` – regler för Cursor
- `AGENTS.md` – kortfattad guide för alla agenter
