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
    selectedBg: 'bg-[#D4A030]',
    selectedText: 'text-white',
    desc: 'Getting something done',
  },
  {
    key: 'connection' as const,
    label: 'Connection',
    icon: Users,
    colour: 'text-[#2D5A3A]',
    bg: 'bg-[#D8EDD8]',
    selectedBg: 'bg-[#7D9B76]',
    selectedText: 'text-white',
    desc: 'Feeling close to others',
  },
  {
    key: 'enjoyment' as const,
    label: 'Enjoyment',
    icon: Heart,
    colour: 'text-[#9B3A45]',
    bg: 'bg-[#FDE8E8]',
    selectedBg: 'bg-[#C17C5A]',
    selectedText: 'text-white',
    desc: 'Pleasure and fun',
  },
] as const;

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function ACEScoreInput({ label, values, onChange, disabled = false }: ACEScoreInputProps) {
  return (
    <div>
      {label && <p className="text-sm font-semibold text-[#3D5A4C] mb-3">{label}</p>}
      <div className="space-y-4">
        {ACE_FIELDS.map(({ key, label: fieldLabel, icon: Icon, colour, bg, selectedBg, selectedText, desc }) => {
          const val = values[key];
          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon size={14} className={colour} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#3D5A4C]">{fieldLabel}</span>
                    {val === null && !disabled && (
                      <span className="text-xs text-[#C8C4BE] italic">tap a score</span>
                    )}
                  </div>
                  <span className="text-xs text-[#9E9B97] block">{desc}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {SCORES.map(n => {
                  const isSelected = val === n;
                  return (
                    <button
                      key={n}
                      onClick={() => !disabled && onChange(key, n)}
                      disabled={disabled}
                      aria-label={`${fieldLabel} ${n}`}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        disabled
                          ? isSelected
                            ? `${selectedBg} ${selectedText} opacity-60`
                            : 'bg-[#F0EBE3] text-[#C8C4BE] opacity-60'
                          : isSelected
                          ? `${selectedBg} ${selectedText} shadow-sm`
                          : 'bg-[#F0EBE3] text-[#9E9B97] hover:bg-[#E8E3DB] hover:text-[#3D5A4C]'
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
