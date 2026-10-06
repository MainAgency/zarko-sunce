/**
 * Static site copy. Lives here until the CMS gets collections/globals for it —
 * then each export becomes a getter in `lib/api.ts`.
 */

// TODO: replace the placeholder contact details with the real ones.
export const CONTACT = {
  phone: "+385 00 000 0000",
  phoneHref: "tel:+38500000000",
  whatsappHref: "https://wa.me/38500000000",
  email: "info@zarko-sunce.hr",
  area: "Grad i okolica",
  hours: "Pon – Pet, 07:00 – 16:00",
};

// Root-relative hashes so the links also work from the inner pages.
export const NAV = [
  { href: "/#usluge", label: "Usluge" },
  { href: "/#o-nama", label: "O nama" },
  { href: "/#projekti", label: "Projekti" },
  { href: "/#novosti", label: "Novosti" },
  { href: "/#blog", label: "Blog" },
  { href: "/kontakt", label: "Kontakt" },
];

export type ServiceId =
  | "kljuc-u-ruke"
  | "adaptacije"
  | "knauf"
  | "gletanje"
  | "stropovi";

export type Photo = { src: string; alt: string };

// TODO: placeholder stock photos (Unsplash licence) — swap for photos of real
// Žarko Sunce projects, ideally uploaded through the CMS media collection.
const unsplash = (id: string, alt: string): Photo => ({
  src: `https://images.unsplash.com/photo-${id}`,
  alt,
});

/**
 * Sized URL for a photo. Image optimisation is off in this setup (see
 * next.config.ts), so without this every Unsplash photo would download at its
 * full original resolution — several MB each.
 */
export function photoUrl(photo: Photo, width: number) {
  if (!photo.src.startsWith("https://images.unsplash.com/")) return photo.src;
  return `${photo.src}?auto=format&fit=crop&w=${width}&q=72`;
}

export const PHOTOS = {
  livingGrey: unsplash("1724582586529-62622e50c0b3", "Dnevni boravak sa sivim zidovima i velikim prozorima"),
  livingWindow: unsplash("1724582586458-a51791349977", "Moderan dnevni boravak uz veliki prozor"),
  kitchen: unsplash("1750764515068-80d222d974bb", "Svijetla kuhinja otvorenog tipa"),
  kitchenIsland: unsplash("1602028915047-37269d1a73f7", "Kuhinja sa sivim elementima i otokom"),
  kitchenGrey: unsplash("1600489000022-c2086d79f9d4", "Kuhinja s policama i sivim ormarićima"),
  ceiling: unsplash("1649766964924-1d257ddf0742", "Bijeli hodnik sa spuštenim stropom i rasvjetom"),
  hallSkylight: unsplash("1711873316332-acb6930211e1", "Dugi bijeli hodnik sa svjetlarnikom"),
  stair: unsplash("1601993957728-1e56ab70c5a8", "Minimalističko stubište od bijelog betona"),
  shadowWall: unsplash("1521194263619-39ecc5b55c61", "Svjetlo i sjena na glatkom zidu"),
  vases: unsplash("1572853566597-b83cde546912", "Dvije bijele keramičke vaze"),
  livingScandi: unsplash("1583847268964-b28dc8f51f92", "Dnevni boravak s velikim prozorima"),
  sofa: unsplash("1585128792020-803d29415281", "Minimalistički interijer s bijelim zidom"),
  bathroom: unsplash("1584622650111-993a426fbf0a", "Moderna kupaonica s tušem"),
  studio: unsplash("1522708323590-d24dbb6b0267", "Svijetao stan s blagovaonicom"),
  livingTv: unsplash("1628592102751-ba83b0314276", "Dnevni boravak s TV zidom"),
  bedroomDark: unsplash("1616594039964-ae9021a400a0", "Spavaća soba s tamnim zidom"),
  bedroomLight: unsplash("1616486029423-aaa4789e8c9a", "Svijetla spavaća soba"),
  officeHall: unsplash("1739700712159-550519327ca7", "Hodnik poslovnog prostora"),
  homeOffice: unsplash("1613575831056-0acd5da8f085", "Radni kutak u dnevnom boravku"),
};

