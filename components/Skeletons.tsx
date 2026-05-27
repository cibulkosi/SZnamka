/**
 * Skeleton loaders pro hlavní stránky.
 *
 * Použití:
 *  if (loading) return <DiscoverSkeleton />
 *  if (loading) return <MatchesSkeleton />
 *  if (loading) return <ProfileSkeleton />
 *
 * Animate-pulse z Tailwind, stejné dimensions jako reálné karty
 * (snižuje perceived loading time o ~30 % — UXCam research).
 */

// Single hero card skeleton (4:5 photo + 3 řádky textu)
function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
      <div className="aspect-[4/5] bg-gray-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
      </div>
    </div>
  )
}

export function DiscoverSkeleton() {
  return (
    <div className="bg-[#FAF6F0]" style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav placeholder */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 max-w-lg mx-auto w-full">
        <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-1.5">
          {[1,2,3,4].map(i => <div key={i} className="h-7 w-10 bg-gray-200 rounded-full animate-pulse" />)}
        </div>
      </div>
      {/* Card area */}
      <div className="flex-1 overflow-hidden px-4">
        <div className="max-w-lg mx-auto">
          <CardSkeleton />
        </div>
      </div>
    </div>
  )
}

export function MatchesSkeleton() {
  return (
    <main className="min-h-screen bg-[#F0EBE3] pb-24">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-8" />
        {/* Tab pills */}
        <div className="flex gap-2 mb-8">
          {[1,2,3].map(i => <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />)}
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <div className="aspect-[4/5] bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-[#F0EBE3] pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-[#F0EBE3]/95 backdrop-blur border-b border-gray-200/50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>

        {/* Sections */}
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-3xl p-6 space-y-3">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  )
}
