// Cosmatch — demo profily pro /demo a /demo/[id]
// POZN: Tyto profily jsou vymyšlené, slouží jen pro web ukázku.
// V aplikaci budou jen reálné profily uživatelů (viz Manifest důvěry).

export type DemoPrompt = {
  question: string
  answer: string
}

export type DemoProfile = {
  id: string
  name: string
  age: number
  city: string
  zodiac: string
  occupation: string
  genitive: string  // 2. pád koho/čeho (Terezy, Jakuba, Kláry, Martina, Anežky, Ondřeje)
  archetypeGenitive: string  // 2. pád archetypu (Průkopnice, Hledače, Pečovatelky, Stavitele, Tvůrkyně, Idealisty)
  bio: string
  hobbies: string[]
  // Compatibility
  matchCategory: 'Spřízněné duše' | 'Láska a přátelství' | 'Osudová přitažlivost' | 'Magnetická tenze' | 'Prospěšný vztah'
  matchLabel: string
  score: number
  verified: boolean
  archetype: { number: number; name: string }
  // Photos (Unsplash CDN — Unsplash License, free for commercial)
  photos: string[]
  // 3 prompts
  prompts: DemoPrompt[]
  // 1 voice prompt (illustrative only on web)
  voicePrompt: { question: string; duration: string }
  // Color accent
  accent: string
}