/* ----------------------------------------------------------------- Hero */

export type HeroSlide = {
  label: string;
  title: string;
  /** Second title line, set in the italic serif. */
  accent: string;
  text: string;
  cta: { href: string; label: string };
  photo: Photo;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    label: "Adaptacije stanova",
    title: "Prostor po mjeri",
    accent: "vašeg života",
    text: "Kompletne i djelomične adaptacije stanova i kuća — od plana do završnog sloja.",
    cta: { href: "#usluge", label: "Usluge" },
    photo: PHOTOS.livingGrey,
  },
  {
    label: "Ključ u ruke",
    title: "Od prve skice",
    accent: "do useljenja",
    text: "Preuzimamo cijeli projekt: koordinaciju, materijale i završno čišćenje.",
    cta: { href: "#o-nama", label: "O nama" },
    photo: PHOTOS.kitchen,
  },
  {
    label: "Knauf i spušteni stropovi",
    title: "Linije koje",
    accent: "oblikuju prostor",
    text: "Pregradni zidovi, obloge i stropovi s integriranom rasvjetom.",
    cta: { href: "#projekti", label: "Projekti" },
    photo: PHOTOS.hallSkylight,
  },
  {
    label: "Gletanje i bojanje",
    title: "Završni sloj",
    accent: "koji se vidi",
    text: "Precizno gletanje i bojanje — zidovi bez mane i pri bočnom svjetlu.",
    cta: { href: "/kontakt", label: "Kontakt" },
    photo: PHOTOS.bedroomLight,
  },
];

/* ------------------------------------------------------------- Services */

export type Service = {
  id: ServiceId;
  photo: Photo;
  title: string;
  short: string;
  description: string;
};

export const SERVICES: Service[] = [
  {
    id: "adaptacije",
    photo: PHOTOS.livingWindow,
    title: "Adaptacije stanova",
    short: "Nova raspodjela, novi život prostora",
    description: "Kompletne i djelomične adaptacije stanova i kuća, prilagođene vašem načinu života.",
  },
  {
    id: "knauf",
    photo: PHOTOS.bedroomDark,
    title: "Pregradni zidovi",
    short: "Knauf suhomontažni sustavi",
    description: "Brza i čista podjela prostora bez mokrih radova, sa zvučnom i toplinskom izolacijom.",
  },
  {
    id: "gletanje",
    photo: PHOTOS.shadowWall,
    title: "Gletanje i bojanje",
    short: "Zidovi bez mane",
    description: "Precizna priprema podloge, gletanje u više slojeva i bojanje.",
  },
  {
    id: "stropovi",
    photo: PHOTOS.ceiling,
    title: "Spušteni stropovi",
    short: "Rasvjeta i skrivene instalacije",
    description: "Ravni i kaskadni stropovi od gips-kartonskih ploča s mjestima za LED rasvjetu.",
  },
  {
    id: "kljuc-u-ruke",
    photo: PHOTOS.kitchen,
    title: "Ključ u ruke",
    short: "Jedan dogovor, cijeli projekt",
    description: "Planiranje, koordinacija radova, materijal i završno čišćenje — vi dobijete ključ.",
  },
];

/* ---------------------------------------------------------------- About */

export const ABOUT = {
  text: [
    "Žarko Sunce d.o.o. bavi se adaptacijama stanova i završnim radovima — suhomontažom, gletanjem, bojanjem i spuštenim stropovima.",
    "Radimo s jednom ekipom od početka do kraja. Rokovi se ne gube između različitih majstora, a vi imate jednu osobu za sve dogovore.",
  ],
  values: ["Jedna ekipa", "Jasna ponuda", "Čisto radilište"],
};

/* --------------------------------------------------------- Projects/news */

