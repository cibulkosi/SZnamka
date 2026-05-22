// Cosmatch — knihovna 40 prompts (Hinge style)
// Použití: registrace / profile editing — uživatel vybere 3-6 promptů

export type Prompt = {
  id: string
  question: string
  // category — pro filtrování pokud bude potřeba
  category: 'about' | 'love' | 'lifestyle' | 'humor' | 'goals' | 'misc'
}

export const PROMPTS: Prompt[] = [
  // About me
  { id: 'co-bys-vedel', question: 'Jedna věc o mně, kterou bys měl/a vědět', category: 'about' },
  { id: 'tri-slova', question: 'Mě v 3 slovech', category: 'about' },
  { id: 'v-parte-jsem', question: 'V partě jsem ten/ta, kdo', category: 'about' },
  { id: 'nejvetsi-prednost', question: 'Moje největší přednost', category: 'about' },
  { id: 'co-me-rozesmeje', question: 'Co mě nejvíc rozesměje', category: 'about' },
  { id: 'co-me-uklidni', question: 'Co mě uklidní', category: 'about' },
  { id: 'tajny-talent', question: 'Tajný talent', category: 'about' },
  { id: 'co-kdybych', question: 'Co kdybych ti řekl/a, že', category: 'about' },

  // Love & relationships
  { id: 'hledam-nekoho', question: 'Hledám někoho, kdo', category: 'love' },
  { id: 'zamilovala', question: 'Zamilovala/a bych se do tebe, kdybys', category: 'love' },
  { id: 'jen-prosim', question: 'Jen tě prosím, abys', category: 'love' },
  { id: 'pokud-pozna', question: 'Pokud bys mě měl/a poznat', category: 'love' },
  { id: 'cervena-vlajka', question: 'Můj červený flag', category: 'love' },
  { id: 'zelena-vlajka', question: 'Můj zelený flag', category: 'love' },
  { id: 'co-baví-samostatne', question: 'Co mě baví dělat samostatně', category: 'love' },

  // Lifestyle
  { id: 'mala-radost', question: 'Moje malá radost', category: 'lifestyle' },
  { id: 'co-vikend', question: 'Co mě baví o víkendu', category: 'lifestyle' },
  { id: 'nedele', question: 'Typická neděle', category: 'lifestyle' },
  { id: 'rano', question: 'Moje ranní rutina', category: 'lifestyle' },
  { id: 'kde-stastny', question: 'Kde jsem nejvíc šťastný/á', category: 'lifestyle' },
  { id: 'obsese-mesic', question: 'Moje obsese tento měsíc', category: 'lifestyle' },
  { id: 'life-hack', question: 'Můj life hack', category: 'lifestyle' },
  { id: 'pisen-rozplyne', question: 'Píseň, která mě vždy rozplyne', category: 'lifestyle' },

  // Humor
  { id: 'dve-pravdy', question: 'Dvě pravdy a jedna lež', category: 'humor' },
  { id: 'nejhorsi-darek', question: 'Nejhorší dárek, který jsem dostal/a', category: 'humor' },
  { id: 'nikdy-uveril', question: 'Nikdy jsem nemohl/a uvěřit, že', category: 'humor' },
  { id: 'kratky-film', question: 'Krátký film o mém životě by se jmenoval', category: 'humor' },

  // Goals & dreams
  { id: 'zivotni-cil', question: 'Můj životní cíl', category: 'goals' },
  { id: 'letos-chci', question: 'Letos opravdu chci', category: 'goals' },
  { id: 'pristi-dobrodruzstvi', question: 'Příští dobrodružství', category: 'goals' },
  { id: 'seznam-prani', question: '3 věci na seznamu životních přání', category: 'goals' },
  { id: 'ucim-se', question: 'Co se právě teď učím', category: 'goals' },
  { id: 'nejvetsi-riziko', question: 'Největší riziko, které jsem podstoupil/a', category: 'goals' },

  // Travel & places
  { id: 'cestoval', question: 'Cestoval/a jsem do', category: 'misc' },
  { id: 'nejlepsi-cesta', question: 'Nejlepší cestovatelský zážitek', category: 'misc' },
  { id: 'tip-pro-mesto', question: 'Můj nejlepší tip pro Prahu', category: 'misc' },
  { id: 'nejcennejsi', question: 'Nejcennější vzpomínka', category: 'misc' },
]

export function getPromptByQuestion(question: string): Prompt | undefined {
  return PROMPTS.find(p => p.question === question)
}
