import React, { useId } from "react";

interface Props {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  label?: React.ReactNode;
  formatValue?(value: number): string;
  onChange(value: [number, number]): void;
}

export default function DualRangeSlider({
  min,
  max,
  step = 1,
  value,
  label,
  formatValue = v => String(v),
  onChange
}: Props) {
  const id = useId();
  const [low, high] = value;
  const range = max - min || 1;
  const lowPct = ((low - min) / range) * 100;
  const highPct = ((high - min) / range) * 100;

  const handleLow = (next: number) => {
    onChange([Math.min(next, high), high]);
  };
  const handleHigh = (next: number) => {
    onChange([low, Math.max(next, low)]);
  };

  return (
    <div className="dual-range-slider">
      {label && <p className="info dual-range-slider__label">{label}</p>}
      <div
        className="dual-range-slider__box"
        style={
          {
            "--dual-range-low": `${lowPct}%`,
            "--dual-range-high": `${highPct}%`
          } as React.CSSProperties
        }
      >
        <div className="dual-range-slider__values">
          <span className="dual-range-slider__value dual-range-slider__value--low">
            {formatValue(low)}
          </span>
          <span className="dual-range-slider__value dual-range-slider__value--high">
            {formatValue(high)}
          </span>
        </div>
        <div className="dual-range-slider__track">
          <div className="dual-range-slider__rail" />
          <div className="dual-range-slider__fill" />
          <input
            id={`${id}-low`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={low}
            onChange={e => handleLow(+e.target.value)}
            aria-label="minimum"
          />
          <input
            id={`${id}-high`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={high}
            onChange={e => handleHigh(+e.target.value)}
            aria-label="maximum"
          />
        </div>
      </div>
    </div>
  );
}