// TODO: every project, news item and blog post below is placeholder content
// to show the layout. Replace with real entries (ideally CMS collections)
// before the site goes live.

export type Project = {
  slug: string;
  title: string;
  category: string;
  area: string;
  duration: string;
  services: ServiceId[];
  cover: Photo;
  gallery: Photo[];
  summary: string;
  body: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "adaptacija-dvosobnog-stana",
    title: "Adaptacija dvosobnog stana",
    category: "Ključ u ruke",
    area: "62 m²",
    duration: "6 tjedana",
    services: ["kljuc-u-ruke", "adaptacije", "knauf", "gletanje", "stropovi"],
    cover: PHOTOS.studio,
    gallery: [PHOTOS.studio, PHOTOS.kitchenGrey, PHOTOS.bedroomLight],
    summary: "Stariji stan prilagođen modernom životu: nova raspodjela prostora, spušteni strop i potpuno novi završni slojevi.",
    body: [
      "Stan je prije radova imao zatvorenu kuhinju i dugačak, mračan hodnik. Uklonili smo dio nenosivog zida i otvorili kuhinju prema dnevnom boravku.",
      "U hodniku smo izveli spušteni strop s mjestima za rasvjetu, a novim Knauf zidom odvojili radni kutak od spavaće sobe.",
      "Svi zidovi su sanirani, gletani u više slojeva i obojeni. Prostor je predan očišćen i spreman za useljenje.",
    ],
  },
  {
    slug: "kuhinja-i-dnevni-boravak",
    title: "Kuhinja i dnevni boravak",
    category: "Adaptacija",
    area: "38 m²",
    duration: "3 tjedna",
    services: ["adaptacije", "gletanje", "stropovi"],
    cover: PHOTOS.kitchenIsland,
    gallery: [PHOTOS.kitchenIsland, PHOTOS.livingTv],
    summary: "Spajanje kuhinje i dnevnog boravka u jedan otvoren prostor s kaskadnim stropom iznad otoka.",
    body: [
      "Cilj je bio dobiti jedan otvoren prostor za kuhanje i druženje. Nakon rušenja pregradnog zida izravnali smo zidove i pripremili ih za nove instalacije.",
      "Iznad kuhinjskog otoka izveden je kaskadni spušteni strop s LED trakom, a zidovi su gletani i obojeni u svijetle, tople tonove.",
    ],
  },
  {
    slug: "spavaca-soba-s-tv-zidom",
    title: "Spavaća soba s TV zidom",
    category: "Knauf",
    area: "16 m²",
    duration: "1 tjedan",
    services: ["knauf", "gletanje"],
    cover: PHOTOS.bedroomDark,
    gallery: [PHOTOS.bedroomDark, PHOTOS.bedroomLight],
    summary: "Knauf obloga s nišama i skrivenom rasvjetom te tamni zid koji smiruje cijelu sobu.",
    body: [
      "Na zidu iza kreveta izveli smo Knauf oblogu s nišama za rasvjetu i skrivenim kabelima.",
      "Zidovi su gletani do potpuno glatke površine i obojeni, s naglašenim tamnim zidom iza uzglavlja.",
    ],
  },
  {
    slug: "uredski-prostor",
    title: "Uređenje uredskog prostora",
    category: "Poslovni prostor",
    area: "120 m²",
    duration: "5 tjedana",
    services: ["knauf", "stropovi", "gletanje"],
    cover: PHOTOS.officeHall,
    gallery: [PHOTOS.officeHall, PHOTOS.homeOffice],
    summary: "Pregradni zidovi za nove urede, spušteni stropovi s revizijskim otvorima i bojanje cijelog prostora.",
    body: [
      "Otvoreni prostor podijelili smo Knauf pregradnim zidovima sa zvučnom izolacijom kako bi svaki ured imao svoj mir.",
      "U hodnicima su izvedeni spušteni stropovi s revizijskim otvorima za lakši pristup instalacijama.",
    ],
  },
  {
    slug: "kupaonica-i-hodnik",
    title: "Kupaonica i hodnik",
    category: "Adaptacija",
    area: "14 m²",
    duration: "2 tjedna",
    services: ["adaptacije", "stropovi"],
    cover: PHOTOS.bathroom,
    gallery: [PHOTOS.bathroom, PHOTOS.ceiling],
    summary: "Spušteni strop u kupaonici i hodniku, nova rasvjeta i priprema zidova za završne radove.",
    body: [
      "U kupaonici smo izveli spušteni strop od vodootpornih ploča s ugradnom rasvjetom.",
      "Hodnik je dobio novi strop s točkastom rasvjetom te gletane i obojene zidove.",
    ],
  },
];

