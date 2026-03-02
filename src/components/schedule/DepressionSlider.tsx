interface DepressionSliderProps {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  /** 'before' shows "right now, before starting" copy; 'after' shows "now that it's done" copy */
  timing: 'before' | 'after';
}

const COPY = {
  before: {
    heading: 'How depressed are you feeling right now?',
    sub: 'Rate before starting · 0 = not at all · 100 = as bad as it gets',
  },
  after: {
    heading: 'How depressed are you feeling now it\'s done?',
    sub: 'Rate after finishing · 0 = not at all · 100 = as bad as it gets',
  },
};

export default function DepressionSlider({ value, onChange, disabled = false, timing }: DepressionSliderProps) {
  const hasValue = value !== null;
  const copy = COPY[timing];

  return (
    <div className="space-y-2">
      <div className="rounded-xl bg-[#F8F5FF] border border-[#E0DAF5] p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-[#6A5A9C]">{copy.heading}</p>
            <p className="text-[10px] text-[#A89CC8] mt-0.5">{copy.sub}</p>
          </div>
          {hasValue ? (
            <span className="px-2.5 py-1 rounded-lg bg-[#EDE8FF] border border-[#C8C0F0] text-[#6A5A9C] text-sm font-bold min-w-[3rem] text-center shrink-0">
              {value}
            </span>
          ) : (
            <span className="text-xs text-[#C8C4BE] italic shrink-0">not rated</span>
          )}
        </div>
        {!hasValue && !disabled ? (
          <button
            onClick={() => onChange(50)}
            className="w-full py-2 rounded-lg border-2 border-dashed border-[#C8C0F0] text-xs text-[#9E98C8] hover:border-[#6A5A9C] hover:text-[#6A5A9C] transition-colors"
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
            className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ accentColor: '#6A5A9C', background: `linear-gradient(to right, #6A5A9C ${value ?? 50}%, #E0DAF5 ${value ?? 50}%)` }}
          />
        )}
      </div>

      {hasValue && value >= 90 && (
        <div className="rounded-xl bg-[#FFF5F5] border border-[#F0C8C8] p-4 space-y-2">
          <p className="text-sm font-semibold text-[#8B4A4A]">
            If you're in crisis or need immediate support
          </p>
          <p className="text-xs text-[#8B6A6A] leading-relaxed">
            Bloom is a self-help tool, not a crisis service. If you need to talk to someone right now, these services are free and available 24/7.
          </p>
          <div className="space-y-1.5 text-xs">
            <p className="text-[#8B4A4A]"><strong>Lifeline:</strong>{' '}<a href="tel:131114" className="underline">13 11 14</a></p>
            <p className="text-[#8B4A4A]"><strong>Beyond Blue:</strong>{' '}<a href="tel:1300224636" className="underline">1300 22 4636</a></p>
            <p className="text-[#8B4A4A]"><strong>13YARN</strong> (Aboriginal & Torres Strait Islander):{' '}<a href="tel:139276" className="underline">13 92 76</a></p>
            <p className="text-[#8B4A4A]"><strong>Emergency:</strong>{' '}<a href="tel:000" className="underline">000</a></p>
          </div>
        </div>
      )}
    </div>
  );
}
