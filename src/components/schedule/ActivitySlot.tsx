import { useState, useCallback, useRef } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Trash2, Zap, Users, Heart, ArrowUp, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import ACEScoreInput from './ACEScoreInput';
import DepressionSlider from './DepressionSlider';
import { categoryColours, categoryLabels, contextColours, contextLabels } from '../../data/activities';
import { activities as catalogueActivities } from '../../data/activities';
import type { ScheduledActivity } from '../../lib/types';
import { track } from '../../lib/analytics';

const encouragingMessages = [
  'Done.',
  'Nice one.',
  'One more in the books.',
  'Tick.',
  'That counts.',
  'Good stuff.',
];

interface ActivitySlotProps {
  activity: ScheduledActivity;
  onUpdate: (id: string, updates: Partial<ScheduledActivity>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  initialExpanded?: boolean;
}

const ACE_DIMENSIONS = [
  { key: 'achievement' as const, label: 'A', icon: Zap, colour: '#7B4A10', bg: '#FFF0DC' },
  { key: 'connection' as const, label: 'C', icon: Users, colour: '#2D5A3A', bg: '#D8EDD8' },
  { key: 'enjoyment' as const, label: 'E', icon: Heart, colour: '#9B3A45', bg: '#FDE8E8' },
];

function fireConfetti(buttonRef: React.RefObject<HTMLButtonElement | null>) {
  let originX = 0.5;
  let originY = 0.5;
  if (buttonRef.current) {
    const rect = buttonRef.current.getBoundingClientRect();
    originX = (rect.left + rect.width / 2) / window.innerWidth;
    originY = (rect.top + rect.height / 2) / window.innerHeight;
  }
  confetti({ origin: { x: originX, y: originY }, particleCount: 60, spread: 55, colors: ['#7D9B76', '#A8C8B0', '#C8DCC4', '#F4D06F'] });
  return { originX, originY };
}

function showCelebration(
  setCelebrationMessage: (msg: string | null) => void,
  onAfter: () => void,
) {
  const msg = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
  setCelebrationMessage(msg);
  setTimeout(() => {
    setCelebrationMessage(null);
    onAfter();
  }, 2000);
}

function MiniBar({ value, max = 10, colour }: { value: number; max?: number; colour: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-8 h-1.5 rounded-full bg-[#EDE8E0] overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: colour }} />
    </div>
  );
}

function ACECompactSummary({ pre, post }: {
  pre: { achievement: number | null; connection: number | null; enjoyment: number | null };
  post?: { achievement: number | null; connection: number | null; enjoyment: number | null };
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {ACE_DIMENSIONS.map(({ key, label, icon: Icon, colour, bg }) => {
        const preVal = pre[key];
        const postVal = post?.[key];
        const delta = (preVal !== null && postVal !== null && postVal !== undefined) ? postVal - preVal : null;
        const improved = delta !== null && delta > 0;
        const declined = delta !== null && delta < 0;
        return (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: bg }}>
              <Icon size={11} style={{ color: colour }} />
            </div>
            <span className="text-xs font-semibold text-[#3D5A4C]">
              {label}:{' '}
              {preVal ?? '–'}
              {post !== undefined && postVal !== null && (
                <>
                  {improved && <ArrowUp size={10} className="inline mx-0.5 text-[#5C7A55]" />}
                  {declined && <ArrowDown size={10} className="inline mx-0.5 text-[#C17C5A]" />}
                  {!improved && !declined && <span className="inline mx-0.5 text-[#ABA8A3]">&rarr;</span>}
                  <span style={{ color: improved ? '#5C7A55' : declined ? '#C17C5A' : undefined }}>
                    {postVal}
                  </span>
                  {delta !== null && delta !== 0 && (
                    <span className="text-[10px] ml-0.5" style={{ color: improved ? '#5C7A55' : '#C17C5A' }}>
                      ({delta > 0 ? '+' : ''}{delta})
                    </span>
                  )}
                </>
              )}
            </span>
            {post !== undefined && postVal !== null && postVal !== undefined && (
              <MiniBar value={postVal} colour={colour} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function DepressionCompactSummary({ pre, post }: { pre: number | null; post?: number | null }) {
  const delta = (pre !== null && post !== null && post !== undefined) ? post - pre : null;
  const improved = delta !== null && delta < 0; // lower depression = better
  const worsened = delta !== null && delta > 0;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-[#6A5A9C]">
        Depression:{' '}
        <span className="font-semibold">{pre ?? '–'}</span>
        {post !== undefined && post !== null && (
          <>
            {improved && <ArrowDown size={10} className="inline mx-0.5 text-[#5C7A55]" />}
            {worsened && <ArrowUp size={10} className="inline mx-0.5 text-[#C17C5A]" />}
            {!improved && !worsened && <span className="inline mx-0.5 text-[#ABA8A3]">&rarr;</span>}
            <span className="font-semibold" style={{ color: improved ? '#5C7A55' : worsened ? '#C17C5A' : undefined }}>
              {post}
            </span>
            {delta !== null && delta !== 0 && (
              <span className="text-[10px] ml-0.5" style={{ color: improved ? '#5C7A55' : '#C17C5A' }}>
                ({delta > 0 ? '+' : ''}{delta})
              </span>
            )}
          </>
        )}
      </span>
    </div>
  );
}

export default function ActivitySlot({ activity, onUpdate, onDelete, initialExpanded = false }: ActivitySlotProps) {
  const hasPostScores =
    activity.post_achievement !== null &&
    activity.post_connection !== null &&
    activity.post_enjoyment !== null;

  const isFullyComplete = activity.completed && hasPostScores;

  const [expanded, setExpanded] = useState(initialExpanded);
  const [saving, setSaving] = useState(false);
  const [showPostScores, setShowPostScores] = useState(activity.completed);
  const [fullyComplete, setFullyComplete] = useState(isFullyComplete);
  const [preSubmitted, setPreSubmitted] = useState(activity.completed);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const completeButtonRef = useRef<HTMLButtonElement>(null);

  // Look up catalogue activity to get context for badge colours
  const catalogueEntry = activity.catalogue_id
    ? catalogueActivities.find(c => c.id === activity.catalogue_id)
    : null;
  const colours = catalogueEntry
    ? contextColours[catalogueEntry.context]
    : activity.category
      ? categoryColours[activity.category]
      : null;
  const badgeLabel = catalogueEntry
    ? contextLabels[catalogueEntry.context]
    : activity.category
      ? categoryLabels[activity.category!]
      : null;

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
    fireConfetti(doneButtonRef);

    setSaving(true);
    try {
      await onUpdate(activity.id, { completed: true });
      track.activityCompleted({ category: activity.category ?? null });

      showCelebration(setCelebrationMessage, () => {
        setShowPostScores(true);
      });
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    fireConfetti(completeButtonRef);

    showCelebration(setCelebrationMessage, () => {
      setFullyComplete(true);
    });
  };

  const handleNotesChange = useCallback(async (notes: string) => {
    await onUpdate(activity.id, { notes });
  }, [activity.id, onUpdate]);

  const hasPreScores =
    activity.pre_achievement !== null &&
    activity.pre_connection !== null &&
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
            {colours && badgeLabel && (
              <span
                className="px-2 py-0.5 rounded-md text-xs font-semibold"
                style={{ background: colours.bg, color: colours.text, border: `1px solid ${colours.border}` }}
              >
                {badgeLabel}
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

          {/* STATE 3: Fully complete — compact summary */}
          {fullyComplete ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide">
                Results
              </p>
              <div className="rounded-lg bg-white border border-[#E8E4DE] p-3 space-y-2">
                <DepressionCompactSummary
                  pre={activity.pre_depression ?? null}
                  post={activity.post_depression ?? null}
                />
                <ACECompactSummary pre={preScores} post={postScores} />
              </div>
              {activity.notes && (
                <div>
                  <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-[#3D5A4C]">{activity.notes}</p>
                </div>
              )}
              <button
                onClick={() => setFullyComplete(false)}
                className="text-xs text-[#ABA8A3] hover:text-[#3D5A4C] transition-colors"
              >
                Edit scores & notes
              </button>
            </div>
          ) : (
            <>
              {/* Before scores: editing or compact summary */}
              {!preSubmitted ? (
                /* Editing before scores */
                <div>
                  <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide mb-3">
                    Expected scores (before)
                  </p>
                  <DepressionSlider
                    timing="before"
                    value={activity.pre_depression ?? null}
                    onChange={v => onUpdate(activity.id, { pre_depression: v })}
                  />
                  <div className="mt-3">
                    <ACEScoreInput
                      values={preScores}
                      onChange={handlePreChange}
                    />
                  </div>
                </div>
              ) : (
                /* Compact before summary */
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide">
                      Before scores
                    </p>
                    <button
                      onClick={() => setPreSubmitted(false)}
                      className="text-xs text-[#ABA8A3] hover:text-[#3D5A4C] transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="rounded-lg bg-white border border-[#E8E4DE] p-2.5 space-y-1.5">
                    <DepressionCompactSummary pre={activity.pre_depression ?? null} />
                    <ACECompactSummary pre={preScores} />
                  </div>
                </div>
              )}

              {/* After score inputs — only after marking done */}
              {showPostScores && (
                <div className="space-y-4">
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
                  </div>

                  {/* Notes */}
                  <div>
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

              {/* Buttons / celebration */}
              {celebrationMessage ? (
                <p
                  className="text-center text-sm font-semibold text-[#7D9B76] py-3"
                  style={{ animation: 'celebrate-in 0.3s ease-out' }}
                >
                  {celebrationMessage}
                </p>
              ) : !preSubmitted ? (
                <button
                  onClick={() => setPreSubmitted(true)}
                  disabled={!hasPreScores}
                  className="w-full py-3 rounded-xl bg-[#3D5A4C] text-white font-semibold text-sm hover:bg-[#2A3D32] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {!hasPreScores ? 'Add expected scores first' : 'Submit scores'}
                </button>
              ) : !activity.completed ? (
                <button
                  ref={doneButtonRef}
                  onClick={handleMarkDone}
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-[#7D9B76] text-white font-semibold text-sm hover:bg-[#5C7A55] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  I did it!
                </button>
              ) : showPostScores && !fullyComplete ? (
                <button
                  ref={completeButtonRef}
                  onClick={handleComplete}
                  disabled={!hasPostScores || saving}
                  className="w-full py-3 rounded-xl bg-[#7D9B76] text-white font-semibold text-sm hover:bg-[#5C7A55] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {!hasPostScores ? 'Rate all three scores first' : 'Complete'}
                </button>
              ) : null}
            </>
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
