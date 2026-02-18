export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="h-6 w-48 bg-muted animate-pulse rounded-full mx-auto" />
            <div className="h-12 w-full max-w-xl bg-muted animate-pulse rounded-lg mx-auto" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-lg mx-auto" />
            <div className="flex gap-4 justify-center pt-4">
              <div className="h-14 w-64 bg-muted animate-pulse rounded-2xl" />
              <div className="h-14 w-64 bg-muted animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
      {/* Steps skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-4">
              <div className="h-16 w-16 bg-muted animate-pulse rounded-2xl mx-auto" />
              <div className="h-6 w-32 bg-muted animate-pulse rounded-lg mx-auto" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded-lg mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
