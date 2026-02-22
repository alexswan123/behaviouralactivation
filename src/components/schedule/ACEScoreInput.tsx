import { Zap, Users, Heart } from 'lucide-react';

interface ACEScoreInputProps {
  label?: string;
  values: { achievement: number | null; connection: number | null; enjoyment: number | null };
  onChange: (key: 'achievement' | 'connection' | 'enjoyment', value: number | null) => void;
  disabled?: boolean;
}

const ACE_FIELDS = [
  {
    key: 'achievement' as const,
    label: 'Achievement',
    icon: Zap,
    colour: 'text-[#7B4A10]',
    bg: 'bg-[#FFF0DC]',
    desc: 'Getting something done',
  },
  {
    key: 'connection' as const,
    label: 'Connection',
    icon: Users,
    colour: 'text-[#2D5A3A]',
    bg: 'bg-[#D8EDD8]',
    desc: 'Feeling close to others',
  },
  {
    key: 'enjoyment' as const,
    label: 'Enjoyment',
    icon: Heart,
    colour: 'text-[#9B3A45]',
    bg: 'bg-[#FDE8E8]',
    desc: 'Pleasure and fun',
  },
] as const;

export default function ACEScoreInput({ label, values, onChange, disabled = false }: ACEScoreInputProps) {
  const handleStep = (key: 'achievement' | 'connection' | 'enjoyment', direction: 1 | -1) => {
    const current = values[key];
    if (current === null) {
      onChange(key, direction === 1 ? 1 : 0);
    } else {
      const next = Math.max(0, Math.min(10, current + direction));
      onChange(key, next);
    }
  };

  return (
    <div>
      {label && <p className="text-sm font-semibold text-[#3D5A4C] mb-3">{label}</p>}
      <div className="space-y-3">
        {ACE_FIELDS.map(({ key, label: fieldLabel, icon: Icon, colour, bg, desc }) => {
          const val = values[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                <Icon size={15} className={colour} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#3D5A4C]">{fieldLabel}</p>
                <p className="text-xs text-[#9E9B97]">{desc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleStep(key, -1)}
                  disabled={disabled || val === 0}
                  className="w-9 h-9 rounded-lg border border-[#E8E4DE] bg-white flex items-center justify-center text-[#3D5A4C] font-bold text-lg hover:bg-[#F0EBE3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Decrease ${fieldLabel}`}
                >
                  −
                </button>
                <span className="w-8 text-center text-[#3D5A4C] font-bold text-lg">
                  {val === null ? '–' : val}
                </span>
                <button
                  onClick={() => handleStep(key, 1)}
                  disabled={disabled || val === 10}
                  className="w-9 h-9 rounded-lg border border-[#E8E4DE] bg-white flex items-center justify-center text-[#3D5A4C] font-bold text-lg hover:bg-[#F0EBE3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Increase ${fieldLabel}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
