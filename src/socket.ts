import * as http from 'http';
import { Server } from 'socket.io';

export default (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'https://rsp-client.vercel.app',
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  return io;
};
