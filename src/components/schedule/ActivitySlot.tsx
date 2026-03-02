import { useState, useCallback, useRef } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Trash2, Zap, Users, Heart } from 'lucide-react';
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

function ResultsSummary({ activity }: { activity: ScheduledActivity }) {
  const pre = {
    achievement: activity.pre_achievement,
    connection: activity.pre_connection,
    enjoyment: activity.pre_enjoyment,
  };
  const post = {
    achievement: activity.post_achievement,
    connection: activity.post_connection,
    enjoyment: activity.post_enjoyment,
  };

  // ACE: count how many improved, same, declined
  const dims = (['achievement', 'connection', 'enjoyment'] as const).map(key => {
    const preVal = pre[key];
    const postVal = post[key];
    if (preVal === null || postVal === null) return 0;
    return postVal - preVal;
  });
  const aceUp = dims.filter(d => d > 0).length;
  const aceDown = dims.filter(d => d < 0).length;
  const aceNetUp = aceUp > aceDown;
  const aceNetDown = aceDown > aceUp;

  // Depression: negative delta = improved (lower score = better mood)
  const depPre = activity.pre_depression;
  const depPost = activity.post_depression;
  const depDelta = (depPre !== null && depPost !== null) ? depPost - depPre : null;
  const hasDep = depDelta !== null;
  const depImproved = hasDep && depDelta < 0;
  const depWorsened = hasDep && depDelta > 0;

  let sentence: string;
  let overall: 'positive' | 'tough' | 'neutral';

  if (!hasDep) {
    // ACE-only messages
    if (aceNetUp) {
      sentence = 'You got more out of this than you expected.';
      overall = 'positive';
    } else if (aceNetDown) {
      sentence = "This was harder than expected. That happens — showing up still counts.";
      overall = 'tough';
    } else {
      sentence = 'About what you expected.';
      overall = 'neutral';
    }
  } else if (aceNetUp && depImproved) {
    sentence = 'You rated this higher than you expected, and your mood improved too.';
    overall = 'positive';
  } else if (aceNetUp && depWorsened) {
    sentence = "You got more out of this than you expected. Even though your mood didn\u2019t shift, that\u2019s common \u2014 depression can make it hard to see the progress you\u2019re making.";
    overall = 'neutral';
  } else if (aceNetDown && depImproved) {
    sentence = "This was harder than expected, but your mood still improved. That\u2019s worth noticing.";
    overall = 'positive';
  } else if (aceNetDown && depWorsened) {
    sentence = "This was a tough one. That happens, and it doesn\u2019t undo the effort. Showing up still counts.";
    overall = 'tough';
  } else if (aceNetUp) {
    // ACE up, depression unchanged
    sentence = 'You got more out of this than you expected.';
    overall = 'positive';
  } else if (aceNetDown) {
    // ACE down, depression unchanged
    sentence = "This was harder than expected. That\u2019s okay — not every activity will land the same way.";
    overall = 'tough';
  } else if (depImproved) {
    // ACE neutral, depression improved
    sentence = 'About what you expected, and your mood improved. Small wins add up.';
    overall = 'positive';
  } else if (depWorsened) {
    // ACE neutral, depression worsened
    sentence = "Your mood dipped, but you still showed up. That takes effort, and it counts.";
    overall = 'tough';
  } else {
    sentence = 'About what you expected.';
    overall = 'neutral';
  }

  return (
    <p className={`text-sm ${
      overall === 'positive' ? 'text-[#3D5A4C]' :
      overall === 'tough' ? 'text-[#8A8680]' :
      'text-[#5C5A57]'
    }`}>
      {sentence}
    </p>
  );
}

