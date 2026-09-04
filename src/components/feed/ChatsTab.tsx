import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, CheckCircle, Search, ShieldCheck } from 'lucide-react';

export const ChatsTab: React.FC = () => {
  const { conversations, activeChatId, setActiveChatId, sendChatMessage, user } = useApp();
  const [msgText, setMsgText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const currentChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !currentChat) return;
    sendChatMessage(currentChat.id, msgText);
    setMsgText('');
  };

  const filteredConversations = conversations.filter(c =>
    c.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
      {/* Conversations List (Sidebar in Chat) */}
      <div className="border-l border-[#262626] bg-[#0D0D0D] p-3 space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="البحث في المحادثات..."
            className="w-full bg-[#141414] border border-[#262626] rounded-xl pl-3 pr-8 py-2 text-xs text-white focus:outline-none focus:border-[#E8123D]"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-[420px]">
          {filteredConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveChatId(conv.id)}
              className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center gap-3 ${
                currentChat?.id === conv.id
                  ? 'bg-[#E8123D]/10 border-[#E8123D] text-white'
                  : 'bg-[#141414] border-[#262626] text-gray-300 hover:bg-[#1f1f1f]'
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={conv.user.avatar}
                  alt={conv.user.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E8123D]"
                />
                {conv.user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-[#141414]" />
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                  <span className="truncate">{conv.user.name}</span>
                  <span className="text-[10px] text-gray-500 font-sans">{conv.timestamp}</span>
                </div>
                <p className="text-[11px] text-gray-400 truncate">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation */}
      <div className="col-span-2 flex flex-col justify-between bg-[#141414]">
        {/* Chat Header */}
        {currentChat && (
          <div className="p-3 border-b border-[#262626] bg-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentChat.user.avatar}
                alt={currentChat.user.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E8123D]"
              />
              <div>
                <h4 className="font-bold text-xs text-white flex items-center gap-1">
                  {currentChat.user.name}
                  {currentChat.user.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
                </h4>
                <span className="text-[10px] text-green-400 font-medium">متصل الآن</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 bg-[#0A0A0A] px-2.5 py-1 rounded-lg border border-[#262626] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              محادثة آمنة ومشفرة
            </div>
          </div>
        )}

        {/* Messages Body */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[380px]">
          {currentChat?.messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMine ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.isMine
                    ? 'bg-[#E8123D] text-white rounded-br-none shadow-lg'
                    : 'bg-[#1f1f1f] border border-[#262626] text-gray-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 font-sans px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-[#262626] bg-[#1a1a1a] flex gap-2">
          <input
            type="text"
            value={msgText}
            onChange={e => setMsgText(e.target.value)}
            placeholder="اكتب رسالتك للوكيل هنا..."
            className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E8123D]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#E8123D] hover:bg-[#b10e31] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
};
