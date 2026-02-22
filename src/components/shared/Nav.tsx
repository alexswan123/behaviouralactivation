import { NavLink } from 'react-router-dom';
import { Calendar, BookOpen, BarChart2, Leaf } from 'lucide-react';

export default function Nav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#3D5A4C] text-white shadow-sm'
        : 'text-[#5C5A57] hover:bg-[#EDE8E0] hover:text-[#3D5A4C]'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#DDD8D0]">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 font-bold text-[#3D5A4C] text-lg">
          <div className="w-8 h-8 bg-[#7D9B76] rounded-lg flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          Bloom
        </NavLink>
        <div className="flex items-center gap-1">
          <NavLink to="/schedule" className={linkClass}>
            <Calendar size={15} />
            Schedule
          </NavLink>
          <NavLink to="/catalogue" className={linkClass}>
            <BookOpen size={15} />
            Activities
          </NavLink>
          <NavLink to="/progress" className={linkClass}>
            <BarChart2 size={15} />
            Progress
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
