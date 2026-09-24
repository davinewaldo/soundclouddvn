import React from 'react';
import { Play, Pause, Heart, Repeat, MessageCircle, Share2 } from 'lucide-react';
import { Track } from '../types';

interface FeedViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string, e: React.MouseEvent) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleLike,
}) => {
  const feedItems = [
    {
      type: 'repost',
      author: 'bosca',
      action: 'reposted a track',
      timeAgo: '2h ago',
      track: tracks.find((t) => t.id === 'track-phyerlen-mixtape') || tracks[0],
      note: 'Turn this up loud in the car!! 🔥🔥',
    },
    {
      type: 'release',
      author: 'star jp',
      action: 'posted a new single',
      timeAgo: '6h ago',
      track: tracks.find((t) => t.id === 'track-bkb-fly') || tracks[1],
      note: 'Official stream now live everywhere. Appreciate all the support!',
    },
    {
      type: 'release',
      author: 'Jakarta, Indone...',
      action: 'dropped a chill session',
      timeAgo: '1d ago',
      track: tracks.find((t) => t.id === 'track-yoga-beatmap') || tracks[2],
      note: 'Deep breathing & meditative frequencies for your week.',
    },
  ];

  return (
    <div className="px-4 pt-3 pb-32">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-white tracking-tight">The Feed</h2>
        <span className="text-xs text-neutral-400 font-medium">From artists you follow</span>
      </div>

      <div className="space-y-4">
        {feedItems.map((item, index) => {
          const track = item.track;
          const isThisPlaying = currentTrack?.id === track.id && isPlaying;

          return (
            <article
              key={index}
              className="bg-[#181818] border border-white/[0.06] rounded-2xl p-4 shadow-md"
            >
              {/* Repost Header */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                <Repeat className="w-3.5 h-3.5 text-[#ff5500]" />
                <span className="font-bold text-white">{item.author}</span>
                <span>{item.action}</span>
                <span aria-hidden="true">·</span>
                <span>{item.timeAgo}</span>
              </div>

              {/* Artist message note */}
              {item.note && (
                <p className="text-xs text-neutral-200 mb-3 bg-white/[0.03] p-2.5 rounded-lg border-l-2 border-[#ff5500]">
                  &ldquo;{item.note}&rdquo;
                </p>
              )}

              {/* Track Card embedded in feed */}
              <div
                onClick={() => onPlayTrack(track)}
                className="bg-[#202020] rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer group hover:bg-[#252525] transition"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      aria-label="Play track"
                      className="absolute inset-0 bg-black/40 flex items-center justify-center text-white group-hover:scale-105 transition"
                    >
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5 fill-[#ff5500] text-[#ff5500]" />
                      ) : (
                        <Play className="w-5 h-5 fill-white" />
                      )}
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      {track.genre}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate leading-tight group-hover:text-[#ff5500] transition">
                      {track.title}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => onToggleLike(track.id, e)}
                  aria-label={track.isLiked ? 'Unlike' : 'Like'}
                  className="p-2 rounded-full hover:bg-white/[0.08] transition shrink-0"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      track.isLiked ? 'fill-[#ff5500] text-[#ff5500]' : 'text-neutral-400'
                    }`}
                  />
                </button>
              </div>

              {/* Feed social actions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05] text-xs text-neutral-400">
                <button
                  type="button"
                  onClick={(e) => onToggleLike(track.id, e)}
                  className="flex items-center gap-1.5 hover:text-white"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      track.isLiked ? 'fill-[#ff5500] text-[#ff5500]' : 'text-neutral-400'
                    }`}
                  />
                  <span>{track.likesCount}</span>
                </button>

                <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span>{track.commentsCount}</span>
                </div>

                <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                  <Repeat className="w-4 h-4" />
                  <span>Repost</span>
                </div>

                <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
