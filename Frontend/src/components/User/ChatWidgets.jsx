import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Plus, Trash2, Edit3, ShoppingCart, Paperclip,
  TrendingUp, Tag, Package, BarChart2, ChevronRight,
  Sparkles, Clock, MessageSquare, ArrowUpRight, Zap
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const pastChats = [
  { id: 1, text: 'How can I save more on groceries?', time: '10:30 AM', active: true },
  { id: 2, text: 'Analyze my spending this month', time: 'Yesterday', active: false },
  { id: 3, text: 'Best time to buy electronics?', time: '2 days ago', active: false },
  { id: 4, text: 'Show my top spending categories', time: '3 days ago', active: false },
  { id: 5, text: 'Tips to stick to my budget', time: '4 days ago', active: false },
];

const quickTopics = [
  { icon: BarChart2, color: '#3B82F6', bg: '#EFF6FF', label: 'Spending Analysis', sub: 'Analyze my spending patterns' },
  { icon: Tag, color: '#10B981', bg: '#D1FAE5', label: 'Saving Tips', sub: 'Get personalized saving tips' },
  { icon: Package, color: '#F59E0B', bg: '#FEF3C7', label: 'Product Recommendations', sub: 'Find best products for you' },
  { icon: TrendingUp, color: '#8B5CF6', bg: '#EDE9FE', label: 'Price Comparison', sub: 'Compare prices across stores' },
];

const tipsCards = [
  {
    icon: ShoppingCart,
    color: '#10B981',
    bg: '#D1FAE5',
    title: 'Buy In Bulk',
    body: 'You can save up to ₹642/month by buying items like rice, dal, oil and atta in bulk.',
  },
  {
    icon: Tag,
    color: '#3B82F6',
    bg: '#DBEAFE',
    title: 'Compare Prices',
    body: 'You can save more by comparing prices across stores. I found 18 items cheaper on Blinkit and Zepto.',
  },
  {
    icon: Trash2,
    color: '#EF4444',
    bg: '#FEE2E2',
    title: 'Avoid Wastage',
    body: 'You waste around ₹356/month on expiring items. Check your pantry before buying.',
  },
];

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    content: "Hi Shubham! 👋\nI'm your AI shopping assistant. How can I help you today?",
    time: '10:30 AM',
    type: 'text',
  },
  {
    id: 2,
    role: 'user',
    content: 'How can I save more on groceries?',
    time: '10:30 AM',
    type: 'text',
  },
  {
    id: 3,
    role: 'ai',
    content: 'Great question! Here are some personalized tips to help you save more on groceries based on your spending pattern:',
    time: '10:30 AM',
    type: 'tips',
    footer: 'Would you like me to create a detailed savings plan for you?',
  },
];

// ─── Chat History Panel ───────────────────────────────────────────────────────

