import React from 'react';
import { Play, Pause, Heart, Share2 } from 'lucide-react';
import { Track } from '../types';

interface TodaysPickProps {
  track: Track;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: (track: Track) => void;
  onToggleLike: (trackId: string, e: React.MouseEvent) => void;
  onShare?: () => void;
}

export const TodaysPick: React.FC<TodaysPickProps> = ({
  track,
  isPlaying,
  isCurrent,
  onPlay,
  onToggleLike,
  onShare,
}) => {
  const isThisPlaying = isCurrent && isPlaying;

  return (
    <section className="px-4 pt-3 pb-4" aria-label="Today's Pick">
      {/* Section Headers */}
      <div className="mb-2.5">
        <span className="text-[11px] font-bold text-[#ff5500] uppercase tracking-wider block">
          TODAY&apos;S PICK
        </span>
        <h3 className="text-[20px] font-extrabold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
          <span>Hot For You</span>
          <span role="img" aria-label="fire">🔥</span>
        </h3>
      </div>

      {/* Large Featured Card */}
      <div
        onClick={() => onPlay(track)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onPlay(track);
          }
        }}
        className="group relative bg-[#181818] hover:bg-[#1f1f1f] rounded-2xl overflow-hidden border border-white/[0.08] p-3.5 transition-all cursor-pointer shadow-lg shadow-black/50"
      >
        {/* Large Artwork Container with Play Button */}
        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-900 mb-3.5">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Fallback gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/60 to-black -z-10 flex items-center justify-center">
            <span className="text-3xl font-black text-[#ff5500]">PHYERLEN</span>
          </div>

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Prominent Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlay(track);
              }}
              aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
              className="w-16 h-16 rounded-full bg-[#ff5500] hover:bg-[#ff6a1a] text-white flex items-center justify-center shadow-xl shadow-[#ff5500]/40 transition transform active:scale-95 group-hover:scale-105"
            >
              {isThisPlaying ? (
                <Pause className="w-8 h-8 fill-white" />
              ) : (
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              )}
            </button>
          </div>

          {/* Live Waveform preview at bottom of artwork */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-end gap-[2px] h-6 opacity-85">
            {track.waveform.slice(0, 48).map((height, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full transition-all duration-200 ${
                  isThisPlaying && i % 4 === 0
                    ? 'bg-[#ff5500] animate-wave'
                    : 'bg-white/70'
                }`}
                style={{
                  height: `${Math.max(15, height * 0.28)}px`,
                  animationDelay: `${(i % 8) * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Track Title and Artist */}
        <div className="space-y-1">
          <h4 className="text-[16px] font-bold text-white tracking-tight leading-snug line-clamp-2 group-hover:text-[#ff5500] transition-colors">
            {track.title}
          </h4>
          <p className="text-[13px] font-medium text-neutral-400">
            {track.artist}
          </p>
        </div>

        {/* Divider hairline */}
        <div className="h-[1px] bg-white/[0.06] my-3" />

        {/* Like count text: "386 people just liked this track" */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            {/* Tiny social heart indicator */}
            <div className="w-6 h-6 rounded-full bg-[#ff5500]/20 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-[#ff5500] text-[#ff5500]" />
            </div>
            <span className="font-medium text-neutral-300">
              <strong className="text-white font-semibold tabular-nums">{track.likesCount}</strong> people just liked this track
            </span>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => onToggleLike(track.id, e)}
              aria-label={track.isLiked ? 'Unlike' : 'Like'}
              className="p-1.5 rounded-full hover:bg-white/[0.08] transition"
            >
              <Heart
                className={`w-4 h-4 ${
                  track.isLiked ? 'fill-[#ff5500] text-[#ff5500]' : 'text-neutral-400 hover:text-white'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.();
              }}
              aria-label="Share track"
              className="p-1.5 rounded-full hover:bg-white/[0.08] text-neutral-400 hover:text-white transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
