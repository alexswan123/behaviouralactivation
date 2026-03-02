import { useState, useEffect } from 'react';
import { X, Search, Clock, Sparkles } from 'lucide-react';
import { activities, contextColours, contextLabels } from '../../data/activities';
import { usePastActivities } from '../../hooks/usePastActivities';
import type { CatalogueActivity, Category, Context } from '../../lib/types';
import { track } from '../../lib/analytics';

interface AddActivityModalProps {
  targetDay?: number;
  initialCustomName?: string;
  onAdd: (data: {
    dayNumber: number;
    activity_name: string;
    scheduled_time: string;
    catalogue_id: string | null;
    category: Category | null;
  }) => Promise<void>;
  onClose: () => void;
  maxDay: number;
}

const CONTEXT_FILTERS: { value: 'all' | Context; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'home', label: 'At Home' },
  { value: 'outdoors', label: 'Outside' },
  { value: 'social', label: 'With Others' },
  { value: 'anywhere', label: 'Anywhere' },
];

const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00',
];

export default function AddActivityModal({ targetDay, initialCustomName, onAdd, onClose, maxDay }: AddActivityModalProps) {
  const { items: pastItems } = usePastActivities();
  const [step, setStep] = useState<'browse' | 'details'>(initialCustomName ? 'details' : 'browse');
  const [selected, setSelected] = useState<CatalogueActivity | null>(null);
  const [customName, setCustomName] = useState(initialCustomName ?? '');
  const [search, setSearch] = useState('');
  const [contextFilter, setContextFilter] = useState<'all' | Context>('all');
  const [effortFilter, setEffortFilter] = useState<'all' | 'low' | 'quick'>('all');
  const [dayNumber, setDayNumber] = useState(targetDay ?? 1);
  const [time, setTime] = useState('09:00');
  const [saving, setSaving] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const filtered = activities.filter(a => {
    const matchCtx = contextFilter === 'all' || a.context === contextFilter;
    const matchEffort =
      effortFilter === 'all' ||
      (effortFilter === 'low' && a.effort === 'low') ||
      (effortFilter === 'quick' && a.durationMinutes !== undefined && a.durationMinutes <= 5);
    const matchSearch = search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    return matchCtx && matchEffort && matchSearch;
  }).sort((a, b) => {
    const order = { low: 0, medium: 1, high: 2 };
    return order[a.effort] - order[b.effort];
  });

  // Past activities filtered by search (if any search term)
  const filteredPast = pastItems.filter(p =>
    search === '' || p.text.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (activity: CatalogueActivity) => {
    setSelected(activity);
    setCustomName('');
    setStep('details');
  };

  const handleSelectPast = (text: string) => {
    setSelected(null);
    setCustomName(text);
    setStep('details');
  };

  const handleCustom = () => {
    if (!customName.trim()) return;
    setSelected(null);
    setStep('details');
  };

  const handleSave = async () => {
    const name = selected ? selected.name : customName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const source = selected ? 'catalogue' : initialCustomName ? 'past' : 'custom';
      await onAdd({
        dayNumber,
        activity_name: name,
        scheduled_time: time,
        catalogue_id: selected?.id ?? null,
        category: selected?.category ?? null,
      });
      track.activityAdded({ source, category: selected?.category ?? null });
      onClose();
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FAF6F0] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-[#DDD8D0]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDD8D0] shrink-0 bg-white rounded-t-2xl">
          <h2 className="font-semibold text-[#3D5A4C]">
            {step === 'browse' ? 'Choose an activity' : 'Set the details'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F0EBE3] text-[#9E9B97]">
            <X size={18} />
          </button>
        </div>

        {step === 'browse' ? (
          <>
            {/* Search + filters */}
            <div className="px-5 pt-4 pb-3 shrink-0 bg-white border-b border-[#EDE8E0] space-y-3">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ABA8A3]" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-[#EDE8E0] rounded-xl text-sm bg-[#FAF6F0] focus:outline-none focus:border-[#7D9B76] placeholder:text-[#C4BFB8]"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {CONTEXT_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setContextFilter(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      contextFilter === f.value
                        ? 'bg-[#3D5A4C] text-white shadow-sm'
                        : 'bg-[#EDE8E0] text-[#5C5A57] hover:bg-[#E0D8CE]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {([
                  { value: 'all' as const, label: 'All' },
                  { value: 'low' as const, label: 'Low effort' },
                  { value: 'quick' as const, label: '5 min or less' },
                ]).map(f => (
                  <button
                    key={f.value}
                    onClick={() => setEffortFilter(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      effortFilter === f.value
                        ? 'bg-[#3D5A4C] text-white shadow-sm'
                        : 'bg-[#EDE8E0] text-[#5C5A57] hover:bg-[#E0D8CE]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or type your own activity..."
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCustom()}
                  className="flex-1 px-3 py-2 border-2 border-[#EDE8E0] rounded-xl text-sm bg-[#FAF6F0] focus:outline-none focus:border-[#7D9B76] placeholder:text-[#C4BFB8]"
                />
                <button
                  onClick={handleCustom}
                  disabled={!customName.trim()}
                  className="px-4 py-2 bg-[#3D5A4C] text-white rounded-xl text-sm font-semibold hover:bg-[#2A3D32] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Use
                </button>
              </div>
            </div>

            {/* Activity list */}
            <div className="overflow-y-auto flex-1 min-h-[50vh] px-5 py-4 space-y-4">
              {/* Past activities section */}
              {filteredPast.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={13} className="text-[#C17C5A]" />
                    <span className="text-xs font-semibold text-[#C17C5A] uppercase tracking-wide">Things I enjoy</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredPast.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectPast(item.text)}
                        className="w-full text-left flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#FFF5EE] border-2 border-[#F0D8C4] hover:border-[#C17C5A] hover:bg-[#FFF0DC] transition-all duration-150"
                      >
                        <p className="text-sm font-semibold text-[#7B4A10]">{item.text}</p>
                        <span className="text-xs text-[#C17C5A] font-semibold shrink-0">Add &rarr;</span>
                      </button>
                    ))}
                  </div>
                  {filtered.length > 0 && <div className="h-px bg-[#EDE8E0] mt-4" />}
                </div>
              )}

              {filtered.length === 0 && filteredPast.length === 0 ? (
                <p className="text-[#9E9B97] text-sm text-center py-8">No activities match your search</p>
              ) : (
                <div className="space-y-2">
                  {filtered.map(activity => {
                    const colours = contextColours[activity.context];
                    return (
                      <button
                        key={activity.id}
                        onClick={() => handleSelect(activity)}
                        className="w-full text-left flex items-start gap-3 p-4 rounded-xl bg-white border-2 border-[#EDE8E0] hover:border-[#7D9B76] hover:bg-[#F2F7F1] transition-all duration-150 shadow-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#2A3D32]">{activity.name}</p>
                          <p className="text-xs text-[#8A8680] mt-0.5 leading-relaxed">{activity.description}</p>
                          {activity.effort === 'low' && (
                            <span className="inline-block mt-1 text-[10px] font-semibold text-[#7D9B76] bg-[#F0F7EE] px-1.5 py-0.5 rounded">
                              Low effort
                            </span>
                          )}
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0"
                          style={{ background: colours.bg, color: colours.text, border: `1px solid ${colours.border}` }}
                        >
                          {contextLabels[activity.context]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {/* Selected activity */}
            <div className="bg-[#F0F7EE] rounded-xl p-4 border border-[#C8DCC4]">
              <p className="text-sm text-[#5C7A55] mb-0.5">Selected activity</p>
              <p className="font-semibold text-[#3D5A4C]">
                {selected ? selected.name : customName}
              </p>
              {selected && (
                <p className="text-xs text-[#7D9B76] mt-1">{selected.description}</p>
              )}
            </div>

            {/* Day picker */}
            {!targetDay && (
              <div>
                <label className="text-sm font-medium text-[#3D5A4C] mb-2 block">Day</label>
                <select
                  value={dayNumber}
                  onChange={e => setDayNumber(Number(e.target.value))}
                  className="w-full border border-[#E8E4DE] rounded-xl px-4 py-3 text-[#3D5A4C] focus:outline-none focus:ring-2 focus:ring-[#7D9B76]"
                >
                  {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>Day {d}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Time picker */}
            <div>
              <label className="text-sm font-medium text-[#3D5A4C] mb-2 flex items-center gap-1.5">
                <Clock size={14} />
                Time
              </label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full border border-[#E8E4DE] rounded-xl px-4 py-3 text-[#3D5A4C] focus:outline-none focus:ring-2 focus:ring-[#7D9B76]"
              >
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setStep('browse'); setSelected(null); if (!initialCustomName) setCustomName(''); }}
                className="flex-1 py-3 rounded-xl border border-[#E8E4DE] text-[#5C5A57] text-sm font-medium hover:bg-[#F0EBE3] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-[#7D9B76] text-white text-sm font-semibold hover:bg-[#5C7A55] disabled:opacity-60 transition-colors"
              >
                {saving ? 'Saving...' : 'Add to schedule'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