export type ArticleBlock = { type: "p" | "h2"; text: string };

export type Article = {
  slug: string;
  title: string;
  /** ISO date. */
  date: string;
  category: string;
  readingTime: string;
  cover: Photo;
  excerpt: string;
  body: ArticleBlock[];
};

export const NEWS: Article[] = [
  {
    slug: "nova-web-stranica",
    title: "Pokrenuli smo novu web stranicu",
    date: "2026-10-01",
    category: "Obavijest",
    readingTime: "1 min",
    cover: PHOTOS.livingWindow,
    excerpt: "Na jednom mjestu možete pogledati naše usluge, projekte i poslati upit za besplatnu procjenu.",
    body: [
      { type: "p", text: "Dobrodošli na novu web stranicu Žarko Sunca. Ovdje ćete pronaći sve naše usluge, odabrane projekte i savjete iz prakse." },
      { type: "p", text: "Upit za besplatnu procjenu možete poslati izravno preko obrasca na dnu stranice ili nas nazvati." },
    ],
  },
  {
    slug: "termini-za-izlazak-na-teren",
    title: "Slobodni termini za izlazak na teren",
    date: "2026-09-15",
    category: "Obavijest",
    readingTime: "1 min",
    cover: PHOTOS.stair,
    excerpt: "Planirate radove za zimu ili proljeće? Javite se na vrijeme i dogovorite besplatan izlazak na teren.",
    body: [
      { type: "p", text: "Najbolje je radove dogovoriti nekoliko tjedana unaprijed. Tako stignemo pogledati prostor, pripremiti ponudu i uskladiti termin." },
      { type: "p", text: "Pošaljite upit preko obrasca ili nas nazovite — javit ćemo vam se s prijedlogom termina." },
    ],
  },
  {
    slug: "zavrsen-projekt-dvosobni-stan",
    title: "Završena adaptacija dvosobnog stana",
    date: "2026-08-28",
    category: "Projekt",
    readingTime: "2 min",
    cover: PHOTOS.studio,
    excerpt: "Šest tjedana rada, pet usluga i jedan stan spreman za useljenje.",
    body: [
      { type: "p", text: "Predali smo još jedan stan po principu ključ u ruke. Cijeli projekt pogledajte u sekciji Projekti." },
    ],
  },
  {
    slug: "novi-alati-za-gletanje",
    title: "Nova oprema za brže i čišće gletanje",
    date: "2026-07-10",
    category: "Oprema",
    readingTime: "2 min",
    cover: PHOTOS.vases,
    excerpt: "Uz novu opremu za brušenje s usisom radilište ostaje znatno čišće.",
    body: [
      { type: "p", text: "Brušenje gleta je posao koji stvara najviše prašine. Uz brusilice s izravnim usisom prašina ostaje u spremniku, a ne na vašem namještaju." },
    ],
  },
];

