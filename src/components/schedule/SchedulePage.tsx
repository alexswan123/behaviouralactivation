import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Download, Settings, CalendarDays, RotateCcw, X, Timer, Sparkles } from 'lucide-react';
import { spell } from '../../lib/spelling';
import { useSchedule } from '../../hooks/useSchedule';
import { useFavourites } from '../../hooks/useFavourites';
import DayCard from './DayCard';
import TodayFocus from './TodayFocus';
import ExportModal from './ExportModal';
import { addDays, format } from '../../lib/dateUtils';
import { track } from '../../lib/analytics';
import { activities as catalogueActivities } from '../../data/activities';
import type { Category } from '../../lib/types';

const DURATION_OPTIONS = [10, 14, 21, 30];

type DialogMode = 'changeDate' | 'reset' | 'changeDuration' | 'quickFill' | null;

export default function SchedulePage() {
  const navigate = useNavigate();
  const { schedule, activities, loading, error, addActivity, updateActivity, deleteActivity, changeStartDate, changeDuration, resetSchedule, resetActivitiesOnly } = useSchedule();
  const { isFavourite } = useFavourites();
  const [showExport, setShowExport] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogMode>(null);
  const [newDateValue, setNewDateValue] = useState('');
  const [newDuration, setNewDuration] = useState(10);
  const [quickFillCount, setQuickFillCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#7D9B76] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#9E9B97] text-sm">Loading your schedule…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FDE8E8] border border-[#F5B8BE] rounded-2xl p-6 text-center">
        <p className="text-[#9B3A45] font-medium">Something went wrong</p>
        <p className="text-sm text-[#9B3A45]/70 mt-1">{error}</p>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-center py-24">
        <p className="text-[#9E9B97] mb-6">You haven't started a {spell.programme.toLowerCase()} yet.</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mx-auto bg-[#7D9B76] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5C7A55] transition-colors"
        >
          Start my {spell.programme.toLowerCase()}
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const completedCount = activities.filter(a => a.completed).length;
  const totalPlanned = activities.length;

  const duration = schedule.duration ?? 10;

  const days = Array.from({ length: duration }, (_, i) => {
    const dayNumber = i + 1;
    const date = format(addDays(new Date(schedule.start_date + 'T00:00:00'), i));
    const dayActivities = activities.filter(a => a.day_number === dayNumber);
    return { dayNumber, date, dayActivities };
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDay = days.find(d => d.date === todayStr) ?? null;

  const handleChangeDate = () => {
    setNewDateValue(schedule.start_date);
    setDialog('changeDate');
    setMenuOpen(false);
  };

  const handleConfirmChangeDate = () => {
    if (!newDateValue) return;
    changeStartDate(newDateValue);
    setDialog(null);
  };

  const handleResetMenu = () => {
    setDialog('reset');
    setMenuOpen(false);
  };

  const handleChangeDuration = () => {
    setNewDuration(schedule.duration ?? 10);
    setDialog('changeDuration');
    setMenuOpen(false);
  };

  const handleConfirmChangeDuration = () => {
    track.programmeLengthChanged({ from: schedule?.duration ?? 10, to: newDuration });
    changeDuration(newDuration);
    setDialog(null);
  };

  const handleQuickFillMenu = () => {
    if (!schedule) return;
    const duration = schedule.duration ?? 10;
    const daysWithActivities = new Set(activities.map(a => a.day_number));
    const emptyDays = Array.from({ length: duration }, (_, i) => i + 1).filter(d => !daysWithActivities.has(d));
    setQuickFillCount(emptyDays.length);
    setDialog('quickFill');
    setMenuOpen(false);
  };

  const handleConfirmQuickFill = async () => {
    if (!schedule) return;
    const duration = schedule.duration ?? 10;
    const daysWithActivities = new Set(activities.map(a => a.day_number));
    const emptyDays = Array.from({ length: duration }, (_, i) => i + 1).filter(d => !daysWithActivities.has(d));

    const categoryOrder: Category[] = ['achievement', 'social', 'body', 'pleasure'];
    const timeByCategory: Record<Category, string> = {
      achievement: '09:00',
      body: '09:00',
      social: '15:00',
      pleasure: '19:00',
    };

    const favouriteCats = catalogueActivities.filter(a => isFavourite(a.id));

    for (let i = 0; i < emptyDays.length; i++) {
      const dayNumber = emptyDays[i];
      const cat = categoryOrder[i % categoryOrder.length];

      // Try favourite first
      let pick = favouriteCats.find(a => a.category === cat);
      // Fall back to any from catalogue
      if (!pick) {
        const pool = catalogueActivities.filter(a => a.category === cat);
        pick = pool[Math.floor(Math.random() * pool.length)];
      }
      if (!pick) continue;

      await addActivity({
        dayNumber,
        activity_name: pick.name,
        scheduled_time: timeByCategory[cat],
        catalogue_id: pick.id,
        category: pick.category,
      });
    }
    setDialog(null);
  };

  return (
    <div>
      {/* Summary bar */}
      <div className="bg-[#3D5A4C] rounded-2xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My {duration}-day {spell.programme.toLowerCase()}</h1>
          <p className="text-[#A8C8B0] text-sm mt-1">
            Starting {new Date(schedule.start_date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {totalPlanned > 0 && (
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2.5">
                <CheckCircle2 size={16} className="text-[#A8C8B0]" />
                <span className="text-sm font-semibold text-white">
                  {completedCount} of {totalPlanned} done
                </span>
              </div>
            )}
            {completedCount >= 3 && (
              <button
                onClick={() => navigate('/progress')}
                className="flex items-center gap-1.5 text-sm font-semibold bg-[#7D9B76] text-white px-4 py-2.5 rounded-xl hover:bg-[#5C7A55] transition-colors"
              >
                View progress
                <ArrowRight size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {totalPlanned > 0 && (
              <button
                onClick={() => { setShowExport(true); track.exportOpened(); }}
                className="flex items-center gap-1.5 text-sm font-semibold bg-white/15 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl hover:bg-white/25 transition-colors"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Save / email</span>
              </button>
            )}
            {/* Settings menu */}
            <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-2.5 rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors"
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E8E3DB] overflow-hidden z-30">
                <button
                  onClick={handleChangeDate}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#3D5A4C] hover:bg-[#F0F7EE] transition-colors text-left"
                >
                  <CalendarDays size={15} className="text-[#7D9B76]" />
                  Change start date
                </button>
                <div className="h-px bg-[#EDE8E0]" />
                <button
                  onClick={handleChangeDuration}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#3D5A4C] hover:bg-[#F0F7EE] transition-colors text-left"
                >
                  <Timer size={15} className="text-[#7D9B76]" />
                  Change program length
                </button>
                <div className="h-px bg-[#EDE8E0]" />
                <button
                  onClick={handleQuickFillMenu}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#3D5A4C] hover:bg-[#F0F7EE] transition-colors text-left"
                >
                  <Sparkles size={15} className="text-[#7D9B76]" />
                  Quick fill empty days
                </button>
                <div className="h-px bg-[#EDE8E0]" />
                <button
                  onClick={handleResetMenu}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#9B3A45] hover:bg-[#FDE8E8] transition-colors text-left"
                >
                  <RotateCcw size={15} />
                  Reset program
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Today focus */}
      {todayDay && (
        <TodayFocus
          dayNumber={todayDay.dayNumber}
          date={todayDay.date}
          activities={todayDay.dayActivities}
          onAdd={addActivity}
          onUpdate={updateActivity}
          onDelete={deleteActivity}
          maxDay={duration}
        />
      )}

      {/* Day grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {days.map(({ dayNumber, date, dayActivities }) => (
          <DayCard
            key={dayNumber}
            dayNumber={dayNumber}
            date={date}
            activities={dayActivities}
            onAdd={addActivity}
            onUpdate={updateActivity}
            onDelete={deleteActivity}
            maxDay={duration}
          />
        ))}
      </div>

      {showExport && (
        <ExportModal
          schedule={schedule}
          activities={activities}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Change start date dialog */}
      {dialog === 'changeDate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#DDD8D0]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0]">
              <h2 className="font-semibold text-[#2A3D32]">Change start date</h2>
              <button onClick={() => setDialog(null)} className="p-1.5 rounded-lg hover:bg-[#F0EBE3] text-[#9E9B97]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#8A8680]">
                Your scheduled dates will update automatically. Activities already logged won't be lost.
              </p>
              <input
                type="date"
                value={newDateValue}
                onChange={e => setNewDateValue(e.target.value)}
                className="w-full border-2 border-[#EDE8E0] rounded-xl px-4 py-3 text-[#3D5A4C] focus:outline-none focus:border-[#7D9B76]"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setDialog(null)}
                  className="flex-1 py-3 rounded-xl border border-[#EDE8E0] text-[#5C5A57] text-sm font-medium hover:bg-[#F0EBE3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmChangeDate}
                  disabled={!newDateValue}
                  className="flex-1 py-3 rounded-xl bg-[#3D5A4C] text-white text-sm font-semibold hover:bg-[#2A3D32] disabled:opacity-40 transition-colors"
                >
                  Update dates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change program length dialog */}
      {dialog === 'changeDuration' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#DDD8D0]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0]">
              <h2 className="font-semibold text-[#2A3D32]">Change program length</h2>
              <button onClick={() => setDialog(null)} className="p-1.5 rounded-lg hover:bg-[#F0EBE3] text-[#9E9B97]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#8A8680]">
                Extending adds more days to your schedule. Shortening will hide days beyond the new limit but won't delete any activities.
              </p>
              <div className="grid grid-cols-4 gap-2">
                {DURATION_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setNewDuration(opt)}
                    className={`flex flex-col items-center py-3 rounded-xl border-2 text-xs font-medium transition-colors ${
                      newDuration === opt
                        ? 'border-[#3D5A4C] bg-[#F0F7EE] text-[#3D5A4C]'
                        : 'border-[#EDE8E0] text-[#8A8680] hover:border-[#7D9B76] hover:text-[#3D5A4C]'
                    }`}
                  >
                    <span className="font-bold text-base">{opt}</span>
                    <span>days</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDialog(null)}
                  className="flex-1 py-3 rounded-xl border border-[#EDE8E0] text-[#5C5A57] text-sm font-medium hover:bg-[#F0EBE3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmChangeDuration}
                  className="flex-1 py-3 rounded-xl bg-[#3D5A4C] text-white text-sm font-semibold hover:bg-[#2A3D32] transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick fill dialog */}
      {dialog === 'quickFill' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#DDD8D0]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0]">
              <h2 className="font-semibold text-[#2A3D32]">Quick fill empty days</h2>
              <button onClick={() => setDialog(null)} className="p-1.5 rounded-lg hover:bg-[#F0EBE3] text-[#9E9B97]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {quickFillCount === 0 ? (
                <p className="text-sm text-[#8A8680]">All days already have activities — nothing to fill.</p>
              ) : (
                <>
                  <p className="text-sm text-[#8A8680]">
                    Add suggested activities to your <strong>{quickFillCount} empty {quickFillCount === 1 ? 'day' : 'days'}</strong>?
                    You can remove any you don't want.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDialog(null)}
                      className="flex-1 py-3 rounded-xl border border-[#EDE8E0] text-[#5C5A57] text-sm font-medium hover:bg-[#F0EBE3] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmQuickFill}
                      className="flex-1 py-3 rounded-xl bg-[#3D5A4C] text-white text-sm font-semibold hover:bg-[#2A3D32] transition-colors"
                    >
                      Fill schedule
                    </button>
                  </div>
                </>
              )}
              {quickFillCount === 0 && (
                <button
                  onClick={() => setDialog(null)}
                  className="w-full py-2.5 text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset dialog */}
      {dialog === 'reset' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#DDD8D0]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0]">
              <h2 className="font-semibold text-[#2A3D32]">Reset program</h2>
              <button onClick={() => setDialog(null)} className="p-1.5 rounded-lg hover:bg-[#F0EBE3] text-[#9E9B97]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#8A8680]">
                Choose what to reset. This can't be undone.
              </p>
              <button
                onClick={() => { track.scheduleResetActivities(); resetActivitiesOnly(); setDialog(null); }}
                className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-[#EDE8E0] hover:border-[#C17C5A] hover:bg-[#FFF5EE] transition-colors"
              >
                <p className="text-sm font-semibold text-[#3D5A4C]">Clear all planned activities</p>
                <p className="text-xs text-[#8A8680] mt-0.5">Keeps your start date, wipes the slate clean</p>
              </button>
              <button
                onClick={() => { track.scheduleResetFull(); resetSchedule(); navigate('/'); }}
                className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-[#EDE8E0] hover:border-[#9B3A45] hover:bg-[#FDE8E8] transition-colors"
              >
                <p className="text-sm font-semibold text-[#9B3A45]">Start completely fresh</p>
                <p className="text-xs text-[#8A8680] mt-0.5">Deletes everything and returns to the start</p>
              </button>
              <button
                onClick={() => setDialog(null)}
                className="w-full py-2.5 text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors"
              >
                Never mind
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
