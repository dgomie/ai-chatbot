const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build/static')));

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// API route
app.post('/api/generateChat', async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const { chatHistory, message } = req.body;

  async function generateAIresponse(history, message) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat({ history });

      let result = await chat.sendMessage(message);
      const response = await result.response;
      const text = await response.text();
      return text;

    } catch (error) {
      console.error('Error generating AI response:', error);
      return null;
    }
  }

  const aiResponse = await generateAIresponse(chatHistory, message);
  if (aiResponse) {
    res.json({ response: aiResponse });
  } else {
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
