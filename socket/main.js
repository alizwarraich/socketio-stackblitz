const express = require('express');
const app = express();

const port = 8080;
const io = require('socket.io')(port, {
  cors: {
    origin: ['https://localhost:5173'],
  },
});

// on connection establish
io.on('connection', (socket) => {
  console.log(socket.id || null);
  socket.on('custom', (obj) => {
    console.log(obj);
  });
  socket.on('msg', (msg) => {
    socket.broadcast.emit('received', msg);
  });
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});