function ScoresSummary({ activity, timing }: { activity: ScheduledActivity; timing: 'before' | 'after' }) {
  const prefix = timing === 'before' ? 'pre' : 'post';
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {ACE_DIMENSIONS.map(({ key, icon: Icon, colour, bg }) => {
        const val = activity[`${prefix}_${key}` as keyof ScheduledActivity] as number | null;
        return (
          <div key={key} className="flex items-center gap-1">
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: bg }}>
              <Icon size={11} style={{ color: colour }} />
            </div>
            <span className="text-xs font-semibold text-[#3D5A4C]">{val ?? '–'}</span>
          </div>
        );
      })}
      {(activity[`${prefix}_depression` as keyof ScheduledActivity] as number | null) !== null && (
        <span className="text-xs font-medium text-[#6A5A9C]">
          Depression: {activity[`${prefix}_depression` as keyof ScheduledActivity] as number}
        </span>
      )}
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
  const [viewMode, setViewMode] = useState<'summary' | 'scores' | 'editBefore' | 'editAfter'>('summary');
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

          {/* STATE 3: Fully complete */}
          {fullyComplete ? (
            <div className="space-y-3">
              {viewMode === 'summary' && (
                <>
                  <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide">
                    Results
                  </p>
                  <div className="rounded-lg bg-white border border-[#E8E4DE] p-3">
                    <ResultsSummary activity={activity} />
                  </div>
                  {activity.notes && (
                    <div>
                      <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm text-[#3D5A4C]">{activity.notes}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setViewMode('scores')}
                    className="text-xs text-[#ABA8A3] hover:text-[#3D5A4C] transition-colors"
                  >
                    View scores
                  </button>
                </>
              )}

              {viewMode === 'scores' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide">Before</p>
                      <button
                        onClick={() => { setViewMode('editBefore'); }}
                        className="text-xs text-[#ABA8A3] hover:text-[#3D5A4C] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="rounded-lg bg-white border border-[#E8E4DE] p-2.5">
                      <ScoresSummary activity={activity} timing="before" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide">After</p>
                      <button
                        onClick={() => { setViewMode('editAfter'); }}
                        className="text-xs text-[#ABA8A3] hover:text-[#3D5A4C] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="rounded-lg bg-white border border-[#E8E4DE] p-2.5">
                      <ScoresSummary activity={activity} timing="after" />
                    </div>
                  </div>
                  {activity.notes && (
                    <div>
                      <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm text-[#3D5A4C]">{activity.notes}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setViewMode('summary')}
                    className="text-xs text-[#ABA8A3] hover:text-[#3D5A4C] transition-colors"
                  >
                    Back to summary
                  </button>
                </>
              )}

              {viewMode === 'editBefore' && (
                <>
                  <div>
                    <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide mb-3">
                      Edit before scores
                    </p>
                    <DepressionSlider
                      timing="before"
                      value={activity.pre_depression ?? null}
                      onChange={v => onUpdate(activity.id, { pre_depression: v })}
                    />
                    <div className="mt-3">
                      <ACEScoreInput values={preScores} onChange={handlePreChange} />
                    </div>
                  </div>
                  <button
                    onClick={() => setViewMode('scores')}
                    className="text-xs text-[#ABA8A3] hover:text-[#3D5A4C] transition-colors"
                  >
                    Done editing
                  </button>
                </>
              )}

              {viewMode === 'editAfter' && (
                <>
                  <div>
                    <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide mb-3">
                      Edit after scores
                    </p>
                    <DepressionSlider
                      timing="after"
                      value={activity.post_depression ?? null}
                      onChange={v => onUpdate(activity.id, { post_depression: v })}
                    />
                    <div className="mt-3">
                      <ACEScoreInput values={postScores} onChange={handlePostChange} />
                    </div>
                  </div>
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
                  <button
                    onClick={() => setViewMode('scores')}
                    className="text-xs text-[#ABA8A3] hover:text-[#3D5A4C] transition-colors"
                  >
                    Done editing
                  </button>
                </>
              )}
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
                  <div className="rounded-lg bg-white border border-[#E8E4DE] p-2.5">
                    <ScoresSummary activity={activity} timing="before" />
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
