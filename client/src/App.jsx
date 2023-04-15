import { useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io(
  'https://vitejsvitehqenx5-qxda--8080--c8358679.local-credentialless.webcontainer.io/'
);

socket.on('connect', () => {
  console.log(socket.id);
  socket.emit('custom', { msg: 'Hello from the client!' });
});

function App() {
  const [msg, setMsg] = useState('');
  const [id, setId] = useState(null);
  const [messages, setMessages] = useState([]);

  socket.on('received', (msg) => {
    setMessages([...messages, msg]);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, msg]);
    socket.emit('msg', msg);
    setMsg('');
  };

  return (
    <div className="App">
      <h1>Socket IO</h1>
      <p>Logged in with ID: {id || null}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          style={{ width: '40%' }}
        />
        <button style={{ width: '20%' }}>Send message</button>
      </form>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
