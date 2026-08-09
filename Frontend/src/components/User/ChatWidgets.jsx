import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Plus, Trash2, Edit3, ShoppingCart, Paperclip,
  TrendingUp, Tag, Package, BarChart2,
  Sparkles, Clock, MessageSquare, ArrowUpRight, Zap, AlertCircle
} from 'lucide-react';

// ─── Auth Helpers ──────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('shopsense_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Static Data ───────────────────────────────────────────────────────────────
const quickTopics = [
  { icon: BarChart2, color: '#3B82F6', bg: '#EFF6FF', label: 'Spending Analysis', sub: 'Analyze my spending patterns', prompt: 'Give me a detailed analysis of my spending patterns.' },
  { icon: Tag, color: '#10B981', bg: '#D1FAE5', label: 'Saving Tips', sub: 'Get personalized saving tips', prompt: 'What are personalized saving tips based on my purchase history?' },
  { icon: Package, color: '#F59E0B', bg: '#FEF3C7', label: 'Pantry Status', sub: 'Check what I need to restock', prompt: 'What items am I running low on in my pantry?' },
  { icon: TrendingUp, color: '#8B5CF6', bg: '#EDE9FE', label: 'Price Comparison', sub: 'Compare prices across stores', prompt: 'Compare prices of my most bought items across different stores.' },
];

