import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { Track } from '../types';

interface TrackGridProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string, e: React.MouseEvent) => void;
}

export const TrackGrid: React.FC<TrackGridProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleLike,
}) => {
  // We take the 4 exact grid tracks
  const gridTracks = tracks.filter((t) =>
    ['track-hipdut-bb', 'track-yoga-beatmap', 'track-lerdut-throw', 'track-mmg-mine'].includes(t.id)
  );

  return (
    <section className="px-4 py-3" aria-label="Recent Tracks">
      <div className="grid grid-cols-2 gap-3">
        {gridTracks.map((track) => {
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
              className={`group relative bg-[#181818] hover:bg-[#202020] active:scale-[0.98] rounded-xl p-2.5 flex flex-col transition-all cursor-pointer border ${
                isThisActive ? 'border-[#ff5500]/50 ring-1 ring-[#ff5500]/30' : 'border-white/[0.06]'
              }`}
            >
              {/* Cover Artwork container */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-900 mb-2 shadow-sm">
                <img
                  src={track.coverUrl}
                  alt={`${track.title} by ${track.artist}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback gradient if file fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Stylized background fallback if image fails */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 -z-10 flex items-center justify-center">
                  <span className="text-xl font-bold text-neutral-600">SC</span>
                </div>

                {/* Dark gradient overlay on bottom of artwork */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Play / Pause button overlay */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayTrack(track);
                  }}
                  aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  className={`absolute right-2 bottom-2 w-9 h-9 rounded-full flex items-center justify-center transition shadow-lg ${
                    isThisPlaying
                      ? 'bg-[#ff5500] text-white scale-100'
                      : 'bg-black/75 hover:bg-[#ff5500] text-white opacity-90 group-hover:scale-105'
                  }`}
                >
                  {isThisPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white translate-x-[1px]" />
                  )}
                </button>

                {/* Active audio visualizer indicator */}
                {isThisPlaying && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs flex items-center gap-[2px]">
                    <span className="w-[2px] h-3 bg-[#ff5500] animate-wave" style={{ animationDelay: '0ms' }} />
                    <span className="w-[2px] h-4 bg-[#ff5500] animate-wave" style={{ animationDelay: '200ms' }} />
                    <span className="w-[2px] h-2 bg-[#ff5500] animate-wave" style={{ animationDelay: '400ms' }} />
                  </div>
                )}
              </div>

              {/* Title & Artist info */}
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13px] font-semibold text-white truncate tracking-tight group-hover:text-[#ff5500] transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>

                {/* Like button */}
                <button
                  type="button"
                  onClick={(e) => onToggleLike(track.id, e)}
                  aria-label={track.isLiked ? 'Unlike' : 'Like'}
                  className="p-1 rounded text-neutral-400 hover:text-white transition shrink-0"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
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
