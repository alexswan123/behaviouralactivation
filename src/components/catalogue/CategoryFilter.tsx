import type { Context } from '../../lib/types';
import type { EffortFilter } from '../../hooks/useCatalogue';

const CONTEXT_FILTERS: { value: 'all' | Context; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'home', label: 'At Home' },
  { value: 'outdoors', label: 'Outside' },
  { value: 'social', label: 'With Others' },
  { value: 'anywhere', label: 'Anywhere' },
];

const EFFORT_FILTERS: { value: EffortFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low effort' },
  { value: 'quick', label: '5 min or less' },
];

interface CategoryFilterProps {
  activeContext: 'all' | Context;
  onContextChange: (value: 'all' | Context) => void;
  effortFilter: EffortFilter;
  onEffortChange: (value: EffortFilter) => void;
}

export default function CategoryFilter({ activeContext, onContextChange, effortFilter, onEffortChange }: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {CONTEXT_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onContextChange(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeContext === f.value
                ? 'bg-[#7D9B76] text-white shadow-sm'
                : 'bg-white border border-[#E8E4DE] text-[#5C5A57] hover:bg-[#F0EBE3]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {EFFORT_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onEffortChange(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              effortFilter === f.value
                ? 'bg-[#3D5A4C] text-white shadow-sm'
                : 'bg-white border border-[#E8E4DE] text-[#8A8680] hover:bg-[#F0EBE3]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
