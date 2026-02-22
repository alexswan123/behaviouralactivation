import type { Category } from '../../lib/types';

const FILTERS: { value: 'all' | Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pleasure', label: 'Pleasure' },
  { value: 'social', label: 'Social' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'body', label: 'Body' },
];

interface CategoryFilterProps {
  active: 'all' | Category;
  onChange: (value: 'all' | Category) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === f.value
              ? 'bg-[#7D9B76] text-white shadow-sm'
              : 'bg-white border border-[#E8E4DE] text-[#5C5A57] hover:bg-[#F0EBE3]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
