// server code

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Zorg dat we de public map kunnen gebruiken
app.use(express.static("public"));

// Wanneer iemand verbindt
io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    // Wanneer client iets stuurt
    socket.on("message", (msg) => {
        console.log("Message received:", msg);

        // Stuur het terug naar ALLE clients
        io.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Server starten
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});