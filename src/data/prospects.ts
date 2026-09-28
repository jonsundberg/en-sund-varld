export type Status = 'ny' | 'aktiv' | 'djupdyk' | 'andrahand' | 'parkerad';
export type Kategori = 'primär' | 'nara-primar' | 'sekundär' | 'grobund';
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
    ha: '55,2',
    haNum: 55.2,
    pris: '3,45 Mkr',
    prisNum: 3450000,
    byggnader: 'Nej',
    status: 'aktiv',
    kategori: 'primär',
    url: 'https://www.hemnet.se/bostad/gard-risby-uppsala-kommun-uppsala-risby-4-3,-del-av-21746306',
    flaggor: [
      { text: 'Delförsäljning', typ: 'info' },
      { text: 'Pris korrigerat (tidigare 4,25 M)', typ: 'positiv' },
      { text: 'Bra areal (55 ha)', typ: 'positiv' },
      { text: 'Ingen befintlig bebyggelse', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3450000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3450000),
      manadskostnadStress: beraknaManadskostnadStress(3450000),
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
    status: 'aktiv',
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
    status: 'aktiv',
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
    status: 'aktiv',
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
    status: 'aktiv',
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
    status: 'aktiv',
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
    slug: 'savastebo-1-3',
    namn: 'Sävastebo 1:3 (del)',
    kommun: 'Uppsala (Bälinge)',
    lan: 'Uppsala län',
    ha: '47,1',
    haNum: 47.1,
    pris: '3,5 Mkr',
    prisNum: 3500000,
    byggnader: 'Nej',
    status: 'ny',
    kategori: 'primär',
    url: 'https://www.hemnet.se/bostad/gard-norra-balinge-uppsala-kommun-del-av-savastebo-1-3-21794564',
    flaggor: [
      { text: 'NY denna vecka', typ: 'info' },
      { text: 'Bra areal (47 ha)', typ: 'positiv' },
      { text: 'Kräver befintlig lantbruksfastighet i Uppsala', typ: 'varning' },
      { text: 'DP osäker', typ: 'varning' },
      { text: 'Ingen befintlig bebyggelse', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3500000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3500000),
      manadskostnadStress: beraknaManadskostnadStress(3500000),
      noter: 'Bygg från scratch – kräver lantbruksfastighet för förvärv.',
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'sv1', text: 'Verifiera förvärvskrav (lantbruksfastighet)', done: false },
      { id: 'sv2', text: 'Kontrollera detaljplan/byggrätt', done: false },
      { id: 'sv3', text: 'Begär skogsbruksplan', done: false },
    ],
  },
  {
    slug: 'bjornbo-134',
    namn: 'Björnbo 134',
    kommun: 'Östhammar',
    lan: 'Uppsala län',
    ha: '17,4',
    haNum: 17.4,
    pris: '2,6 Mkr',
    prisNum: 2600000,
    byggnader: 'Bostad + uthus',
    status: 'ny',
    kategori: 'primär',
    url: 'https://www.hemnet.se/bostad/gard-5rum-osthammar-osthammars-kommun-bjornbo-134-19312475',
    flaggor: [
      { text: 'NY denna vecka', typ: 'info' },
      { text: 'Attraktivt pris (2,6 Mkr)', typ: 'positiv' },
      { text: 'Areal i undre spannet (17 ha)', typ: 'varning' },
      { text: 'Befintlig bostad', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(2600000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(2600000),
      manadskostnadStress: beraknaManadskostnadStress(2600000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'bj1', text: 'Begär komplett prospekt', done: false },
      { id: 'bj2', text: 'Kontrollera skick på bostad och uthus', done: false },
      { id: 'bj3', text: 'Utvärdera om arealen räcker', done: false },
    ],
  },
  {
    slug: 'uppveda-byvag',
    namn: 'Uppveda Byväg',
    kommun: 'Norrtälje',
    lan: 'Stockholms län',
    ha: '~49',
    haNum: 49,
    pris: '4,3 Mkr',
    prisNum: 4300000,
    byggnader: 'Okänt',
    status: 'parkerad',
    kategori: 'primär',
    url: '',
    flaggor: [
      { text: 'PARKERAD — styrelsebeslut krävs', typ: 'varning' },
      { text: 'Bud var 28 sep kl 12 (historiskt)', typ: 'info' },
      { text: 'Stor areal (49 ha)', typ: 'positiv' },
      { text: 'Stockholms län', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4300000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4300000),
      manadskostnadStress: beraknaManadskostnadStress(4300000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'up1', text: 'Invänta styrelsebeslut', done: false },
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
    status: 'aktiv',
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
    status: 'aktiv',
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
    status: 'parkerad',
    kategori: 'sekundär',
    url: 'https://areal.se/fastighet/gard-ol-pers-i-iste-gavleborg-bollnas/',
    flaggor: [
      { text: 'OSÄKER – Areal 404, stryk tills bekräftad', typ: 'varning' },
      { text: 'Lågt pris (2,2 Mkr)', typ: 'positiv' },
      { text: 'Befintliga byggnader', typ: 'positiv' },
      { text: 'Bollnäs – längst från Stockholm', typ: 'info' },
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
      { id: 'ol1', text: 'Verifiera om annonsen finns kvar', done: false },
    ],
  },
  {
    slug: 'gorvalstorvagen-6',
    namn: 'Görvälstorpsvägen 6',
    kommun: 'Norrtälje',
    lan: 'Stockholms län',
    ha: '23',
    haNum: 23,
    pris: '~3,5 Mkr (högsta bud)',
    prisNum: 3500000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'nara-primar',
    url: 'https://www.husiroslagen.se/Beskrivning/OBJ5P33BK53CW7JXLH7GZ',
    flaggor: [
      { text: 'Budgivning pågår', typ: 'varning' },
      { text: 'Utgångspris 3,95 Mkr, högsta 3,5 M', typ: 'info' },
      { text: 'Bra areal (23 ha)', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3500000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3500000),
      manadskostnadStress: beraknaManadskostnadStress(3500000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'go1', text: 'Följa budgivningen', done: false },
    ],
  },
  {
    slug: 'varhulta-malmvik-1',
    namn: 'Värhulta Malmvik 1',
    kommun: 'Eskilstuna',
    lan: 'Södermanlands län',
    ha: '19',
    haNum: 19,
    pris: '3,5 Mkr',
    prisNum: 3500000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'nara-primar',
    url: '',
    flaggor: [
      { text: 'Medel areal (19 ha)', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3500000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3500000),
      manadskostnadStress: beraknaManadskostnadStress(3500000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'vh1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'bjalketorp',
    namn: 'Bjälketorp',
    kommun: 'Eskilstuna',
    lan: 'Södermanlands län',
    ha: '45',
    haNum: 45,
    pris: '4,995 Mkr',
    prisNum: 4995000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'nara-primar',
    url: '',
    flaggor: [
      { text: 'Stor areal (45 ha)', typ: 'positiv' },
      { text: 'Högre pris (~5 Mkr)', typ: 'varning' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4995000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4995000),
      manadskostnadStress: beraknaManadskostnadStress(4995000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'bk1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'bjorsund-4-5',
    namn: 'Björsund 4:5 (del)',
    kommun: 'Strängnäs',
    lan: 'Södermanlands län',
    ha: '18,8',
    haNum: 18.8,
    pris: '~3,15 Mkr (högsta bud)',
    prisNum: 3150000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'nara-primar',
    url: 'https://www.svenskfast.se/gard/sodermanland/strangnas/del-av-bjorsund-4-5/450720/',
    flaggor: [
      { text: 'Budgivning pågår', typ: 'varning' },
      { text: 'Utgångspris 2,9 Mkr, högsta 3,15 M', typ: 'info' },
      { text: 'Mindre areal (18,8 ha)', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3150000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3150000),
      manadskostnadStress: beraknaManadskostnadStress(3150000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'bs1', text: 'Följa budgivningen', done: false },
    ],
  },
  {
    slug: 'husby-3-katrineholm',
    namn: 'Husby 3',
    kommun: 'Katrineholm',
    lan: 'Södermanlands län',
    ha: '21,9',
    haNum: 21.9,
    pris: '4,8 Mkr',
    prisNum: 4800000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'nara-primar',
    url: '',
    flaggor: [
      { text: 'Medel areal (22 ha)', typ: 'info' },
      { text: 'Högre pris (4,8 Mkr)', typ: 'varning' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4800000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4800000),
      manadskostnadStress: beraknaManadskostnadStress(4800000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'hu1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'syrholen-gagnef',
    namn: 'Syrholen',
    kommun: 'Gagnef',
    lan: 'Dalarnas län',
    ha: '49,9',
    haNum: 49.9,
    pris: '3,0 Mkr',
    prisNum: 3000000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    buddatum: '7 okt 2026 kl 14',
    url: '',
    flaggor: [
      { text: 'Anbud 7 okt kl 14:00', typ: 'varning' },
      { text: 'Stor areal (50 ha)', typ: 'positiv' },
      { text: 'Attraktivt pris (3,0 Mkr)', typ: 'positiv' },
      { text: 'Dalarna – sekundärt geografiskt läge', typ: 'info' },
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
      { id: 'sy1', text: 'Utvärdera om Dalarna-läge passar gruppen', done: false },
    ],
  },
  {
    slug: 'yttre-1-2-nordanstig',
    namn: 'Yttre 1:2',
    kommun: 'Nordanstig',
    lan: 'Gävleborgs län',
    ha: '61,8',
    haNum: 61.8,
    pris: '4,45 Mkr',
    prisNum: 4450000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    url: '',
    flaggor: [
      { text: 'Stor areal (62 ha)', typ: 'positiv' },
      { text: 'Gävleborg – sekundärt geografiskt läge', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4450000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4450000),
      manadskostnadStress: beraknaManadskostnadStress(4450000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'yt1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'sodra-fjole-arvika',
    namn: 'Södra Fjöle',
    kommun: 'Arvika',
    lan: 'Värmlands län',
    ha: '59,9',
    haNum: 59.9,
    pris: '3,5 Mkr',
    prisNum: 3500000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    url: '',
    flaggor: [
      { text: 'Stor areal (60 ha)', typ: 'positiv' },
      { text: 'Attraktivt pris (3,5 Mkr)', typ: 'positiv' },
      { text: 'Värmland – sekundärt geografiskt läge', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3500000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3500000),
      manadskostnadStress: beraknaManadskostnadStress(3500000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'sf1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'sjogetorp-odeshog',
    namn: 'Sjögetorp',
    kommun: 'Ödeshög',
    lan: 'Östergötlands län',
    ha: '~37',
    haNum: 37,
    pris: '5,0 Mkr',
    prisNum: 5000000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    url: '',
    flaggor: [
      { text: 'Bra areal (37 ha)', typ: 'positiv' },
      { text: 'Prisgräns (5,0 Mkr)', typ: 'varning' },
      { text: 'Östergötland – sekundärt geografiskt läge', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(5000000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(5000000),
      manadskostnadStress: beraknaManadskostnadStress(5000000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'sj1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'berg-leksand',
    namn: 'Berg',
    kommun: 'Leksand',
    lan: 'Dalarnas län',
    ha: '~25',
    haNum: 25,
    pris: '4,75 Mkr',
    prisNum: 4750000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    buddatum: 'Visning 3 okt 2026',
    url: '',
    flaggor: [
      { text: 'Visning 3 okt', typ: 'info' },
      { text: 'Medel areal (25 ha)', typ: 'info' },
      { text: 'Dalarna – sekundärt geografiskt läge', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4750000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4750000),
      manadskostnadStress: beraknaManadskostnadStress(4750000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'be1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'overtanger-falun',
    namn: 'Övertänger',
    kommun: 'Falun',
    lan: 'Dalarnas län',
    ha: '52,2',
    haNum: 52.2,
    pris: '2,65 Mkr',
    prisNum: 2650000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    buddatum: '28 sep 2026 kl 14 (historiskt)',
    url: '',
    flaggor: [
      { text: 'NY / akut – anbud var 28 sep kl 14', typ: 'varning' },
      { text: 'Stor areal (52 ha)', typ: 'positiv' },
      { text: 'Attraktivt pris (2,65 Mkr)', typ: 'positiv' },
      { text: 'Dalarna – sekundärt geografiskt läge', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(2650000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(2650000),
      manadskostnadStress: beraknaManadskostnadStress(2650000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'ot1', text: 'Kontrollera om deadline har passerat', done: false },
    ],
  },
  {
    slug: 'aberga-orsa',
    namn: 'Åberga',
    kommun: 'Orsa',
    lan: 'Dalarnas län',
    ha: '37,1',
    haNum: 37.1,
    pris: '3,4 Mkr',
    prisNum: 3400000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    url: '',
    flaggor: [
      { text: 'NY', typ: 'info' },
      { text: 'Bra areal (37 ha)', typ: 'positiv' },
      { text: 'Attraktivt pris (3,4 Mkr)', typ: 'positiv' },
      { text: 'Dalarna – sekundärt geografiskt läge', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3400000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3400000),
      manadskostnadStress: beraknaManadskostnadStress(3400000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'ab1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'over-saljen-ockelbo',
    namn: 'Över-Säljen',
    kommun: 'Ockelbo',
    lan: 'Gävleborgs län',
    ha: '59,7',
    haNum: 59.7,
    pris: '3,3 Mkr',
    prisNum: 3300000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    buddatum: '23 okt 2026',
    url: '',
    flaggor: [
      { text: 'Kant ny (andra hand)', typ: 'info' },
      { text: 'Anbud 23 okt', typ: 'info' },
      { text: 'Stor areal (60 ha)', typ: 'positiv' },
      { text: 'Attraktivt pris (3,3 Mkr)', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(3300000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(3300000),
      manadskostnadStress: beraknaManadskostnadStress(3300000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'os1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'limmingen-hallefors',
    namn: 'Limmingen',
    kommun: 'Hällefors',
    lan: 'Örebro län',
    ha: '56',
    haNum: 56,
    pris: '4 Mkr',
    prisNum: 4000000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    url: '',
    flaggor: [
      { text: 'Kant ny (andra hand)', typ: 'info' },
      { text: 'Stor areal (56 ha)', typ: 'positiv' },
      { text: 'Reservat – undersök begränsningar', typ: 'varning' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4000000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4000000),
      manadskostnadStress: beraknaManadskostnadStress(4000000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'li1', text: 'Undersök reservatbegränsningar', done: false },
    ],
  },
  {
    slug: 'nyhyttan-nora',
    namn: 'Nyhyttan',
    kommun: 'Nora',
    lan: 'Örebro län',
    ha: '38',
    haNum: 38,
    pris: '1,9 Mkr',
    prisNum: 1900000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    url: '',
    flaggor: [
      { text: 'Kant ny (andra hand)', typ: 'info' },
      { text: 'Bra areal (38 ha)', typ: 'positiv' },
      { text: 'Lågt pris (1,9 Mkr)', typ: 'positiv' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(1900000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(1900000),
      manadskostnadStress: beraknaManadskostnadStress(1900000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'ny1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'stimmerkulla-askersund',
    namn: 'Stimmerkulla',
    kommun: 'Askersund',
    lan: 'Örebro län',
    ha: '21',
    haNum: 21,
    pris: '3,7 Mkr',
    prisNum: 3700000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    url: '',
    flaggor: [
      { text: 'Kant ny (andra hand)', typ: 'info' },
      { text: 'Medel areal (21 ha)', typ: 'info' },
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
      { id: 'st1', text: 'Begär komplett prospekt', done: false },
    ],
  },
  {
    slug: 'hogbron-isefall-motala',
    namn: 'Högbron Isefall',
    kommun: 'Motala',
    lan: 'Östergötlands län',
    ha: '33',
    haNum: 33,
    pris: '4,995 Mkr',
    prisNum: 4995000,
    byggnader: 'Okänt',
    status: 'ny',
    kategori: 'sekundär',
    url: '',
    flaggor: [
      { text: 'Kant ny (andra hand)', typ: 'info' },
      { text: 'Bra areal (33 ha)', typ: 'positiv' },
      { text: 'Högre pris (~5 Mkr)', typ: 'varning' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(4995000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(4995000),
      manadskostnadStress: beraknaManadskostnadStress(4995000),
    },
    djupdyk: undefined,
    nastaSteg: [
      { id: 'hb1', text: 'Begär komplett prospekt', done: false },
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
    status: 'aktiv',
    kategori: 'grobund',
    url: 'https://www.svenskfast.se/kommersiellt/uppsala/tierp/skarplinge/valnasvagen-3/443157/',
    flaggor: [
      { text: 'Industrilokal ~1 490 m²', typ: 'positiv' },
      { text: 'Grobund-kandidat', typ: 'info' },
      { text: '≤5 Mkr', typ: 'positiv' },
      { text: 'DP-varning', typ: 'varning' },
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
    status: 'aktiv',
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
    status: 'aktiv',
    kategori: 'grobund',
    url: 'https://www.svenskfast.se/kommersiellt/uppsala/tierp/orbyhus/tegelsmoravagen-16b/407213/',
    flaggor: [
      { text: 'Grobund-kandidat', typ: 'info' },
      { text: '≤5 Mkr', typ: 'positiv' },
      { text: 'DP-varning', typ: 'varning' },
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
  {
    slug: 'fjadervagen-17-ranas',
    namn: 'Fjädervägen 17',
    kommun: 'Rånäs',
    lan: 'Stockholms län',
    ha: 'Okänt',
    haNum: 0,
    pris: '6,5 Mkr',
    prisNum: 6500000,
    byggnader: 'Okänt',
    status: 'parkerad',
    kategori: 'grobund',
    url: '',
    flaggor: [
      { text: 'Strategi >5 Mkr (ej aktiv shortlist)', typ: 'varning' },
      { text: 'Grobund-kandidat', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(6500000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(6500000),
      manadskostnadStress: beraknaManadskostnadStress(6500000),
    },
    djupdyk: undefined,
    nastaSteg: [],
  },
  {
    slug: 'lenaberg-vattholma',
    namn: 'Lenaberg',
    kommun: 'Vattholma',
    lan: 'Uppsala län',
    ha: 'Okänt',
    haNum: 0,
    pris: '25 Mkr',
    prisNum: 25000000,
    byggnader: 'Okänt',
    status: 'parkerad',
    kategori: 'grobund',
    url: '',
    flaggor: [
      { text: 'Strategi >5 Mkr (ej aktiv shortlist)', typ: 'varning' },
      { text: 'Grobund-kandidat', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(25000000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(25000000),
      manadskostnadStress: beraknaManadskostnadStress(25000000),
    },
    djupdyk: undefined,
    nastaSteg: [],
  },
  {
    slug: 'husby-111c-vendel',
    namn: 'Husby 111C',
    kommun: 'Vendel',
    lan: 'Uppsala län',
    ha: 'Okänt',
    haNum: 0,
    pris: '7,5 Mkr',
    prisNum: 7500000,
    byggnader: 'Okänt',
    status: 'parkerad',
    kategori: 'grobund',
    url: '',
    flaggor: [
      { text: 'Strategi >5 Mkr (ej aktiv shortlist)', typ: 'varning' },
      { text: 'Svag tomt', typ: 'varning' },
      { text: 'Grobund-kandidat', typ: 'info' },
    ],
    kalkyl: {
      kopfasPerHh: beraknaKopfas(7500000),
      rekommenderadVA: 'bas',
      vaKostnadPerHh: { sparsamt: 168, bas: 218, ovre: 293 },
      manadskostnadBas: beraknaManadskostnadBas(7500000),
      manadskostnadStress: beraknaManadskostnadStress(7500000),
    },
    djupdyk: undefined,
    nastaSteg: [],
  },
];

export const statusLabels: Record<Status, string> = {
  ny: 'Ny',
  aktiv: 'Aktiv',
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

export function getNaraPrimarProspects(): Prospekt[] {
  return prospects.filter((p) => p.kategori === 'nara-primar' && p.status !== 'parkerad');
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

export function isValidExternalUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}

export default prospects;
