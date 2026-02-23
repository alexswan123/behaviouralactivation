import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, Zap, Users } from 'lucide-react';
import { useSchedule } from '../../hooks/useSchedule';
import HowItWorksSection from './HowItWorksSection';
import { format } from '../../lib/dateUtils';
import { spell } from '../../lib/spelling';
import { track } from '../../lib/analytics';

const DURATION_OPTIONS = [
  { value: 10, label: '10 days', description: 'Standard' },
  { value: 14, label: '14 days', description: '2 weeks' },
  { value: 21, label: '21 days', description: '3 weeks' },
  { value: 30, label: '30 days', description: '1 month' },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const { createSchedule, schedule } = useSchedule();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(format(new Date()));
  const [duration, setDuration] = useState(10);
  const [creating, setCreating] = useState(false);

  const handleStart = async () => {
    if (schedule) {
      track.programmeContinued();
      navigate('/schedule');
      return;
    }
    setCreating(true);
    try {
      await createSchedule(new Date(startDate + 'T00:00:00'), duration);
      track.programmeCreated(duration);
      navigate('/schedule');
    } catch (err) {
      console.error(err);
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#7D9B76] rounded-2xl flex items-center justify-center shadow-lg">
            <Leaf size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-[#3D5A4C] mb-4">Bloom</h1>
        <p className="text-xl text-[#7D9B76] font-medium mb-2">Small steps. Real change.</p>
        <p className="text-[#9E9B97] max-w-md mx-auto">
          A gentle {spell.programme.toLowerCase()} to help you reconnect with activities that bring
          achievement, connection, and enjoyment back into your days.
        </p>

        <div className="mt-10 flex justify-center gap-3">
          {!showDatePicker && !schedule ? (
            <button
              onClick={() => setShowDatePicker(true)}
              className="flex items-center gap-2 bg-[#7D9B76] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#5C7A55] transition-colors shadow-md"
            >
              Start my {spell.programme.toLowerCase()}
              <ArrowRight size={20} />
            </button>
          ) : showDatePicker && !schedule ? (
            <div className="bg-white rounded-2xl shadow-md border border-[#E8E4DE] p-6 w-full max-w-sm mx-4">
              <p className="text-[#3D5A4C] font-semibold mb-3">When does Day 1 start?</p>
              <input
                type="date"
                value={startDate}
                min={format(new Date())}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border border-[#E8E4DE] rounded-lg px-4 py-3 text-[#3D5A4C] focus:outline-none focus:ring-2 focus:ring-[#7D9B76] mb-4"
              />
              <p className="text-[#3D5A4C] font-semibold mb-2">How long is your {spell.programme.toLowerCase()}?</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {DURATION_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`flex flex-col items-center py-2.5 px-1 rounded-lg border-2 text-xs font-medium transition-colors ${
                      duration === opt.value
                        ? 'border-[#7D9B76] bg-[#F0F7EE] text-[#3D5A4C]'
                        : 'border-[#E8E4DE] text-[#9E9B97] hover:border-[#7D9B76] hover:text-[#3D5A4C]'
                    }`}
                  >
                    <span className="font-bold text-sm">{opt.value}</span>
                    <span>{opt.description}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleStart}
                disabled={creating}
                className="w-full flex items-center justify-center gap-2 bg-[#7D9B76] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5C7A55] transition-colors disabled:opacity-60"
              >
                {creating ? 'Creating...' : `Begin ${spell.programme.toLowerCase()}`}
                {!creating && <ArrowRight size={18} />}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/schedule')}
              className="flex items-center gap-2 bg-[#7D9B76] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#5C7A55] transition-colors shadow-md"
            >
              Continue my {spell.programme.toLowerCase()}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* ACE Quick explainer */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-16 px-4">
        {[
          { icon: Zap, label: 'Achievement', colour: 'bg-[#FFF0DC] text-[#7B4A10]', desc: 'Getting things done' },
          { icon: Users, label: 'Connection', colour: 'bg-[#D8EDD8] text-[#2D5A3A]', desc: 'Feeling close to others' },
          { icon: Heart, label: 'Enjoyment', colour: 'bg-[#FDE8E8] text-[#9B3A45]', desc: 'Pleasure and fun' },
        ].map(({ icon: Icon, label, colour, desc }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E8E4DE] p-3 sm:p-5 text-center shadow-sm min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${colour}`}>
              <Icon size={20} />
            </div>
            <p className="font-semibold text-[#3D5A4C] text-sm">{label}</p>
            <p className="text-[#9E9B97] text-xs mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <HowItWorksSection />
    </div>
  );
}
