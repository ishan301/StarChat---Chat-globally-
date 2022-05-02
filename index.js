const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user',name=>{
      users[socket.id]=name;
      socket.broadcast.emit('user-joined',name);
    });
    socket.on('send',message=>{
      socket.broadcast.emit('receive',{msg:message.msg,user:message.user, position:'left'});
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-left',users[socket.id]);
      delete users[socket.id];
    });
  });

server.listen(80, () => {
  console.log('listening on port 80');
});