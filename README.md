# Balloon Dodger


## Concept

De speler probeert zo lang mogelijk te overleven zonder obstakels te raken.

De smartphone stuurt:

- Swipe input (horizontale beweging)
- Tap input (grootte aanpassen)
- Accelerometer input (boost via kantelen)

De desktop verwerkt deze input en rendert de game state.


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

Mijn volgende goal is om een QR code op mijn desktop scherm te kunnen krijgen, die ik dan kan scannen met mijn gsm. Dit zal ik gaan doen via websockets.

## Qr code
### Tools die ik heb gebruikt
- one to one QR code tutorial video
- ai om de logica te begrijpen en toe te passen.

### Process
Voor de basis ben ik gestart van de tutorial filmpjes van one to one QR code. Dit gaf me de basis om de code van de qr code te inplementeren. 
Na het filmpje te volgen zag mijn code er zo uit:

#### index.html

```javascript
<!DOCTYPE html>
<html>

<head>
    <title>WebSocket Demo</title>
</head>

<body>
    <h1>Mini Chat</h1>

    <p>
        Scan this link:
        <a id="url" target="_blank"></a>
    </p>
    
    <div id="qr"></div>

    <input id="input" placeholder="Type something..." />
    <button onclick="sendMessage()">Send</button>

    <ul id="messages"></ul>

    <!-- Socket.io client library -->
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>


    <script>
         {
                const $messages = document.getElementById('messages');
                const $url = document.getElementById('url');

                let socket; // will be assigned a value later

                const init = () => {
                    socket = io.connect('/');
                    socket.on('connect', () => {
                        console.log(`Connected: ${socket.id}`);
                        const url = `${new URL(`/controller.html?id=${socket.id}`, window.location)}`;
                        $url.textContent = url;
                        $url.setAttribute('href', url);

                        const typeNumber = 4;
                        const errorCorrectionLevel = 'L';
                        const qr = qrcode(typeNumber, errorCorrectionLevel);
                        qr.addData(url);
                        qr.make();
                        document.getElementById('qr').innerHTML = qr.createImgTag(4);
                    });

                    socket.on(`update`, (senderId, data) => {
                        let $cursor = document.querySelector(`#cursor`);
                        if (!$cursor) {
                            $cursor = document.createElement(`div`);
                            $cursor.classList.add(`cursor`);
                            $cursor.setAttribute(`id`, `cursor`);
                            document.body.appendChild($cursor);
                        }
                        $cursor.style.left = `${data.x * window.innerWidth}px`;
                        $cursor.style.top = `${data.y * window.innerHeight}px`;
                    });
                };

                init();
            }
    </script>
</body>

</html>
```

#### controller.html

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Socket.io Controller</title>
    <style>
        html {
            box-sizing: border-box;
        }

        *,
        *:before,
        *:after {
            box-sizing: inherit;
        }

        html,
        body {
            height: 100%;
            margin: 0;
        }

        .cursor {
            position: absolute;
            width: 1rem;
            height: 1rem;
            margin-left: -.5rem;
            margin-right: -.5rem;
            background: red;
            border-radius: 50% 50%;
        }
    </style>
</head>

<body>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        {
            const $messages = document.getElementById('messages');

            let socket; // will be assigned a value later

            const init = () => {
                targetSocketId = getUrlParameter('id');
                if (!targetSocketId) {
                    alert(`Missing target ID in querystring`);
                    return;
                }
                socket = io.connect('/');
                socket.on('connect', () => {
                    console.log(`Connected: ${socket.id}`);
                });
                window.addEventListener(`mousemove`, e => handleMouseMove(e));
                window.addEventListener(`touchmove`, e => handleTouchMove(e));
            };

            const getUrlParameter = name => {
                name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
                const results = regex.exec(location.search);
                return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
            };

            const handleMouseMove = e => {
                if (socket.connected) {
                    socket.emit(`update`, targetSocketId, {
                        x: e.clientX / window.innerWidth,
                        y: e.clientY / window.innerHeight
                    });
                }
            };

            const handleTouchMove = e => {
                if (socket.connected) {
                    socket.emit(`update`, targetSocketId, {
                        x: e.touches[0].clientX / window.innerWidth,
                        y: e.touches[0].clientY / window.innerHeight
                    });
                }
            };

            init();
        }
    </script>
</body>

</html>
```

Nu krijg ik op mijn app zowel mijn mini chat als de qr code te zien. De volgende stap is om eerst de QR code te zien te krijgen, en als die is gescant pas de mini chat. Ik heb dit zo aangepakt:

