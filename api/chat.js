/**
 * Vercel Serverless Function: /api/chat
 * Proxies chat requests to HuggingFace Mistral-7B-Instruct.
 * The HF token (VITE_AI_TOKEN) stays server-side — never exposed to the client.
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const hfToken = process.env.VITE_AI_TOKEN;
  if (!hfToken) {
    return res.status(500).json({ error: 'AI token not configured on server' });
  }

  // Build system prompt with dashboard context only
  const systemPrompt = `You are a dashboard assistant. You can ONLY answer questions using the data provided below. Do NOT use any outside knowledge. If the answer is not in the data, say "I don't have that information in the current dashboard data."

CURRENT DASHBOARD DATA:
${JSON.stringify(context, null, 2)}`;

  const lastUserMessage = messages[messages.length - 1]?.content || '';

  const fullPrompt = `<s>[INST] ${systemPrompt}

User question: ${lastUserMessage} [/INST]`;

  try {
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.3,
            return_full_text: false,
            do_sample: true,
          },
        }),
      }
    );

    if (!hfResponse.ok) {
      const errText = await hfResponse.text();
      console.error('HuggingFace error:', hfResponse.status, errText);
      return res.status(502).json({ error: `HuggingFace API error: ${hfResponse.status}` });
    }

    const data = await hfResponse.json();

    // Handle model loading (HF sometimes returns a loading message)
    if (data.error) {
      if (data.error.includes('loading') || data.error.includes('currently loading')) {
        return res.json({ reply: '⏳ The AI model is warming up. Please try again in a moment.' });
      }
      return res.status(502).json({ error: data.error });
    }

    const text =
      data[0]?.generated_text ||
      (Array.isArray(data) && data.length === 0
        ? "I couldn't generate a response. Please try rephrasing."
        : "Sorry, I couldn't process that.");

    return res.json({ reply: text.trim() });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
