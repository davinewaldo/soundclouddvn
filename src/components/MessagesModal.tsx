import React, { useState } from 'react';
import { X, Mail, Send, CheckCheck } from 'lucide-react';
import { MessageItem } from '../types';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MessageItem[];
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  onClose,
  messages,
}) => {
  const [activeChat, setActiveChat] = useState<MessageItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, { sender: string; text: string; time: string }[]>>({
    'msg-1': [
      { sender: 'them', text: 'Yo! Thanks for bumping the new track. Remixed stems dropping soon.', time: '35m ago' },
    ],
    'msg-2': [
      { sender: 'them', text: 'Collab session next Thursday? Let us know if you want to hop on the lineup.', time: '3h ago' },
    ],
    'msg-3': [
      { sender: 'them', text: 'Appreciate the love on hipdut bb fam! 🙏', time: 'Yesterday' },
    ],
  });

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;
    const history = chatHistory[activeChat.id] || [];
    setChatHistory({
      ...chatHistory,
      [activeChat.id]: [
        ...history,
        { sender: 'me', text: replyText.trim(), time: 'Just now' },
      ],
    });
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#181818] border border-white/[0.1] rounded-t-2xl sm:rounded-2xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#ff5500]" />
            <h3 className="text-base font-bold text-white">
              {activeChat ? activeChat.user : 'Direct Messages'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {activeChat && (
              <button
                onClick={() => setActiveChat(null)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1"
              >
                All Messages
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

        {/* Content area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(chatHistory[activeChat.id] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'me' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-[#ff5500] text-white rounded-br-none'
                        : 'bg-[#252525] text-neutral-200 rounded-bl-none border border-white/[0.06]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 px-1 flex items-center gap-1">
                    {msg.time}
                    {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-[#ff5500]" />}
                  </span>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="p-3 bg-[#141414] border-t border-white/[0.08] flex items-center gap-2"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Message ${activeChat.user}...`}
                className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500]"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="w-8 h-8 rounded-full bg-[#ff5500] disabled:opacity-40 text-white flex items-center justify-center transition shrink-0 active:scale-90"
              >
                <Send className="w-4 h-4 translate-x-[1px]" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setActiveChat(msg)}
                role="button"
                tabIndex={0}
                className="p-3 rounded-xl bg-[#202020] hover:bg-[#252525] border border-white/[0.05] flex items-center gap-3 cursor-pointer transition"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-lg shrink-0 border border-white/[0.06]">
                  {msg.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{msg.user}</span>
                      {msg.verified && (
                        <span className="text-[10px] text-[#ff5500]">★</span>
                      )}
                    </h4>
                    <span className="text-[10px] text-neutral-500">{msg.timeAgo}</span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {msg.lastMessage}
                  </p>
                </div>
                {msg.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#ff5500] shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
