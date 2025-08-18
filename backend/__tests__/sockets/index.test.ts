import { createServer, Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import Client, { Socket as ClientSocket } from 'socket.io-client';
import { registerSocketHandlers } from '../../src/sockets';
import * as cognito from '../../src/services/cognito';
import * as processCommand from '../../src/sockets/processCommand';

jest.mock('../../src/services/cognito');
jest.mock('../../src/sockets/processCommand');

describe('Sockets', () => {
  let io: Server;
  let httpServer: HTTPServer;
  let addr: { port: number };

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    registerSocketHandlers(io);
    httpServer.listen(() => {
      const addressInfo = httpServer.address();
      if (typeof addressInfo === 'string' || !addressInfo) throw new Error('Failed to get server address');
      addr = addressInfo as { port: number; family: string; address: string };
      done();
    });
  });

  afterAll(() => {
    io.close();
    httpServer.close();
  });

  describe('Socket auth', () => {
    it('authenticates valid token', (done) => {
      (cognito.verifyCognitoAccessToken as jest.Mock).mockResolvedValue({ sub: 'u1', username: 'test' });

      const client: ClientSocket = Client(`http://localhost:${addr.port}`, { auth: { token: 'ok' } });
      client.on('connect', () => {
        expect(client.id).toBeDefined();
        client.close();
        done();
      });
    });

    it('rejects invalid token', (done) => {
      (cognito.verifyCognitoAccessToken as jest.Mock).mockRejectedValue(new Error('bad token'));

      const client: ClientSocket = Client(`http://localhost:${addr.port}`, { auth: { token: 'bad' } });
      client.on('connect_error', (err: any) => {
        expect(err.message).toBe('Authentication error');
        client.close();
        done();
      });
    });
  });

  describe('Chat commands', () => {
    beforeEach(() => {
      (cognito.verifyCognitoAccessToken as jest.Mock).mockResolvedValue({ sub: 'u1', username: 'user' });
      (processCommand.processCommand as jest.Mock).mockResolvedValue('ok');
    });

    it('emits success after processing command', (done) => {
      const client: ClientSocket = Client(`http://localhost:${addr.port}`, { auth: { token: 'ok' } });
      const events: string[] = [];

      client.on('connect', () => {
        client.emit('chat_command', { command: 'ping' });
      });

      client.on('command_status', (data: any) => {
        events.push(data.status);
        if (data.status === 'success') {
          expect(events).toEqual(['processing', 'success']);
          client.close();
          done();
        }
      });
    });
  });
});
