import { useState, useCallback, useRef } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import ACEScoreInput from './ACEScoreInput';
import DepressionSlider from './DepressionSlider';
import { categoryColours, categoryLabels } from '../../data/activities';
import type { ScheduledActivity } from '../../lib/types';
import { track } from '../../lib/analytics';

const encouragingMessages = ['Nice work!', 'Well done!', 'Keep going!', 'You did it!'];

interface ActivitySlotProps {
  activity: ScheduledActivity;
  onUpdate: (id: string, updates: Partial<ScheduledActivity>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  initialExpanded?: boolean;
}

export default function ActivitySlot({ activity, onUpdate, onDelete, initialExpanded = false }: ActivitySlotProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [saving, setSaving] = useState(false);
  const [showPostScores, setShowPostScores] = useState(activity.completed);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);

  const colours = activity.category ? categoryColours[activity.category] : null;

  const preScores = {
    achievement: activity.pre_achievement,
    connection: activity.pre_connection,
    enjoyment: activity.pre_enjoyment,
  };

  const postScores = {
    achievement: activity.post_achievement,
    connection: activity.post_connection,
    enjoyment: activity.post_enjoyment,
  };

  const handlePreChange = useCallback(async (
    key: 'achievement' | 'connection' | 'enjoyment',
    value: number | null
  ) => {
    setSaving(true);
    try {
      await onUpdate(activity.id, { [`pre_${key}`]: value });
    } finally {
      setSaving(false);
    }
  }, [activity.id, onUpdate]);

  const handlePostChange = useCallback(async (
    key: 'achievement' | 'connection' | 'enjoyment',
    value: number | null
  ) => {
    setSaving(true);
    try {
      await onUpdate(activity.id, { [`post_${key}`]: value });
    } finally {
      setSaving(false);
    }
  }, [activity.id, onUpdate]);

  const handleMarkDone = async () => {
    setSaving(true);
    try {
      await onUpdate(activity.id, { completed: true });
      track.activityCompleted({ category: activity.category ?? null });

      // Fire confetti from button position
      if (doneButtonRef.current) {
        const rect = doneButtonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({ origin: { x, y }, particleCount: 60, spread: 55, colors: ['#7D9B76', '#A8C8B0', '#C8DCC4', '#F4D06F'] });
      }

      // Show encouraging message, then reveal post-scores
      const msg = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      setCelebrationMessage(msg);
      setTimeout(() => {
        setCelebrationMessage(null);
        setShowPostScores(true);
      }, 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleNotesChange = useCallback(async (notes: string) => {
    await onUpdate(activity.id, { notes });
  }, [activity.id, onUpdate]);

  const hasPreScores =
    activity.pre_achievement !== null ||
    activity.pre_connection !== null ||
    activity.pre_enjoyment !== null;

  return (
    <div className={`rounded-xl border-2 transition-all ${
      activity.completed
        ? 'border-[#C8DCC4] bg-[#F4FAF4]'
        : 'border-[#EDE8E0] bg-[#FDFAF7]'
    }`}>
      {/* Activity header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-[#2A3D32] text-sm">{activity.activity_name}</p>
            {activity.completed && (
              <CheckCircle2 size={14} className="text-[#7D9B76] shrink-0" />
            )}
            {saving && <span className="text-xs text-[#ABA8A3]">saving…</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-[#ABA8A3]">
              <Clock size={11} />
              {activity.scheduled_time}
            </span>
            {colours && (
              <span
                className="px-2 py-0.5 rounded-md text-xs font-semibold"
                style={{ background: colours.bg, color: colours.text, border: `1px solid ${colours.border}` }}
              >
                {categoryLabels[activity.category!]}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg hover:bg-[#EDE8E0] text-[#ABA8A3] hover:text-[#3D5A4C] shrink-0 transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-5 border-t border-[#EDE8E0] pt-4">
          {/* Pre scores */}
          <div>
            <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide mb-3">
              Expected scores (before)
            </p>
            <DepressionSlider
              timing="before"
              value={activity.pre_depression ?? null}
              onChange={v => onUpdate(activity.id, { pre_depression: v })}
              disabled={activity.completed}
            />
            <div className="mt-3">
              <ACEScoreInput
                values={preScores}
                onChange={handlePreChange}
                disabled={activity.completed}
              />
            </div>
          </div>

          {/* Mark done / post scores */}
          {!activity.completed && !showPostScores && !celebrationMessage ? (
            <button
              ref={doneButtonRef}
              onClick={handleMarkDone}
              disabled={!hasPreScores || saving}
              className="w-full py-3 rounded-xl bg-[#7D9B76] text-white font-semibold text-sm hover:bg-[#5C7A55] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {!hasPreScores ? 'Add expected scores first' : 'Mark as done'}
            </button>
          ) : celebrationMessage ? (
            <p
              className="text-center text-lg font-bold text-[#7D9B76] py-3"
              style={{ animation: 'celebrate-in 0.3s ease-out' }}
            >
              {celebrationMessage}
            </p>
          ) : (
            <div>
              <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide mb-3">
                Actual scores (after)
              </p>
              <DepressionSlider
                timing="after"
                value={activity.post_depression ?? null}
                onChange={v => onUpdate(activity.id, { post_depression: v })}
              />
              <div className="mt-3">
              <ACEScoreInput
                values={postScores}
                onChange={handlePostChange}
              />
              </div>
              {/* Notes */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide mb-2">
                  Notes (optional)
                </p>
                <textarea
                  defaultValue={activity.notes ?? ''}
                  onBlur={e => handleNotesChange(e.target.value)}
                  placeholder="How did it go? Any observations..."
                  rows={2}
                  className="w-full border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-sm text-[#3D5A4C] placeholder:text-[#C8C4BE] focus:outline-none focus:ring-2 focus:ring-[#7D9B76] resize-none"
                />
              </div>
            </div>
          )}

          {/* Delete */}
          <button
            onClick={() => { track.activityDeleted(); onDelete(activity.id); }}
            className="flex items-center gap-1.5 text-xs text-[#C17C5A] hover:text-[#9B5A3A] transition-colors"
          >
            <Trash2 size={13} />
            Remove activity
          </button>
        </div>
      )}
    </div>
  );
}
