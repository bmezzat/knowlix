import { Server } from 'socket.io';
import { verifyCognitoAccessToken } from '../services/cognito';
import { processCommand } from './processCommand';

export function registerSocketHandlers(io: Server) {
  // Auth with JWT for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('No token provided');
      const decoded = await verifyCognitoAccessToken(token);
      (socket as any).userId = decoded.sub;
      (socket as any).username = decoded.username;

      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Register events
  io.on('connection', (socket) => {
    console.log("User with id " + (socket as any).userId + "is connected")
    socket.on('chat_command', async (data) => {
      socket.emit('typing_indicator', { isProcessing: true });
      socket.emit('command_status', { status: 'processing' });
      try {
        const result = await processCommand(data.command, (socket as any).userId);
        socket.emit('api_response', { command: data.command, result, api: 'chat', timestamp: Date.now() });
        socket.emit('command_status', { status: 'success' })
      } catch (error) {
        socket.emit('command_status', { status: 'error', error: error instanceof Error ? error.message : String(error) });
      } finally {
        socket.emit('typing_indicator', { isProcessing: false });
      }
    });
  });
}