## QR code en chat toggle
### ai prompt
Hoe zorg ik dat eerst alleen de QR code te zien is, en pas na scannen de chat?

### ai advies
- Event controller-connected op server.
- Desktop luistert naar event en toggle display van QR → chat.

#### index.html (client side) aanpassingen
##### opgesplitst in 2 containers

```javascript
    <div id="qrContainer">
        <p>Scan deze QR code om te connecten:</p>
        <div id="qr"></div>
        <a id="url" target="_blank"></a>
    </div>

    <div id="chatContainer" style="display:none;">
        <h1>Mini Chat</h1>
        <input id="input" placeholder="Type iets..." />
        <button onclick="sendMessage()">Send</button>
        <ul id="messages"></ul>
    </div>

```

##### qr code en link -> chat tonen nadat controller verbonden is
```javascript
socket.on('controller-connected', () => {
    $qrContainer.style.display = 'none';
    $chatContainer.style.display = 'block';
});
```

##### nieuw event
```javascript
socket.on('message', msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    $messages.appendChild(li);
});
```

##### inline -> apparte functie
```javascript
function sendMessage() {
    const input = document.getElementById('input');
    const msg = input.value;
    if (!msg) return;
    socket.emit('message', msg);
    input.value = '';
}
```


#### index.js (server-side, Node + Express + Socket.io)

```javascript
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
```

### Eigen aanpassing
De ai gebruikte nog het IP adress van de oefening, waardoor dat als ik de QR code scande met mijn gsm, het niet lade. Daarom heb ik nog het IP adress veranderd naar het mijne.

```javascript
const desktopIP = "192.168.1.32:3000";
const url = `http://${desktopIP}/controller.html?id=${socket.id}`;
```

## QR code websockets -> webRTC
Als ik nu met mijn gsm de qr code scan, geeft die qr code mij de link van de localhost. Dit is al goed, maar als mijn telefoon verbonden is met een ander netwerk zal dit niet werken en dat is niet de bedoeling. Daarom zal ik op zoek gaan naar een oplossing met webRTC dat je niet percee op het zelfde netwerk hoeft te zitten.

### Tools die ik heb gebruikt
- Cursor tutorial
- Documentatie: Using WebRTC data channels
- ai om de logica te begrijpen en toe te passen.

### Eerst alles in websockets
Omdat ik de stap te groot vond om direct een bolletje te kunnen laten bewegen met webRTC, heb ik ervoor gekozen om het eerst met webSockets te proberen, en dit in een volgende stap dan om te zetten naar webRtc.

Ik heb voor de bewegende bolletjes de tutorial van de corusor gevold. Ook heb ik de logica van mijn mini chat weg gelaten. Ik weet nu namelijk dat die socket connectie goed zit.

Na de tutorial van de cursor te hebben gevold is dit mijn code:


#### index.js
#### ai prompt
Bekijk deze code en pas deze aan voor het gebruik van WebRTC

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); 

io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    // Controller meldt zich bij een desktop
    socket.on('controller-connected', desktopId => {
        console.log(`Controller ${socket.id} connected for desktop ${desktopId}`);
        io.to(desktopId).emit('controller-connected', socket.id);
    });

    // Ontvangen van cursor updates
    socket.on('cursor-update', ({ desktopId, x, y }) => {
        io.to(desktopId).emit('cursor-update', { controllerId: socket.id, x, y });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

#### index.html
#### ai prompt
Bekijk deze code en pas deze aan voor het gebruik van WebRTC

```javascript
<!DOCTYPE html>
<html>

<head>
    <title>QR & WebRTC Demo</title>
    <style>
        .cursor {
            position: absolute;
            width: 3rem;
            height: 3rem;
            background: red;
            border-radius: 50%;
            transition: all 0.05s linear;
        }
    </style>
</head>

