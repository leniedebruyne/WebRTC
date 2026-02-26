const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    socket.on('signal', ({ targetId, signal }) => {
        io.to(targetId).emit('signal', {
            senderId: socket.id,
            signal
        });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


server.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});