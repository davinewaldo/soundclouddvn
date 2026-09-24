import React from 'react';
import { Play, Pause, Heart, ListMusic } from 'lucide-react';
import { Track } from '../types';

interface FloatingMiniPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onToggleLike: (trackId: string, e: React.MouseEvent) => void;
  onOpenQueue: () => void;
  onOpenFullPlayer: () => void;
}

export const FloatingMiniPlayer: React.FC<FloatingMiniPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onToggleLike,
  onOpenQueue,
  onOpenFullPlayer,
}) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-[60px] left-0 right-0 z-40 max-w-md mx-auto px-2 pointer-events-none">
      <div
        onClick={onOpenFullPlayer}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onOpenFullPlayer();
          }
        }}
        className="pointer-events-auto relative w-full bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/[0.12] rounded-xl overflow-hidden shadow-2xl shadow-black/80 flex items-center justify-between p-2 cursor-pointer transition active:scale-[0.99] group"
      >
        {/* Top Slim Audio Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-800">
          <div
            className="h-full bg-[#ff5500] transition-all duration-150"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* Left: Track Artwork + Details */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
          {/* Cover Art */}
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-white/[0.08]">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-[#ff5500] rounded-full animate-ping" />
              </div>
            )}
          </div>

          {/* Title & Artist */}
          <div className="min-w-0 flex-1 text-left">
            <h5 className="text-[13px] font-bold text-white tracking-tight truncate leading-tight group-hover:text-[#ff5500] transition-colors">
              {currentTrack.title}
            </h5>
            <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-medium">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Right side Controls: Queue icon, Heart icon (orange-highlighted), and Play/Pause */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Orange-highlighted Heart icon */}
          <button
            type="button"
            onClick={(e) => onToggleLike(currentTrack.id, e)}
            aria-label={currentTrack.isLiked ? 'Unlike current track' : 'Like current track'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition active:scale-90"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                currentTrack.isLiked
                  ? 'fill-[#ff5500] text-[#ff5500] drop-shadow-[0_0_6px_rgba(255,85,0,0.5)]'
                  : 'text-neutral-400'
              }`}
            />
          </button>

          {/* Queue icon */}
          <button
            type="button"
            onClick={onOpenQueue}
            aria-label="Open queue"
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-90"
          >
            <ListMusic className="w-5 h-5" />
          </button>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-full bg-white hover:bg-neutral-200 active:scale-90 text-black flex items-center justify-center transition shadow-md ml-0.5"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black text-black" />
            ) : (
              <Play className="w-4 h-4 fill-black text-black translate-x-[0.5px]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
