import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { updateGames } from './services/user.service';
import { updateWins } from './services/user.service';

type Room = {
  id: string;
  p1Id?: number;
  p2Id?: number;
  p1Choice?: string;
  p2Choice?: string;
};

const rooms: Record<string, Room> = {};
const queue: string[] = [];

export default function registerGameHandler(io: Server, socket: Socket) {
  async function declareWinner(roomId: string) {
    let p1Choice = rooms[roomId].p1Choice;
    let p2Choice = rooms[roomId].p2Choice;
    let p1Id = rooms[roomId].p1Id;
    let p2Id = rooms[roomId].p2Id;
    let winner = null;
    if (p1Choice === p2Choice) {
      winner = 'd';
    } else if (p1Choice == 'paper') {
      if (p2Choice == 'scissors') {
        winner = 'p2';
      } else {
        winner = 'p1';
      }
    } else if (p1Choice == 'rock') {
      if (p2Choice == 'paper') {
        winner = 'p2';
      } else {
        winner = 'p1';
      }
    } else if (p1Choice == 'scissors') {
      if (p2Choice == 'rock') {
        winner = 'p2';
      } else {
        winner = 'p1';
      }
    }

    updateGames(p1Id);
    updateGames(p2Id);

    if (winner == 'p1') {
      updateWins(p1Id);
    } else if (winner == 'p2') {
      updateWins(p2Id);
    }

    io.sockets.to(roomId).emit('game_ended', {
      roomId: roomId,
      winner: winner,
    });
    rooms[roomId].p1Choice = null;
    rooms[roomId].p2Choice = null;
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('find_game', (data) => {
    console.log('User emitted find game');

    if (queue.length) {
      const roomId = queue.pop();
      rooms[roomId].p2Id = data.id;
      socket.join(roomId);
      socket.emit('new_game', { roomId: roomId, player1: false });
      io.in(roomId).emit('game_started');
    } else {
      const roomId = uuidv4();
      rooms[roomId] = { id: roomId, p1Id: data.id };
      queue.push(roomId);
      socket.join(roomId);
      socket.emit('new_game', { roomId: roomId, player1: true });
    }
    console.log(io.sockets.adapter.rooms);
  });

  socket.on('p1_choice', (data) => {
    const { choice, roomId } = data;
    rooms[roomId].p1Choice = choice;
    if (rooms[roomId].p2Choice != null) {
      declareWinner(roomId);
    }
  });
  socket.on('p2_choice', (data) => {
    const { choice, roomId } = data;
    rooms[roomId].p2Choice = choice;
    console.log(rooms);
    if (rooms[roomId].p1Choice != null) {
      declareWinner(roomId);
    }
  });

  socket.on('timeout', (data) => {
    if (rooms[data.roomId].p1Choice == null && rooms[data.roomId].p2Choice == null) {
      io.in(data.roomId).emit('game_cancelled');
    } else if (rooms[data.roomId].p1Choice == null) {
      updateGames(rooms[data.roomId].p2Id);
      updateGames(rooms[data.roomId].p1Id);
      updateWins(rooms[data.roomId].p2Id);
      io.sockets.to(data.roomId).emit('game_ended', {
        roomId: data.roomId,
        winner: 'p2',
      });
    } else if (rooms[data.roomId].p2Choice == null) {
      updateGames(rooms[data.roomId].p2Id);
      updateGames(rooms[data.roomId].p1Id);
      updateWins(rooms[data.roomId].p2Id);
      io.sockets.to(data.roomId).emit('game_ended', {
        roomId: data.roomId,
        winner: 'p1',
      });
    }
  });

  socket.on('request_rematch', (data) => {
    console.log('rematch requested', data);
    const newRoomId = uuidv4();

    socket.leave(data.roomId);

    socket.join(newRoomId);
    rooms[newRoomId] = { id: newRoomId, p1Id: data.id };
    socket.to(data.roomId).emit('rematch_requested', { roomId: newRoomId });
    socket.emit('new_game', { roomId: newRoomId, player1: true });
  });

  socket.on('accept_rematch', (data) => {
    socket.join(data.roomId);
    rooms[data.roomId].p2Id = data.id;
    socket.emit('new_game', { roomId: data.roomId, player1: false });
    io.in(data.roomId).emit('game_started');
  });

  socket.on('cancel_game', (data) => {
    io.in(data.roomId).emit('game_cancelled');
    io.in(data.roomId).socketsLeave(data.roomId);
  });
}
