export default function DashboardLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-56 rounded-lg bg-white/[0.07]" />
        <div className="h-4 w-80 max-w-full rounded-md bg-white/[0.04]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-28 rounded-2xl bg-white/[0.04] border border-white/[0.06]" />
        <div className="h-28 rounded-2xl bg-white/[0.04] border border-white/[0.06]" />
        <div className="h-28 rounded-2xl bg-white/[0.04] border border-white/[0.06]" />
      </div>
      <div className="h-72 rounded-2xl bg-white/[0.03] border border-white/[0.06]" />
    </div>
  )
}
