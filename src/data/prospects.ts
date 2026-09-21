export type Status = 'ny' | 'djupdyk' | 'andrahand' | 'parkerad';
export type Kategori = 'primär' | 'sekundär' | 'grobund';
export type VANiva = 'sparsamt' | 'bas' | 'övre';
export type TillstandsRisk = 'låg' | 'medel' | 'medel–hög' | 'hög';

export interface Flagga {
  text: string;
  typ: 'info' | 'varning' | 'positiv';
}

export interface Kalkyl {
  kopfasPerHh: number;
  rekommenderadVA: VANiva;
  vaKostnadPerHh: { sparsamt: number; bas: number; ovre: number };
  manadskostnadBas: number;
  manadskostnadStress: number;
  noter?: string;
}

export interface NastaSteg {
  id: string;
  text: string;
  done: boolean;
}

export interface Prospekt {
  slug: string;
  namn: string;
  kommun: string;
  lan: string;
  ha: string;
  haNum: number;
  pris: string;
  prisNum: number;
  byggnader: string;
  status: Status;
  kategori: Kategori;
  url: string;
  buddatum?: string;
  saljartyp?: string;
  flaggor: Flagga[];
  kalkyl: Kalkyl;
  djupdyk?: string;
  nastaSteg: NastaSteg[];
}

export const EKONOMI_KONSTANTER = {
  antalHh: 10,
  ltv: 0.60,
  lagfart: 0.0425,
  basRanta: 0.032,
  basAmortering: 0.02,
  stressRanta: 0.045,
  stressLtv: 0.75,
};

export function beraknaKopfas(prisKr: number): number {
  const lagfartKr = prisKr * EKONOMI_KONSTANTER.lagfart;
  const egetKapitalKr = prisKr * (1 - EKONOMI_KONSTANTER.ltv);
  const totalMedlemskapitalKr = egetKapitalKr + lagfartKr;
  return Math.round(totalMedlemskapitalKr / EKONOMI_KONSTANTER.antalHh / 1000);
}

export function beraknaManadskostnadBas(prisKr: number): number {
  const lanKr = prisKr * EKONOMI_KONSTANTER.ltv;
  const arligKostnad = lanKr * (EKONOMI_KONSTANTER.basRanta + EKONOMI_KONSTANTER.basAmortering);
  return Math.round(arligKostnad / 12 / EKONOMI_KONSTANTER.antalHh);
}

export function beraknaManadskostnadStress(prisKr: number): number {
  const lanKr = prisKr * EKONOMI_KONSTANTER.stressLtv;
  const arligKostnad = lanKr * (EKONOMI_KONSTANTER.stressRanta + EKONOMI_KONSTANTER.basAmortering);
  return Math.round(arligKostnad / 12 / EKONOMI_KONSTANTER.antalHh);
}

export const VA_KOSTNADER = {
  sparsamt: 168,
  bas: 218,
  ovre: 293,
};

