import 'reflect-metadata';
import * as http from 'http';
import { Socket } from 'socket.io';

import app from './app';
import socketServer from './socket';
import registerGameHandler from './gameHandler';
import { db } from './db/db';

const port = process.env.PORT || 8000;
app.set('port', port);

db.initialize()
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err));

var server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

const io = socketServer(server);

io.on('connection', onConnection);

function onConnection(socket: Socket) {
  registerGameHandler(io, socket);
}
