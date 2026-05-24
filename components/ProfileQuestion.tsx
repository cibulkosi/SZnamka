'use client'
/**
 * ProfileQuestion – karta s otázkou, která se zobrazuje mezi swipováním
 * Každá odpověď se okamžitě uloží do Supabase i localStorage
 */

import { useState } from 'react'
import { supabase, type Profile } from '@/lib/supabase'

export type Question = {
  id: string        // odpovídá poli v Profile
  emoji: string
  text: string
  subtext?: string
  options: { value: string; label: string; emoji: string }[]
  intimate?: boolean  // true = jemnější formulace
}

export const PROFILE_QUESTIONS: Question[] = [
  {
    id: 'relationship_type',
    emoji: '💫',
    text: 'Co teď hledáš?',
    subtext: 'Buď upřímný/á — upřímnost je základ správného párování',
    options: [
      { value: 'serious',  label: 'Vážný vztah',         emoji: '💍' },
      { value: 'casual',   label: 'Něco nenáročného',    emoji: '🌸' },
      { value: 'open',     label: 'Otevřený vztah',      emoji: '🌈' },
      { value: 'unsure',   label: 'Ještě nevím',         emoji: '🤷' },
    ],
  },
  {
    id: 'family_plans',
    emoji: '👨‍👩‍👧',
    text: 'Jaké máš plány ohledně dětí?',
    options: [
      { value: 'want_kids',          label: 'Chci děti',              emoji: '🍼' },
      { value: 'have_kids_want_more', label: 'Mám a chci další',      emoji: '👶' },
      { value: 'no_kids',            label: 'Nechci děti',            emoji: '🙅' },
      { value: 'open',               label: 'Jsem otevřený/á',        emoji: '🌿' },
    ],
  },
  {
    id: 'personality_role',
    emoji: '🧩',
    text: 'Jak bys popsal/a svůj styl?',
    subtext: 'Protiklady se doplňují — v týmu i ve vztahu',
    options: [
      { value: 'visionary', label: 'Vizionář – mám nápady',      emoji: '💡' },
      { value: 'executor',  label: 'Realizátor – dotáhnu věci',  emoji: '⚙️' },
      { value: 'both',      label: 'Obojí — podle situace',      emoji: '🎯' },
    ],
  },
  {
    id: 'personality_schedule',
    emoji: '🌅',
    text: 'Jsi ranní ptáče nebo noční sova?',
    options: [
      { value: 'morning',  label: 'Ranní ptáče',    emoji: '☀️' },
      { value: 'night',    label: 'Noční sova',     emoji: '🦉' },
      { value: 'flexible', label: 'Flexibilní',     emoji: '🌀' },
    ],
  },
  {
    id: 'personality_social',
    emoji: '🎭',
    text: 'Jak si dobíjíš energii?',
    options: [
      { value: 'introvert',  label: 'Sám/sama v klidu',       emoji: '🏡' },
      { value: 'extrovert',  label: 'Mezi lidmi',             emoji: '🎉' },
      { value: 'ambivert',   label: 'Záleží na náladě',       emoji: '⚡' },
    ],
  },
  {
    id: 'personality_decision',
    emoji: '🧠',
    text: 'Jak se hlavně rozhoduješ?',
    subtext: 'Logikou nebo srdcem? Obojí má sílu',
    options: [
      { value: 'logic',     label: 'Logikou, hlavou',         emoji: '🧮' },
      { value: 'heart',     label: 'Srdcem, intuicí',         emoji: '💗' },
      { value: 'balanced',  label: 'Vyvážením obou',          emoji: '⚖️' },
    ],
  },
  {
    id: 'personality_lifestyle',
    emoji: '📅',
    text: 'Jaký máš životní styl?',
    subtext: 'Plánovaný, spontánní nebo flexibilní?',
    options: [
      { value: 'planned',     label: 'Mám rád/a věci naplánované', emoji: '📋' },
      { value: 'spontaneous', label: 'Rozhoduji se spontánně',     emoji: '🎲' },
      { value: 'flexible',    label: 'Podle situace',              emoji: '🌀' },
    ],
  },
  {
    id: 'smoking',
    emoji: '🚭',
    text: 'Kouříš?',
    options: [
      { value: 'never',     label: 'Nekouřím',          emoji: '✅' },
      { value: 'sometimes', label: 'Příležitostně',     emoji: '🌿' },
      { value: 'often',     label: 'Ano, pravidelně',   emoji: '🚬' },
    ],
  },
  {
    id: 'alcohol',
    emoji: '🍷',
    text: 'Alkohol v tvém životě?',
    options: [
      { value: 'never',     label: 'Nepiji',           emoji: '💧' },
      { value: 'socially',  label: 'Příležitostně',    emoji: '🥂' },
      { value: 'regularly', label: 'Pravidelně',       emoji: '🍺' },
    ],
  },
  {
    id: 'marijuana',
    emoji: '🌿',
    text: 'Marihuana v tvém životě?',
    options: [
      { value: 'never',     label: 'Vůbec',            emoji: '🚫' },
      { value: 'sometimes', label: 'Příležitostně',    emoji: '🌿' },
      { value: 'often',     label: 'Pravidelně',       emoji: '💚' },
    ],
  },
  {
    id: 'religion',
    emoji: '🌟',
    text: 'Víra a spiritualita ve tvém životě?',
    options: [
      { value: 'none',      label: 'Ateista/agnostik', emoji: '🔬' },
      { value: 'spiritual', label: 'Spirituální',      emoji: '🌙' },
      { value: 'religious', label: 'Věřící',           emoji: '🙏' },
      { value: 'other',     label: 'Jiné',             emoji: '✨' },
    ],
  },
  {
    id: 'finances',
    emoji: '💰',
    text: 'Jak nakládáš s penězi?',
    options: [
      { value: 'saver',    label: 'Šetřím a investuji',  emoji: '🏦' },
      { value: 'balanced', label: 'Vyrovnaně',           emoji: '⚖️' },
      { value: 'spender',  label: 'Užívám si přítomnost', emoji: '🛍️' },
    ],
  },
  {
    id: 'personality_conflict',
    emoji: '🕊️',
    text: 'Jak řešíš neshody ve vztahu?',
    options: [
      { value: 'talk',      label: 'Hned to vyříkám',       emoji: '💬' },
      { value: 'cool_down', label: 'Nejdřív se uklidním',   emoji: '🧘' },
      { value: 'avoid',     label: 'Konflikty nerad/a',     emoji: '🙈' },
    ],
  },
  {
    id: 'attachment_style',
    emoji: '🤝',
    text: 'Jak se cítíš v blízkém vztahu?',
    subtext: 'Bowlbyho attachment theory — silně predikuje vztahový úspěch',
    options: [
      { value: 'secure',      label: 'Pohodlně s blízkostí i sám/sama',    emoji: '🌿' },
      { value: 'anxious',     label: 'Bojím se opuštění, potřebuji ujištění', emoji: '🌊' },
      { value: 'avoidant',    label: 'Cením si nezávislosti, blízkost občas dusí', emoji: '🦅' },
      { value: 'disorganized',label: 'Touha po blízkosti i strach z ní zároveň', emoji: '🌀' },
    ],
  },
  {
    id: 'love_language_primary',
    emoji: '💝',
    text: 'Jak nejlíp přijímáš lásku?',
    subtext: 'Chapmanových 5 jazyků lásky — vyber, co Ti dělá největší radost',
    options: [
      { value: 'words',  label: 'Slova ujištění a chvála',       emoji: '💬' },
      { value: 'acts',   label: 'Skutky a praktická pomoc',      emoji: '🛠️' },
      { value: 'gifts',  label: 'Drobné dárky a překvapení',     emoji: '🎁' },
      { value: 'time',   label: 'Společně strávený čas',          emoji: '⏳' },
      { value: 'touch',  label: 'Fyzický kontakt a doteky',      emoji: '🤗' },
    ],
  },
  {
    id: 'love_language_secondary',
    emoji: '💕',
    text: 'A druhý nejdůležitější jazyk lásky?',
    subtext: 'Vyber druhý nejsilnější (jiný než hlavní)',
    options: [
      { value: 'words',  label: 'Slova ujištění a chvála',       emoji: '💬' },
      { value: 'acts',   label: 'Skutky a praktická pomoc',      emoji: '🛠️' },
      { value: 'gifts',  label: 'Drobné dárky a překvapení',     emoji: '🎁' },
      { value: 'time',   label: 'Společně strávený čas',          emoji: '⏳' },
      { value: 'touch',  label: 'Fyzický kontakt a doteky',      emoji: '🤗' },
    ],
  },
  {
    id: 'emotional_stability',
    emoji: '🌤️',
    text: 'Jak prožíváš emoce?',
    subtext: 'Klidně, intenzivně nebo podle situace?',
    options: [
      { value: 'stable',   label: 'Klidně, vyrovnaně',         emoji: '🌳' },
      { value: 'reactive', label: 'Intenzivně, naplno',        emoji: '🔥' },
      { value: 'balanced', label: 'Podle situace',             emoji: '🌗' },
    ],
  },
  {
    id: 'diet',
    emoji: '🥗',
    text: 'Jak jíš?',
    options: [
      { value: 'omnivore',   label: 'Všežravec',      emoji: '🍖' },
      { value: 'vegetarian', label: 'Vegetarián/ka',  emoji: '🥦' },
      { value: 'vegan',      label: 'Vegan/ka',       emoji: '🌱' },
      { value: 'other',      label: 'Jiné',           emoji: '🍱' },
    ],
  },
  {
    id: 'exercise',
    emoji: '🏃',
    text: 'Sport a pohyb v tvém životě?',
    options: [
      { value: 'never',     label: 'Spíše nesportuji',   emoji: '🛋️' },
      { value: 'sometimes', label: 'Občas',              emoji: '🚶' },
      { value: 'regularly', label: 'Pravidelně',         emoji: '💪' },
    ],
  },
  {
    id: 'libido',
    emoji: '🌸',
    text: 'Jak intenzivní intimní spojení preferuješ?',
    subtext: 'Fyzická synergie je důležitá pro dlouhodobou spokojenost',
    intimate: true,
    options: [
      { value: '1', label: 'Zřídka – pohodová blízkost',     emoji: '🕊️' },
      { value: '2', label: 'Pár krát za měsíc',              emoji: '🌷' },
      { value: '3', label: 'Jednou týdně',                   emoji: '💫' },
      { value: '4', label: 'Několikrát týdně',               emoji: '🔥' },
      { value: '5', label: 'Každý den je ideál',             emoji: '⚡' },
    ],
  },
]

