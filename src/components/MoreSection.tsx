import React from 'react';
import { Play, Pause, Heart, ChevronRight } from 'lucide-react';
import { Track } from '../types';

interface MoreSectionProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string, e: React.MouseEvent) => void;
  onSeeAll: () => void;
}

export const MoreSection: React.FC<MoreSectionProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  onSeeAll,
}) => {
  // Take tracks for the more section
  const moreTracks = tracks.filter((t) =>
    ['track-cyber-sunset', 'track-jakarta-nights', 'track-808-nostalgia'].includes(t.id)
  );

  return (
    <section className="px-4 pt-2 pb-24" aria-label="More of what you like">
      {/* Section Header with "See All" button */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[17px] font-bold text-white tracking-tight">
          More of what you like
        </h3>
        <button
          onClick={onSeeAll}
          type="button"
          className="text-xs font-semibold text-neutral-400 hover:text-[#ff5500] flex items-center gap-0.5 transition active:scale-95 py-1 px-1.5"
        >
          <span>See All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Carousel or Vertical list - let's render a clean, tactile horizontal card scroll and stacked previews */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 snap-x">
        {moreTracks.map((track) => {
          const isThisPlaying = currentTrack?.id === track.id && isPlaying;
          const isThisActive = currentTrack?.id === track.id;

          return (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onPlayTrack(track);
                }
              }}
              className={`snap-start shrink-0 w-[150px] bg-[#181818] hover:bg-[#202020] rounded-xl p-2.5 flex flex-col border transition cursor-pointer ${
                isThisActive ? 'border-[#ff5500]/50' : 'border-white/[0.06]'
              }`}
            >
              {/* Artwork */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-900 mb-2">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Play button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayTrack(track);
                  }}
                  aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  className={`absolute right-1.5 bottom-1.5 w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
                    isThisPlaying ? 'bg-[#ff5500] text-white' : 'bg-black/75 hover:bg-[#ff5500] text-white'
                  }`}
                >
                  {isThisPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-white" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white translate-x-[1px]" />
                  )}
                </button>
              </div>

              {/* Title & Artist */}
              <h4 className="text-[12px] font-semibold text-white truncate tracking-tight">
                {track.title}
              </h4>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                {track.artist}
              </p>

              {/* Bottom stats */}
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/[0.05]">
                <span className="text-[10px] text-neutral-500">
                  {track.genre.split('/')[0]}
                </span>
                <button
                  type="button"
                  onClick={(e) => onToggleLike(track.id, e)}
                  aria-label={track.isLiked ? 'Unlike' : 'Like'}
                  className="text-neutral-400 hover:text-white"
                >
                  <Heart
                    className={`w-3 h-3 ${
                      track.isLiked ? 'fill-[#ff5500] text-[#ff5500]' : 'text-neutral-400'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
