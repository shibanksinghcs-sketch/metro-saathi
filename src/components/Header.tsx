import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Moon,
  Sun,
  WifiOff,
  Clock,
  Menu,
  X,
  Compass,
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  pendingSyncCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  mobileMenuOpen,
  onToggleMobileMenu,
  pendingSyncCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#115E59] text-white shadow-md border-b border-[#0F766E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand & Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg bg-[#0F766E] text-white hover:bg-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-teal-300"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Metro Saathi Logo Icon */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0F766E] flex items-center justify-center shadow-inner border border-teal-300/30">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="13" rx="3" />
                  <path d="M4 11h16" />
                  <path d="M8 17l-3 4" />
                  <path d="M16 17l3 4" />
                  <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="8" r="1.5" fill="currentColor" />
                </svg>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white">
                    METRO SAATHI
                  </h1>
                  <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-teal-800/80 text-teal-200 border border-teal-600/40">
                    PS-07
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-teal-100/90 font-medium tracking-tight line-clamp-1">
                  Every Voice Heard. Every Issue Routed. Every Journey Matters.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Status Badges, Clock & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Offline Mode Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-300 text-xs font-semibold shadow-sm">
              <WifiOff className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden md:inline">OFFLINE MODE</span>
              <span className="md:hidden">OFFLINE</span>
            </div>

            {/* Local Clock */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-900/60 border border-teal-700/50 text-teal-100 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-teal-300" />
              <span>{currentTime || '11:00:00 AM'}</span>
            </div>

            {/* Pending Sync indicator pill */}
            {pendingSyncCount > 0 && (
              <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{pendingSyncCount} pending sync</span>
              </div>
            )}

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-white border border-teal-600/40 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-teal-100" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
