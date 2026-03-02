import { ArrowDown, TrendingUp, Sparkles, Compass } from 'lucide-react';
import { spell } from '../../lib/spelling';

export default function HowItWorksSection() {
  return (
    <div className="space-y-10 pb-16 px-4">
      {/* The depression cycle */}
      <section className="bg-white rounded-2xl border border-[#E8E4DE] p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-[#FDE8E8] rounded-lg flex items-center justify-center">
            <ArrowDown size={18} className="text-[#9B3A45]" />
          </div>
          <h2 className="text-lg font-semibold text-[#3D5A4C]">The depression cycle</h2>
        </div>
        <p className="text-[#5C5A57] mb-5">
          When we feel low, we naturally pull back from life. We stop doing things we used to
          enjoy, avoid seeing people, and let responsibilities pile up. It feels like rest,
          but it often makes things worse.
        </p>
        <div className="bg-[#FAF6F0] rounded-xl p-5">
          <div className="flex flex-col items-center gap-2 text-sm text-center">
            {[
              'Low mood',
              'Withdraw from activities',
              'Less pleasure, achievement, connection',
              'Mood drops further',
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="bg-white border border-[#E8E4DE] rounded-lg px-5 py-2.5 text-[#3D5A4C] font-medium shadow-sm">
                  {step}
                </div>
                {i < 3 && <div className="text-[#C17C5A] font-bold">↓</div>}
              </div>
            ))}
          </div>
          <p className="text-center text-[#9E9B97] text-xs mt-4">The cycle that keeps low mood going</p>
        </div>
      </section>

      {/* What BA does */}
      <section className="bg-white rounded-2xl border border-[#E8E4DE] p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-[#D8EDD8] rounded-lg flex items-center justify-center">
            <TrendingUp size={18} className="text-[#2D5A3A]" />
          </div>
          <h2 className="text-lg font-semibold text-[#3D5A4C]">What behavioural activation does</h2>
        </div>
        <p className="text-[#5C5A57] mb-4">
          Behavioural activation (BA) turns the cycle around. Instead of waiting to feel better
          before doing things, you do things. And mood improves as a result.
        </p>
        <div className="bg-[#F0F7EE] rounded-xl p-5 border border-[#C8DCC4]">
          <p className="text-[#3D5A4C] font-semibold text-center mb-3">Act first. Mood follows.</p>
          <div className="flex flex-col items-center gap-1 text-sm text-center">
            {[
              'Schedule an activity',
              'Do it (even if it feels hard)',
              'Notice even small positive feelings',
              'Motivation grows',
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="bg-white border border-[#B8D4B4] rounded-lg px-5 py-2.5 text-[#3D5A4C] font-medium shadow-sm">
                  {step}
                </div>
                {i < 3 && <div className="text-[#7D9B76] font-bold">↓</div>}
              </div>
            ))}
          </div>
        </div>
        <p className="text-[#9E9B97] text-sm mt-4">
          Research shows that doing activities, even ones you don't feel like doing, reliably
          improves mood over time. You don't need to feel motivated first.
        </p>
      </section>

      {/* ACE explained */}
      <section className="bg-white rounded-2xl border border-[#E8E4DE] p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-[#FFF0DC] rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-[#7B4A10]" />
          </div>
          <h2 className="text-lg font-semibold text-[#3D5A4C]">What ACE means</h2>
        </div>
        <p className="text-[#5C5A57] mb-6">
          For each activity, you'll rate three dimensions. These help you understand
          what kinds of activities nourish you most.
        </p>
        <div className="space-y-4">
          {[
            {
              letter: 'A',
              name: 'Achievement',
              colour: 'bg-[#FFF0DC] text-[#7B4A10]',
              desc: 'The sense of getting something done. Finishing a task, taking a step forward, showing up for yourself. It doesn\'t have to be big.',
            },
            {
              letter: 'C',
              name: 'Connection',
              colour: 'bg-[#D8EDD8] text-[#2D5A3A]',
              desc: 'Feeling close to others, part of something, or simply not alone. Connection can be with people, animals, nature, or a community.',
            },
            {
              letter: 'E',
              name: 'Enjoyment',
              colour: 'bg-[#FDE8E8] text-[#9B3A45]',
              desc: 'Pleasure, fun, and sensory delight. Things that make life feel worth living, even in small doses.',
            },
          ].map(({ letter, name, colour, desc }) => (
            <div key={letter} className="flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${colour}`}>
                {letter}
              </div>
              <div>
                <p className="font-semibold text-[#3D5A4C]">{name}</p>
                <p className="text-[#9E9B97] text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#FAF6F0] rounded-xl p-4 mt-6 border border-[#E8E4DE]">
          <p className="text-sm text-[#5C5A57]">
            <span className="font-medium text-[#3D5A4C]">Before each activity,</span> you'll predict your ACE scores.
            <span className="font-medium text-[#3D5A4C]"> Afterwards,</span> you'll rate how it actually felt.
            Comparing the two is one of the most powerful parts of the {spell.programme.toLowerCase()}.
          </p>
        </div>
      </section>

      {/* Use it your way */}
      <section className="bg-white rounded-2xl border border-[#E8E4DE] p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-[#EDE8FF] rounded-lg flex items-center justify-center">
            <Compass size={18} className="text-[#6A5A9C]" />
          </div>
          <h2 className="text-lg font-semibold text-[#3D5A4C]">Use it your way</h2>
        </div>
        <p className="text-[#5C5A57] mb-4">
          People use Bloom differently, and that's fine. Some plan their week ahead.
          Others fill it in on the day. What matters most is doing at least one
          thing each day — even if it's small, even if it's low-effort.
        </p>
        <p className="text-[#5C5A57] mb-4">
          On tough days, pick something that takes five minutes or less.
          That still counts as a win.
        </p>
        <div className="bg-[#FAF6F0] rounded-xl p-4 border border-[#E8E4DE]">
          <p className="text-sm text-[#5C5A57]">
            If you have questions about how Bloom fits into your care, speak with your clinician.
          </p>
        </div>
      </section>
    </div>
  );
}
