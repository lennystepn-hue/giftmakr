export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-sage/10 rounded-lg animate-pulse ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-sage/10 overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
