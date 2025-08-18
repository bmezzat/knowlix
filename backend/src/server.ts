import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { registerSocketHandlers } from './sockets';

const PORT = Number(process.env.PORT) || 3001;

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`API up on http://localhost:${PORT}`);
});
