import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'AI response', sender: 'ai' },
        ]);
      }, 1000);
    }
  };

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
              justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'} 
              mb={1}
            >
              <Typography 
                variant="body1" 
                component="div" 
                bgcolor={message.sender === 'user' ? 'blue' : 'lightgrey'} 
                color={message.sender === 'user' ? 'white' : 'black'} 
                p={1} 
                borderRadius={2}
              >
                {message.text}
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