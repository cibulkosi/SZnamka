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
    bio: 'Miluji cestování, dobrou kávu a spontánní výlety do hor. Hledám někoho, kdo bude sdílet podobné životné hodnoty.',
    hobbies: ['Cestování', 'Jóga', 'Fotografování', 'Vaření'],
    matchCategory: 'Spřízněné duše',
    matchLabel: 'Spřízněné duše · oboustranná shoda',
    score: 94,
    verified: true,
    archetype: { number: 1, name: 'Průkopnice' },
    photos: [
      u('photo-1494790108377-be9c29b29330'),
      u('photo-1599447421416-3414500d18a5'),
      u('photo-1500835556837-99ac94a94552'),
      u('photo-1495474472287-4d71bcdd2085'),
      u('photo-1551218808-94e220e084d2'),
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
    bio: 'Softwarový inženýr, nadšenec do vína a filmů. Hledám trvalý vztah, ne jen povrchní zábavu.',
    hobbies: ['Filmy', 'Hudba', 'Fitness', 'Cestování'],
    matchCategory: 'Láska a přátelství',
    matchLabel: 'Láska a přátelství · oboustranná shoda',
    score: 81,
    verified: false,
    archetype: { number: 7, name: 'Hledač' },
    photos: [
      u('photo-1500648767791-00dcc994a43e'),
      u('photo-1497366216548-37526070297c'),
      u('photo-1505740420928-5e560c06d30e'),
      u('photo-1571019613454-1cb2f99b2d8b'),
      u('photo-1469854523086-cc02fe5d8800'),
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
    bio: 'Léčitelka duší, kterou baví hluboké rozhovory a lidé s příběhem. Ve volném čase maluju.',
    hobbies: ['Umění', 'Čtení', 'Příroda', 'Meditace'],
    matchCategory: 'Osudová přitažlivost',
    matchLabel: 'Osudová přitažlivost',
    score: 73,
    verified: true,
    archetype: { number: 6, name: 'Pečovatelka' },
    photos: [
      u('photo-1438761681033-6461ffad8d80'),
      u('photo-1513475382585-d06e58bcb0e0'),
      u('photo-1481627834876-b7833e8f5570'),
      u('photo-1441974231531-c6227db76b6e'),
      u('photo-1547036967-23d11aacaee0'),
    ],
    prompts: [
      { question: 'Co kdybych ti řekl/a, že', answer: 'maluju každý den 20 minut, i když nic z toho nikomu neukážu' },
      { question: 'Co mě uklidní', answer: 'Dlouhé procházky lesem, kde nepotkáš nikoho známého' },
      { question: 'Nejcennější vzpomínka', answer: 'Hlavní postava knížky, co mi máma četla když mi bylo 7. Stálo to za to udržet ji v hlavě.' },
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
    bio: 'Šéfkuchař amatér. Miluji vaření, přírodu a psy. Hledám někoho, kdo se nebojí života.',
    hobbies: ['Vaření', 'Příroda', 'Zahradničení', 'Sport'],
    matchCategory: 'Magnetická tenze',
    matchLabel: 'Magnetická tenze · výzva',
    score: 62,
    verified: false,
    archetype: { number: 4, name: 'Stavitel' },
    photos: [
      u('photo-1507003211169-0a1dd7228f2d'),
      u('photo-1556909114-f6e7ad7d3136'),
      u('photo-1545558014-8692077e9b5c'),
      u('photo-1453825012366-3ee49a99e76e'),
      u('photo-1546519638-68e109498ffc'),
    ],
    prompts: [
      { question: 'Typická neděle', answer: 'Vaříme se psem, oba dva. Já vařím, on dohlíží.' },
      { question: 'Pokud bys mě měl/a poznat', answer: 'Začni u jídla. Tam mi opravdu vidíš v očích.' },
      { question: 'Hledám někoho, kdo', answer: 'se nebojí zašpinit ruce, doslova i obrazně' },
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
    bio: 'Pracuji v laboratoři a ráda tančím salsu. Zatancuješ si se mnou?',
    hobbies: ['Tanec', 'Věda', 'Fitness', 'Cestování'],
    matchCategory: 'Prospěšný vztah',
    matchLabel: 'Prospěšný vztah · oboustranná shoda',
    score: 78,
    verified: true,
    archetype: { number: 3, name: 'Tvůrkyně' },
    photos: [
      u('photo-1531746020798-e6953c6e8e04'),
      u('photo-1535525153412-5a092d46b734'),
      u('photo-1532187863486-abf9dbad1b69'),
      u('photo-1518611012118-696072aa579a'),
      u('photo-1488646953014-85cb44e25828'),
    ],
    prompts: [
      { question: 'V partě jsem ten/ta, kdo', answer: 'domluví letenku, ubytování a vyhledá nejlepší restauraci. Pak ale není schopná rozhodnout, kam jdeme.' },
      { question: 'Můj životní cíl', answer: 'Vědecky doložit, že tanec snižuje stres víc než káva. A tančit při tom.' },
      { question: 'Tajný talent', answer: 'Vím nazpaměť 47 různých variací Bachaty Suelty' },
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
    bio: 'Muzikant a věčný snílek. Píšu texty písní a hledám múzu. Jsem milovník ticha i hlasitých koncertů.',
    hobbies: ['Hudba', 'Umění', 'Filmy', 'Čtení'],
    matchCategory: 'Spřízněné duše',
    matchLabel: 'Spřízněné duše',
    score: 88,
    verified: false,
    archetype: { number: 9, name: 'Idealista' },
    photos: [
      u('photo-1542178243-bc20204b769f'),
      u('photo-1510915361894-db8b60106cb1'),
      u('photo-1485579149621-3123dd979885'),
      u('photo-1485846234645-a62644f84728'),
      u('photo-1524995997946-a1c2e315a42f'),
    ],
    prompts: [
      { question: 'Píseň, která mě vždy rozplyne', answer: 'Norah Jones — Come Away With Me. Pokaždé se ztratí čas.' },
      { question: 'Krátký film o mém životě by se jmenoval', answer: 'Čekání na inspiraci v 3 ráno' },
      { question: 'Hledám někoho, kdo', answer: 'rozumí, že ticho mezi notami je často důležitější než tóny samy' },
    ],
    voicePrompt: { question: 'Krátký verš o tobě, kterou jsem nikdy neviděl', duration: '0:34' },
    accent: '#ec4899',
  },
]

export function getDemoProfileById(id: string): DemoProfile | undefined {
  return DEMO_PROFILES.find(p => p.id === id)
}
