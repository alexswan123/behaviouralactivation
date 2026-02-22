import { ExternalLink, Coffee, ClipboardList, Users, BarChart2, FileDown, BookOpen } from 'lucide-react';

const BMC_URL = 'https://buymeacoffee.com/alexandraswan';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-[#2A3D32] mb-4">{children}</h2>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-[#E8E3DB] rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#EEF5EC] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-[#2A3D32] mb-1.5">{title}</p>
          <p className="text-sm text-[#6B6866] leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
}

export default function ClinicianPage() {
  return (
    <div className="max-w-3xl mx-auto">

      {/* Hero */}
      <div className="bg-[#3D5A4C] rounded-2xl px-8 py-10 mb-10 text-white">
        <p className="text-xs font-semibold text-[#A8C8B0] uppercase tracking-widest mb-3">For clinicians</p>
        <h1 className="text-3xl font-bold mb-4 leading-snug">
          A free tool for referring clients to behavioural activation
        </h1>
        <p className="text-[#C4D9C8] text-base leading-relaxed max-w-xl">
          Bloom was built by a psychologist and a developer to make BA more accessible — a structured,
          evidence-based tool your clients can use between sessions, at no cost.
        </p>
      </div>

      {/* What it is */}
      <div className="mb-12">
        <SectionHeading>What Bloom does</SectionHeading>
        <p className="text-[#6B6866] leading-relaxed mb-6">
          Bloom guides clients through a 10-day behavioural activation program.
          It draws on the core BA model — scheduling values-consistent activities, tracking
          Achievement, Connection, and Enjoyment (ACE) before and after each activity,
          and reviewing progress over time. Everything runs in the browser with no account required.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card icon={<ClipboardList size={18} className="text-[#5C7A55]" />} title="10-day schedule">
            Clients plan activities across a structured 10-day window, with date-aware day cards
            and time slots.
          </Card>
          <Card icon={<BookOpen size={18} className="text-[#5C7A55]" />} title="Curated activity catalogue">
            60 activities across Pleasure, Social, Achievement, and Body — with space for clients
            to add their own or record things they used to enjoy.
          </Card>
          <Card icon={<BarChart2 size={18} className="text-[#5C7A55]" />} title="Pre and post ACE ratings">
            Clients rate expected and actual Achievement, Connection, and Enjoyment (0–10)
            for each activity. Progress charts appear after three completed activities.
          </Card>
          <Card icon={<FileDown size={18} className="text-[#5C7A55]" />} title="Printable & exportable">
            Clients can download a PDF summary, export to their calendar (.ics),
            or copy their schedule as text — useful for session review.
          </Card>
        </div>
      </div>

      {/* How to use with clients */}
      <div className="mb-12">
        <SectionHeading>How to use it with clients</SectionHeading>
        <div className="bg-white border-2 border-[#E8E3DB] rounded-2xl overflow-hidden">
          {[
            {
              n: '1',
              title: 'Share the link',
              detail: 'Send clients to this site. No sign-up or account needed — they start immediately. Works on mobile and desktop.',
            },
            {
              n: '2',
              title: 'Set a start date together',
              detail: 'In session, agree on a start date for their 10-day window. Helps with commitment and makes the first activity feel concrete.',
            },
            {
              n: '3',
              title: 'Introduce the ACE framework',
              detail: 'The welcome page explains the depression–withdrawal cycle and what ACE means. You can direct clients there, or use it as a conversation starter.',
            },
            {
              n: '4',
              title: 'Encourage pre-activity ratings',
              detail: 'Pre-activity expected scores are clinically meaningful — research shows anticipated pleasure predicts depression improvement. Prompt clients to rate before, not just after.',
            },
            {
              n: '5',
              title: 'Review the PDF in session',
              detail: 'Ask clients to bring their PDF export to the next session. The ACE lift columns make it easy to spot which activity types are working best for them.',
            },
          ].map(step => (
            <div key={step.n} className="flex items-start gap-5 px-6 py-5 border-b border-[#EDE8E0] last:border-0">
              <div className="w-7 h-7 bg-[#3D5A4C] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{step.n}</span>
              </div>
              <div>
                <p className="font-semibold text-[#2A3D32] mb-1">{step.title}</p>
                <p className="text-sm text-[#6B6866] leading-relaxed">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical background */}
      <div className="mb-12">
        <SectionHeading>Clinical background</SectionHeading>
        <div className="bg-[#F5F0E8] border border-[#DDD8D0] rounded-2xl p-6 text-sm text-[#5C5A57] leading-relaxed space-y-3">
          <p>
            Behavioural activation is an evidence-based treatment for depression with strong support
            across randomised controlled trials. The core mechanism is interrupting the depression–withdrawal
            cycle: low mood leads to avoidance, which reduces access to reinforcement, which deepens low mood.
          </p>
          <p>
            BA works by scheduling approach behaviours — particularly activities associated with mastery
            and pleasure — regardless of current motivation. The ACE framework (Achievement, Connection,
            Enjoyment) maps onto the main reinforcer categories targeted in BA.
          </p>
          <p>
            Pre-activity ratings of expected pleasure and mastery have been shown to predict treatment
            response in depression, and reviewing the gap between expected and actual experience is a
            clinically useful technique for addressing anticipatory anhedonia.
          </p>
          <p className="text-[#8A8680]">
            Key references: Martell, Dimidjian & Herman-Dunn (2010); Cuijpers et al. (2007);
            Mazzucchelli, Kane & Rees (2009).
          </p>
        </div>
      </div>

      {/* Support / Buy Me a Coffee */}
      <div className="mb-10">
        <div className="bg-white border-2 border-[#E8E3DB] rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-[#7D9B76]" />
              <p className="text-xs font-semibold text-[#7D9B76] uppercase tracking-wide">Support Bloom</p>
            </div>
            <h3 className="text-lg font-bold text-[#2A3D32] mb-2">Free for clients, always</h3>
            <p className="text-sm text-[#6B6866] leading-relaxed">
              Bloom is and will always be free for clients to use. If you're a clinician who
              finds yourself referring to it regularly, buying us a coffee is a kind way to
              help keep it going. No pressure at all — just appreciated.
            </p>
          </div>
          <a
            href={BMC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all"
            style={{ backgroundColor: '#FFDD00', color: '#1a1a1a' }}
          >
            <Coffee size={17} />
            Buy us a coffee
            <ExternalLink size={13} className="opacity-60" />
          </a>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-[#ABA8A3] pb-4">
        Bloom was made by a psychologist and a developer. It is a clinical aid, not a replacement for therapy.
      </p>

    </div>
  );
}
