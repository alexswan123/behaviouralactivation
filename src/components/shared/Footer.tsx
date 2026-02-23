import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Leaf } from 'lucide-react';

const BMC_URL = 'https://buymeacoffee.com/alexandraswan';
const CONTACT = 'hello@behaviouralactivation.com.au';

type LegalTab = 'terms' | 'privacy';

function LegalModal({ initialTab, onClose }: { initialTab: LegalTab; onClose: () => void }) {
  const [tab, setTab] = useState<LegalTab>(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FAF6F0] rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col border border-[#DDD8D0]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDD8D0] bg-white rounded-t-2xl shrink-0">
          <div className="flex gap-1">
            {(['terms', 'privacy'] as LegalTab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === t ? 'bg-[#3D5A4C] text-white' : 'text-[#8A8680] hover:bg-[#EDE8E0]'
                }`}
              >
                {t === 'terms' ? 'Terms of use' : 'Privacy'}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F0EBE3] text-[#9E9B97]">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6 text-sm text-[#5C5A57] leading-relaxed space-y-4">
          {tab === 'terms' ? (
            <>
              <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide">Last updated February 2026</p>

              <p>Bloom is a free tool designed to support behavioural activation, an evidence-based approach to managing low mood and depression. It is intended as a self-help aid and is not a substitute for professional medical or psychological advice, diagnosis, or treatment.</p>

              <h3 className="font-semibold text-[#2A3D32]">Not a clinical service</h3>
              <p>Bloom does not provide therapy, counselling, or any form of clinical care. If you are experiencing significant distress, thoughts of self-harm, or a mental health crisis, please contact a qualified health professional, your GP, or an emergency service.</p>

              <h3 className="font-semibold text-[#2A3D32]">Use at your own discretion</h3>
              <p>We have made every effort to ensure the content of Bloom is clinically grounded and helpful. However, we make no warranties about the accuracy, completeness, or suitability of the information for any particular purpose. Use of Bloom is at your own discretion.</p>

              <h3 className="font-semibold text-[#2A3D32]">No liability</h3>
              <p>The creators of Bloom accept no liability for any outcomes arising from use of this tool. Bloom is provided as-is, without guarantee of availability or fitness for any specific purpose.</p>

              <h3 className="font-semibold text-[#2A3D32]">Intellectual property</h3>
              <p>The content, design, and structure of Bloom are the property of its creators. You may use Bloom freely for personal or clinical support purposes. You may not reproduce or redistribute it commercially without permission.</p>

              <h3 className="font-semibold text-[#2A3D32]">Contact</h3>
              <p>Questions or concerns: <a href={`mailto:${CONTACT}`} className="text-[#7D9B76] underline">{CONTACT}</a></p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-[#9E9B97] uppercase tracking-wide">Last updated February 2026 (v2)</p>

              <p>Your privacy matters to us. Bloom is designed so that your data stays with you.</p>

              <h3 className="font-semibold text-[#2A3D32]">No accounts, no servers</h3>
              <p>Bloom does not require you to create an account or log in. All of your schedule data (activities, ACE scores, notes) is stored only on your device using your browser's local storage. Nothing is transmitted to any server.</p>

              <h3 className="font-semibold text-[#2A3D32]">What we store</h3>
              <p>The only data stored is what you enter into Bloom: your schedule start date, planned activities, and any ACE scores or notes you record. This data lives entirely in your browser and is not accessible to us.</p>

              <h3 className="font-semibold text-[#2A3D32]">Clearing your data</h3>
              <p>You can delete all your data at any time using the "Reset program" option in the schedule settings, or by clearing your browser's local storage for this site.</p>

              <h3 className="font-semibold text-[#2A3D32]">Analytics</h3>
              <p>Bloom uses PostHog to collect anonymous, aggregate usage data — things like which features are used and how often, so we can understand what's helpful and improve the product. We do not capture any content you enter (activity names, ACE scores, notes, or dates). We do not create user profiles or link any event to an individual. No personal information is collected or transmitted.</p>

              <h3 className="font-semibold text-[#2A3D32]">Third-party services</h3>
              <p>Bloom loads fonts from Google Fonts. This means Google's servers receive a request for font files when you visit the site. No personal data from within the app is shared with Google. Anonymous usage events are sent to PostHog (posthog.com), which is a privacy-focused analytics platform. PostHog processes data in the United States.</p>

              <h3 className="font-semibold text-[#2A3D32]">Contact</h3>
              <p>Privacy questions: <a href={`mailto:${CONTACT}`} className="text-[#7D9B76] underline">{CONTACT}</a></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);

  return (
    <>
      <footer className="border-t border-[#DDD8D0] bg-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row gap-8 justify-between">

            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-[#7D9B76] rounded-lg flex items-center justify-center">
                  <Leaf size={14} className="text-white" />
                </div>
                <span className="font-bold text-[#3D5A4C]">Bloom</span>
              </div>
              <p className="text-sm text-[#8A8680] leading-relaxed">
                Low mood shrinks your world. Bloom helps you slowly expand it again, one activity at a time.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              <div>
                <p className="text-xs font-semibold text-[#3D5A4C] uppercase tracking-wider mb-3">App</p>
                <div className="space-y-2">
                  <Link to="/schedule" className="block text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors">Schedule</Link>
                  <Link to="/catalogue" className="block text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors">Activities</Link>
                  <Link to="/progress" className="block text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors">Progress</Link>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#3D5A4C] uppercase tracking-wider mb-3">Clinicians</p>
                <div className="space-y-2">
                  <Link to="/for-clinicians" className="block text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors">For clinicians</Link>
                  <a
                    href={BMC_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors"
                  >
                    Support
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#3D5A4C] uppercase tracking-wider mb-3">Legal & contact</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setLegalTab('terms')}
                    className="block text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors text-left"
                  >
                    Terms of use
                  </button>
                  <button
                    onClick={() => setLegalTab('privacy')}
                    className="block text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors text-left"
                  >
                    Privacy
                  </button>
                  <a
                    href={`mailto:${CONTACT}`}
                    className="block text-sm text-[#8A8680] hover:text-[#3D5A4C] transition-colors"
                  >
                    {CONTACT}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-[#EDE8E0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-[#ABA8A3]">
              © {new Date().getFullYear()} Bloom. Free for personal and clinical use. Not a substitute for professional care.
            </p>
            <p className="text-xs text-[#ABA8A3]">Made in Australia 🌿</p>
          </div>
        </div>
      </footer>

      {legalTab && <LegalModal initialTab={legalTab} onClose={() => setLegalTab(null)} />}
    </>
  );
}
