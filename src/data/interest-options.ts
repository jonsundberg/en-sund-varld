/**
 * Shared interest choices and page sources for the signup form and Brevo mapping.
 */

export const INTEREST_OPTIONS = [
  {
    value: 'ekoby-boendegemenskap',
    title: 'Ekoby & Boendegemenskap',
    description: 'Jag vill bo eller gå in i ett ekobyprojekt',
  },
  {
    value: 'olof-larsson-gard',
    title: 'Olof Larssons Gård',
    description: 'Stödja eller arbeta i kulturarvsprojektet',
  },
  {
    value: 'allmant-medlemskap',
    title: 'Allmänt medlemskap / Stödmedlem',
    description: 'Medlemskap i En sund värld',
  },
  {
    value: 'tips-om-mark',
    title: 'Tips om mark',
    description: 'Fastighet till salu eller arrende',
  },
  {
    value: 'markagare',
    title: 'Markägare',
    description: 'Jag äger eller förvaltar mark och vill utforska samarbete',
  },
  {
    value: 'nyhetsbrev',
    title: 'Nyhetsbrev',
    description: 'Håll mig uppdaterad – jag är nyfiken men inte redo att engagera mig än',
  },
] as const;

export type InterestValue = (typeof INTEREST_OPTIONS)[number]['value'];

export const INTEREST_VALUE_SET: ReadonlySet<string> = new Set(
  INTEREST_OPTIONS.map((option) => option.value)
);

const INTEREST_TITLE_BY_VALUE = new Map<string, string>(
  INTEREST_OPTIONS.map((option) => [option.value, option.title])
);

export const SOURCE_LABELS: Record<string, string> = {
  '/': 'Startsida',
  '/projekt/olof-larsson': 'Olof Larssons Gård',
  '/projekt/ekoby': 'Ekoby & Boendegemenskap',
  '/for-markagare': 'För markägare',
};

export function interestTitle(value: string): string {
  return INTEREST_TITLE_BY_VALUE.get(value) ?? value;
}

export function formatInterestLabels(values: string[]): string {
  return values.map(interestTitle).join(', ');
}

export function formatSourceLabel(raw: string | undefined): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  let path = trimmed;
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      path = new URL(trimmed).pathname;
    }
  } catch {
    path = trimmed;
  }

  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return SOURCE_LABELS[path] ?? path;
}
