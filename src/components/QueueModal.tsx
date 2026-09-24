import React from 'react';
import { X, Play, Pause, Trash2, ListMusic } from 'lucide-react';
import { Track } from '../types';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onRemoveFromQueue: (trackId: string) => void;
  onClearQueue: () => void;
}

export const QueueModal: React.FC<QueueModalProps> = ({
  isOpen,
  onClose,
  queue,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onRemoveFromQueue,
  onClearQueue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#181818] border border-white/[0.1] rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#ff5500]" />
            <h3 className="text-base font-bold text-white">Playback Queue</h3>
          </div>
          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={onClearQueue}
                className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition px-2 py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-3 space-y-3 flex-1">
          {/* Now Playing Block */}
          <div>
            <span className="text-[10px] font-bold text-[#ff5500] uppercase tracking-wider px-1 mb-1 block">
              NOW PLAYING
            </span>
            <div className="p-2.5 rounded-xl bg-[#222222] border border-[#ff5500]/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">
                    {currentTrack.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5500] animate-ping mr-2" />
            </div>
          </div>

          {/* Up Next List */}
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1 mb-1.5 block">
              UP NEXT ({queue.length})
            </span>
            <div className="space-y-1">
              {queue.map((track) => (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  role="button"
                  tabIndex={0}
                  className="p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-white/[0.04] flex items-center justify-between gap-2 cursor-pointer transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#ff5500]">
                        {track.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onPlayTrack(track)}
                      className="p-1.5 rounded-full hover:bg-white/[0.1] text-neutral-300"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFromQueue(track.id)}
                      className="p-1.5 rounded-full hover:bg-white/[0.1] text-neutral-400 hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