<body>
    <div id="qrContainer">
        <p id="status">Scan QR code met je gsm</p>
        <div id="qr"></div>
        <a id="url" target="_blank"></a>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>

    <script>
        const socket = io();
        const $qrContainer = document.getElementById('qrContainer');
        const $url = document.getElementById('url');
        const $status = document.getElementById('status');

        let targetControllerId;
        let cursors = {}; // controllerId => div

        // QR code genereren
        socket.on('connect', () => {
            const desktopIP = "192.168.1.32:3000"; // pas aan
            const url = `http://${desktopIP}/controller.html?id=${socket.id}`;
            $url.textContent = url;
            $url.setAttribute('href', url);

            const qr = qrcode(4, 'L');
            qr.addData(url);
            qr.make();
            document.getElementById('qr').innerHTML = qr.createImgTag(4);
        });

        // Controller meldt zich
        socket.on('controller-connected', controllerId => {
            targetControllerId = controllerId;
            $status.textContent = "Controller connected! 🎉";
            console.log("Controller connected:", targetControllerId);

            if (!cursors[controllerId]) {
                const $cursor = document.createElement('div');
                $cursor.classList.add('cursor');
                $cursor.style.left = '50px';
                $cursor.style.top = `${$qrContainer.offsetTop + $qrContainer.offsetHeight + 20}px`;
                document.body.appendChild($cursor);
                cursors[controllerId] = $cursor;
            }
        });

        // Cursor updates ontvangen
        socket.on('cursor-update', ({ controllerId, x, y }) => {
            let $cursor = cursors[controllerId];
            if (!$cursor) {
                $cursor = document.createElement('div');
                $cursor.classList.add('cursor');
                document.body.appendChild($cursor);
                cursors[controllerId] = $cursor;
            }
            $cursor.style.left = `${x * window.innerWidth}px`;
            $cursor.style.top = `${y * window.innerHeight}px`;
        });
    </script>
</body>

</html>
```

#### controller.html
#### ai prompt
Bekijk deze code en pas deze aan voor het gebruik van WebRTC

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Controller</title>
    <style>
        #touchCursor {
            position: absolute;
            width: 3rem;
            height: 3rem;
            background: blue;
            border-radius: 50%;
            pointer-events: none;
        }
    </style>
</head>

<body>
    <h1>Controller</h1>
    <div id="touchCursor"></div>

    <script src="/socket.io/socket.io.js"></script>

    <script>
        const socket = io();
        const desktopId = new URLSearchParams(window.location.search).get('id');
        if (!desktopId) alert("Missing desktop ID in URL!");

        socket.emit('controller-connected', desktopId);

        const $touchCursor = document.getElementById('touchCursor');

        const sendCursor = e => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            // update eigen bolletje
            $touchCursor.style.left = `${e.clientX}px`;
            $touchCursor.style.top = `${e.clientY}px`;

            // stuur naar desktop
            socket.emit('cursor-update', { desktopId, x, y });
        };

        const handleTouch = e => {
            e.preventDefault();
            sendCursor(e.touches[0]);
        };

        window.addEventListener('mousemove', sendCursor);
        window.addEventListener('touchstart', handleTouch, { passive: false });
        window.addEventListener('touchmove', handleTouch, { passive: false });
        window.addEventListener('touchend', handleTouch, { passive: false });
        window.addEventListener('touchcancel', handleTouch, { passive: false });
    </script>
</body>

</html>
```

Alles werkt nu goed met websockets, nu moet ik ervoor zorgen dat mijn cursor updates gebeuren met WebRTC

## Nu de cursor verplaatsing met websockets veranderen naar webRTC
### ai prompt
Geef een stappenplan van hoe ik mijn project kan optimaliseren zodat ik websockets alleen gebruik voor signalling en webrtc voor de aansturing.
- code van de cursor oefening

### ai antwoord
### index.js
```javascript
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
```

