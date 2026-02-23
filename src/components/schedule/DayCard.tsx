import { useState } from 'react';
import { Plus } from 'lucide-react';
import ActivitySlot from './ActivitySlot';
import AddActivityModal from './AddActivityModal';
import { formatDayHeader, isToday, isInPast } from '../../lib/dateUtils';
import type { ScheduledActivity, Category } from '../../lib/types';

interface DayCardProps {
  dayNumber: number;
  date: string;
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
  maxDay: number;
}

export default function DayCard({ dayNumber, date, activities, onAdd, onUpdate, onDelete, maxDay }: DayCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { weekday, date: dateLabel } = formatDayHeader(date);
  const today = isToday(date);
  const past = isInPast(date);

  return (
    <>
      <div className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
        today
          ? 'border-[#7D9B76] shadow-[0_4px_24px_rgba(125,155,118,0.2)]'
          : 'border-[#E8E3DB] shadow-[0_2px_12px_rgba(61,90,76,0.06)] hover:border-[#C8D8C4] hover:shadow-[0_4px_16px_rgba(61,90,76,0.10)]'
      }`}>
        {/* Day header */}
        <div className={`flex items-center justify-between px-5 py-4 ${
          today
            ? 'bg-[#7D9B76]'
            : past
              ? 'bg-[#F0EBE3]'
              : 'bg-white'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`text-lg font-bold tabular-nums ${today ? 'text-white' : 'text-[#2A3D32]'}`}>
              Day {dayNumber}
            </span>
            <span className={`text-sm ${today ? 'text-[#D4EAD0]' : 'text-[#8A8680]'}`}>
              {weekday} {dateLabel}
            </span>
            {today && (
              <span className="px-2 py-0.5 bg-white/25 text-white text-xs font-bold rounded-full">
                Today
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              today
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-[#F2F7F1] border border-[#C8DCC4] text-[#3D5A4C] hover:bg-[#7D9B76] hover:text-white hover:border-[#7D9B76]'
            }`}
          >
            <Plus size={13} />
            Add
          </button>
        </div>

        {/* Activities */}
        <div className="p-4 space-y-3 bg-white">
          {activities.length === 0 ? (
            past ? (
              <p className="text-sm text-[#C4BFB8] italic py-3 text-center">
                You can still add a reflection for this day
              </p>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-6 rounded-xl border-2 border-dashed border-[#DDD8D0] text-[#C4BFB8] text-sm font-medium hover:border-[#7D9B76] hover:text-[#7D9B76] hover:bg-[#F2F7F1] transition-all duration-150"
              >
                + Add an activity for this day
              </button>
            )
          ) : (
            activities.map(activity => (
              <ActivitySlot
                key={activity.id}
                activity={activity}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <AddActivityModal
          targetDay={dayNumber}
          onAdd={onAdd}
          onClose={() => setShowModal(false)}
          maxDay={maxDay}
        />
      )}
    </>
  );
}
