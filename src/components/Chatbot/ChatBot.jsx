import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from './ChatWindow';
import { useChatbot } from '../../hooks/useChatbot';

export default function ChatBot({ issData, newsData }) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isTyping, clearChat } = useChatbot(issData, newsData);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="chatbot-toggle"
        onClick={() => setIsOpen((p) => !p)}
        aria-label={isOpen ? 'Close chat' : 'Open AI assistant'}
        // Idle oscillation when closed
        animate={isOpen
          ? { rotate: 45, scale: 1 }
          : { y: [0, -5, 0], rotate: 0, scale: 1 }}
        transition={isOpen
          ? { duration: 0.25 }
          : { y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0.25 } }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 58, height: 58,
          borderRadius: '50%',
          background: isOpen
            ? 'linear-gradient(135deg,#ef4444,#dc2626)'
            : 'linear-gradient(135deg,#00d4ff,#3b82f6)',
          border: 'none', cursor: 'pointer',
          fontSize: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isOpen
            ? '0 8px 32px rgba(239,68,68,0.45)'
            : '0 8px 32px rgba(0,212,255,0.45)',
          zIndex: 1001,
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      {/* Badge */}
      <AnimatePresence>
        {!isOpen && messages.length > 1 && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            style={{
              position: 'fixed', bottom: 72, right: 18,
              background: 'var(--accent-cyan)', color: '#000',
              borderRadius: '50%', width: 19, height: 19,
              fontSize: '0.6rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1002,
              boxShadow: '0 2px 8px rgba(0,212,255,0.5)',
            }}>
            {Math.min(messages.length - 1, 9)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages} sendMessage={sendMessage}
            isTyping={isTyping} clearChat={clearChat}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
