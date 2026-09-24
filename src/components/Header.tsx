import React from 'react';
import { Search, Bell, Mail } from 'lucide-react';

interface HeaderProps {
  onOpenGoPro: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenMessages: () => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGoPro,
  onOpenSearch,
  onOpenNotifications,
  onOpenMessages,
  unreadNotificationsCount = 2,
  unreadMessagesCount = 1,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-white/[0.06] px-4 py-2.5 flex items-center justify-between transition-colors">
      {/* Left side: SoundCloud orange cloud logo next to the text "SoundCloud" */}
      <div className="flex items-center gap-2 cursor-pointer select-none group">
        {/* SoundCloud Classic Cloud SVG */}
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 40 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-5 drop-shadow-sm"
          >
            {/* SoundCloud cloud paths */}
            <path
              d="M32.5 10.2C31.8 4.5 26.9 0 21 0C17.2 0 13.9 1.9 12 4.8C10.9 4.3 9.7 4 8.5 4C3.8 4 0 7.8 0 12.5C0 17.2 3.8 21 8.5 21H32.5C36.6 21 40 17.6 40 13.5C40 9.8 37 6.8 33.3 6.6C33 7.8 32.7 9 32.5 10.2Z"
              fill="#FF5500"
            />
            {/* Signature sound waves cut inside cloud */}
            <line x1="2.5" y1="12" x2="2.5" y2="18" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="5" y1="10" x2="5" y2="19" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="7.5" y1="8" x2="7.5" y2="20" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="10" y1="9" x2="10" y2="20" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="12.5" y1="7" x2="12.5" y2="20" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-white font-bold text-[19px] tracking-tight group-hover:text-[#ff5500] transition-colors">
          SoundCloud
        </span>
      </div>

      {/* Right side: "Go Pro" button, Search icon, Notification bell icon, and Messages envelope icon */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Go Pro Button */}
        <button
          onClick={onOpenGoPro}
          type="button"
          aria-label="Go Pro membership"
          className="h-[30px] px-2.5 rounded-full bg-gradient-to-r from-[#ff5500] to-[#ff3300] hover:brightness-110 active:scale-95 text-white font-bold text-[11px] tracking-wide flex items-center justify-center transition shadow-sm shadow-[#ff5500]/20"
        >
          Go Pro
        </button>

        {/* Search icon */}
        <button
          onClick={onOpenSearch}
          type="button"
          aria-label="Search tracks and artists"
          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/[0.08] active:scale-95 transition"
        >
          <Search className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Notification bell icon */}
        <button
          onClick={onOpenNotifications}
          type="button"
          aria-label="Notifications"
          className="relative w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/[0.08] active:scale-95 transition"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff5500] rounded-full ring-2 ring-[#121212]" />
          )}
        </button>

        {/* Messages envelope icon */}
        <button
          onClick={onOpenMessages}
          type="button"
          aria-label="Messages"
          className="relative w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/[0.08] active:scale-95 transition"
        >
          <Mail className="w-5 h-5 stroke-[2]" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff5500] rounded-full ring-2 ring-[#121212]" />
          )}
        </button>
      </div>
    </header>
  );
};
