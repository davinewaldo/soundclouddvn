import React, { useState } from 'react';
import {
  ChevronDown,
  Heart,
  Share2,
  Shuffle,
  Repeat,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  MessageSquare,
  ListMusic,
} from 'lucide-react';
import { Track } from '../types';
import { MOCK_COMMENTS } from '../data/mockTracks';

interface FullPlayerModalProps {
  isOpen: boolean;
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onClose: () => void;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onToggleLike: (trackId: string, e: React.MouseEvent) => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenQueue: () => void;
}

export const FullPlayerModal: React.FC<FullPlayerModalProps> = ({
  isOpen,
  track,
  isPlaying,
  currentTime,
  duration,
  onClose,
  onTogglePlay,
  onSeek,
  onToggleLike,
  onNext,
  onPrev,
  onOpenQueue,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [showComments, setShowComments] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      user: 'You',
      avatar: '🎧',
      text: newCommentText.trim(),
      timeOffset: Math.floor(currentTime),
    };
    setComments([...comments, newComment]);
    setNewCommentText('');
  };

  const activeCommentsAtTime = comments.filter(
    (c) => Math.abs(c.timeOffset - currentTime) < 4
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col justify-between max-w-md mx-auto overflow-y-auto no-scrollbar animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={onClose}
          type="button"
          aria-label="Collapse player"
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-90"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
            PLAYING FROM SOUNDCLOUD
          </span>
          <span className="text-xs font-semibold text-white tracking-tight">
            {track.genre}
          </span>
        </div>

        <button
          onClick={onOpenQueue}
          type="button"
          aria-label="Queue"
          className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-90"
        >
          <ListMusic className="w-5 h-5" />
        </button>
      </div>

      {/* Main Track Display */}
      <div className="flex-1 flex flex-col justify-center px-6 py-2">
        {/* Cover Artwork */}
        <div className="relative aspect-square w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/[0.1] bg-neutral-900 mb-6 group">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Realtime comment popup badge over artwork */}
          {showComments && activeCommentsAtTime.length > 0 && (
            <div className="absolute top-4 left-4 right-4 bg-black/85 backdrop-blur-md rounded-xl p-2.5 border border-[#ff5500]/40 shadow-xl animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <span className="text-base">{activeCommentsAtTime[0].avatar}</span>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-[#ff5500] block truncate">
                    @{activeCommentsAtTime[0].user}
                  </span>
                  <p className="text-xs text-white leading-snug truncate">
                    {activeCommentsAtTime[0].text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Title, Artist & Like */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-[20px] font-extrabold text-white tracking-tight truncate leading-tight">
              {track.title}
            </h2>
            <p className="text-sm font-medium text-neutral-400 truncate mt-0.5">
              {track.artist}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => onToggleLike(track.id, e)}
              type="button"
              aria-label={track.isLiked ? 'Unlike' : 'Like'}
              className="w-11 h-11 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition active:scale-90"
            >
              <Heart
                className={`w-6 h-6 ${
                  track.isLiked
                    ? 'fill-[#ff5500] text-[#ff5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]'
                    : 'text-neutral-400'
                }`}
              />
            </button>
            <button
              type="button"
              aria-label="Share track"
              className="w-11 h-11 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition active:scale-90"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Classic SoundCloud Signature Interactive Waveform */}
        <div className="my-2">
          <div
            onClick={handleWaveformClick}
            className="relative h-16 w-full cursor-pointer flex items-end gap-[2px] py-1 select-none group"
            role="slider"
            aria-label="Seek position in track"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            tabIndex={0}
          >
            {track.waveform.map((height, idx) => {
              const barRatio = idx / track.waveform.length;
              const currentRatio = duration > 0 ? currentTime / duration : 0;
              const isPlayed = barRatio <= currentRatio;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col justify-end h-full relative"
                >
                  <span
                    className={`w-full rounded-full transition-colors ${
                      isPlayed
                        ? 'bg-[#ff5500]'
                        : 'bg-neutral-600/70 group-hover:bg-neutral-500'
                    }`}
                    style={{
                      height: `${Math.max(12, height)}%`,
                    }}
                  />
                </div>
              );
            })}

            {/* Comment dots along waveform timeline */}
            {comments.map((c) => {
              const dotPos = duration > 0 ? (c.timeOffset / duration) * 100 : 0;
              return (
                <div
                  key={c.id}
                  title={`${c.user}: ${c.text}`}
                  className="absolute bottom-0 w-2.5 h-2.5 rounded-full bg-white border border-neutral-900 -translate-x-1/2 cursor-pointer shadow-sm hover:scale-125 transition-transform"
                  style={{ left: `${dotPos}%` }}
                />
              );
            })}
          </div>

          {/* Time indicators */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 tabular-nums px-0.5 mt-1">
            <span className="text-[#ff5500]">{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls: Shuffle, Prev, Play, Next, Repeat */}
        <div className="flex items-center justify-between px-2 mt-4 mb-2">
          {/* Shuffle */}
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            type="button"
            aria-label="Toggle shuffle"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition active:scale-90 ${
              isShuffle ? 'text-[#ff5500]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous */}
          <button
            onClick={onPrev}
            type="button"
            aria-label="Previous track"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-[#ff5500] transition active:scale-90"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          {/* Big Play / Pause */}
          <button
            onClick={onTogglePlay}
            type="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-18 h-18 rounded-full bg-[#ff5500] hover:bg-[#ff661a] active:scale-95 text-white flex items-center justify-center shadow-xl shadow-[#ff5500]/40 transition"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white" />
            ) : (
              <Play className="w-8 h-8 fill-white translate-x-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            type="button"
            aria-label="Next track"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-[#ff5500] transition active:scale-90"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={() => {
              setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
            }}
            type="button"
            aria-label="Toggle repeat"
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition active:scale-90 ${
              repeatMode !== 'off' ? 'text-[#ff5500]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Repeat className="w-5 h-5" />
            {repeatMode === 'one' && (
              <span className="absolute top-2 right-2 text-[9px] font-bold">1</span>
            )}
          </button>
        </div>

        {/* Comment input field */}
        <form onSubmit={handleAddComment} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={`Write a comment at ${formatTime(currentTime)}...`}
            className="flex-1 bg-white/[0.07] border border-white/[0.1] rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500]"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-3 py-2 bg-[#ff5500] disabled:opacity-40 text-white text-xs font-bold rounded-full transition active:scale-95"
          >
            Post
          </button>
        </form>
      </div>

      {/* Bottom Volume / Comments Toggle Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.08] text-xs text-neutral-400">
        <button
          onClick={() => setIsMuted(!isMuted)}
          type="button"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="flex items-center gap-1.5 hover:text-white transition"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          <span>{isMuted ? 'Muted' : 'Volume'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          type="button"
          aria-label="Toggle comments visibility"
          className={`flex items-center gap-1.5 transition ${
            showComments ? 'text-[#ff5500]' : 'hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{comments.length} comments</span>
        </button>
      </div>
    </div>
  );
};
