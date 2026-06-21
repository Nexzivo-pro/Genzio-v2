import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Bot, User, Sparkles, MessageSquare, 
  Plus, Search, MoreVertical, Trash2, Edit2, Play, PanelLeftClose, PanelLeft, Paperclip, Image as ImageIcon
} from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

export default function AIChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load formatting from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('genzio_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // revive dates
        const revived = parsed.map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
        setSessions(revived);
        if (revived.length > 0) {
          setActiveSessionId(revived[0].id);
        }
      } catch (e) {
        console.error('Failed to parse chats', e);
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('genzio_chats', JSON.stringify(sessions));
    }
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, isTyping]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [
        {
          id: 'welcome',
          role: 'ai',
          content: 'I am Genzio AI, your dedicated client acquisition and cold outreach architect. How can I assist with your growth strategies today?',
          timestamp: new Date()
        }
      ],
      updatedAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(sessions.find(s => s.id !== id)?.id || null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    setInput('');
    setIsTyping(true);

    const activeIndex = sessions.findIndex(s => s.id === activeSessionId);
    if (activeIndex === -1) return;

    const currentSession = sessions[activeIndex];
    
    // Auto-rename title if it's the first real user message
    let newTitle = currentSession.title;
    if (currentSession.messages.length <= 1) {
       newTitle = userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '');
    }

    const updatedSession = {
      ...currentSession,
      title: newTitle,
      messages: [...currentSession.messages, userMessage],
      updatedAt: new Date()
    };

    const updatedSessions = [...sessions];
    updatedSessions[activeIndex] = updatedSession;
    setSessions(updatedSessions);

    try {
      const token = await user.getIdToken();
      // Prepare messages for API
      const apiMessages = updatedSession.messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) {
        throw new Error('API error');
      }
      
      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.response || 'I am sorry, I am unable to process that right now.',
        timestamp: new Date()
      };

      setSessions(prev => {
        const idx = prev.findIndex(s => s.id === activeSessionId);
        if (idx === -1) return prev;
        const s = { ...prev[idx] };
        s.messages = [...s.messages, aiMessage];
        s.updatedAt = new Date();
        const copy = [...prev];
        copy[idx] = s;
        return copy;
      });

    } catch (e: any) {
      console.error(e);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `Error: ${e.message}`,
        timestamp: new Date()
      };
      setSessions(prev => {
        const idx = prev.findIndex(s => s.id === activeSessionId);
        if (idx === -1) return prev;
        const s = { ...prev[idx] };
        s.messages = [...s.messages, errMsg];
        s.updatedAt = new Date();
        const copy = [...prev];
        copy[idx] = s;
        return copy;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden bg-[#050508] relative">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 blur-[80px] pointer-events-none rounded-full transform-gpu" />
      
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-[#0a0a0f] border-r border-white/5 flex flex-col flex-shrink-0 relative z-20"
          >
            <div className="p-4 flex flex-col gap-4 border-b border-white/5">
              <button 
                onClick={createNewSession}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/30 rounded-xl transition-all text-white font-bold group"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-neon-cyan" />
                  <span>New Chat</span>
                </div>
                <div className="w-5 h-5 rounded flex items-center justify-center bg-white/10 group-hover:bg-neon-cyan/30 text-[10px] text-gray-400 group-hover:text-neon-cyan">⌘K</div>
              </button>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050508] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:border-neon-cyan/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              <div className="text-xs font-mono text-gray-600 px-3 py-2 uppercase tracking-widest flex items-center justify-between">
                <span>Pinned Chats</span>
              </div>
              <div className="px-3 pb-2 text-xs text-gray-500 border-b border-white/5 mb-2">No pinned chats.</div>

              <div className="text-xs font-mono text-gray-600 px-3 py-2 uppercase tracking-widest mt-2">Recent Chats</div>
              {filteredSessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    activeSessionId === session.id ? 'bg-neon-cyan/10 border-neon-cyan/30' : 'hover:bg-white/5 border-transparent'
                  } border`}
                >
                  <div className="flex items-center gap-3 overflow-hidden text-ellipsis">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeSessionId === session.id ? 'text-neon-cyan' : 'text-gray-500'}`} />
                    <span 
                      onDoubleClick={(e) => { e.stopPropagation(); const newT = prompt('Rename:', session.title); if(newT) { setSessions(prev => prev.map(s => s.id === session.id ? {...s, title: newT} : s)) } }}
                      className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${activeSessionId === session.id ? 'text-white' : 'text-gray-400'}`}
                    >
                      {session.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                       onClick={(e) => { e.stopPropagation(); const newT = prompt('Rename:', session.title); if(newT) { setSessions(prev => prev.map(s => s.id === session.id ? {...s, title: newT} : s)) } }}
                       className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                     >
                       <Edit2 className="w-3.5 h-3.5" />
                     </button>
                     <button 
                       onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                       className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                     >
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative z-10 w-full min-w-0">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
            </div>
            <div>
              <h2 className="text-white font-bold leading-tight">Genzio AI</h2>
              <p className="text-[10px] text-neon-cyan font-mono tracking-widest uppercase">Specialized Outreach Assitant</p>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 space-y-8 no-scrollbar scroll-smooth">
          {activeSession?.messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex items-start gap-4 max-w-4xl mx-auto w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'ai' && (
                <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.15)]">
                  <Bot className="w-5 h-5 text-neon-cyan" />
                </div>
              )}
              
              <div 
                className={`p-4 md:p-6 rounded-2xl md:rounded-3xl text-sm md:text-[15px] leading-relaxed relative overflow-hidden group ${
                  message.role === 'user' 
                    ? 'bg-white/5 border border-white/10 text-gray-200 rounded-tr-sm shadow-inner' 
                    : 'bg-[#0a0a0f] border border-white/5 text-gray-300 rounded-tl-sm shadow-2xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-cyan/5 via-transparent to-transparent'
                }`}
              >
                {message.content}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
             <div className="flex items-start gap-4 max-w-4xl mx-auto w-full justify-start">
               <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.15)]">
                  <Bot className="w-5 h-5 text-neon-cyan" />
               </div>
               <div className="p-4 md:p-5 rounded-2xl rounded-tl-sm bg-[#0a0a0f] border border-white/5 shadow-2xl flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <div className="w-full max-w-4xl mx-auto px-4 pb-6 pt-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-3xl blur opacity-20 transition duration-1000 group-focus-within:opacity-40"></div>
            <div className="relative flex items-end gap-2 bg-[#0a0a0f] border border-white/10 focus-within:border-neon-cyan/50 rounded-3xl p-3 shadow-2xl transition-all">
              
              <div className="flex items-center gap-1 self-end pb-1.5 h-full pl-2">
                 <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <Paperclip className="w-5 h-5" />
                 </button>
                 <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all hidden sm:block">
                    <ImageIcon className="w-5 h-5" />
                 </button>
              </div>

              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Genzio AI about outreach strategy..."
                className="flex-1 max-h-48 min-h-[44px] bg-transparent border-none text-white px-3 py-3 resize-none focus:outline-none placeholder:text-gray-600 custom-scrollbar leading-relaxed"
                rows={1}
                style={{ height: "auto" }}
              />

              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3.5 mt-auto bg-white/10 hover:bg-neon-cyan text-white hover:text-black rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-white/10 disabled:hover:text-white disabled:cursor-not-allowed flex-shrink-0 shadow-[0_0_15px_rgba(0,243,255,0)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] mb-0.5 mr-0.5"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-center mt-3">
             <span className="text-[11px] text-gray-600 font-mono">Genzio AI can make mistakes. Consider verifying critical strategies.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
