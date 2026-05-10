export default function SkeletonCard() {
  return (
    <div className="h-80 animate-pulse rounded-3xl bg-background-card shadow-soft border border-border-default">
      <div className="h-48 bg-gray-200 rounded-t-3xl"></div>
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded-full w-full mt-4"></div>
      </div>
    </div>
  );
}
