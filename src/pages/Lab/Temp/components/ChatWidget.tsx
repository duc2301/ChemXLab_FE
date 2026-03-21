import { MessageCircle, Minus, Send, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { MessageHistory } from '../../../../entities/Chatbot';
import { createSession, getConversationHistory, sendMessage } from '../../../../features/Chatbot';
import ChatMessage from '../../../Chatbot/components/ChatMessage';

const STORAGE_KEY = 'lab_chat_session_id';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<MessageHistory[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isUnread, setIsUnread] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      const savedSessionId = localStorage.getItem(STORAGE_KEY);
      if (savedSessionId) {
        const history = await getConversationHistory(savedSessionId);
        if (history && history.messages) {
          setSessionId(savedSessionId);
          setMessages(history.messages);
        } else {
          // If the session is invalid or deleted (404), purge it so a new one can be created
          localStorage.removeItem(STORAGE_KEY);
          setSessionId(null);
        }
      }
    };
    initSession();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input when open
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleOpen = async () => {
    setIsOpen(true);
    setIsMinimized(false);
    setIsUnread(false);

    // If no session exists, create one upon opening
    if (!sessionId && messages.length === 0) {
      setIsLoading(true);
      const newSession = await createSession('Hỗ trợ Phòng Thí Nghiệm');
      if (newSession) {
        setSessionId(newSession.sessionId);
        localStorage.setItem(STORAGE_KEY, newSession.sessionId);

        // Initial AI greeting (locally simulated for better UX)
        const greeting: MessageHistory = {
          role: 'assistant',
          content: 'Xin chào! Tôi là Trợ lý Hoá Học ảo. Bạn có câu hỏi nào về các hóa chất hoặc phản ứng trong phòng thí nghiệm này không?',
          toolsUsed: [],
          timestamp: new Date().toISOString()
        };
        setMessages([greeting]);
      }
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      // Create session fallback
      const newSession = await createSession(inputValue.slice(0, 50));
      if (!newSession) return;
      currentSessionId = newSession.sessionId;
      setSessionId(currentSessionId);
      localStorage.setItem(STORAGE_KEY, currentSessionId);
    }

    const userMsg = inputValue.trim();
    setInputValue('');

    const userHistory: MessageHistory = {
      role: 'user',
      content: userMsg,
      toolsUsed: [],
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userHistory]);
    setIsLoading(true);

    const response = await sendMessage(currentSessionId, userMsg);
    setIsLoading(false);

    if (response) {
      const aiResponse: MessageHistory = {
        role: 'assistant',
        content: response.response,
        toolsUsed: response.toolsUsed,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      if (!isOpen || isMinimized) {
        setIsUnread(true);
      }
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // RENDER FLOATING ACTION BUTTON
  // ────────────────────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-500">
        <button
          onClick={handleOpen}
          className="relative group w-14 h-14 bg-gradient-to-r from-[#04306E] to-[#3398DB] rounded-full shadow-[0_8px_20px_rgba(4,48,110,0.3)] flex items-center justify-center hover:scale-110 transition-all duration-300"
        >
          {isUnread && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
            </span>
          )}
          <MessageCircle className="text-white w-6 h-6 group-hover:animate-pulse" />
        </button>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // RENDER CHAT WINDOW
  // ────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed bottom-5 right-5 z-[100] w-[320px] sm:w-[340px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(4,48,110,0.15)] border border-[#E2E8F0] overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? 'h-[56px]' : 'h-[460px] max-h-[75vh]'} animate-in fade-in slide-in-from-bottom-5`}
    >
      {/* Header */}
      <div
        className="h-14 bg-gradient-to-r from-[#04306E] to-[#3398DB] px-4 flex items-center justify-between cursor-pointer flex-shrink-0"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="font-space font-bold text-white text-[14px] tracking-wide">ChemXLab AI</h3>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors hover:text-red-100"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body Area */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar px-3 py-4 flex flex-col text-[14px]">
            {messages.length === 0 && !isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 opacity-70">
                <MessageCircle size={40} className="text-[#94A3B8] mb-3" strokeWidth={1.5} />
                <p className="font-inter font-medium text-[#64748B] text-sm leading-relaxed">
                  Bắt đầu cuộc hội thoại để nhận trợ giúp về thí nghiệm hoá học.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className="mb-3 transform-gpu">
                <ChatMessage message={msg} />
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 py-2 px-1 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#438BC4] to-[#2A6BA6] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 pt-1.5 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-[#3398DB] rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={scrollRef} className="h-2" />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-[#E2E8F0] flex-shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
                className="w-full bg-[#F1F5F9] border border-transparent rounded-full pl-4 pr-12 py-3 text-[14px] font-inter text-[#04306E] focus:bg-white focus:border-[#3398DB]/40 focus:ring-4 focus:ring-[#3398DB]/10 outline-none transition-all placeholder:text-[#94A3B8]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-1.5 flex items-center justify-center w-9 h-9 bg-gradient-to-r from-[#04306E] to-[#3398DB] rounded-full text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