// ─── Chat History Panel ────────────────────────────────────────────────────────
export function ChatHistoryPanel({ activeId, onSelect, onNewChat, onClear }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/history`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setChats(data.chats || []);
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);
  useEffect(() => { fetchHistory(); }, [activeId, fetchHistory]);

  const handleClear = async () => {
    try {
      await fetch(`${API_BASE}/chat/history`, { method: 'DELETE', headers: getAuthHeaders() });
      setChats([]);
      onClear();
    } catch (_) {}
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const diff = Date.now() - d;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 172800000) return 'Yesterday';
    return `${Math.floor(diff / 86400000)} days ago`;
  };

  return (
    <div style={{ width: 220, flexShrink: 0, background: '#FFFFFF', borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Your Chats</span>
        <button onClick={onNewChat} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #E2E8F0', background: '#FAFCFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Edit3 size={13} color="#64748B" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} style={{ height: 52, background: '#F8FAFC', borderRadius: 10, marginBottom: 4 }} />)
        ) : chats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 12px', fontSize: 11, color: '#CBD5E1' }}>No chats yet. Start a conversation!</div>
        ) : (
          chats.map(chat => (
            <div key={chat._id} onClick={() => onSelect(chat._id)}
              style={{ padding: '10px 12px', borderRadius: 10, marginBottom: 4, background: activeId === chat._id ? '#F0FDF4' : 'transparent', cursor: 'pointer', transition: 'background 0.15s', border: activeId === chat._id ? '1px solid #D1FAE5' : '1px solid transparent' }}
              onMouseEnter={e => { if (activeId !== chat._id) e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={e => { if (activeId !== chat._id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Clock size={13} color={activeId === chat._id ? '#154539' : '#94A3B8'} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: activeId === chat._id ? '#154539' : '#334155', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {chat.title}
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>{formatTime(chat.updatedAt)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '16px 16px 24px' }}>
        <button onClick={handleClear}
          style={{ width: '100%', padding: '9px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: '1px solid #E2E8F0', borderRadius: 10, background: '#FFF', fontSize: 12, fontWeight: 600, color: '#64748B', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
          onMouseLeave={e => e.currentTarget.style.background = '#FFF'}
        >
          <Trash2 size={13} color="#EF4444" /> Clear all chats
        </button>
      </div>
    </div>
  );
}

// ─── Message Bubbles ───────────────────────────────────────────────────────────
function AiMessage({ msg }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #154539, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Sparkles size={16} color="#FFF" />
      </div>
      <div style={{ flex: 1, maxWidth: '80%' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', fontSize: 14, color: '#0F172A', lineHeight: 1.7, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', whiteSpace: 'pre-wrap' }}>
          {msg.content}
        </div>
        <div style={{ fontSize: 10, color: '#CBD5E1', marginTop: 6, paddingLeft: 4 }}>{msg.time}</div>
      </div>
    </motion.div>
  );
}

function UserMessage({ msg }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24, justifyContent: 'flex-end' }}>
      <div style={{ maxWidth: '65%', textAlign: 'right' }}>
        <div style={{ background: 'linear-gradient(135deg, #154539, #0F3028)', borderRadius: '16px 4px 16px 16px', padding: '13px 18px', fontSize: 14, color: '#FFFFFF', lineHeight: 1.6, boxShadow: '0 4px 14px rgba(21,69,57,0.25)', display: 'inline-block', textAlign: 'left' }}>
          {msg.content}
        </div>
        <div style={{ fontSize: 10, color: '#CBD5E1', marginTop: 6, paddingRight: 4, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>{msg.time} ✓✓</div>
      </div>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubham" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </motion.div>
  );
}

// ─── Main Chat Area ────────────────────────────────────────────────────────────
export function ChatMainArea({ activeChatId, onChatCreated, pendingPrompt, onPromptConsumed }) {
  const [messages, setMessages] = useState([{
    id: 'welcome', role: 'ai',
    content: "Hi! 👋 I'm your ShopSense AI shopping assistant.\nAsk me about your spending, pantry items, or shopping tips!",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  // Load existing chat when selected from history sidebar
  useEffect(() => {
    if (!activeChatId) {
      setMessages([{ id: 'welcome', role: 'ai', content: "Hi! 👋 I'm your ShopSense AI shopping assistant.\nAsk me about your spending, pantry items, or shopping tips!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setCurrentChatId(null);
      setError(null);
      return;
    }
    const loadChat = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/${activeChatId}`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (!data.success) return;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(data.chat.messages.map((m, i) => ({
          id: i, role: m.role === 'assistant' ? 'ai' : 'user', content: m.content,
          time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : now,
        })));
        setCurrentChatId(activeChatId);
        setError(null);
      } catch (_) { setError('Failed to load conversation.'); }
    };
    loadChat();
  }, [activeChatId]);

  // Consume pending prompt from quick topic clicks
  useEffect(() => {
    if (pendingPrompt) { sendMessage(pendingPrompt); onPromptConsumed?.(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: trimmed, time: now }]);
    setInput('');
    setIsTyping(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST', headers: getAuthHeaders(),
        body: JSON.stringify({ message: trimmed, chatId: currentChatId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');
      if (data.chatId && data.chatId !== currentChatId) {
        setCurrentChatId(data.chatId);
        onChatCreated?.(data.chatId);
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 20px' }}>
        {messages.map(msg => msg.role === 'ai' ? <AiMessage key={msg.id} msg={msg} /> : <UserMessage key={msg.id} msg={msg} />)}

        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #154539, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={16} color="#FFF" />
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '4px 16px 16px 16px', padding: '14px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#154539' }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626', fontSize: 13, marginBottom: 16 }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />{error}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div style={{ textAlign: 'center', fontSize: 10, color: '#CBD5E1', fontWeight: 500, letterSpacing: 0.4, paddingBottom: 8 }}>
        AI RESPONSES MAY NOT BE 100% ACCURATE. PLEASE VERIFY IMPORTANT INFORMATION.
      </div>

      <div style={{ padding: '0 40px 32px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '16px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder="Ask me anything about your shopping..." disabled={isTyping}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: '#0F172A', background: 'transparent', fontFamily: "'Inter', sans-serif", marginBottom: 12, opacity: isTyping ? 0.5 : 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #F1F5F9', background: '#FAFCFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Paperclip size={15} color="#64748B" />
              </button>
              <button style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #F1F5F9', background: '#FAFCFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ShoppingCart size={15} color="#64748B" />
              </button>
            </div>
            <button onClick={() => sendMessage()} disabled={!input.trim() || isTyping}
              style={{ width: 38, height: 38, borderRadius: 10, background: input.trim() && !isTyping ? 'linear-gradient(135deg, #154539, #10B981)' : '#E2E8F0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isTyping ? 'pointer' : 'default', transition: 'background 0.2s' }}>
              <Send size={16} color={input.trim() && !isTyping ? '#FFF' : '#94A3B8'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel ───────────────────────────────────────────────────────────────
export function ChatRightPanel({ onTopicSelect }) {
  return (
    <div style={{ width: 280, flexShrink: 0, background: '#FFFFFF', borderLeft: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, overflowY: 'auto', padding: '28px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>AI Insights For You</span>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', borderRadius: 14, padding: '16px', border: '1px solid #D1FAE5', marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#10B981', letterSpacing: 1, marginBottom: 6 }}>POWERED BY GEMINI AI</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.5 }}>
            Ask me about your spending, pantry stock, or how to save more on groceries!
          </div>
        </div>
        <button onClick={() => onTopicSelect?.('Give me a full summary of my shopping insights.')}
          style={{ width: '100%', marginTop: 14, padding: '9px 0', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          View All Insights <ArrowUpRight size={12} />
        </button>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Ask me about</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {quickTopics.map((topic, i) => (
            <div key={i} onClick={() => onTopicSelect?.(topic.prompt)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: '1px solid #F1F5F9', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#F1F5F9'; }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: topic.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <topic.icon size={15} color={topic.color} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{topic.label}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{topic.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Top Bar ───────────────────────────────────────────────────────────────────
export function ChatTopBar({ onNewChat }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', background: '#FFFFFF', borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Chat AI</h1>
        <Zap size={18} color="#F59E0B" fill="#F59E0B" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onNewChat} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          <Plus size={14} /> New Chat
        </button>
        <button style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <MessageSquare size={18} color="#334155" />
        </button>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubham" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  );
}
