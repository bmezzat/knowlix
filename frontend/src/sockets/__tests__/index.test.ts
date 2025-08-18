import { describe, it, beforeEach, afterEach, vi, Mock, expect } from 'vitest';
import { socket, connectSocket, disconnectSocket, setSocket } from '../index';
import { io as mockIo, Socket } from 'socket.io-client';
import store from '../../store';
import { addMessage } from '../../store/chatSlice';


// Mock socket.io-client
vi.mock('socket.io-client', () => {
  return {
    io: vi.fn(),
  };
});

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid'),
}));

// Mock store dispatch
vi.mock('@/store', () => ({
  default: { dispatch: vi.fn() },
}));

describe('Socket functions', () => {
  let mockSocket: Partial<Socket>;

  beforeEach(() => {
    mockSocket = {
      on: vi.fn(),
      disconnect: vi.fn(),
      io: {
        on: vi.fn(),
      } as any,
    };

    (mockIo as Mock).mockReturnValue(mockSocket as Socket);
    (store.dispatch as Mock).mockClear();
  });

  it('connectSocket throws if no token provided', async () => {
    await expect(connectSocket(null)).rejects.toThrow('No access token provided');
  });

  it('connectSocket initializes socket and attaches listeners', async () => {
    const token = 'test-token';
    const returnedSocket = await connectSocket(token);

    expect(mockIo).toHaveBeenCalledWith(import.meta.env.VITE_API_URL, {
      auth: { token },
    });
    expect(mockSocket.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
    expect(returnedSocket).toBe(mockSocket);
  });

  it('connectSocket dispatches error message on connect_error', async () => {
    const token = 'test-token';
    await connectSocket(token);
    const errorCallback = (mockSocket.on as Mock)?.mock.calls.find(
      (call: any[]) => call[0] === 'connect_error'
    )?.[1];

    const error = new Error('Connection failed');
    errorCallback(error);

    expect(store.dispatch).toHaveBeenCalledWith(
      addMessage({
        id: 'mock-uuid',
        text: 'Socket connection error: Connection failed',
        sender: 'bot',
      })
    );
  });

  it('disconnectSocket disconnects and nullifies socket', () => {
    setSocket(mockSocket as Socket);

    disconnectSocket();

    expect(mockSocket.disconnect).toHaveBeenCalled();
    expect(socket).toBeNull();
  });

  it('disconnectSocket does nothing if socket is null', () => {
    setSocket(null);

    disconnectSocket();

    expect(socket).toBeNull();
  });
});