export const POSTS: Article[] = [
  {
    slug: "knauf-ili-zidani-zid",
    title: "Knauf ili zidani pregradni zid — što odabrati?",
    date: "2026-09-20",
    category: "Savjeti",
    readingTime: "4 min",
    cover: PHOTOS.homeOffice,
    excerpt: "Usporedili smo suhomontažne i zidane pregradne zidove: brzinu, čistoću, izolaciju i cijenu.",
    body: [
      { type: "p", text: "Kad treba podijeliti prostor, najčešće se bira između zidanog zida i suhomontažnog (Knauf) sustava. Oba rješenja imaju svoje mjesto." },
      { type: "h2", text: "Brzina i čistoća" },
      { type: "p", text: "Suhomontažni zid postavlja se bez mokrih radova i bez čekanja na sušenje. Radilište je čišće, a prostor se brže vraća u upotrebu." },
      { type: "h2", text: "Izolacija" },
      { type: "p", text: "S mineralnom vunom u konstrukciji i odgovarajućim pločama suhomontažni zid postiže dobru zvučnu izolaciju za stambene prostore." },
      { type: "h2", text: "Kada ipak zidati?" },
      { type: "p", text: "Ako na zid planirate vješati vrlo teške elemente ili je riječ o vanjskom zidu, zidani zid je često bolji izbor. Najbolje je odluku donijeti nakon izlaska na teren." },
    ],
  },
  {
    slug: "kako-pripremiti-stan-za-gletanje",
    title: "Kako pripremiti stan za gletanje i bojanje",
    date: "2026-09-02",
    category: "Vodič",
    readingTime: "3 min",
    cover: PHOTOS.shadowWall,
    excerpt: "Pet koraka koje možete napraviti sami prije dolaska ekipe — i uštedjeti vrijeme.",
    body: [
      { type: "p", text: "Dobra priprema skraćuje radove i smanjuje nered. Evo što možete napraviti prije našeg dolaska." },
      { type: "h2", text: "Ispraznite zidove" },
      { type: "p", text: "Skinite slike, police i zavjese. Što je manje stvari uz zidove, to je posao brži." },
      { type: "h2", text: "Pomaknite namještaj" },
      { type: "p", text: "Namještaj pomaknite na sredinu prostorije. Mi ćemo ga zaštititi folijom, a podove pokriti." },
      { type: "h2", text: "Dogovorite redoslijed soba" },
      { type: "p", text: "Ako stanujete u stanu tijekom radova, dogovorit ćemo redoslijed kako bi uvijek imali barem jednu slobodnu sobu." },
    ],
  },
  {
    slug: "koliko-traje-adaptacija-stana",
    title: "Koliko traje adaptacija stana?",
    date: "2026-08-14",
    category: "Savjeti",
    readingTime: "3 min",
    cover: PHOTOS.livingScandi,
    excerpt: "Što sve utječe na trajanje radova i kako realno planirati useljenje.",
    body: [
      { type: "p", text: "Trajanje adaptacije ovisi o veličini stana, stanju prostora i opsegu radova. Djelomična adaptacija traje kraće od potpune." },
      { type: "h2", text: "Što najviše utječe na rok" },
      { type: "p", text: "Rušenje i instalacije, sušenje materijala te dostava opreme najčešće određuju tempo radova." },
      { type: "h2", text: "Kako planirati" },
      { type: "p", text: "Okvirni rok dobit ćete u ponudi nakon izlaska na teren. Preporučujemo ostaviti malu rezervu prije useljenja." },
    ],
  },
  {
    slug: "spusteni-strop-ideje",
    title: "Spušteni strop: ideje za rasvjetu",
    date: "2026-07-22",
    category: "Inspiracija",
    readingTime: "2 min",
    cover: PHOTOS.ceiling,
    excerpt: "LED trake, točkasta rasvjeta i kaskade — kako spušteni strop mijenja dojam prostora.",
    body: [
      { type: "p", text: "Spušteni strop ne služi samo skrivanju instalacija. Uz dobro planiranu rasvjetu može potpuno promijeniti dojam prostora." },
      { type: "h2", text: "Indirektna LED rasvjeta" },
      { type: "p", text: "LED traka u kaskadi stropa daje meko, ravnomjerno svjetlo — idealno za dnevni boravak i spavaću sobu." },
    ],
  },
];

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("hr-HR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
