# Balloon Dodger

Balloon Dodger is een 1-op-1 interactieve desktop game waarbij de speler een ballon bestuurt via een smartphone.  
De smartphone functioneert als controller en stuurt bewegingen en acties realtime door naar de desktop via een WebRTC data channel.

De desktop toont de game. De smartphone verwerkt de input.

---

## Concept

De speler probeert zo lang mogelijk te overleven zonder obstakels te raken.

De smartphone stuurt:

- Swipe input (horizontale beweging)
- Tap input (grootte aanpassen)
- Accelerometer input (boost via kantelen)

De desktop verwerkt deze input en rendert de game state.

---

## Desktop

### Visuals

De desktop toont een canvas met:

- Een bestuurbare ballon
- Obstakels:
  - Wolken (statisch)
  - Vogels (bewegen horizontaal)
- Score
- Timer
- Highscore indicator

Achtergrondkleur: luchtblauw.

### Gameplay

- De ballon beweegt horizontaal op basis van swipe-input vanaf de smartphone.
- 1x tik → ballon wordt groter.
- 2x tik → ballon wordt kleiner.
- Kantelen van de smartphone → tijdelijke boost (maximaal 3 per ronde).
- Obstakels bewegen automatisch.
- Botsing met een obstakel resulteert in game over.
- De score loopt door zolang de speler niet botst.

---

## Smartphone Controller

### Interface

De smartphone toont:

- Een swipe-gebied voor horizontale beweging.
- Tap-functionaliteit voor grootte-aanpassing.
- Accelerometer ondersteuning voor boost.

### Controls Flow

1. Swipe links/rechts → beweeg de ballon.
2. Tik → verander grootte.
3. Kantel telefoon → activeer boost (max. 3 per ronde).
4. Score blijft stijgen zolang er geen botsing is.

## Opstart
Ik ben begonnen met het opstarten van mijn project. Omdat ik websockets ga gebruiken heb ik er eerst voor gezorgd dat dit werkt. Dit zijn de stappen die ik heb gevolgd:


```javascript
npm init -y
```

```javascript
npm install express socket.io
```
Daarna heb ik een map aangemaakt genaamd “public”, in die map heb ik een index.html file aangemaakt. Op de root heb ik nog een file index.js aangemaakt.


## Test
Om te testen of alle structuur goed was en of ik een connectie kon maken met websocket, heb ik een mini chat gemaakt. Dit was puur om te zien of ik een connectie kon maken met websocket van de server naar de client. Dit is de code:

### Server -> index.js

```javascript
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
```

### Client -> public/index.html

```javascript
<!DOCTYPE html>
<html>
<head>
  <title>WebSocket Demo</title>
</head>
<body>
  <h1>Mini Chat</h1>

  <input id="input" placeholder="Type something..." />
  <button onclick="sendMessage()">Send</button>

  <ul id="messages"></ul>

  <!-- Socket.io client library -->
  <script src="/socket.io/socket.io.js"></script>

  <script>
    const socket = io();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    function sendMessage() {
      const input = document.getElementById("input");
      socket.emit("message", input.value);
      input.value = "";
    }

    socket.on("message", (msg) => {
      const li = document.createElement("li");
      li.textContent = msg;
      document.getElementById("messages").appendChild(li);
    });
  </script>
</body>
</html>
```
Door deze code uit te voeren wist ik dat mijn basis structuur goed zat. De volgende stap was om dit project aan github te linken.


## Github

Dit zijn de stappen die ik heb ondernomen om mijn project op github te plaatsen



```javascript
git init
```

```javascript
git add .
```

```javascript
git commit -m "setup en eerste commit"
```

Dan heb ik een repository aangemaakt op Github, genaamd WebRTC. Daarna heb ik de instructies op Github gevold om mijn repository te linken aan mijn code.

Ook heb ik gekozen om een development branch aan te maken. Ik heb deze keuze gemaakt omdat ik dan een branch heb waarop ik kan werken, de development branch, en een branch waar ik dingen naar kan pushen als die klaar zijn, de main branch. De development branch heb ik zo aangemaakt:


```javascript
git checkout -b development
```

```javascript
git push -u origin development
```

## Volgende goal

Mijn volgende goal is om een qr code op mijn desktop scherm te kunnen krijgen, die ik dan kan scannen met mijn gsm. Dit zal ik gaan doen via websockets.

## Qr code
### Tools die ik heb gebruikt
- one to one qr code tutorial video
