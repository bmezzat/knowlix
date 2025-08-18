import { io, Socket } from 'socket.io-client';
import { attachEventListeners } from './chat';
import store from '../store';
import { addMessage } from '../store/chatSlice';
import { v4 as uuidv4 } from 'uuid';

// To get the SOCKET URL from cypress if i am using cypress else get it from env
const SOCKET_URL = (window as any).Cypress?.env?.socketUrl || import.meta.env.VITE_API_URL;

export interface ChatCommand {
  command: string;
  timestamp?: number;
}

export interface ApiResponse {
  command: string;
  result: any;
  api: string;
  timestamp: number;
}

export interface CommandStatus {
  status: 'processing' | 'success' | 'error';
  error?: string;
}

export interface TypingIndicator {
  isProcessing: boolean;
}

export let socket: Socket | null = null;

// Initialize socket connection
export const connectSocket = async (token: string | null) => {
  if (!token) throw new Error('No access token provided');
  console.log("Connecting socket to:", SOCKET_URL);
  socket = io(SOCKET_URL, {
    auth: { token }
  });

  (window as any).socket = socket;
  socket.on('connect_error', (err) => {
    store.dispatch(
      addMessage({
        id: uuidv4(),
        text: `Socket connection error: ${err.message}`,
        sender: 'bot',
      })
    )
  });  

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.connected);
    store.dispatch(
      addMessage({
        id: uuidv4(),
        text: `Socket connected `,
        sender: "bot",
      })
    )
  });

  socket.on("disconnect", (reason) => {
    store.dispatch(
      addMessage({
        id: uuidv4(),
        text: `Socket disconnected (${reason})`,
        sender: "bot",
      })
    )
  });  

  socket.io.on("reconnect_attempt", (attempt) => {
    store.dispatch(addMessage({
      id: uuidv4(),
      text: `Reconnecting... (attempt ${attempt})`,
      sender: "bot",
    }));
  });

  socket.io.on("reconnect", (attempt) => {
    store.dispatch(addMessage({
      id: uuidv4(),
      text: `Reconnected after ${attempt} attempts`,
      sender: "bot",
    }));
  });

  attachEventListeners();
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// For testing
export const setSocket = (s: Socket | null) => {
  socket = s;
};