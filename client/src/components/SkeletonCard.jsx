export default function SkeletonCard() {
  return (
    <div className="h-80 animate-pulse rounded-3xl bg-background-card shadow-soft border border-border-default">
      <div className="h-48 rounded-t-3xl bg-background-soft"></div>
      <div className="p-6 space-y-3">
        <div className="h-4 w-3/4 rounded bg-background-soft"></div>
        <div className="h-3 w-1/2 rounded bg-background-soft"></div>
        <div className="h-4 w-1/4 rounded bg-background-soft"></div>
        <div className="mt-4 h-10 w-full rounded-full bg-background-soft"></div>
      </div>
    </div>
  );
}