### index.html
```javascript
<!DOCTYPE html>
<html>

<head>
    <title>QR & WebRTC Demo</title>
    <style>
        .cursor {
            position: absolute;
            width: 3rem;
            height: 3rem;
            background: red;
            border-radius: 50%;
            transition: all 0.05s linear;
        }
    </style>
</head>

<body>
    <div id="qrContainer">
        <p id="status">Scan QR code met je gsm</p>
        <div id="qr"></div>
        <a id="url" target="_blank"></a>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>

    <script>
        const socket = io();
        const $qrContainer = document.getElementById('qrContainer');
        const $url = document.getElementById('url');
        const $status = document.getElementById('status');

        let peers = {};       // controllerId -> RTCPeerConnection
        let dataChannels = {}; // controllerId -> DataChannel
        let cursors = {};     // controllerId -> div

        // QR code genereren
        socket.on('connect', () => {
            const desktopIP = "192.168.1.32:3000"; // pas aan naar jouw lokale IP
            const url = `http://${desktopIP}/controller.html?id=${socket.id}`;
            $url.textContent = url;
            $url.setAttribute('href', url);

            const qr = qrcode(4, 'L');
            qr.addData(url);
            qr.make();
            document.getElementById('qr').innerHTML = qr.createImgTag(4);
        });

        // Nieuwe controller meldt zich via signalling (offer)
        socket.on('webrtc-offer', async ({ controllerId, offer }) => {
            const pc = new RTCPeerConnection();
            peers[controllerId] = pc;

            // Data channel ontvangen van controller
            pc.ondatachannel = event => {
                const channel = event.channel;
                dataChannels[controllerId] = channel;

                channel.onmessage = e => {
                    const { x, y } = JSON.parse(e.data);

                    let $cursor = cursors[controllerId];
                    if (!$cursor) {
                        $cursor = document.createElement('div');
                        $cursor.classList.add('cursor');
                        document.body.appendChild($cursor);
                        cursors[controllerId] = $cursor;
                    }
                    $cursor.style.left = `${x * window.innerWidth}px`;
                    $cursor.style.top = `${y * window.innerHeight}px`;
                };
            };

            pc.onicecandidate = e => {
                if (e.candidate) {
                    socket.emit('webrtc-ice-candidate', { targetId: controllerId, candidate: e.candidate });
                }
            };

            await pc.setRemoteDescription(offer);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit('webrtc-answer', { controllerId, answer });

            $status.textContent = "Controller connected! 🎉";
        });

        // ICE candidates ontvangen
        socket.on('webrtc-ice-candidate', ({ candidate }) => {
            Object.values(peers).forEach(pc => {
                pc.addIceCandidate(candidate).catch(e => console.error(e));
            });
        });
    </script>
</body>

</html>
```


### controller.html

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Controller</title>
    <style>
        #touchCursor {
            position: absolute;
            width: 3rem;
            height: 3rem;
            background: blue;
            border-radius: 50%;
            pointer-events: none;
        }
    </style>
</head>

<body>
    <h1>Controller</h1>
    <div id="touchCursor"></div>

    <script src="/socket.io/socket.io.js"></script>

    <script>
        const socket = io();
        const desktopId = new URLSearchParams(window.location.search).get('id');
        if (!desktopId) alert("Missing desktop ID in URL!");

        const pc = new RTCPeerConnection();
        const dataChannel = pc.createDataChannel('cursor');

        dataChannel.onopen = () => console.log("Data channel open!");

        pc.onicecandidate = e => {
            if (e.candidate) {
                socket.emit('webrtc-ice-candidate', { targetId: desktopId, candidate: e.candidate });
            }
        };

        (async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('webrtc-offer', { desktopId, offer });
        })();

        socket.on('webrtc-answer', ({ answer }) => {
            pc.setRemoteDescription(answer);
        });

        const $touchCursor = document.getElementById('touchCursor');

        const sendCursor = e => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            $touchCursor.style.left = `${e.clientX}px`;
            $touchCursor.style.top = `${e.clientY}px`;

            if (dataChannel.readyState === "open") {
                dataChannel.send(JSON.stringify({ x, y }));
            }
        };

        const handleTouch = e => {
            e.preventDefault();
            sendCursor(e.touches[0]);
        };

        window.addEventListener('mousemove', sendCursor);
        window.addEventListener('touchstart', handleTouch, { passive: false });
        window.addEventListener('touchmove', handleTouch, { passive: false });
        window.addEventListener('touchend', handleTouch, { passive: false });
        window.addEventListener('touchcancel', handleTouch, { passive: false });
    </script>
</body>

</html>
```

## Inzicht
Ik vroeg AI om een stappenplan, maar kreeg eigenlijk al een volledig werkende code, zonder uitleg erbij. Maar ik stelde me tog een paar vragen bij de code. 
- Waarom hebben we in deze code peers nodig? Ik wil niet met meerdere controllers werken. Daarom heb ik peers uit de code gehaald.
- De code gebruikt nog altijd het IP adress voor de qr code, ik zal een oplossing moeten vinden om dit op te lossen, zodat de code niet meer afhankelijk is van het lokale ip adress. Ik had dit in de documentatie van mdn gevonden, maar weet niet zeker of dit is wat ik nodig heb. https://developer.mozilla.org/en-US/docs/Web/API/Location/origin : console.log(window.location.origin);

- Waarom word er in controller.html passive false gebruikt? -> Dit gebeurd omdat je anders op de pagina kan scrollen, dit is niet handig als je het bolletje probeerd te verplaatsen.