// Unsplash photos — používáme stable photo IDs (CDN cached)
const u = (id: string) => `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'tereza',
    name: 'Tereza',
    age: 28,
    city: 'Praha',
    zodiac: 'Beran',
    occupation: 'Grafická designérka',
    genitive: 'Terezy',
    bio: 'Miluji cestování, dobrou kávu a spontánní výlety do hor. Hledám někoho, kdo bude sdílet podobné životní hodnoty.',
    hobbies: ['Cestování', 'Jóga', 'Fotografování', 'Vaření'],
    matchCategory: 'Spřízněné duše',
    matchLabel: 'Oboustranná shoda',
    score: 94,
    verified: true,
    archetype: { number: 1, name: 'Průkopnice' },
    archetypeGenitive: 'Průkopnice',
    photos: [
      u('photo-1494790108377-be9c29b29330'),  // hero: smiling female portrait
      u('photo-1545389336-cf090694435e'),  // yoga mat from above (no face)
      u('photo-1500835556837-99ac94a94552'),  // passport on map (travel)
      u('photo-1495474472287-4d71bcdd2085'),  // latte art coffee (top-down)
      u('photo-1556909114-f6e7ad7d3136'),  // cooking ingredients flat lay
    ],
    prompts: [
      { question: 'Co mě baví o víkendu', answer: 'Spontánní výlety do hor a dobrá káva s knížkou' },
      { question: 'Moje malá radost', answer: 'Káva v sobotu ráno, když je dům ještě tichý' },
      { question: 'Hledám někoho, kdo', answer: 'má rád ticho stejně jako město, a kdo ví, kdy si sednout a poslouchat' },
    ],
    voicePrompt: { question: 'Krátká věc o mně', duration: '0:23' },
    accent: '#ec4899',
  },
  {
    id: 'jakub',
    name: 'Jakub',
    age: 31,
    city: 'Brno',
    zodiac: 'Rak',
    occupation: 'Software engineer',
    genitive: 'Jakuba',
    bio: 'Softwarový inženýr, nadšenec do vína a filmů. Hledám trvalý vztah, ne jen povrchní zábavu.',
    hobbies: ['Filmy', 'Hudba', 'Fitness', 'Cestování'],
    matchCategory: 'Láska a přátelství',
    matchLabel: 'Oboustranná shoda',
    score: 81,
    verified: false,
    archetype: { number: 7, name: 'Hledač' },
    archetypeGenitive: 'Hledače',
    photos: [
      u('photo-1633332755192-727a05c4013d'),  // hero: blond male portrait (light hair)
      u('photo-1497366216548-37526070297c'),  // laptop on desk (no face)
      u('photo-1505740420928-5e560c06d30e'),  // headphones (no face)
      u('photo-1534438327276-14e5300c3a48'),  // dumbells gym (no face)
      u('photo-1469854523086-cc02fe5d8800'),  // mountain landscape
    ],
    prompts: [
      { question: 'Letos opravdu chci', answer: 'Najít víno, které mě překvapí, a film, který mě donutí přemýšlet 3 dny' },
      { question: 'Moje největší přednost', answer: 'Umím slyšet co lidé ve skutečnosti říkají, ne jen co říkají nahlas' },
      { question: 'V partě jsem ten/ta, kdo', answer: 'vždycky posílá zprávy o půlnoci a ráno se za to omlouvá' },
    ],
    voicePrompt: { question: 'O čem teď nejvíc přemýšlím', duration: '0:31' },
    accent: '#ec4899',
  },
  {
    id: 'klara',
    name: 'Klára',
    age: 26,
    city: 'Praha',
    zodiac: 'Štír',
    occupation: 'Psycholožka',
    genitive: 'Kláry',
    bio: 'Léčitelka duší, kterou baví hluboké rozhovory a lidé s příběhem. Ve volném čase maluju.',
    hobbies: ['Umění', 'Čtení', 'Příroda', 'Meditace'],
    matchCategory: 'Osudová přitažlivost',
    matchLabel: '',
    score: 73,
    verified: true,
    archetype: { number: 6, name: 'Pečovatelka' },
    archetypeGenitive: 'Pečovatelky',
    photos: [
      u('photo-1438761681033-6461ffad8d80'),  // hero: dreamy female portrait
      u('photo-1513475382585-d06e58bcb0e0'),  // paint brushes & palette (no face)
      u('photo-1481627834876-b7833e8f5570'),  // open books (no face)
      u('photo-1441974231531-c6227db76b6e'),  // forest path (nature)
      u('photo-1545389336-cf090694435e'),  // meditation/yoga (replaced — original was a face)
    ],
    prompts: [
      { question: 'Co kdybych ti řekl/a, že', answer: 'maluju každý den 20 minut, i když nic z toho nikomu neukážu' },
      { question: 'Co mě uklidní', answer: 'Dlouhé procházky lesem, kde nepotkáš nikoho známého' },
      { question: 'Nejcennější vzpomínka', answer: 'Hlavní postava knížky, co mi máma četla když mi bylo 7. Neustále si beru její moudrosti k srdci.' },
    ],
    voicePrompt: { question: 'Píseň, která mě právě teď drží', duration: '0:18' },
    accent: '#ec4899',
  },
  {
    id: 'martin',
    name: 'Martin',
    age: 34,
    city: 'Praha',
    zodiac: 'Býk',
    occupation: 'Produktový manažer',
    genitive: 'Martina',
    bio: 'Šéfkuchař amatér. Miluji vaření, přírodu a psy. Hledám někoho, kdo se nebojí života.',
    hobbies: ['Vaření', 'Příroda', 'Zahradničení', 'Sport'],
    matchCategory: 'Magnetická tenze',
    matchLabel: 'Výzva',
    score: 62,
    verified: false,
    archetype: { number: 4, name: 'Stavitel' },
    archetypeGenitive: 'Stavitele',
    photos: [
      u('photo-1535713875002-d1d0cf377fde'),  // hero: blond MALE portrait (clear masc)
      u('photo-1556909114-f6e7ad7d3136'),  // cooking ingredients (no face)
      u('photo-1518791841217-8f162f1e1131'),  // dog on grass (nature)
      u('photo-1504280390367-361c6d9f38f4'),  // camping tent
      u('photo-1517649763962-0c623066013b'),  // running shoes (sport, no face)
    ],
    prompts: [
      { question: 'Typická neděle', answer: 'Vaříme se psem, oba dva. Já vařím, on dohlíží.' },
      { question: 'Pokud bys mě měl/a poznat', answer: 'Začni u jídla. Tam mě opravdu dostaneš.' },
      { question: 'Hledám někoho, kdo', answer: 'se nebojí zašpinit ruce, miluju zahradničení a kempování!' },
    ],
    voicePrompt: { question: 'Recept, který tě naučím první', duration: '0:27' },
    accent: '#ec4899',
  },
  {
    id: 'anezka',
    name: 'Anežka',
    age: 29,
    city: 'Ostrava',
    zodiac: 'Panna',
    occupation: 'Vědkyně',
    genitive: 'Anežky',
    bio: 'Pracuji v laboratoři a ráda tančím salsu. Zatancuješ si se mnou?',
    hobbies: ['Tanec', 'Věda', 'Fitness', 'Cestování'],
    matchCategory: 'Prospěšný vztah',
    matchLabel: 'Oboustranná shoda',
    score: 78,
    verified: true,
    archetype: { number: 3, name: 'Tvůrkyně' },
    archetypeGenitive: 'Tvůrkyně',
    photos: [
      u('photo-1531746020798-e6953c6e8e04'),  // hero: female portrait
      u('photo-1547153760-18fc86324498'),  // dance motion (low face visibility)
      u('photo-1532187863486-abf9dbad1b69'),  // lab equipment (no face)
      u('photo-1517649763962-0c623066013b'),  // running shoes (sport, no face)
      u('photo-1488646953014-85cb44e25828'),  // travel scenery
    ],
    prompts: [
      { question: 'V partě jsem ten/ta, kdo', answer: 'domluví letenku, ubytování a vyhledá nejlepší restaurace. Pak ale nejsem schopná se rozhodnout, kam vlastně půjdeme.' },
      { question: 'Můj životní cíl', answer: 'Vědecky doložit, že tanec snižuje stres víc než káva. A tančit při tom.' },
      { question: 'Tajný talent', answer: 'Znám nazpaměť 17 různých variací Bachaty Suelty' },
    ],
    voicePrompt: { question: 'Kam mě vezmeš tančit', duration: '0:22' },
    accent: '#ec4899',
  },
  {
    id: 'ondrej',
    name: 'Ondřej',
    age: 27,
    city: 'Praha',
    zodiac: 'Kozoroh',
    occupation: 'Hudebník',
    genitive: 'Ondřeje',
    bio: 'Muzikant a věčný snílek. Píšu texty písní a hledám múzu. Jsem milovník ticha i hlasitých koncertů.',
    hobbies: ['Hudba', 'Umění', 'Filmy', 'Čtení'],
    matchCategory: 'Spřízněné duše',
    matchLabel: '',
    score: 88,
    verified: false,
    archetype: { number: 9, name: 'Idealista' },
    archetypeGenitive: 'Idealisty',
    photos: [
      u('photo-1542178243-bc20204b769f'),  // hero: male portrait
      u('photo-1510915361894-db8b60106cb1'),  // acoustic guitar (no face)
      u('photo-1485579149621-3123dd979885'),  // concert lights (no face)
      u('photo-1485846234645-a62644f84728'),  // cinema/film (no face)
      u('photo-1524995997946-a1c2e315a42f'),  // books stack (no face)
    ],
    prompts: [
      { question: 'Píseň, která mě vždy dostane', answer: 'Norah Jones — Come Away With Me.' },
      { question: 'Krátký film o mém životě by se jmenoval', answer: 'Čekání na inspiraci ve 3 ráno.' },
      { question: 'Hledám někoho, kdo', answer: 'rozumí, že ticho mezi notami je často důležitější než tóny samy' },
    ],
    voicePrompt: { question: 'Krátký verš o tobě, i když jsem Tě ještě nikdy neviděl', duration: '0:34' },
    accent: '#ec4899',
  },
]

export function getDemoProfileById(id: string): DemoProfile | undefined {
  return DEMO_PROFILES.find(p => p.id === id)
}
