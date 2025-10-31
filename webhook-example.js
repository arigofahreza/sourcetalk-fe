// Example webhook handler for testing
// You can deploy this to Vercel, Netlify, or any serverless platform

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, timestamp } = req.body;

    if (!message) {
      return res.status(400).json({
        message: '',
        success: false,
        error: 'Message is required'
      });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple echo response (replace with actual AI integration)
    const responses = [
      `I understand you said: "${message}". How can I help you further?`,
      `That's an interesting point about "${message}". Let me think about that...`,
      `Thanks for sharing "${message}". Here's what I think...`,
      `I see you mentioned "${message}". Could you tell me more about that?`,
      `Regarding "${message}", I'd be happy to help you with that.`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return res.status(200).json({
      message: randomResponse,
      success: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      message: '',
      success: false,
      error: 'Internal server error'
    });
  }
}

// For Express.js backend:
/*
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message, timestamp } = req.body;
  
  // Your AI integration here (OpenAI, Claude, etc.)
  const aiResponse = await callYourAI(message);
  
  res.json({
    message: aiResponse,
    success: true
  });
});

app.listen(3001);
*/