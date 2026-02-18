export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 w-64 bg-muted animate-pulse rounded-lg" />
          <div className="h-48 w-full bg-muted animate-pulse rounded-2xl" />
          <div className="h-4 w-full bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  )
}