const prospects: Prospekt[] = [
  {
    slug: 'blackbo-1-6',
    namn: 'Blackbo 1:6',
    kommun: 'Uppsala',
    lan: 'Uppsala län',
    ha: '84,5',
    haNum: 84.5,
    pris: '3,5 Mkr',
    prisNum: 3500000,
    byggnader: 'Äldre ekonomibyggnader',
    status: 'djupdyk',
    kategori: 'primär',
    url: 'https://ludvig.se/fastigheter/gsz-aoc-skogsfastighet-om-78-ha-med-fina-jakt-och-fiskemojligheter-invid-siggeforasjon/',
    flaggor: [
      { text: 'Anbud', typ: 'info' },
      { text: 'Utanför detaljplan', typ: 'positiv' },
      { text: 'Utvidgat strandskydd 300m (södra skiftet)', typ: 'varning' },
      { text: 'Natura 2000-koppling', typ: 'varning' },
      { text: 'Två skiften', typ: 'info' },
      { text: 'Befintliga pantbrev ~733 tkr', typ: 'info' },
      { text: 'Invid Siggeforasjön – fiske & jakt', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: 197,
      rekommenderadVA: 'övre',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: 910,
      manadskostnadStress: 1420,
      noter: 'Strandskyddet kräver övre VA-nivå (MRV+P). Sjönära läge = strängare krav.',
    },
    djupdyk: `**Ekonom-noteringar (2026-09-14):**

Köpfas-beräkning med 10 hushåll, 60 % LTV:
- Kontantinsats exkl. VA: ~197 tkr/hh (bas)
- Med övre VA (sjönära MRV+P): ~293 tkr tillägg = ca 490 tkr totalt/hh i köpfas+VA

Boendekostnad börjar från noll – byggnader kräver renovering. Möjlighet att etablera stegvis.

**VA-notering:** Strandskyddszonen (300m) kräver minireningsverk med fosforfälla. Budget för "övre" nivå (293 tkr/hh) är nödvändig.

**Risker:**
- Natura 2000 kan begränsa exploatering
- Två skiften innebär splittrad mark
- Äldre ekonomibyggnader behöver statusbedömning`,
    nastaSteg: [
      { id: 'bs1', text: 'Boka visning med mäklare', done: false },
      { id: 'bs2', text: 'Begär detaljerad skogsbruksplan', done: false },
      { id: 'bs3', text: 'Kontrollera Natura 2000-begränsningar med länsstyrelsen', done: false },
      { id: 'bs4', text: 'Uppskatta renoveringskostnad ekonomibyggnader', done: false },
      { id: 'bs5', text: 'Verifiera VA-krav med Uppsala kommun', done: false },
    ],
  },
  {
    slug: 'risby-4-3',
    namn: 'Risby 4:3 (del)',
    kommun: 'Uppsala (Viksta)',
    lan: 'Uppsala län',
    ha: '55',
    haNum: 55,
    pris: '4,25 Mkr',
    prisNum: 4250000,
    byggnader: 'Nej',
    status: 'ny',
    kategori: 'primär',
    url: 'https://www.skogsfastigheter.se/uppsala/uppsala/del-av-risby-43-1074',
    flaggor: [
      { text: 'Delförsäljning', typ: 'info' },
      { text: '~6 300 m³sk virkesförråd', typ: 'positiv' },
      { text: 'Bra areal (55 ha)', typ: 'positiv' },
      { text: 'Ingen befintlig bebyggelse', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4250000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4250000),
      manadskostnadStress: beraknaManadskostnadStress(4250000),
      noter: 'Bygg från scratch – ingen befintlig bebyggelse.',
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'ri1', text: 'Begär skogsbruksplan', done: false },
      { id: 'ri2', text: 'Undersök bygglovsförutsättningar', done: false },
      { id: 'ri3', text: 'Verifiera vägtillgång och servitut', done: false },
      { id: 'ri4', text: 'Kontrollera vattentillgång', done: false },
    ],
  },
  {
    slug: 'slada-335',
    namn: 'Slada 335',
    kommun: 'Tierp',
    lan: 'Uppsala län',
    ha: '~45',
    haNum: 45,
    pris: '3,0 Mkr',
    prisNum: 3000000,
    byggnader: 'Bostadshus + ladugård',
    status: 'parkerad',
    kategori: 'primär',
    url: 'https://www.boneo.se/bostad/id-3642941-gard-skog-6rum-hallnas-slada-335',
    flaggor: [
      { text: 'Såld (sep 2026)', typ: 'varning' },
      { text: 'Befintligt bostadshus (6 rum)', typ: 'positiv' },
      { text: 'Ladugård för konvertering', typ: 'positiv' },
      { text: 'Hällnäs – norra Tierp', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3000000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3000000),
      manadskostnadStress: beraknaManadskostnadStress(3000000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'sl1', text: 'Begär komplett prospekt', done: false },
      { id: 'sl2', text: 'Kontrollera detaljplan/byggrätt', done: false },
      { id: 'sl3', text: 'Undersök VA-förutsättningar', done: false },
    ],
  },
  {
    slug: 'lingnare-101',
    namn: 'Lingnåre 101',
    kommun: 'Tierp',
    lan: 'Uppsala län',
    ha: '~32',
    haNum: 32,
    pris: '2,995 Mkr',
    prisNum: 2995000,
    byggnader: 'Bostadshus + gäststuga',
    status: 'parkerad',
    kategori: 'primär',
    url: 'https://www.fastighetsbyran.com/sv/sverige/till-salu/uppsala-lan/tierps-kommun/objekt/?objektID=3074230',
    flaggor: [
      { text: 'Borttagen från marknaden / troligen såld (sep 2026)', typ: 'varning' },
      { text: 'Befintligt bostadshus', typ: 'positiv' },
      { text: 'Gäststuga', typ: 'positiv' },
      { text: 'Mindre areal än önskat', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(2995000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(2995000),
      manadskostnadStress: beraknaManadskostnadStress(2995000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'li1', text: 'Begär komplett prospekt', done: false },
      { id: 'li2', text: 'Kontrollera skogsbruksplan', done: false },
      { id: 'li3', text: 'Verifiera vattentillgång', done: false },
    ],
  },
  {
    slug: 'johanneslund',
    namn: 'Johanneslund',
    kommun: 'Heby',
    lan: 'Uppsala län',
    ha: '14,3',
    haNum: 14.3,
    pris: '2,9 Mkr',
    prisNum: 2900000,
    byggnader: 'Bostad + ekonomi',
    status: 'ny',
    kategori: 'primär',
    url: 'https://carlssonring.se/objekt/johanneslund-tarnsjo/',
    flaggor: [
      { text: 'Liten areal (14,3 ha) – under önskad nivå', typ: 'varning' },
      { text: 'JP-kommun glesbygd', typ: 'info' },
      { text: 'Glesbygdsläge (Tärnsjö)', typ: 'info' },
      { text: 'Befintligt bostadshus', typ: 'positiv' },
      { text: 'Ekonomibyggnader', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(2900000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(2900000),
      manadskostnadStress: beraknaManadskostnadStress(2900000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'jo1', text: 'Utvärdera om arealen räcker för 10 hh', done: false },
      { id: 'jo2', text: 'Undersök tillköpsmöjligheter av grannmark', done: false },
      { id: 'jo3', text: 'Kontrollera JFL-status', done: false },
    ],
  },
  {
    slug: 'hallerad-lindgarden',
    namn: 'Hälleråd Lindgården',
    kommun: 'Vingåker',
    lan: 'Södermanlands län',
    ha: '17',
    haNum: 17,
    pris: '4,495 Mkr',
    prisNum: 4495000,
    byggnader: 'Bostad + ekonomi',
    status: 'ny',
    kategori: 'primär',
    url: 'https://www.maklarhuset.se/bostad/sverige/sodermanland/vingaker/hallerad-lindgarden/618848',
    flaggor: [
      { text: 'Högre pris (4,5 Mkr) – påverkar kapitalkrav', typ: 'varning' },
      { text: 'Befintligt bostadshus', typ: 'positiv' },
      { text: 'Ekonomibyggnader', typ: 'positiv' },
      { text: 'Vingåker – Sörmland', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4495000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4495000),
      manadskostnadStress: beraknaManadskostnadStress(4495000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'ha1', text: 'Utvärdera om prisnivån är motiverad', done: false },
      { id: 'ha2', text: 'Begär komplett prospekt', done: false },
      { id: 'ha3', text: 'Kontrollera byggrätt för fler bostäder', done: false },
    ],
  },
  {
    slug: 'isatra-3-4',
    namn: 'Isätra 3:4',
    kommun: 'Sala',
    lan: 'Västmanlands län',
    ha: '38',
    haNum: 38,
    pris: '4,45 Mkr',
    prisNum: 4450000,
    byggnader: 'Nej',
    status: 'ny',
    kategori: 'primär',
    url: 'https://www.skogsfastigheter.se/vastmanland/sala/sala-isatra-34-1032',
    flaggor: [
      { text: 'Acceptpris', typ: 'info' },
      { text: 'Ingen befintlig bebyggelse', typ: 'info' },
      { text: 'Ren skogsfastighet', typ: 'info' },
      { text: 'Bra areal (38 ha)', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4450000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4450000),
      manadskostnadStress: beraknaManadskostnadStress(4450000),
      noter: 'Bygg från scratch – högre etableringskostnad men full flexibilitet.',
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'is1', text: 'Begär skogsbruksplan', done: false },
      { id: 'is2', text: 'Undersök bygglovsförutsättningar', done: false },
      { id: 'is3', text: 'Verifiera vägtillgång och servitut', done: false },
      { id: 'is4', text: 'Kontrollera vattentillgång (borrning)', done: false },
    ],
  },
  {
    slug: 'havero-bergby-1-20',
    namn: 'Häverö-Bergby 1:20',
    kommun: 'Norrtälje',
    lan: 'Stockholms län',
    ha: '15,6',
    haNum: 15.6,
    pris: '1,3 Mkr',
    prisNum: 1300000,
    byggnader: 'Nej (förhandsbesked 1 hus)',
    status: 'ny',
    kategori: 'primär',
    url: 'https://ludvig.se/fastigheter/gzr-ftk-skogsmark-med-forhandsbesked-15-ha-mellan-hallstavik-och-almsta/',
    buddatum: '5 okt 2026 kl 12',
    flaggor: [
      { text: 'Marginal areal (15,6 ha)', typ: 'varning' },
      { text: 'Förhandsbesked för 1 hus', typ: 'positiv' },
      { text: 'Attraktivt pris (1,3 Mkr)', typ: 'positiv' },
      { text: 'Anbud 5 oktober kl 12', typ: 'varning' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(1300000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(1300000),
      manadskostnadStress: beraknaManadskostnadStress(1300000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'hb1', text: 'Begär komplett prospekt', done: false },
      { id: 'hb2', text: 'Kontrollera förhandsbeskedets villkor', done: false },
      { id: 'hb3', text: 'Undersök möjlighet för fler byggrätter', done: false },
    ],
  },
  {
    slug: 'nordanberg-104',
    namn: 'Nordanberg 104',
    kommun: 'Sala (Möklinta)',
    lan: 'Västmanlands län',
    ha: '15,7',
    haNum: 15.7,
    pris: '4,5 Mkr',
    prisNum: 4500000,
    byggnader: '2 bostäder + ekonomi',
    status: 'ny',
    kategori: 'primär',
    url: 'https://carlssonring.se/objekt/nordanberg-104-moklinta/',
    flaggor: [
      { text: 'Marginal areal (15,7 ha)', typ: 'varning' },
      { text: 'Glesbygdsläge (Möklinta)', typ: 'info' },
      { text: '2 befintliga bostäder', typ: 'positiv' },
      { text: 'Ekonomibyggnader', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4500000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4500000),
      manadskostnadStress: beraknaManadskostnadStress(4500000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'nb1', text: 'Begär komplett prospekt', done: false },
      { id: 'nb2', text: 'Kontrollera skick på befintliga byggnader', done: false },
      { id: 'nb3', text: 'Utvärdera glesbygdsläge vs service', done: false },
    ],
  },
  {
    slug: 'pellpars',
    namn: 'Pellpärs',
    kommun: 'Ockelbo',
    lan: 'Gävleborgs län',
    ha: '22,6',
    haNum: 22.6,
    pris: '3,75 Mkr',
    prisNum: 3750000,
    byggnader: 'Tre bostäder + ekonomi',
    status: 'ny',
    kategori: 'sekundär',
    url: 'https://ludvig.se/fastigheter/gdy-ccw-lantligt-gardsboende-med-tre-bostader-ekonomibyggnader-och-stort-utvecklingsmojligheter/',
    flaggor: [
      { text: 'Tre befintliga bostäder', typ: 'positiv' },
      { text: 'Ekonomibyggnader', typ: 'positiv' },
      { text: 'Ockelbo – längre från Stockholm', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3750000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3750000),
      manadskostnadStress: beraknaManadskostnadStress(3750000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'pe1', text: 'Utvärdera avstånd till service', done: false },
      { id: 'pe2', text: 'Kontrollera skick på befintliga byggnader', done: false },
    ],
  },
  {
    slug: 'alven-eda',
    namn: 'Älven',
    kommun: 'Eda (Värmland)',
    lan: 'Värmlands län',
    ha: '~31',
    haNum: 31,
    pris: '2,7 Mkr',
    prisNum: 2700000,
    byggnader: 'Ja',
    status: 'ny',
    kategori: 'sekundär',
    url: 'https://areal.se/fastighet/trivsam-gard-med-bra-lage-varmland-eda/',
    buddatum: '6 okt 2026',
    flaggor: [
      { text: 'Anbud 6 oktober 2026', typ: 'varning' },
      { text: 'Visning 23 sep kl 16:30', typ: 'info' },
      { text: 'JP förvärvstillstånd krävs', typ: 'varning' },
      { text: 'Attraktivt pris (2,7 Mkr)', typ: 'positiv' },
      { text: 'Värmland – sekundärt geografiskt läge', typ: 'info' },
      { text: 'Befintliga byggnader', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(2700000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(2700000),
      manadskostnadStress: beraknaManadskostnadStress(2700000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'al1', text: 'Boka visning innan anbud', done: false },
      { id: 'al2', text: 'Utvärdera gruppens intresse för Värmlandsläge', done: false },
      { id: 'al3', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'mora-vastbygge-184-6',
    namn: 'Mora Västbygge 184:6',
    kommun: 'Mora (Venjan)',
    lan: 'Dalarnas län',
    ha: '53,4',
    haNum: 53.4,
    pris: '2,75 Mkr',
    prisNum: 2750000,
    byggnader: 'Nej',
    status: 'andrahand',
    kategori: 'sekundär',
    url: 'https://www.skogsfastigheter.se/dalarna/mora/skogsfastighet-venjan-mora-vastbygge-1846-1004',
    flaggor: [
      { text: 'Stor areal (53,4 ha)', typ: 'positiv' },
      { text: 'Attraktivt pris (2,75 Mkr)', typ: 'positiv' },
      { text: 'Ingen befintlig bebyggelse', typ: 'info' },
      { text: 'Dalarna – sekundärt geografiskt läge', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(2750000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(2750000),
      manadskostnadStress: beraknaManadskostnadStress(2750000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'mv1', text: 'Begär skogsbruksplan', done: false },
      { id: 'mv2', text: 'Undersök bygglovsförutsättningar', done: false },
      { id: 'mv3', text: 'Utvärdera avståndsproblematiken', done: false },
    ],
  },
  {
    slug: 'ol-pers',
    namn: 'Ol-Pers',
    kommun: 'Bollnäs',
    lan: 'Gävleborgs län',
    ha: '23',
    haNum: 23,
    pris: '2,2 Mkr',
    prisNum: 2200000,
    byggnader: 'Ja',
    status: 'ny',
    kategori: 'sekundär',
    url: 'https://areal.se/fastighet/gard-ol-pers-i-iste-gavleborg-bollnas/',
    flaggor: [
      { text: 'Lågt pris (2,2 Mkr)', typ: 'positiv' },
      { text: 'Befintliga byggnader', typ: 'positiv' },
      { text: 'Bollnäs – längst från Stockholm', typ: 'info' },
      { text: 'Mindre areal (23 ha)', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(2200000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(2200000),
      manadskostnadStress: beraknaManadskostnadStress(2200000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'ol1', text: 'Utvärdera avståndsproblematiken', done: false },
      { id: 'ol2', text: 'Kontrollera skick på befintliga byggnader', done: false },
    ],
  },
  {
    slug: 'valnasvagen-3-skarplinge',
    namn: 'Valnäsvägen 3',
    kommun: 'Tierp (Skärplinge)',
    lan: 'Uppsala län',
    ha: '0,9',
    haNum: 0.9,
    pris: '2,3 Mkr',
    prisNum: 2300000,
    byggnader: '~1 490 m² industri/lager',
    status: 'ny',
    kategori: 'grobund',
    url: 'https://www.svenskfast.se/kommersiellt/uppsala/tierp/skarplinge/valnasvagen-3/443157/',
    flaggor: [
      { text: 'Industrilokal ~1 490 m²', typ: 'positiv' },
      { text: 'Grobund-kandidat', typ: 'info' },
      { text: '≤5 Mkr', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(2300000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(2300000),
      manadskostnadStress: beraknaManadskostnadStress(2300000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'vn1', text: 'Utvärdera för industriändamål', done: false },
    ],
  },
  {
    slug: 'gransta-208-knutby',
    namn: 'Gränsta 208',
    kommun: 'Uppsala (Knutby)',
    lan: 'Uppsala län',
    ha: '~1',
    haNum: 1,
    pris: '3,7 Mkr',
    prisNum: 3700000,
    byggnader: '~507 m² industri/lager',
    status: 'ny',
    kategori: 'grobund',
    url: 'https://www.svenskfast.se/kommersiellt/uppsala/uppsala/knutby/gransta-208/409728/',
    flaggor: [
      { text: 'Industrilokal ~507 m²', typ: 'positiv' },
      { text: 'Grobund-kandidat', typ: 'info' },
      { text: '≤5 Mkr', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3700000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3700000),
      manadskostnadStress: beraknaManadskostnadStress(3700000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'gr1', text: 'Utvärdera för industriändamål', done: false },
    ],
  },
  {
    slug: 'tegelsmoravagen-16b-orbyhus',
    namn: 'Tegelsmoravägen 16B',
    kommun: 'Tierp (Örbyhus)',
    lan: 'Uppsala län',
    ha: '~0,9',
    haNum: 0.9,
    pris: '2,975 Mkr',
    prisNum: 2975000,
    byggnader: 'Industrifastighet',
    status: 'ny',
    kategori: 'grobund',
    url: 'https://www.svenskfast.se/kommersiellt/uppsala/tierp/orbyhus/tegelsmoravagen-16b/407213/',
    flaggor: [
      { text: 'Grobund-kandidat', typ: 'info' },
      { text: '≤5 Mkr', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(2975000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(2975000),
      manadskostnadStress: beraknaManadskostnadStress(2975000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'te1', text: 'Utvärdera för industriändamål', done: false },
    ],
  },
];

export const statusLabels: Record<Status, string> = {
  ny: 'Ny',
  djupdyk: 'Djupdyk',
  andrahand: 'Andra hand',
  parkerad: 'Parkerad',
};

export function getProspektBySlug(slug: string): Prospekt | undefined {
  return prospects.find((p) => p.slug === slug);
}

export function getAllProspects(): Prospekt[] {
  return prospects;
}

export function getPrimaryProspects(): Prospekt[] {
  return prospects.filter((p) => p.kategori === 'primär' && p.status !== 'parkerad');
}

export function getSecondaryProspects(): Prospekt[] {
  return prospects.filter((p) => p.kategori === 'sekundär' && p.status !== 'parkerad');
}

export function getParkedProspects(): Prospekt[] {
  return prospects.filter((p) => p.status === 'parkerad');
}

export function getGrobundProspects(): Prospekt[] {
  return prospects.filter((p) => p.kategori === 'grobund' && p.status !== 'parkerad');
}

export default prospects;
