import React from 'react';
import { Home, Radio, Search, Heart, Star } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: Home,
      solidIcon: false,
    },
    {
      id: 'feed' as TabType,
      label: 'Feed',
      icon: Radio,
      solidIcon: false,
    },
    {
      id: 'search' as TabType,
      label: 'Search',
      icon: Search,
      solidIcon: false,
    },
    {
      // NOTE: Replaced standard Library with Likes tab as required
      id: 'likes' as TabType,
      label: 'Likes',
      icon: Heart,
      solidIcon: true,
    },
    {
      id: 'upgrade' as TabType,
      label: 'Upgrade',
      icon: Star,
      solidIcon: false,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-[#121212]/95 backdrop-blur-xl border-t border-white/[0.08] h-[58px] px-1 flex items-center justify-around select-none"
      aria-label="SoundCloud Navigation"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            aria-label={tab.label}
            aria-selected={isActive}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] py-1 transition-all ${
              isActive
                ? 'text-[#ff5500]'
                : 'text-neutral-400 hover:text-neutral-200 active:scale-95'
            }`}
          >
            <div className="relative">
              <IconComponent
                className={`w-[22px] h-[22px] stroke-[2] transition-transform ${
                  isActive ? 'scale-105' : ''
                } ${
                  tab.solidIcon && (isActive || tab.id === 'likes')
                    ? isActive
                      ? 'fill-[#ff5500]'
                      : 'fill-neutral-400'
                    : ''
                }`}
              />
              {tab.id === 'upgrade' && (
                <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 bg-[#ff5500] rounded-full ring-1 ring-[#121212]" />
              )}
            </div>
            <span
              className={`text-[10px] font-medium tracking-tight mt-1 ${
                isActive ? 'font-bold text-[#ff5500]' : 'text-neutral-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
