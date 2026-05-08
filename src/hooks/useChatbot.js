import { useState, useCallback } from 'react';
import { sendChatMessage } from '../api/chatbotApi';
import { setItem, getItem } from '../utils/localStorage';

const HISTORY_KEY = 'chatbot_history';
const MAX_MESSAGES = 30;

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "👋 Hi! I'm your ISS & News Dashboard assistant. I can answer questions about the current ISS position, speed, crew, and the latest news headlines. Try asking me something!",
  timestamp: new Date().toISOString(),
};

export function useChatbot(issContext, newsContext) {
  const [messages, setMessages] = useState(() => {
    const saved = getItem(HISTORY_KEY, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return [WELCOME_MESSAGE];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const buildContext = useCallback(() => {
    const context = {
      iss: issContext
        ? {
            latitude: issContext.position?.latitude,
            longitude: issContext.position?.longitude,
            speed_kmh: issContext.speed ? Math.round(issContext.speed) : null,
            nearest_place: issContext.nearestPlace,
            crew_count: issContext.astronauts?.number,
            crew: issContext.astronauts?.people,
            last_updated: issContext.position?.timestamp
              ? new Date(issContext.position.timestamp * 1000).toISOString()
              : null,
          }
        : null,
      news: newsContext
        ? Object.fromEntries(
            Object.entries(newsContext).map(([cat, arts]) => [
              cat,
              (arts || []).slice(0, 5).map((a) => ({
                title: a.title,
                source: a.source,
                date: a.publishedAt,
              })),
            ])
          )
        : {},
    };
    return context;
  }, [issContext, newsContext]);

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim()) return;

      const userMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMsg].slice(-MAX_MESSAGES);
      setMessages(updatedMessages);
      setIsTyping(true);
      setError(null);

      try {
        const context = buildContext();
        const reply = await sendChatMessage(updatedMessages, context);

        const assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
        };

        const finalMessages = [...updatedMessages, assistantMsg].slice(-MAX_MESSAGES);
        setMessages(finalMessages);
        setItem(HISTORY_KEY, finalMessages);
      } catch (err) {
        setError(err.message || 'Failed to get response');
        const errMsg = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, buildContext]
  );

  const clearChat = useCallback(() => {
    const fresh = [WELCOME_MESSAGE];
    setMessages(fresh);
    setItem(HISTORY_KEY, fresh);
    setError(null);
  }, []);

  return { messages, sendMessage, isTyping, clearChat, error };
}
