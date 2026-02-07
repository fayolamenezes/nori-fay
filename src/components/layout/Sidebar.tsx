import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Settings2, 
  Bell, 
  Brain, 
  FileText, 
  Waves,
  Cpu,
  History,
  FlaskConical,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tank', label: 'Tank Control', icon: Waves },
  { path: '/analytics', label: 'Analytics', icon: Activity },
  { path: '/ai-insights', label: 'AI Insights', icon: Brain },
  { path: '/predictions', label: 'Predictions', icon: Cpu },
  { path: '/history', label: 'History', icon: History },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/research', label: 'Research', icon: FlaskConical },
  { path: '/settings', label: 'Settings', icon: Settings2 },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-secondary border border-border"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border",
        "transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center animate-pulse-glow">
                  <Waves className="w-6 h-6 text-accent" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-seaweed rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">NORI</h1>
                <p className="text-xs text-muted-foreground">Smart IMTA System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-sidebar-accent group",
                  isActive 
                    ? "bg-accent/10 text-accent border border-accent/20 glow-accent" 
                    : "text-sidebar-foreground"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  location.pathname === path ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Status */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-seaweed animate-pulse" />
                <span className="text-sm font-medium text-seaweed">System Online</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Last sync: Just now
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
