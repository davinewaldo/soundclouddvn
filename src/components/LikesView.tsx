import React, { useState } from 'react';
import { Heart, Shuffle, Play, Pause, Search, Clock } from 'lucide-react';
import { Track } from '../types';

interface LikesViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string, e: React.MouseEvent) => void;
  onShuffleLikes: () => void;
}

export const LikesView: React.FC<LikesViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  onShuffleLikes,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const likedTracks = tracks.filter((t) => t.isLiked);

  const filteredTracks = likedTracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="px-4 pt-3 pb-32">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#2a140a] via-[#1c120c] to-[#141414] border border-[#ff5500]/25 rounded-2xl p-5 mb-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#cc4400] flex items-center justify-center shadow-lg shadow-[#ff5500]/30 shrink-0">
            <Heart className="w-9 h-9 fill-white text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5500]">
              PLAYLIST
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Your Likes
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              {likedTracks.length} tracks · Auto-synced
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/[0.08]">
          <button
            onClick={() => {
              if (likedTracks.length > 0) {
                onPlayTrack(likedTracks[0]);
              }
            }}
            type="button"
            className="flex-1 h-10 rounded-full bg-[#ff5500] hover:bg-[#ff661a] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play All</span>
          </button>

          <button
            onClick={onShuffleLikes}
            type="button"
            className="h-10 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.12] active:scale-95 text-white font-semibold text-xs flex items-center gap-2 transition"
          >
            <Shuffle className="w-4 h-4" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Search in Likes */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter liked tracks & artists..."
          className="w-full bg-[#181818] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500] transition"
        />
      </div>

      {/* Tracks List */}
      <div className="space-y-1.5">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-12 px-4 bg-[#181818] rounded-xl border border-white/[0.05]">
            <Heart className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-300">No tracks found</p>
            <p className="text-xs text-neutral-500 mt-1">
              Tap the heart icon on any track to add it to your likes!
            </p>
          </div>
        ) : (
          filteredTracks.map((track, idx) => {
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
                className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer group ${
                  isThisActive
                    ? 'bg-[#222222] border border-[#ff5500]/40'
                    : 'hover:bg-[#1c1c1c] border border-transparent'
                }`}
              >
                {/* Index / Indicator */}
                <div className="w-6 text-center text-xs font-semibold text-neutral-500 group-hover:hidden">
                  {idx + 1}
                </div>
                <div className="w-6 hidden group-hover:flex items-center justify-center">
                  {isThisPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-[#ff5500] text-[#ff5500]" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-[#ff5500] text-[#ff5500]" />
                  )}
                </div>

                {/* Cover Art */}
                <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-neutral-900 mx-2 shrink-0 border border-white/[0.06]">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {isThisPlaying && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-[#ff5500] rounded-full animate-ping" />
                    </div>
                  )}
                </div>

                {/* Track Title and Artist */}
                <div className="min-w-0 flex-1 pr-2">
                  <h4
                    className={`text-[13px] font-bold truncate tracking-tight ${
                      isThisActive ? 'text-[#ff5500]' : 'text-white group-hover:text-[#ff5500]'
                    }`}
                  >
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>

                {/* Right side: Duration + Unlike */}
                <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(track.duration)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => onToggleLike(track.id, e)}
                    aria-label="Remove from likes"
                    className="p-1.5 rounded-full hover:bg-white/[0.08] transition"
                  >
                    <Heart className="w-4 h-4 fill-[#ff5500] text-[#ff5500]" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
