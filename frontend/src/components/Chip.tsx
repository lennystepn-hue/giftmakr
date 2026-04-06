import { X } from "lucide-react";

interface ChipProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
}

export default function Chip({ label, selected, onToggle, onRemove }: ChipProps) {
  if (onRemove) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-3 py-1.5 text-sm text-sage font-medium">
        {label}
        <button onClick={onRemove} className="ml-1 hover:text-charcoal" aria-label={`Remove ${label}`}>
          <X size={14} />
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
        selected
          ? "bg-sage text-white shadow-sm"
          : "border border-sage/30 text-charcoal hover:border-sage hover:bg-sage/5"
      }`}
    >
      {label}
    </button>
  );
}
