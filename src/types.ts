export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: number; // in seconds
  likesCount: number;
  playsCount: number;
  commentsCount: number;
  isLiked: boolean;
  genre: string;
  audioTempo: number; // BPM for synthetic playback
  audioKey: string;
  releaseDate?: string;
  waveform: number[]; // Array of 0-100 amplitudes
}

export type TabType = 'home' | 'feed' | 'search' | 'likes' | 'upgrade';

export interface CommentMarker {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeOffset: number; // in seconds
}

export interface NotificationItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  trackTitle?: string;
  timeAgo: string;
  read: boolean;
}

export interface MessageItem {
  id: string;
  user: string;
  avatar: string;
  lastMessage: string;
  timeAgo: string;
  unread: boolean;
  verified?: boolean;
}
