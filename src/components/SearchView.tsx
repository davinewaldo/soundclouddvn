import React, { useState } from 'react';
import { Search, X, Play, Pause, Flame } from 'lucide-react';
import { Track } from '../types';

interface SearchViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
}) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const genres = [
    'All',
    'Hip-Hop',
    'Electronic',
    'Breakbeat',
    'Phonk',
    'Chill',
    'Trap',
    'Club',
  ];

  const filteredTracks = tracks.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase()) ||
      t.genre.toLowerCase().includes(query.toLowerCase());
    const matchesGenre =
      !selectedGenre || selectedGenre === 'All'
        ? true
        : t.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesQuery && matchesGenre;
  });

  return (
    <div className="px-4 pt-3 pb-32">
      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artists, tracks, remixes..."
          className="w-full bg-[#1e1e1e] border border-white/[0.1] rounded-full pl-10 pr-9 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#ff5500]"
          autoFocus={false}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Genre Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mb-4 -mx-4 px-4">
        {genres.map((g) => {
          const isSelected = selectedGenre === g || (!selectedGenre && g === 'All');
          return (
            <button
              key={g}
              onClick={() => setSelectedGenre(g === 'All' ? null : g)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-[#ff5500] text-white shadow-sm'
                  : 'bg-white/[0.06] text-neutral-300 hover:bg-white/[0.1]'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Trending Heading if no query */}
      {!query && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          <Flame className="w-3.5 h-3.5 text-[#ff5500]" />
          <span>Trending in Underground & Charts</span>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-2">
        {filteredTracks.map((track) => {
          const isThisPlaying = currentTrack?.id === track.id && isPlaying;
          const isThisActive = currentTrack?.id === track.id;

          return (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track)}
              role="button"
              tabIndex={0}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition border ${
                isThisActive
                  ? 'bg-[#222222] border-[#ff5500]/50'
                  : 'bg-[#181818] hover:bg-[#202020] border-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {isThisPlaying ? (
                      <Pause className="w-4 h-4 fill-[#ff5500] text-[#ff5500]" />
                    ) : (
                      <Play className="w-4 h-4 fill-white" />
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate tracking-tight">
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    {track.genre}
                  </span>
                </div>
              </div>

              <div className="text-right pl-2">
                <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                  {Math.floor(track.duration / 60)}:{track.duration % 60 < 10 ? '0' : ''}
                  {track.duration % 60}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
