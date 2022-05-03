const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 80;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};
let online=0;

io.on('connection', (socket) => {
    socket.on('new-user',name=>{
      users[socket.id]=name;
      online=Object.keys(users).length;
      socket.broadcast.emit('user-joined',{name:name,online:online});
      io.emit('accepted',online);
    });
    socket.on('send',message=>{
      socket.broadcast.emit('receive',{msg:message.msg,user:message.user, position:'left'});
    })
    socket.on('disconnect', () => {
      online--;
      socket.broadcast.emit('user-left',{user:users[socket.id],online:online});
      delete users[socket.id];
      online=Object.keys(users).length;
    });
  });

server.listen(PORT, () => {
  console.log('listening on port 80');
});