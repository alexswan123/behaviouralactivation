import { Plus } from 'lucide-react';
import { categoryColours, categoryLabels } from '../../data/activities';
import type { CatalogueActivity } from '../../lib/types';

interface ActivityCardProps {
  activity: CatalogueActivity;
  onAdd: (activity: CatalogueActivity) => void;
}

export default function ActivityCard({ activity, onAdd }: ActivityCardProps) {
  const colours = categoryColours[activity.category];

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E8E3DB] shadow-[0_2px_12px_rgba(61,90,76,0.08)] p-5 flex flex-col gap-4 hover:border-[#7D9B76] hover:shadow-[0_4px_20px_rgba(125,155,118,0.15)] transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#2A3D32] text-[15px] leading-snug">{activity.name}</p>
          <p className="text-sm text-[#8A8680] mt-1 leading-relaxed">{activity.description}</p>
        </div>
        <span
          className="px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 mt-0.5"
          style={{ background: colours.bg, color: colours.text, border: `1px solid ${colours.border}` }}
        >
          {categoryLabels[activity.category]}
        </span>
      </div>
      <button
        onClick={() => onAdd(activity)}
        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#F2F7F1] border border-[#C8DCC4] text-[#3D5A4C] text-sm font-semibold hover:bg-[#7D9B76] hover:text-white hover:border-[#7D9B76] transition-all duration-150"
      >
        <Plus size={15} />
        Add to my schedule
      </button>
    </div>
  );
}
