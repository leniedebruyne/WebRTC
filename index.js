const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    // WebRTC signalling: offer van controller naar desktop
    socket.on('webrtc-offer', ({ desktopId, offer }) => {
        io.to(desktopId).emit('webrtc-offer', { controllerId: socket.id, offer });
    });

    // WebRTC signalling: answer van desktop naar controller
    socket.on('webrtc-answer', ({ controllerId, answer }) => {
        io.to(controllerId).emit('webrtc-answer', { answer });
    });

    // WebRTC signalling: ICE candidates
    socket.on('webrtc-ice-candidate', ({ targetId, candidate }) => {
        io.to(targetId).emit('webrtc-ice-candidate', { candidate });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));