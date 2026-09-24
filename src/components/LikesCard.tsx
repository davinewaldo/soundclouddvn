import React from 'react';
import { Heart, Shuffle } from 'lucide-react';

interface LikesCardProps {
  likesCount?: number;
  onOpenLikes: () => void;
  onShuffleLikes: () => void;
}

export const LikesCard: React.FC<LikesCardProps> = ({
  likesCount = 248,
  onOpenLikes,
  onShuffleLikes,
}) => {
  return (
    <div className="px-4 pt-3 pb-2">
      <div
        onClick={onOpenLikes}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onOpenLikes();
          }
        }}
        className="w-full bg-[#1e1e1e] hover:bg-[#252525] active:scale-[0.99] border border-white/[0.08] rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition shadow-md shadow-black/40 group"
      >
        {/* Left side: Solid orange heart icon inside a stylized icon container */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2a160c] to-[#1c120c] border border-[#ff5500]/30 flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#ff5500]/60 transition-colors">
            <Heart className="w-6 h-6 fill-[#ff5500] text-[#ff5500] drop-shadow-[0_2px_8px_rgba(255,85,0,0.45)]" />
          </div>

          <div className="flex flex-col text-left truncate">
            <span className="text-white font-bold text-[16px] tracking-tight group-hover:text-[#ff5500] transition-colors truncate">
              Your Likes
            </span>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
              <span>{likesCount} tracks</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-500">Auto playlist</span>
            </div>
          </div>
        </div>

        {/* Right side: Shuffle icon button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShuffleLikes();
          }}
          type="button"
          aria-label="Shuffle your liked tracks"
          title="Shuffle Likes"
          className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#ff5500]/20 hover:text-[#ff5500] text-neutral-300 flex items-center justify-center transition active:scale-90 shrink-0 ml-2"
        >
          <Shuffle className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
