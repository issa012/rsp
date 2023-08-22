import * as http from 'http';
import { Server } from 'socket.io';

export default (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  return io;
};
