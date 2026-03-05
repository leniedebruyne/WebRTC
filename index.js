const express = require('express');
const https = require('https');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();

// SSL opties
const options = {
    key: fs.readFileSync('./localhost.key'),
    cert: fs.readFileSync('./localhost.crt')
};

const server = https.createServer(options, app);

const io = new Server(server);

app.use(express.static('public'));

io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    socket.on('signal', ({ targetId, signal }) => {
        io.to(targetId).emit('signal', { senderId: socket.id, signal });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        if (socket.controllerFor) {
            io.to(socket.controllerFor).emit('controllerDisconnected');
        }
    });

    socket.on('registerController', desktopId => {
        socket.controllerFor = desktopId;
    });
});


server.listen(3000, "0.0.0.0", () => {
    console.log("HTTPS Server running on port 3000");
});