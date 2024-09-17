import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (input.trim()) {
      const newMessage = { role: 'user', parts: [{ text: input }] };
      setMessages([...messages, newMessage]);
      setInput('');

      try {
        const response = await axios.post('/api/generateChat', {
          chatHistory: messages,
          message: input,
        });

        if (response.data && response.data.response) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'model', parts: [{ text: response.data.response }] },
          ]);
        }
      } catch (error) {
        console.error('Error generating AI response:', error);
      }
    }
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <Box 
          width="100%" 
          maxHeight="70vh" 
          overflow="auto" 
          border={1} 
          borderColor="grey" 
          borderRadius={2} 
          p={2} 
          mb={2}
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              display="flex" 
              justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'} 
              mb={1}
            >
              <Typography 
                variant="body1" 
                component="div" 
                bgcolor={message.role === 'user' ? 'blue' : 'lightgrey'} 
                color={message.role === 'user' ? 'white' : 'black'} 
                p={1} 
                borderRadius={2}
              >
                {message.parts && message.parts[0] && message.parts[0].text}
              </Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
          <Box display="flex">
            <TextField 
              fullWidth 
              variant="outlined" 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Type a message..." 
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default App;