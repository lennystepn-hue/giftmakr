import { useCallback } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  formatLabel?: (value: number) => string;
}

export default function RangeSlider({
  min, max, step, valueMin, valueMax, onChange, formatLabel = (v) => `${v}`,
}: RangeSliderProps) {
  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(Number(e.target.value), valueMax - step);
      onChange(val, valueMax);
    },
    [valueMax, step, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.max(Number(e.target.value), valueMin + step);
      onChange(valueMin, val);
    },
    [valueMin, step, onChange]
  );

  const leftPercent = ((valueMin - min) / (max - min)) * 100;
  const rightPercent = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-lg font-heading font-bold text-sage">
        <span>{formatLabel(valueMin)}</span>
        <span>{formatLabel(valueMax)}</span>
      </div>
      <div className="relative h-2">
        <div className="absolute inset-0 rounded-full bg-sage/20" />
        <div
          className="absolute h-full rounded-full bg-sage"
          style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
        />
        <input
          type="range"
          min={min} max={max} step={step} value={valueMin}
          onChange={handleMinChange}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sage [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sage [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={min} max={max} step={step} value={valueMax}
          onChange={handleMaxChange}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sage [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sage [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}
