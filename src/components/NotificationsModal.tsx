import React from 'react';
import { X, Bell, Heart, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#181818] border border-white/[0.1] rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#ff5500]" />
            <h3 className="text-base font-bold text-white">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-neutral-400 hover:text-white transition px-2 py-1"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                notif.read
                  ? 'bg-transparent border-transparent text-neutral-400'
                  : 'bg-[#222222] border-[#ff5500]/20 text-neutral-200'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-base shrink-0 border border-white/[0.06]">
                {notif.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-relaxed">
                  <span className="font-bold text-white">{notif.user}</span>{' '}
                  {notif.action}{' '}
                  {notif.trackTitle && (
                    <span className="font-semibold text-[#ff5500]">
                      &ldquo;{notif.trackTitle}&rdquo;
                    </span>
                  )}
                </p>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  {notif.timeAgo}
                </span>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#ff5500] shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
