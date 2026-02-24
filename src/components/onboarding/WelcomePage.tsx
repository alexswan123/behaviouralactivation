import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, Zap, Users, Download, Bell, Share } from 'lucide-react';
import { useSchedule } from '../../hooks/useSchedule';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import * as notifications from '../../lib/notifications';
import HowItWorksSection from './HowItWorksSection';
import { format } from '../../lib/dateUtils';
import { spell } from '../../lib/spelling';
import { track } from '../../lib/analytics';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { createSchedule, schedule } = useSchedule();
  const { isInstalled, canPrompt, isIOS, promptInstall } = useInstallPrompt();
  const [showBeforeYouBegin, setShowBeforeYouBegin] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(format(new Date()));
  const [creating, setCreating] = useState(false);
  const handleStart = async () => {
    if (schedule) {
      track.programmeContinued();
      navigate('/schedule');
      return;
    }
    setCreating(true);
    try {
      await createSchedule(new Date(startDate + 'T00:00:00'), 10);
      track.programmeCreated(10);
      navigate('/schedule');
    } catch (err) {
      console.error(err);
      setCreating(false);
    }
  };

  const handleInstall = async () => {
    await promptInstall();
    setShowBeforeYouBegin(false);
    setShowDatePicker(true);
  };

  const handleEnableReminders = async () => {
    await notifications.requestPermission();
    setShowBeforeYouBegin(false);
    setShowDatePicker(true);
  };

  const handleSkip = () => {
    setShowBeforeYouBegin(false);
    setShowDatePicker(true);
  };

  const canInstall = !isInstalled && (canPrompt || isIOS);

  const renderInterstitial = () => (
    <div className="bg-white rounded-2xl shadow-md border border-[#E8E4DE] p-6 w-full max-w-sm mx-4 text-center">
      <p className="text-[#3D5A4C] font-semibold text-lg mb-2">Before you begin</p>
      {canInstall ? (
        <>
          <p className="text-[#9E9B97] text-sm mb-5">
            To get the most out of Bloom, we recommend installing it as an app for reminders and easy access.
          </p>
          {isIOS ? (
            <div className="bg-[#F5F2ED] rounded-xl p-4 mb-4 text-left">
              <p className="text-[#3D5A4C] text-sm font-medium mb-2">Add to home screen:</p>
              <p className="text-[#9E9B97] text-sm">
                Tap the <Share size={14} className="inline -mt-0.5" /> share button at the bottom of your screen, then tap <span className="font-medium text-[#3D5A4C]">Add to Home Screen</span>.
              </p>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2 bg-[#7D9B76] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5C7A55] transition-colors mb-3"
            >
              <Download size={18} />
              Install Bloom
            </button>
          )}
        </>
      ) : (
        <>
          <p className="text-[#9E9B97] text-sm mb-5">
            To get the most out of Bloom, we recommend enabling reminders so you don't miss your activities.
          </p>
          {notifications.isSupported() && (
            <button
              onClick={handleEnableReminders}
              className="w-full flex items-center justify-center gap-2 bg-[#7D9B76] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5C7A55] transition-colors mb-3"
            >
              <Bell size={18} />
              Enable reminders
            </button>
          )}
        </>
      )}
      <button
        onClick={handleSkip}
        className="text-[#9E9B97] text-sm hover:text-[#3D5A4C] transition-colors"
      >
        Continue without
      </button>
    </div>
  );

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
        {!showBeforeYouBegin && (
          <p className="text-xl text-[#7D9B76] font-medium mb-2">Small steps. Real change.</p>
        )}
        {!showBeforeYouBegin && (
          <p className="text-[#9E9B97] max-w-md mx-auto">
            A gentle 10-day {spell.programme.toLowerCase()} to help you reconnect with activities that bring
            achievement, connection, and enjoyment back into your days.
          </p>
        )}

        <div className="mt-10 flex justify-center gap-3">
          {schedule ? (
            <button
              onClick={() => navigate('/schedule')}
              className="flex items-center gap-2 bg-[#7D9B76] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#5C7A55] transition-colors shadow-md"
            >
              Continue my {spell.programme.toLowerCase()}
              <ArrowRight size={20} />
            </button>
          ) : showBeforeYouBegin && !showDatePicker ? (
            renderInterstitial()
          ) : showDatePicker ? (
            <div className="bg-white rounded-2xl shadow-md border border-[#E8E4DE] p-6 w-full max-w-sm mx-4">
              <p className="text-[#3D5A4C] font-semibold mb-3">When does Day 1 start?</p>
              <input
                type="date"
                value={startDate}
                min={format(new Date())}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border border-[#E8E4DE] rounded-lg px-4 py-3 text-[#3D5A4C] focus:outline-none focus:ring-2 focus:ring-[#7D9B76] mb-4"
              />
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
              onClick={() => {
                // Skip interstitial if nothing to prompt for
                if (isInstalled && notifications.hasPermission()) {
                  setShowDatePicker(true);
                } else {
                  setShowBeforeYouBegin(true);
                }
              }}
              className="flex items-center gap-2 bg-[#7D9B76] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#5C7A55] transition-colors shadow-md"
            >
              Start my {spell.programme.toLowerCase()}
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
