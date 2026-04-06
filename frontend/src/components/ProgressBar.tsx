interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
            i < current ? "bg-sage" : "bg-sage/20"
          }`}
        />
      ))}
      <span className="text-xs text-charcoal/50 ml-2 whitespace-nowrap">
        {current} / {total}
      </span>
    </div>
  );
}
