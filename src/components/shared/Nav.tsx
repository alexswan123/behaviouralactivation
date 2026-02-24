import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, BookOpen, BarChart2, Leaf, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/catalogue', icon: BookOpen, label: 'Activities' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
] as const;

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#3D5A4C] text-white shadow-sm'
        : 'text-[#5C5A57] hover:bg-[#EDE8E0] hover:text-[#3D5A4C]'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#3D5A4C] text-white'
        : 'text-[#3D5A4C] hover:bg-[#EDE8E0]'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#DDD8D0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 font-bold text-[#3D5A4C] text-lg">
          <div className="w-8 h-8 bg-[#7D9B76] rounded-lg flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          Bloom
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="p-2 rounded-xl text-[#3D5A4C] hover:bg-[#EDE8E0] transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {mobileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E8E3DB] p-2 space-y-1">
              {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
