/**
 * Chatbot API — calls the Vercel serverless proxy at /api/chat.
 * The HuggingFace token stays server-side in api/chat.js.
 */
export async function sendChatMessage(messages, context) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Chat API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.reply || "Sorry, I couldn't process that.";
}
