import { motion } from 'framer-motion';
import { formatTime } from '../../utils/formatters';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
        style={{
          background: isUser
            ? 'linear-gradient(135deg,#00d4ff,#3b82f6)'
            : isError ? 'rgba(239,68,68,0.2)' : 'rgba(139,92,246,0.2)',
          border: isUser ? 'none' : `1px solid ${isError ? 'rgba(239,68,68,0.4)' : 'rgba(139,92,246,0.4)'}`,
        }}>
        {isUser ? '👤' : isError ? '⚠️' : '🤖'}
      </div>

      {/* Bubble */}
      <div className="max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed"
        style={{
          background: isUser
            ? 'linear-gradient(135deg,rgba(0,212,255,0.12),rgba(59,130,246,0.12))'
            : isError ? 'rgba(239,68,68,0.08)' : 'var(--bg-primary)',
          border: `1px solid ${isUser ? 'rgba(0,212,255,0.25)' : isError ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
          color: isError ? '#ef4444' : 'var(--text-primary)',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        }}>
        <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</p>
        <p className="text-right mt-1" style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', opacity: 0.6 }}>
          {message.timestamp ? formatTime(new Date(message.timestamp)) : ''}
        </p>
      </div>
    </motion.div>
  );
}
