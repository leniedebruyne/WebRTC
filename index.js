// server code

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const clients = {};

app.use(express.static('public')); // zorg dat index.html in /public staat

io.on('connection', socket => {
    clients[socket.id] = { id: socket.id };
    console.log('Socket connected', socket.id);

    socket.on('update', (targetSocketId, data) => {
        if (!clients[targetSocketId]) return;

        // Notify desktop dat controller is connected
        io.to(targetSocketId).emit('controller-connected');

        // Stuur cursor data
        io.to(targetSocketId).emit('update', data);
    });

    socket.on('message', msg => {
        io.emit('message', msg); // broadcast naar iedereen
    });

    socket.on('disconnect', () => {
        delete clients[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});