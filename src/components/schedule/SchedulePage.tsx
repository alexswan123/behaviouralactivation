import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Download, Settings, CalendarDays, RotateCcw, X } from 'lucide-react';
import { spell } from '../../lib/spelling';
import { useSchedule } from '../../hooks/useSchedule';
import DayCard from './DayCard';
import TodayFocus from './TodayFocus';
import ExportModal from './ExportModal';
import { addDays, format } from '../../lib/dateUtils';

type DialogMode = 'changeDate' | 'reset' | null;

export default function SchedulePage() {
  const navigate = useNavigate();
  const { schedule, activities, loading, error, addActivity, updateActivity, deleteActivity, changeStartDate, resetSchedule, resetActivitiesOnly } = useSchedule();
  const [showExport, setShowExport] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogMode>(null);
  const [newDateValue, setNewDateValue] = useState('');
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
          Start my 10 days
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const completedCount = activities.filter(a => a.completed).length;
  const totalPlanned = activities.length;

  const days = Array.from({ length: 10 }, (_, i) => {
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

  return (
    <div>
      {/* Summary bar */}
      <div className="bg-[#3D5A4C] rounded-2xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My 10-day {spell.programme.toLowerCase()}</h1>
          <p className="text-[#A8C8B0] text-sm mt-1">
            Starting {new Date(schedule.start_date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
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
          {totalPlanned > 0 && (
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 text-sm font-semibold bg-white/15 text-white px-4 py-2.5 rounded-xl hover:bg-white/25 transition-colors"
            >
              <Download size={14} />
              Save / email
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
                  onClick={handleResetMenu}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#9B3A45] hover:bg-[#FDE8E8] transition-colors text-left"
                >
                  <RotateCcw size={15} />
                  Reset programme
                </button>
              </div>
            )}
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

      {/* Reset dialog */}
      {dialog === 'reset' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#DDD8D0]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0]">
              <h2 className="font-semibold text-[#2A3D32]">Reset programme</h2>
              <button onClick={() => setDialog(null)} className="p-1.5 rounded-lg hover:bg-[#F0EBE3] text-[#9E9B97]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#8A8680]">
                Choose what to reset. This can't be undone.
              </p>
              <button
                onClick={() => { resetActivitiesOnly(); setDialog(null); }}
                className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-[#EDE8E0] hover:border-[#C17C5A] hover:bg-[#FFF5EE] transition-colors"
              >
                <p className="text-sm font-semibold text-[#3D5A4C]">Clear all planned activities</p>
                <p className="text-xs text-[#8A8680] mt-0.5">Keeps your start date — wipe the slate clean</p>
              </button>
              <button
                onClick={() => { resetSchedule(); navigate('/'); }}
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
