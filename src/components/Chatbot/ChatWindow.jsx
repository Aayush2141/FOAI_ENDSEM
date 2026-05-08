import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';

const SUGGESTED = [
  'Where is the ISS right now?',
  "What's the ISS speed?",
  'Who is in space currently?',
  'Show me top tech news',
];

export default function ChatWindow({ messages, sendMessage, isTyping, clearChat, onClose }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="flex flex-col"
      style={{
        position: 'fixed', bottom: 90, right: 24,
        width: 380, maxWidth: 'calc(100vw - 32px)',
        height: 520, maxHeight: 'calc(100vh - 120px)',
        zIndex: 1000,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 rounded-t-[18px]"
        style={{
          background: 'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(139,92,246,0.08))',
          borderBottom: '1px solid var(--border)',
        }}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: 'var(--accent-green)' }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent-green)' }} />
          </span>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>🤖 Dashboard AI</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.button id="chat-clear" onClick={clearChat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
            className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
            🗑️ Clear
          </motion.button>
          <motion.button id="chat-close" onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
            className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '1rem' }}>
            ✕
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 items-end">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
              style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)' }}>🤖</div>
            <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px' }}>
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="w-2 h-2 rounded-full inline-block"
                  style={{ background: 'var(--accent-cyan)' }}
                  animate={{ y: [0, -7, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Suggestions:</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED.map((q) => (
              <motion.button key={q} onClick={() => sendMessage(q)}
                whileHover={{ scale: 1.04, background: 'rgba(0,212,255,0.15)' }}
                whileTap={{ scale: 0.96 }}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--accent-cyan)', cursor: 'pointer' }}>
                {q}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex gap-2">
          <textarea ref={inputRef} id="chat-input" value={input}
            onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="Ask about ISS or news…" rows={1}
            className="input-field resize-none"
            style={{ lineHeight: '1.5', minHeight: 40, maxHeight: 100, overflow: 'auto' }}
            disabled={isTyping} />
          <motion.button id="chat-send" onClick={handleSend}
            disabled={!input.trim() || isTyping}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}
            className="btn btn-primary shrink-0"
            style={{ padding: '8px 14px', opacity: !input.trim() || isTyping ? 0.45 : 1 }}>
            ➤
          </motion.button>
        </div>
        <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--text-secondary)' }}>
          Enter ↵ to send · Shift+Enter for new line
        </p>
      </div>
    </motion.div>
  );
}
