import { useState } from 'react';
import { Plus, Sun } from 'lucide-react';
import ActivitySlot from './ActivitySlot';
import AddActivityModal from './AddActivityModal';
import type { ScheduledActivity, Category } from '../../lib/types';

interface TodayFocusProps {
  dayNumber: number;
  date: string; // ISO date string e.g. "2026-02-22"
  activities: ScheduledActivity[];
  onAdd: (data: {
    dayNumber: number;
    activity_name: string;
    scheduled_time: string;
    catalogue_id: string | null;
    category: Category | null;
  }) => Promise<void>;
  onUpdate: (id: string, updates: Partial<ScheduledActivity>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodayFocus({ dayNumber, date, activities, onAdd, onUpdate, onDelete }: TodayFocusProps) {
  const [showModal, setShowModal] = useState(false);

  const d = new Date(date + 'T00:00:00');
  const weekday  = d.toLocaleDateString('en-AU', { weekday: 'long' });
  const dateLabel = d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long' });

  const completedCount = activities.filter(a => a.completed).length;

  return (
    <>
      <div className="mb-8 rounded-2xl overflow-hidden border-2 border-[#7D9B76] shadow-[0_4px_28px_rgba(125,155,118,0.18)]">
        {/* Header */}
        <div className="bg-[#7D9B76] px-6 py-5 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <Sun size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2.5 py-0.5 bg-white/25 text-white text-xs font-bold rounded-full tracking-wide">
                  Today
                </span>
                <span className="text-[#C4E8C4] text-sm font-medium">Day {dayNumber}</span>
              </div>
              <p className="text-white font-bold text-xl">{weekday}, {dateLabel}</p>
              {activities.length > 0 && (
                <p className="text-[#C4E8C4] text-sm mt-0.5">
                  {completedCount} of {activities.length} {activities.length === 1 ? 'activity' : 'activities'} done
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
          >
            <Plus size={15} />
            Add activity
          </button>
        </div>

        {/* Body */}
        <div className="bg-white p-6">
          {activities.length === 0 ? (
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-8 rounded-xl border-2 border-dashed border-[#C8DCC4] text-[#7D9B76] text-sm font-medium hover:border-[#7D9B76] hover:bg-[#F2F7F1] transition-all duration-150 flex flex-col items-center gap-2"
            >
              <Plus size={20} />
              Add something for today
              <span className="text-xs text-[#ABA8A3] font-normal">What would be good to do today?</span>
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide">
                Fill in your before scores, do the activity, then come back to rate how it actually felt
              </p>
              {activities.map(activity => (
                <ActivitySlot
                  key={activity.id}
                  activity={activity}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  initialExpanded
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddActivityModal
          targetDay={dayNumber}
          onAdd={onAdd}
          onClose={() => setShowModal(false)}
          maxDay={10}
        />
      )}
    </>
  );
}
