interface DepressionSliderProps {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  label: string;
}

export default function DepressionSlider({ value, onChange, disabled = false, label }: DepressionSliderProps) {
  const hasValue = value !== null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide">{label}</p>
          <p className="text-[10px] text-[#C8C4BE] mt-0.5">Depression level · 0 = none · 100 = most you've felt</p>
        </div>
        {hasValue ? (
          <span className="px-2.5 py-1 rounded-lg bg-[#F0F7EE] border border-[#C8DCC4] text-[#3D5A4C] text-sm font-bold min-w-[3rem] text-center">
            {value}
          </span>
        ) : (
          <span className="text-xs text-[#C8C4BE] italic">not rated</span>
        )}
      </div>
      {!hasValue && !disabled ? (
        <button
          onClick={() => onChange(50)}
          className="w-full py-2 rounded-xl border-2 border-dashed border-[#D8DCC4] text-xs text-[#9E9B97] hover:border-[#7D9B76] hover:text-[#3D5A4C] transition-colors"
        >
          Tap to rate
        </button>
      ) : (
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value ?? 50}
          disabled={disabled}
          onChange={e => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#7D9B76] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: `linear-gradient(to right, #7D9B76 ${value ?? 50}%, #E8E4DE ${value ?? 50}%)` }}
        />
      )}
    </div>
  );
}
