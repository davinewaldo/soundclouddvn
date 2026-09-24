/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { LikesCard } from './components/LikesCard';
import { TrackGrid } from './components/TrackGrid';
import { TodaysPick } from './components/TodaysPick';
import { MoreSection } from './components/MoreSection';
import { FloatingMiniPlayer } from './components/FloatingMiniPlayer';
import { BottomNavBar } from './components/BottomNavBar';
import { FullPlayerModal } from './components/FullPlayerModal';
import { FeedView } from './components/FeedView';
import { SearchView } from './components/SearchView';
import { LikesView } from './components/LikesView';
import { UpgradeView } from './components/UpgradeView';
import { NotificationsModal } from './components/NotificationsModal';
import { MessagesModal } from './components/MessagesModal';
import { QueueModal } from './components/QueueModal';

import {
  INITIAL_TRACKS,
  MOCK_NOTIFICATIONS,
  MOCK_MESSAGES,
} from './data/mockTracks';
import { Track, TabType, NotificationItem, MessageItem } from './types';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);

  // Active playing track: initially "BKB Mandarin Fly Higher (AMA..." by "star jp" as required
  const defaultTrack = INITIAL_TRACKS.find((t) => t.id === 'track-bkb-fly') || INITIAL_TRACKS[0];
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultTrack);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(14); // small initial offset for realism
  const [duration, setDuration] = useState<number>(defaultTrack.duration);

  // Navigation tab state: 'home' | 'feed' | 'search' | 'likes' | 'upgrade'
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Modals & Sheets
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState<boolean>(false);

  // Mock data states
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [messages] = useState<MessageItem[]>(MOCK_MESSAGES);
  const [queue, setQueue] = useState<Track[]>(
    INITIAL_TRACKS.filter((t) => t.id !== defaultTrack.id)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scroll container reference to reset scroll on tab switch
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Setup audio synthesizer listener
  useEffect(() => {
    audioEngine.setOnTimeUpdate((time) => {
      setCurrentTime(time);
    });

    audioEngine.setOnEnded(() => {
      handleNextTrack();
    });

    return () => {
      audioEngine.pause();
    };
  }, [tracks, currentTrack, queue]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handlePlayTrack = (track: Track) => {
    if (currentTrack.id === track.id) {
      if (isPlaying) {
        audioEngine.pause();
        setIsPlaying(false);
      } else {
        audioEngine.resume();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setDuration(track.duration);
      setCurrentTime(0);
      setIsPlaying(true);
      audioEngine.play(track.id, track.audioTempo, track.duration, 0);

      // Reorder queue so upcoming tracks are kept fresh
      setQueue((prev) => {
        const filtered = prev.filter((t) => t.id !== track.id);
        return [...filtered, currentTrack];
      });
      showToast(`Playing: ${track.title}`);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play(currentTrack.id, currentTrack.audioTempo, currentTrack.duration, currentTime);
      setIsPlaying(true);
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  };

  const handleToggleLike = (trackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const updatedLiked = !t.isLiked;
          const updated = {
            ...t,
            isLiked: updatedLiked,
            likesCount: updatedLiked ? t.likesCount + 1 : Math.max(0, t.likesCount - 1),
          };
          if (trackId === currentTrack.id) {
            setCurrentTrack(updated);
          }
          showToast(updatedLiked ? 'Added to Your Likes' : 'Removed from Your Likes');
          return updated;
        }
        return t;
      })
    );
  };

  const handleShuffleLikes = () => {
    const liked = tracks.filter((t) => t.isLiked);
    if (liked.length === 0) {
      showToast('No liked tracks to shuffle yet!');
      return;
    }
    const randomIndex = Math.floor(Math.random() * liked.length);
    handlePlayTrack(liked[randomIndex]);
    showToast('Shuffling Your Likes 🔀');
  };

  const handleNextTrack = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      handlePlayTrack(next);
    } else {
      // Loop back to first track
      const first = tracks[0];
      handlePlayTrack(first);
    }
  };

  const handlePrevTrack = () => {
    if (currentTime > 4) {
      handleSeek(0);
    } else {
      const prev = tracks[(tracks.findIndex((t) => t.id === currentTrack.id) - 1 + tracks.length) % tracks.length];
      handlePlayTrack(prev);
    }
  };

  const handleRemoveFromQueue = (trackId: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== trackId));
    showToast('Removed from queue');
  };

  const handleClearQueue = () => {
    setQueue([]);
    showToast('Queue cleared');
  };

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = messages.filter((m) => m.unread).length;

  // Selected track for Today's Pick: "VOL.19 - BREAKS GEN-Z - PHYERLEN (MIXTAPE)"
  const todaysPickTrack =
    tracks.find((t) => t.id === 'track-phyerlen-mixtape') || tracks[1];

  return (
    <div className="min-h-screen bg-[#080808] flex justify-center text-neutral-100 font-sans selection:bg-[#ff5500] selection:text-white">
      {/* Mobile Viewport Container: centered, max-w-[430px], realistic mobile frame */}
      <main className="w-full max-w-[430px] min-h-screen bg-[#121212] relative flex flex-col shadow-2xl border-x border-white/[0.04]">
        {/* 1. Header (Sticky Top):
            - Top status bar styling (time "3.17", battery/wifi icons).
            - Left side: SoundCloud orange cloud logo next to the text "SoundCloud".
            - Right side: "Go Pro" button, Search icon, Notification bell icon, and Messages envelope icon.
        */}
        <div className="sticky top-0 z-30 bg-[#121212] border-b border-white/[0.04]">
          <StatusBar />
          <Header
            onOpenGoPro={() => handleSelectTab('upgrade')}
            onOpenSearch={() => handleSelectTab('search')}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenMessages={() => setIsMessagesOpen(true)}
            unreadNotificationsCount={unreadNotificationsCount}
            unreadMessagesCount={unreadMessagesCount}
          />
        </div>

        {/* Content Area - Scrollable */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar pb-36"
        >
          {activeTab === 'home' && (
            <div>
              {/* 2. Content Area - Top:
                  A prominent "Your Likes" card featuring a solid orange heart icon on the left,
                  "Your Likes" text, and a shuffle icon on the right.
              */}
              <LikesCard
                likesCount={tracks.filter((t) => t.isLiked).length}
                onOpenLikes={() => handleSelectTab('likes')}
                onShuffleLikes={handleShuffleLikes}
              />

              {/* 3. Content Area - Grid Section:
                  A 2x2 grid of track/artist cards with dark backgrounds:
                  * "hipdut bb" by "bosca"
                  * "Yoga BeatMap" by "Jakarta, Indone..."
                  * "LERDUT THROW..." by "LERBE PIDUT"
                  * "MMG (My Mine..." by "Slicejax"
              */}
              <TrackGrid
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onToggleLike={handleToggleLike}
              />

              {/* 4. Today's Pick Section:
                  Section header: "TODAY'S PICK" and title "Hot For You 🔥".
                  Large featured card: "VOL.19 - BREAKS GEN-Z - PHYERLEN (MIXTAPE)" by "Phyerlen Official"
                  with a prominent play button and like count text ("386 people just liked this track").
              */}
              <TodaysPick
                track={todaysPickTrack}
                isPlaying={isPlaying}
                isCurrent={currentTrack.id === todaysPickTrack.id}
                onPlay={handlePlayTrack}
                onToggleLike={handleToggleLike}
                onShare={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Link copied to clipboard!');
                }}
              />

              {/* 5. More Section:
                  Section header: "More of what you like" with a "See All" button,
                  showing a preview of additional tracks.
              */}
              <MoreSection
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onToggleLike={handleToggleLike}
                onSeeAll={() => handleSelectTab('search')}
              />
            </div>
          )}

          {activeTab === 'feed' && (
            <FeedView
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onToggleLike={handleToggleLike}
            />
          )}

          {activeTab === 'search' && (
            <SearchView
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
            />
          )}

          {activeTab === 'likes' && (
            <LikesView
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onToggleLike={handleToggleLike}
              onShuffleLikes={handleShuffleLikes}
            />
          )}

          {activeTab === 'upgrade' && (
            <UpgradeView
              onSuccess={() => {
                showToast('Welcome to SoundCloud Go+! 🎉');
              }}
            />
          )}
        </div>

        {/* 6. Floating Mini-Player:
            Positioned just above the bottom navigation bar.
            Displays currently playing track: "BKB Mandarin Fly Higher (AMA..." by "star jp".
            Controls: Pause/Play button, Queue icon, and an orange-highlighted Heart icon.
        */}
        <FloatingMiniPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={handleTogglePlay}
          onToggleLike={handleToggleLike}
          onOpenQueue={() => setIsQueueOpen(true)}
          onOpenFullPlayer={() => setIsFullPlayerOpen(true)}
        />

        {/* 7. Bottom Navigation Bar (Fixed at bottom):
            5 distinct tabs with icons and text labels:
            1. Home (Home icon)
            2. Feed (Feed/Activity icon)
            3. Search (Search icon)
            4. Likes (Solid Heart icon) <--- NOTE: Replaced standard Library with Likes tab.
            5. Upgrade (Upgrade/Star icon)
        */}
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />

        {/* Expandable Full Player Screen Modal */}
        <FullPlayerModal
          isOpen={isFullPlayerOpen}
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onClose={() => setIsFullPlayerOpen(false)}
          onTogglePlay={handleTogglePlay}
          onSeek={handleSeek}
          onToggleLike={handleToggleLike}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onOpenQueue={() => setIsQueueOpen(true)}
        />

        {/* Queue Modal */}
        <QueueModal
          isOpen={isQueueOpen}
          onClose={() => setIsQueueOpen(false)}
          queue={queue}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={handlePlayTrack}
          onRemoveFromQueue={handleRemoveFromQueue}
          onClearQueue={handleClearQueue}
        />

        {/* Notifications Modal */}
        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllRead}
        />

        {/* Messages Modal */}
        <MessagesModal
          isOpen={isMessagesOpen}
          onClose={() => setIsMessagesOpen(false)}
          messages={messages}
        />

        {/* Toast feedback pill */}
        {toastMessage && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full border border-[#ff5500]/40 shadow-xl pointer-events-none transition-all duration-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