export function ChatHistoryPanel({ activeId, onSelect, onNewChat, onClear }) {
  return (
    <div style={{
      width: 220,
      flexShrink: 0,
      background: '#FFFFFF',
      borderRight: '1px solid #F1F5F9',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Your Chats</span>
        <button
          onClick={onNewChat}
          style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #E2E8F0', background: '#FAFCFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Edit3 size={13} color="#64748B" />
        </button>
      </div>

      {/* Chat List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        {pastChats.map(chat => (
          <div
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              marginBottom: 4,
              background: activeId === chat.id ? '#F0FDF4' : 'transparent',
              cursor: 'pointer',
              transition: 'background 0.15s',
              border: activeId === chat.id ? '1px solid #D1FAE5' : '1px solid transparent',
            }}
            onMouseEnter={e => { if (activeId !== chat.id) e.currentTarget.style.background = '#F8FAFC'; }}
            onMouseLeave={e => { if (activeId !== chat.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Clock size={13} color={activeId === chat.id ? '#154539' : '#94A3B8'} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  color: activeId === chat.id ? '#154539' : '#334155',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {chat.text}
                </div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>{chat.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clear */}
      <div style={{ padding: '16px 16px 24px' }}>
        <button
          onClick={onClear}
          style={{
            width: '100%', padding: '9px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            border: '1px solid #E2E8F0', borderRadius: 10,
            background: '#FFF', fontSize: 12, fontWeight: 600,
            color: '#64748B', cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
          onMouseLeave={e => e.currentTarget.style.background = '#FFF'}
        >
          <Trash2 size={13} color="#EF4444" /> Clear all chats
        </button>
      </div>
    </div>
  );
}

// ─── Message Bubbles ──────────────────────────────────────────────────────────

function AiMessage({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}
    >
      {/* AI Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'linear-gradient(135deg, #154539, #10B981)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Sparkles size={16} color="#FFF" />
      </div>

      <div style={{ flex: 1, maxWidth: '80%' }}>
        {msg.type === 'text' && (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #F1F5F9',
            borderRadius: '4px 16px 16px 16px',
            padding: '14px 18px',
            fontSize: 14, color: '#0F172A', lineHeight: 1.6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            whiteSpace: 'pre-line',
          }}>
            {msg.content}
          </div>
        )}

        {msg.type === 'tips' && (
          <div>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #F1F5F9',
              borderRadius: '4px 16px 16px 16px',
              padding: '14px 18px',
              fontSize: 14, color: '#0F172A', lineHeight: 1.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              marginBottom: 12,
            }}>
              {msg.content}
            </div>

            {/* Tip cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
              {tipsCards.map((tip, i) => (
                <div key={i} style={{
                  background: '#FFFFFF',
                  border: '1px solid #F1F5F9',
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: tip.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <tip.icon size={17} color={tip.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>{tip.title}</div>
                    <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{tip.body}</div>
                  </div>
                </div>
              ))}
            </div>

            {msg.footer && (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #F1F5F9',
                borderRadius: '16px 16px 16px 4px',
                padding: '14px 18px',
                fontSize: 14, color: '#0F172A', lineHeight: 1.6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                {msg.footer}
              </div>
            )}
          </div>
        )}

        <div style={{ fontSize: 10, color: '#CBD5E1', marginTop: 6, paddingLeft: 4 }}>{msg.time}</div>
      </div>
    </motion.div>
  );
}

function UserMessage({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24, justifyContent: 'flex-end' }}
    >
      <div style={{ maxWidth: '65%', textAlign: 'right' }}>
        <div style={{
          background: 'linear-gradient(135deg, #154539, #0F3028)',
          borderRadius: '16px 4px 16px 16px',
          padding: '13px 18px',
          fontSize: 14, color: '#FFFFFF', lineHeight: 1.6,
          boxShadow: '0 4px 14px rgba(21,69,57,0.25)',
          display: 'inline-block',
          textAlign: 'left',
        }}>
          {msg.content}
        </div>
        <div style={{ fontSize: 10, color: '#CBD5E1', marginTop: 6, paddingRight: 4, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          {msg.time} ✓✓
        </div>
      </div>

      {/* User avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: '#E2E8F0', overflow: 'hidden', flexShrink: 0,
      }}>
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubham"
          alt="User"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </motion.div>
  );
}

// ─── Main Chat Area ───────────────────────────────────────────────────────────

export function ChatMainArea() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), role: 'user', content: trimmed, time: now, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: `I've analyzed your query about "${trimmed}". Based on your spending patterns, I can see opportunities to optimize your shopping habits. Would you like me to go deeper into any specific area?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1800);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 20px' }}>
        {messages.map(msg =>
          msg.role === 'ai'
            ? <AiMessage key={msg.id} msg={msg} />
            : <UserMessage key={msg.id} msg={msg} />
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #154539, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={16} color="#FFF" />
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '4px 16px 16px 16px', padding: '14px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: '#154539' }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Disclaimer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#CBD5E1', fontWeight: 500, letterSpacing: 0.4, paddingBottom: 8 }}>
        AI RESPONSES MAY NOT BE 100% ACCURATE. PLEASE VERIFY IMPORTANT INFORMATION.
      </div>

      {/* Input Box */}
      <div style={{ padding: '0 40px 32px' }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '16px 20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask me anything about your shopping..."
            style={{
              width: '100%', border: 'none', outline: 'none',
              fontSize: 14, color: '#0F172A', background: 'transparent',
              fontFamily: "'Inter', sans-serif", marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #F1F5F9', background: '#FAFCFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Paperclip size={15} color="#64748B" />
              </button>
              <button style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #F1F5F9', background: '#FAFCFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ShoppingCart size={15} color="#64748B" />
              </button>
            </div>
            <button
              onClick={handleSend}
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: input.trim() ? 'linear-gradient(135deg, #154539, #10B981)' : '#E2E8F0',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s',
              }}
            >
              <Send size={16} color={input.trim() ? '#FFF' : '#94A3B8'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

export function ChatRightPanel() {
  return (
    <div style={{
      width: 280,
      flexShrink: 0,
      background: '#FFFFFF',
      borderLeft: '1px solid #F1F5F9',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
      padding: '28px 20px',
    }}>

      {/* AI Insights Card */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>AI Insights For You</span>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', borderRadius: 14, padding: '16px', border: '1px solid #D1FAE5', marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#10B981', letterSpacing: 1, marginBottom: 6 }}>POTENTIAL SAVINGS</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>₹1,284</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#10B981', borderRadius: 8, padding: '4px 8px' }}>
              <TrendingUp size={12} color="#FFF" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#FFF' }}>this month</span>
            </div>
          </div>
        </div>

        {/* Insight rows */}
        {[
          { icon: ShoppingCart, color: '#154539', bg: '#F0FDF4', label: 'Groceries', sub: 'Top spending (40.8%)' },
          { icon: Trash2, color: '#EF4444', bg: '#FEF2F2', label: '₹356 Wasted', sub: 'On expiring items' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i === 0 ? '1px solid #F1F5F9' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={15} color={item.color} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{item.sub}</div>
              </div>
            </div>
            <ChevronRight size={14} color="#CBD5E1" />
          </div>
        ))}

        <button style={{ width: '100%', marginTop: 14, padding: '9px 0', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          View All Insights <ArrowUpRight size={12} />
        </button>
      </div>

      {/* Ask me about */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Ask me about</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {quickTopics.map((topic, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderRadius: 12, border: '1px solid #F1F5F9', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
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

// ─── Top Bar ──────────────────────────────────────────────────────────────────

export function ChatTopBar({ onNewChat }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 32px',
      background: '#FFFFFF',
      borderBottom: '1px solid #F1F5F9',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Chat AI</h1>
        <Zap size={18} color="#F59E0B" fill="#F59E0B" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onNewChat}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 16px', borderRadius: 10,
            border: '1px solid #E2E8F0', background: '#FFFFFF',
            fontSize: 13, fontWeight: 600, color: '#334155',
            cursor: 'pointer',
          }}
        >
          <Plus size={14} /> New Chat
        </button>
        <button style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
          <MessageSquare size={18} color="#334155" />
          <div style={{ position: 'absolute', top: -2, right: -2, background: '#154539', color: '#FFF', fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FAFCFC' }}>3</div>
        </button>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubham" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  );
}
