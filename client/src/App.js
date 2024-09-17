import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    axios.get('/api/greeting')
      .then(response => {
        setGreeting(response.data.message);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{greeting}</h1>
      </header>
    </div>
  );
}

export default App;