interface Props {
  question: Question
  user: Profile
  onAnswer: (updatedUser: Profile) => void
  onSkip: () => void
  questionNumber: number
  totalQuestions: number
}

export function ProfileQuestion({ question, user, onAnswer, onSkip, questionNumber, totalQuestions }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSelect = async (value: string) => {
    setSelected(value)
    setSaving(true)

    const fieldValue = question.id === 'libido' ? parseInt(value) : value
    const update = { [question.id]: fieldValue }

    await supabase.from('profiles').update(update).eq('id', user.id)

    const updatedUser = { ...user, ...update }
    localStorage.setItem('cosmatch_user', JSON.stringify(updatedUser))

    setTimeout(() => {
      setSaving(false)
      onAnswer(updatedUser)
    }, 400)
  }

  return (
    <div className="card p-6 mx-auto" style={{ maxWidth: '440px' }}>
      {/* Záhlaví */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
            Nauč nás víc o Tobě
          </span>
        </div>
        <button
          onClick={onSkip}
          className="text-xs text-gray-300 hover:text-gray-400 transition-colors"
        >
          Přeskočit →
        </button>
      </div>

      {/* Progress tečky */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < questionNumber ? 'bg-pink-400' : i === questionNumber ? 'bg-pink-500' : 'bg-gray-100'
            }`}
          />
        ))}
      </div>

      {/* Otázka */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{question.emoji}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{question.text}</h3>
        {question.subtext && (
          <p className="text-sm text-gray-400">{question.subtext}</p>
        )}
      </div>

      {/* Odpovědi */}
      <div className="space-y-2.5">
        {question.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => !saving && handleSelect(opt.value)}
            disabled={saving}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
              selected === opt.value
                ? 'border-pink-500 bg-pink-50 scale-[0.98]'
                : 'border-gray-100 bg-white hover:border-pink-200 hover:bg-pink-50/30'
            }`}
          >
            <span className="text-xl">{opt.emoji}</span>
            <span className={`font-medium text-sm ${selected === opt.value ? 'text-pink-700' : 'text-gray-700'}`}>
              {opt.label}
            </span>
            {selected === opt.value && !saving && (
              <span className="ml-auto text-pink-500">✓</span>
            )}
            {selected === opt.value && saving && (
              <span className="ml-auto text-pink-300 animate-spin">◌</span>
            )}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-300 mt-4">
        Odpovědi zlepšují přesnost Tvého skóre kompatibility
      </p>
    </div>
  )
}
