require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't match an API route, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.post('/api/generateChat', async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const { chatHistory, message } = req.body;

  async function generateAIresponse(history, message) {
    console.log("history", history)
    // if (Array.isArray(history) && history.length === 0) {
    //   history = [{ role: 'user', parts: [{ text: "I want you to be a certified physical therapist that treats injuries conservatively." }] }];
    // }
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat({history})

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


//------------------------------------ WEBSOCKET ----------------------------------------
// require('dotenv').config();
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const express = require('express');
// const path = require('path');
// const WebSocket = require('ws');


// const app = express();
// const port = process.env.PORT || 3001;

// app.use(express.static(path.join(__dirname, 'client/build')));

// // The "catchall" handler: for any request that doesn't match an API route, serve the React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

// // Create WebSocket server
// const wss = new WebSocket.Server({ server: app.listen(port, () => console.log(`Server running on port ${port}`)) });

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   ws.on('message', async (message) => {
//     console.log('Received:', message);

//     const genAI = new GoogleGenerativeAI(process.env.API_KEY);
//     const chatHistory = JSON.parse(message).chatHistory;

//     async function generateAIresponse(history) {
//       try {
//         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//         const chat = model.startChat({ history });

//         let result = await chat.sendMessage("What are states i can visit?");
//         const response = await result.response;
//         const text = await response.text();
//         return text;

//       } catch (error) {
//         console.error('Error generating AI response:', error);
//         return null;
//       }
//     }

//     const aiResponse = await generateAIresponse(chatHistory);
//     if (aiResponse) {
//       ws.send(JSON.stringify({ response: aiResponse }));
//     } else {
//       ws.send(JSON.stringify({ error: 'Failed to generate AI response' }));
//     }
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });