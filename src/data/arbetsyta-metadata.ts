/**
 * Centralized metadata for arbetsyta sections.
 * Single source of truth for "senast ändrat" dates shown on both
 * the overview (/arbetsyta/) and individual section pages.
 */

export interface ArbetsytaSektion {
  href: string;
  titel: string;
  beskrivning: string;
  status: 'aktiv' | 'utkast' | 'arkiv' | 'pågående' | 'komplement';
  /** ISO date string (YYYY-MM-DD) */
  senastAndrad: string;
}

/**
 * Format an ISO date string to Swedish human-readable format.
 * @example formatDatumSvenska('2026-09-15') => '15 sep 2026'
 */
export function formatDatumSvenska(isoDate: string): string {
  const months = [
    'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
    'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
  ];
  const [year, month, day] = isoDate.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  const dayNum = parseInt(day, 10);
  return `${dayNum} ${months[monthIndex]} ${year}`;
}

export const MARK_SENAST_ANDRAD = '2026-09-21';
export const OFFMARKET_SENAST_ANDRAD = '2026-09-14';
export const EKONOMI_SENAST_ANDRAD = '2026-09-18';
export const IDEER_SENAST_ANDRAD = '2026-09-18';
export const KAPITAL_DETALJ_SENAST_ANDRAD = '2026-09-15';
export const MOTEN_SENAST_ANDRAD = '2026-09-20';

export const arbetsytaSektioner: ArbetsytaSektion[] = [
  {
    href: '/arbetsyta/moten/',
    titel: 'Mötesanteckningar',
    beskrivning: 'Punkter från styrelsens veckomöten – vad vi pratat om och vad vi ska göra.',
    status: 'aktiv',
    senastAndrad: MOTEN_SENAST_ANDRAD,
  },
  {
    href: '/arbetsyta/mark/',
    titel: 'Markspaning',
    beskrivning: 'Prospekt och utvärderingar av markområden för ekobyprojektet.',
    status: 'aktiv',
    senastAndrad: MARK_SENAST_ANDRAD,
  },
  {
    href: '/arbetsyta/mark/offmarket/',
    titel: 'Långsiktiga markägare',
    beskrivning: 'Dialog med gods, stiftelser och kyrka om vård och nyttjanderätt.',
    status: 'aktiv',
    senastAndrad: OFFMARKET_SENAST_ANDRAD,
  },
  {
    href: '/arbetsyta/ekonomi/',
    titel: 'Ekonomi & kalkyler',
    beskrivning: 'Kapitalkalkyler, finansieringsmodeller och budget för ekobyns förvärv.',
    status: 'aktiv',
    senastAndrad: EKONOMI_SENAST_ANDRAD,
  },
  {
    href: '/arbetsyta/ideer/',
    titel: 'Idébank',
    beskrivning: 'Intäktsidéer, verksamhetsplaner och resiliensstrategi för ekobymarken.',
    status: 'aktiv',
    senastAndrad: IDEER_SENAST_ANDRAD,
  },
];

export function statusLabel(status: ArbetsytaSektion['status']): string {
  const labels: Record<ArbetsytaSektion['status'], string> = {
    utkast: 'Utkast',
    aktiv: 'Aktiv',
    arkiv: 'Arkiverad',
    pågående: 'Pågående',
    komplement: 'Komplement',
  };
  return labels[status] || status;
}
