import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, Brain, Cpu, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: Activity },
  { path: '/predictions', label: 'Predictions', icon: Cpu },
  { path: '/ai-insights', label: 'AI Insights', icon: Brain },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[hsl(220,24%,18%)] border border-[hsl(220,22%,24%)] text-white"
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
      )}

      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col',
        'bg-[hsl(220,24%,18%)] border-r border-[hsl(220,22%,24%)]',
        'transform transition-transform duration-200 ease-in-out lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[hsl(220,22%,24%)]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border-2 border-[hsl(191,70%,55%)] flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[hsl(191,70%,55%)]" />
            </div>
            <div>
              <p className="text-base font-bold text-white tracking-wide" style={{ fontFamily: 'Syne, sans-serif' }}>NORI</p>
              <p className="text-[11px] text-[hsl(220,15%,55%)] tracking-widest uppercase font-mono">IMTA Monitor</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all border-l-2',
                  isActive
                    ? 'border-[hsl(191,70%,55%)] text-white bg-[hsl(220,22%,24%)]'
                    : 'border-transparent text-[hsl(220,15%,60%)] hover:text-white hover:bg-[hsl(220,22%,22%)]'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Live sensors */}
        <div className="px-6 py-5 border-t border-[hsl(220,22%,24%)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[hsl(158,48%,50%)] ticker-live" />
            <span className="text-[11px] tracking-widest uppercase text-[hsl(220,15%,55%)] font-mono font-medium">Live Sensors</span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Temperature', val: '28.5°C' },
              { label: 'pH', val: '7.8' },
              { label: 'TDS', val: '245 ppm' },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center">
                <span className="text-[12px] text-[hsl(220,15%,55%)] font-mono">{s.label}</span>
                <span className="text-[13px] font-mono font-semibold text-white">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};