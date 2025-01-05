import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Chess } from 'chess.js';

const app = express();
const chess = new Chess();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.static('public'));

app.post('/api/update', (req, res) => {
  const { fen, evalSource1, evalSource2 } = req.body;
  
  try {
    // Validate FEN string
    new Chess(fen);
    
    // Emit the update to all connected clients
    io.emit('chess-update', { fen, evalSource1, evalSource2 });
    
    res.status(200).json({ message: 'Update successful' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid FEN string' });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('A client connected');
  
  // Send initial state to the newly connected client
  const initialFen = chess.fen();
  const initialEvalSource1 = "0.0";
  const initialEvalSource2 = "0.0";
  socket.emit('chess-update', { fen: initialFen, evalSource1: initialEvalSource1, evalSource2: initialEvalSource2 });
});

// For demonstration purposes, simulate updates
// setInterval(() => {
//   let moves = chess.moves();
//   chess.move(moves[Math.floor(Math.random() * moves.length)]);
//   const fen = chess.fen();
//   const evalSource1 = (Math.random() * 2 - 1).toFixed(2); // Random eval between -1 and 1
//   const evalSource2 = (Math.random() * 2 - 1).toFixed(2); // Random eval between -1 and 1
//   io.emit('chess-update', { fen, evalSource1, evalSource2 });
//   console.log('Simulated update sent:', { fen, evalSource1, evalSource2 });
// }, 500);