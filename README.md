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


## Qr code zonder IP adress
Nu werkt de QR code goed, maar hij werkt met het IP adress, het is de bedoeling dat ik met mijn gsm de QR code kan scannen en kan connecteren met mijn laptop, ookal zitten ze niet op hetzelfde wifi adress.

Ik heb wat research gedaan naar hoe ik dit kan doen. Het eerste dat ik tegen kwam was een code stuk op MDN. https://developer.mozilla.org/en-US/docs/Web/API/Location/origin



```javascript
console.log(window.location.origin); // On this page returns 'https://developer.mozilla.org'
```

Ik heb dit zo in mijn code geïntegreerd:

```javascript
const url = `${window.location.origin}/controller.html?id=${socket.id}`;
```
Mijn localhost wou echter niet verbinden met deze integratie. Ik kreeg geen error dus wist ook niet wat er mis was, daarom heb ik het gevraagd aan ai.

### ai prompt
Ik probeer een code te integreren waar ik een QR code heb op desktop, die ik kan scannen met mijn gsm. Ik probeer een manier te vinden om deze connectie niet te maken met een IP adress, ik dacht dat ik iets had gevonden, maar mijn gsm geeft aan dat hij niet kan verbinden met deze host. Ook krijg ik geen error, wat kan er mis zijn? 

### Dit zijn de oplossingen die AI gaf
- port forwarding
- Een TURN‑server gebruiken -> niet gratis
- Je project online hosten

Volgens mij is port forwarding de beste optie voor wat ik wil bereiken. Dit zijn de stappen die moet ondernemen in mijn code:
https://code.visualstudio.com/docs/debugtest/port-forwarding


#### 1. index.js

```javascript
server.listen(3000, '0.0.0.0', () => {
  console.log("Server running on port 3000");
});

```
#### 2. Lan-ip adress vinden
192.168.1.32
via deze website: https://whatismyipaddress.com/
IPv4: 81.244.7.174

#### 3. inloggen op router
http://192.168.1.1

#### 4. Zoek “Port Forwarding” of “NAT”

#### 5. Maak een nieuwe port forwarding regel

#### 6. Vind je publieke IP

#### 7. Test of je server publiek bereikbaar is

#### 8. Pas je QR‑code aan

Dit is de code die ik heb toegevoegd:
Index.js:
```javascript
server.listen(3000, '0.0.0.0', () => { console.log("Server running on port 3000"); });

```

index.html:

```javascript
            const publicIP = "81.244.7.174";
            const url = `http://${publicIP}:3000/controller.html?id=${socket.id}`;

```

Maar het werkt nog niet als ik http://81.244.7.174:3000 opzoek op mijn telefoon op 4G. Daarom heb ik aan ai gevraagd wat het probleem kan zijn.
Die zegt dat ik data moet veranderen in mijn router.

Het laatste dat ik vond is ngrok, een API die dit eigenlijk zelf afhandeld. Dit zijn de stappen voor het gebruiken ervan:

```javascript
ngrok http 3000

```

dan krijg je een code, die je moet veranderen in je const url.

-> https://subministrant-kimora-haughty.ngrok-free.dev/

```javascript
const desktopIP = "192.168.1.32:3000";
const url = `http://${desktopIP}/controller.html?id=${socket.id}`;

```

->

```javascript
const url = `${window.location.origin}/controller.html?id=${socket.id}`;

```

en dit:

```javascript
const qr = qrcode(4, 'L');
```

->

```javascript
const qr = qrcode(0, 'L');
```

Nu werkt de qr code ook als ik die wil scannen met mijn gsm die op 4g zit. Het probleem is nu dat hij de beweging van het bolletje niet meer waarneemt.

## Consult 1
### Qr code
In het consult werd duidelijk dat ik de QR code zonder IP wat te ver zogt, de oplossing had ik al lang gevonden, namelijk gewoon met window location werken. Dit is dus de code voor de qr code:

index.js:
```javascript
server.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
```

index.html:
```javascript
const desktopIP = "192.168.1.32:3000"; 
const url = `${window.location.origin}/controller.html?id=${socket.id}`; 
```

Nu kan ik mijn website via deze link bekijken: http://192.168.1.32:3000/

### Concept
Mijn concept werd ook goed gekeurd, wel moest ik er rekning mee houden dat mensen niet heel de tijd naar hun gsm mogen kijken, daarom zal ik niet met apparte buttons werken, maar met vlakken. Zo zal het makkelijker zijn voor de gebruiker en hoeven ze niet elke keer te kijken welke button ze moeten klikken.

### Simple peer
Ook moet ik proberen om simple peer in te voegen, dit geeft een kortere notatie weer. 

### http -> https 
Omdat ik wil gaan werken met de kanteling van mijn gsm, zal ik inplaats van met htpp moeten werken met https

## goal voor volgende week
Voor het consult van volgende week wil ik de ui klaar hebben. Ook wil ik al de basic interacties hebben (klikken, slepen, ...). Ik wil ook al eens bekeken hebben hoe de kanteling van de gsm in zijn werk zal gaan.

## simple peer
Ik ben begonnen met de feedback van simple peer toe te passen. Dit zijn de dingen die ik heb gewijzigd in mijn code:

index,js:
```javascript
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
```

index,html: 
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/simple-peer/9.11.1/simplepeer.min.js"></script>
```

```javascript
let peer = null;
let cursor = null;
let currentControllerId = null;

socket.on('signal', ({ senderId, signal }) => {

    currentControllerId = senderId;

    if (!peer) {
        peer = new SimplePeer({
            initiator: false,
            trickle: true
        });

        peer.on('signal', data => {
            socket.emit('signal', {
                targetId: currentControllerId,
                signal: data
            });
        });

        peer.on('data', data => {
            const { x, y } = JSON.parse(data);

            if (!cursor) {
                cursor = document.createElement('div');
                cursor.classList.add('cursor');
                document.body.appendChild(cursor);
            }

            cursor.style.left = `${x * window.innerWidth}px`;
            cursor.style.top = `${y * window.innerHeight}px`;
        });

        peer.on('connect', () => {
            $status.textContent = "Controller connected!";
            $qrContainer.style.display = "none";
        });
    }

    peer.signal(signal);
});
```

controller.html: 
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/simple-peer/9.11.1/simplepeer.min.js"></script>
```

```javascript
const peer = new SimplePeer({
    initiator: true,
    trickle: true
});

peer.on('signal', data => {
    socket.emit('signal', {
        targetId: desktopId,
        signal: data
    });
});

socket.on('signal', ({ signal }) => {
    peer.signal(signal);
});

peer.on('connect', () => {
    console.log("Data channel open!");
});
```

```javascript
const sendCursor = e => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    $touchCursor.style.left = `${e.clientX}px`;
    $touchCursor.style.top = `${e.clientY}px`;

    if (peer.connected) {
        peer.send(JSON.stringify({ x, y }));
    }
};
```

## html structuur
Daarna heb ik gezorgt voor de html structuur van mijn ui. 
### desktop
Op mijn desktop had ik bovenaan een bar. In die bar staat de tijd die je al bezig bent aan de game en de high score die al is gemaakt. Daar onder speelt de game zich af. Je ziet geleidelijk aan wolkjes op de achtergrond verschijnen en weer verdwijnen. Ook vliegt er een vogel rond, als je deze raakt ben je af. En als laatste zie je ook nog een ballon. Deze kan je besturen met je gsm.

```javascript
<div class="game">
        <!-- UI -->
        <div class="hud">
            <span class="time">Time: 00:00</span>
            <span class="best">Best: 00:00</span>
        </div>
        <!-- Wolken-container -->
        <div class="clouds"></div>
        <!-- Ballon -->
        <div class="balloon"> <img src="/assets/Balloon.svg" alt="balloon"> </div>
        <!-- Vogel -->
        <div class="bird"> <img src="/assets/Bird.png" alt="bird"> </div>
    </div>
```


### phone
Op mijn phone heb ik veel gewerkt met div's omdat deze makkelijker zijn om dan bijvoorbeeld een klik op schuif event op te zetten. Mijn eerste div bovenaan heeft de tekst "Shake for boost" en daar onder 3 bolletjes, die aantonen hoeveel boosts je al hebt gebruikt. Daar onder heb je 2 buttons die samen in een div zitten. De eerste button is om de ballon grootter te maken, de andere is om hem terug kleiner te maken. Je kan deze knoppen altijd gebruiken, maar de ballon heeft maar 3 groottes: klein, normaal of groot. Daar onder staat de laatste div, daar stata de tekst "Swipe to move" en een arrow die aangeeft dat je van links naar rechts moet swipen. Dit zal er voor zorgen dat je de ballon kan verschuiven.

```javascript
 <div class="game-ui">
        <div class="boost-section">
            <p class="title">Shake for boost</p>
            <div class="indicators"> <span class="dot"></span> <span class="dot"></span> <span class="dot"></span>
            </div>
        </div>
        <div class="actions">
            <button class="btn grow">Tap to grow</button>
            <button class="btn shrink">Tap to shrink</button>
        </div>
        <div class="swipe-section">
            <p>Swipe to move</p>
            <div class="arrow"></div>
        </div>
    </div>
```

Ook heb ik een map toegevoegd genaamd assets, waar ik mijn images heb ingestoken.

## css
Daarna was het tijd om de css toe te voegen.
### Desktop
Als eerste heb ik ervoor gezorgt dat de qr code in het midden van het scherm stond, met een achtergrondkleur. Daarna heb ik de css van de game zelf gemaakt, waar onder de achtergrond gradient, tijd bar, de ballon heb ik voor een tijdje statisch gezet, maar het is natuurlijk straks de bedoeling dat die kan bewegen. Ook heb ik een kleine animatie op de vogel gezet, die vliegt nu heen en weer, het is nog niet hoe het er moet uitzien, maar de gedachte word wel getoond. En ook voor de wolkjes heb ik een kleine animatie die later word aangevuld met javascript.

```javascript
<style>

        .cursor {
            position: absolute;
            width: 3rem;
            height: 3rem;
            background: red;
            border-radius: 50%;
            transition: all 0.05s linear;
        }


        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: linear-gradient(to top, #65A9E7, #D7ECFE);
            font-family: 'Arial', sans-serif;
        }

        #qrContainer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #65A9E7;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        #qrContainer p {
            font-size: 1.5rem;
            margin-bottom: 20px;
        }

        .game {
            display: none;
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }

        .hud {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 200px;
            font-size: 45px;
            color: #333;
            background: rgba(248, 250, 254, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 10;
        }

        .balloon {
            position: absolute;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 120px;
        }

        .bird {
            position: absolute;
            top: 30%;
            left: 0;
            width: 60px;
            height: auto;
            animation: fly 6s linear infinite alternate;
        }

        @keyframes fly {
            0% {
                left: 0;
                transform: scaleX(1);
            }

            100% {
                left: 90%;
                transform: scaleX(-1);
            }
        }

        .clouds {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .cloud {
            position: absolute;
            bottom: -150px;
            width: 283px;
            height: 131px;
            pointer-events: none;
            background-size: contain;
            background-repeat: no-repeat;
            opacity: 0.9;

            transform-origin: bottom center;
            transform: scale(var(--scale, 1));
        }

        @keyframes rise {
            from {
                transform: scale(var(--scale, 1)) translateY(0);
            }

            to {
                transform: scale(var(--scale, 1)) translateY(-130vh);
            }
        }
    </style>
```

### Phone
Voor mijn ui van mijn phone heb ik ervoor gezorgt dat de plaatsen waarop je kunt tikken groot genoeg waren, zodat je niet elke keer hoeft te kijken. Alles van de ui is nu nog statisch, zoals ook de bolletjes van de boost, die zullen later logica krijgen.







```javascript
<style>
        #touchCursor {
            position: absolute;
            width: 3rem;
            height: 3rem;
            background: blue;
            border-radius: 50%;
            pointer-events: none;
        }

        body {
            background: linear-gradient(#6894d1, #1e4fbf);
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            font-family: sans-serif;
        }

        .game-ui {
            width: 300px;
            text-align: center;
            color: #D7ECFE;
        }

        .boost-section {
            margin-top: 10px;
            text-align: center;
        }

        .boost-section .title {
            font-size: 25px;
        }

        .boost-section .indicators {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
        }

        .dot {
            width: 12px;
            height: 12px;
            background: #D7ECFE;
            opacity: 0.5;
            border-radius: 50%;
        }

        .boost-section .dot {
            width: 25px;
            height: 25px;
            background: #D7ECFE;
            opacity: 0.5;
            border-radius: 50%;
        }

        .actions {
            display: flex;
            flex-direction: column;
            gap: 25px;
            margin-top: 35px;
            align-items: center;
        }

        .btn {
            width: 293px;
            height: 150px;
            border-radius: 20px;
            border: none;
            font-size: 25px;
            cursor: pointer;
            background: #D7ECFE;
            color: #4174AC;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .grow {
            font-weight: bold;
        }

        .shrink {
            font-weight: normal;
        }

        .swipe-section {
            width: 100vw;
            margin-left: 50%;
            transform: translateX(-50%);
            margin-top: 50px;
            background: rgba(255, 255, 255, 0.2);
            border-top-left-radius: 25px;
            border-top-right-radius: 25px;
            padding: 25px 0;
            text-align: center;
        }

        .swipe-section p {
            font-size: 30px;
            margin: 0 0 15px 0;
            color: #D7ECFE;
        }

        .arrow {
            width: 120px;
            height: 40px;
            background-image: url('/assets/Arrow.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin: 0 auto;
        }
    </style>
```

## Javascript
Voor de logica van de wolken was er ook wat javascript nodig, ik wou namelijk dat er wolken op de achtergrond bewogen, zodat het lijkt alsof het beeld omhoog beweegt. Ik wou maximum 4 wolken op mijn scherm, zodat er niet te veel waren. Ook mochten ze een verschillende scale hebben. 
Voor deze logica heb ik ai gebruikt om te zien hoe ik de spawn van de wolken moest aanpakken.

### ai
Ik wil logica schrijven waarbij wolken om de woveel tijd spawnen, er mogen maximum 4 wolken op het scherm aanwezig zijn en de wolken mogen een verschillende scale hebben. Kun je me helpen met het schrijven van de logica?

### output

```javascript
const cloudContainer = document.querySelector('.clouds');
const maxClouds = 4;

function spawnCloud() {
    console.log("Nieuwe wolk wordt gespawnd!");

    if (!cloudContainer) {
        console.log("cloudContainer bestaat nog niet!");
        return;
    }

    if (cloudContainer.children.length >= maxClouds) {
        console.log("Max aantal wolken bereikt:", cloudContainer.children.length);
        return;
    }

    const cloud = document.createElement('div');
    cloud.classList.add('cloud');

    cloud.style.backgroundImage = "url('/assets/Cloud.png')";
    cloud.style.left = Math.random() * 80 + 10 + "vw";

    const scale = Math.random() * 0.6 + 0.7;
    cloud.style.setProperty('--scale', scale);
    const duration = Math.random() * 10 + 8;
    cloud.style.animation = `rise ${duration}s linear forwards`;

    cloudContainer.appendChild(cloud);

    console.log("Wolk toegevoegd! Totaal nu:", cloudContainer.children.length);

    cloud.addEventListener('animationend', () => {
        cloud.remove();
        console.log("💨 Wolk verdwenen (animationend)");
    });
}


// Elke 2–4 seconden een nieuwe wolk proberen spawnen
function startClouds() {
    if (!cloudContainer) {
        console.log(".clouds niet gevonden!");
        return;
    }

    console.log("Wolken-animatie gestart!");
    setInterval(() => {
        spawnCloud();
    }, 2500);
}
```

Ik vond deze code goed geschreven, het is duidelijk, het doet wat het moet doen en de console.logs zijn handig moest er iets mislopen met de wolken. 

## Ballon swipe logica
### Ballon op de plaats van het bolletje
Nu wil ik inplaats dat ik een bolletje zie bewegen op mijn desktop, dat ik de ballon kan bewegen. Daarvoor moet ik een beetje logica veranderen in mijn peer.on functie. Ik zal de ballon mee geven met een queryselector, zodat de functie aan de ballon kan om die te bewegen. De if statement heb ik niet meer nodig, omdat de ballon nu wel al bestaat in mijn html. 

```javascript
peer.on('data', data => {
    const { x, y } = JSON.parse(data);

    const balloon = document.querySelector('.balloon');

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const balloonWidth = balloon.offsetWidth;
    const balloonHeight = balloon.offsetHeight;

    // Zet ballonpositie gebaseerd op normalized x/y van phone
    const newX = x * screenWidth - balloonWidth / 2;
    const newY = y * screenHeight - balloonHeight / 2;

    balloon.style.left = `${newX}px`;
    balloon.style.top = `${newY}px`;
});
```


Ook heb ik de css een klein beetje vereenvoudigd, zodat deze de javascript niet kan overschrijven.

```javascript
.balloon {
    position: absolute;
    width: 80px;
    height: 120px;
}
```

### Alleen swipen in de bijhorende div
Nu kun je de ballon besturen via de gsm, maar dit kan nog over heel de gsm. Ik wil dat je alleen kunt swipen in het gebied die daarvoor dient.

Nu luister ik nog naar de beweging op heel het scherm, dat is het eerste dat ik zal veranderen. Als eerste zal ik de div selecteren waarin de swipe mag gebeuren.

```javascript
const swipeSection = document.querySelector('.swipe-section');

```

Nu kan ik geen window.innerWidth meer gebruiken, maar .swipe-section, ook heb ik ai gevraagd hoe ik kan checken of het nog binnen de swipe section zit. ZO heb ik dit aangepast:

```javascript
const sendCursor = e => {
    const rect = swipeSection.getBoundingClientRect();

    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    // Check of we binnen de swipe-section zitten
    if (
        localX < 0 || 
        localY < 0 || 
        localX > rect.width || 
        localY > rect.height
    ) {
        return;
    }

    const x = localX / rect.width;
    const y = localY / rect.height;

    $touchCursor.style.left = `${e.clientX}px`;
    $touchCursor.style.top = `${e.clientY}px`;

    if (peer.connected) {
        peer.send(JSON.stringify({ x, y }));
    }
};

```

Ook bij mijn eventListeners kon ik geen window.addEventListener gebruiken, ik moest nu ook swipeSection.addEventListener doen.


```javascript
swipeSection.addEventListener('mousemove', sendCursor);
swipeSection.addEventListener('touchstart', handleTouch, { passive: false });
swipeSection.addEventListener('touchmove', handleTouch, { passive: false });
```

Daarna zat ik wat vast met mij logica. Je kunt nu inderdaad alleen in die div swipen, maar als de qr code net opent, spawnt de ballon nog bovenaan het scherm, de ballon volgde de bal ook nog niet. Daarom heb ik even de hulp van ai gevraagd, om te kijken wat het probleem is.

Als eerste heb ik de touchCursor plaats veranderd, zodat hij niet meer bovenaan begint.

```javascript
$touchCursor.style.left = `${rect.left + localX}px`;
$touchCursor.style.top = `${rect.top + localY}px`;
```

Ook heb ik de ballon een startpositie gegeven.

```javascript
const balloon = document.querySelector('.balloon');

balloon.style.left = `${window.innerWidth / 2}px`;
balloon.style.top = `${window.innerHeight / 2}px`;
```

Als laatste heb ik ervoor gezorgt dat de ballon niet uit het scherm gaat.

```javascript
const clampedX = Math.max(0, Math.min(screenWidth - balloonWidth, newX));
const clampedY = Math.max(0, Math.min(screenHeight - balloonHeight, newY));

balloon.style.left = `${clampedX}px`;
balloon.style.top = `${clampedY}px`;

```
Dankzei deze aanpassingen gaat mijn ballon nu mee met mijn beweging, en kun je alleen maar swipen in het vak. 

### balletje op phone onzichtbaar maken
Als laatste wil ik dat je het balletje op phone niet meer ziet, maar dat het wel blijft bestaan. Dit heb ik zo aangepakt.
Dit heb ik gedaan met deze css lijn: 

```javascript
opacity: 0;
```

## Logica time indicator
De volgende stap is om de time en best time te doen werken. Ik zal beginnen met de time, die loopt gewoon op vanaf de qr code is gescant.

```javascript
let startTime = null;
let timerInterval = null;

const timeEl = document.querySelector('.time');
```

```javascript
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
```

```javascript
function startTimer() {
    startTime = Date.now();

    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeEl.textContent = `Time: ${formatTime(elapsed)}`;
    }, 1000);
}
```

```javascript
startTimer();
```

## Vogel
### Animatie 
Nu ga ik eerst door met de animatie van de vogel en daarna ook de levens, deze logica heb ik nodig voor ik de best time kan invoegen.

Voor de vogels wil ik dat er max 1 op het scherm is. Ik zal mijn rond draaiende animatie weg doen, als hij van links komt staat hij normaal, komt hij van rechts? dan flip ik hem.

Als eerste heb ik de css veranderd, zodat deze de toekomstige logica niet overschrijft.


```javascript
        .bird {
            position: absolute;
            width: 60px;
            height: auto;
            transition: transform 0.2s linear;
        }
```

Daarna heb ik javascript logica toegevoegd. Als eerste heb ik de bird met een queryselector geselecteerd, zodat de functie hier aan kan. 

Daarna heb ik aan ai gevraagd hoe ik die verschillende logica kan combineren in een functie.

```javascript
const bird = document.querySelector('.bird');
const gameArea = document.querySelector('.game');
let direction = 1; 
let speed = 2;
let pos = 0;
let birdExists = false

function spawnBird() {
    if (birdExists) return; // als er al een vogel is, spawn niet

    birdExists = true; // markeer dat er nu een vogel is

    const bird = document.createElement('div');
    bird.classList.add('bird');
    bird.innerHTML = '<img src="/assets/Bird.png" alt="bird">';

    // Random top positie
    const topPos = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.1;
    bird.style.top = `${topPos}px`;

    // Random kant van spawn
    const fromLeft = Math.random() < 0.5;

    let pos = fromLeft ? -60 : window.innerWidth + 60; // start net buiten scherm
    let direction = fromLeft ? 1 : -1; // richting
    bird.style.left = pos + 'px';
    bird.style.transform = `scaleX(${fromLeft ? 1 : -1})`;

    // Random snelheid
    const speed = Math.random() * 3 + 1;

    gameArea.appendChild(bird);

    function animate() {
        pos += speed * direction;
        bird.style.left = pos + 'px';

        if ((direction === 1 && pos > window.innerWidth + 60) ||
            (direction === -1 && pos < -60)) {
            bird.remove();
            birdExists = false; // vogel is weg, kan een nieuwe spawnen
            return;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// spawn vogel elke 1–5 sec, maar alleen als er geen vogel is
setInterval(() => {
    spawnBird();
}, 1000); // interval check elke 1 sec, spawnBird zorgt dat er max 1 is

```

Deze functie werkt goed en ik begrijp wat er allemaal gebeurd. 


### levens logica
Daarna was het tijd om de logica van de levens te schrijven. Ik wil dat je 3 levens hebt, die kun je zien in de top bar div. Er staan 3 gevulde hartjes, elke keer als de ballon tegen de vogel botst, verdwijnt er een hartje. Als je hartjes op zijn, stopt het spel.

Als eerste heb ik mijn div aangepast, zodat er ook hartjes staan.

```javascript
<div class="hud">
    <span class="time">Time: 00:00</span>
    <span class="best">Best time: 00:00</span>
    <div class="lives">
        ❤️ ❤️ ❤️
    </div>
</div>
```

Dan heb ik ervoor gezorgt dat je 3 levens hebt en dat de functie aan de hartjes kan.

```javascript
let lives = 3; // start met 3 levens
const livesContainer = document.querySelector('.hud .lives');
```

Voor de volgende stap heb ik ai zijn hulp gevraagd. Ik wist nog dat je iets moest dien met client rect maar wist niet meer precies hoe dat in zijn werk ging. Dit is de code die hij gaf:

```javascript
function animate() {
    pos += speed * direction;
    bird.style.left = pos + 'px';

    // check collision met ballon
    const birdRect = bird.getBoundingClientRect();
    const balloonRect = balloon.getBoundingClientRect();

    if (
        birdRect.left < balloonRect.right &&
        birdRect.right > balloonRect.left &&
        birdRect.top < balloonRect.bottom &&
        birdRect.bottom > balloonRect.top
    ) {
        // botsing gedetecteerd
        bird.remove();
        birdExists = false;

        // verwijder 1 hartje
        lives--;
        updateLivesUI();

        if (lives <= 0) {
            endGame();
        }

        return; // stop animatie van deze vogel
    }

    // check of buiten scherm
    if ((direction === 1 && pos > window.innerWidth + 60) ||
        (direction === -1 && pos < -60)) {
        bird.remove();
        birdExists = false;
        return;
    }

    requestAnimationFrame(animate);
}
```

Daarna moest ik nog een fucntie maken die de hartjes opdate, voor elk leven dat er is moet er een hartje staan.

```javascript
function updateLivesUI() {
    livesContainer.textContent = '❤️'.repeat(lives);
}
```

Ook wil ik dat het spel stopt als er geen levens meer zijn. Nu zal ik dit nog doen met een alert, later zal ik hier een UI scherm voor maken. Ook stop ik de timer en de vogels die binnen komen.

```javascript
function endGame() {
    alert("Game Over!");
    clearInterval(birdInterval);
    clearInterval(timerInterval);
}
```

Ik had een bug waarbij dat als de ballon de vogel raakte, de hartjes nog niet weg gingen. Ik heb daarom een console.log toegevoegd. Daar kwam uit dat de levens functie nog niet verbonden was met de vogel, maar ik wist niet hoe ik dit dan moest aanpakken. Daarom heb ik wederom AI zijn hulp gevraagd hiervoor.

```javascript
function spawnBird() {
    if (birdExists) return;

    birdExists = true;

    const bird = document.createElement('div');
    bird.classList.add('bird');
    bird.innerHTML = '<img src="/assets/Bird.png" alt="bird">';

    const topPos = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.1;
    bird.style.top = `${topPos}px`;

    const fromLeft = Math.random() < 0.5;
    let pos = fromLeft ? -60 : window.innerWidth + 60;
    let direction = fromLeft ? 1 : -1;
    bird.style.left = pos + 'px';
    bird.style.transform = `scaleX(${fromLeft ? 1 : -1})`;

    const speed = Math.random() * 3 + 1;

    gameArea.appendChild(bird);

    function animate() {
    // kleine stapjes per frame
    const step = speed * direction;
    const steps = Math.ceil(Math.abs(step)); // aantal sub-stapjes

    for (let i = 0; i < steps; i++) {
        pos += direction; // 1px per sub-stap
        bird.style.left = pos + 'px';

        const birdRect = bird.getBoundingClientRect();
        const balloonRect = balloon.getBoundingClientRect();

        if (
            birdRect.left < balloonRect.right &&
            birdRect.right > balloonRect.left &&
            birdRect.top < balloonRect.bottom &&
            birdRect.bottom > balloonRect.top
        ) {
            console.log("⚠️ Botsing gedetecteerd!");
            bird.remove();
            birdExists = false;

            lives--;
            updateLivesUI();

            if (lives <= 0) {
                endGame();
            }
            return; // stop animatie
        }
    }

    if ((direction === 1 && pos > window.innerWidth + 60) ||
        (direction === -1 && pos < -60)) {
        bird.remove();
        birdExists = false;
        return;
    }

    requestAnimationFrame(animate);
}

    animate();
}
```

## Best score
Daarna heb ik een klein beetje logica geschreven voor de beste score te kunnen bijhouden. Ik heb dit gedaan met LocalStorage.

Eerst heb ik het element met de class .best geselecteerd met een queryselector, dan heb ik er ook voor gezorgt dat de beste tijd uit de localstorage gehaald kan worden.

```javascript
const bestEl = document.querySelector('.best');
let bestTime = parseInt(localStorage.getItem('bestTime')) || 0;
```

Daarna heb ik een klein beetje logica geschreven, die de best time update.
```javascript

function updateBestTimeUI() {
    if (bestTime > 0) {
        bestEl.textContent = `Best time: ${formatTime(bestTime)}`;
    } else {
        bestEl.textContent = `Best time: 00:00`;
    }
}
```

Ook heb ik de endgame functie wat aangepast, zodat de besttime word geüpdate als het spel eindigd.

```javascript
function endGame() {
    clearInterval(birdInterval);
    clearInterval(timerInterval);

    const finalTime = Date.now() - startTime;

    if (finalTime > bestTime) {
        bestTime = finalTime;
        localStorage.setItem('bestTime', bestTime);
    }

    updateBestTimeUI();

    alert("Game Over!");
}

```

## grow button
Hierna is het de bedoeling dat je de ballon kan doen groeien en krimpen. Als de ballon groot is, gaat de tijd wat trager, als de ballon klein is, gaat het sneller.
Ik heb dit zo aangepakt:

Eerst pak ik de grow button met de query selector.

```javascript
const growBtn = document.querySelector('.grow');
```

Daarna moest ik een manier vinden om ervoor te zorgen dat de receiver iets met grow kan doen. Daar zat ik wat vast, dus heb ik AI om hulp gevraagd. Dit is de uitkomst:

```javascript
growBtn.addEventListener('click', () => {
    if (peer.connected) {
        peer.send(JSON.stringify({ type: 'grow' }));
    }
});
```

Ook kan ik nu inplaats van alleen maar schuiven, meerdere soorten data krijgen. Daarom heb ik mijn peer on wat moeten veranderen.

```javascript
peer.on('data', data => {
    const message = JSON.parse(data);

    // Cursor movement
    if (message.x !== undefined && message.y !== undefined) {
        handleMovement(message.x, message.y);
    }

    // Grow action
    if (message.type === 'grow') {
        toggleGrow();
    }
});
```

En ook mijn handlemovement heb ik wat moeten veranderen hierdoor.

```javascript
function handleMovement(x, y) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const balloonWidth = balloon.offsetWidth;
    const balloonHeight = balloon.offsetHeight;

    const newX = x * screenWidth - balloonWidth / 2;
    const newY = y * screenHeight - balloonHeight / 2;

    const clampedX = Math.max(0, Math.min(screenWidth - balloonWidth, newX));
    const clampedY = Math.max(0, Math.min(screenHeight - balloonHeight, newY));

    balloon.style.left = `${clampedX}px`;
    balloon.style.top = `${clampedY}px`;
}
```

Daarna kon ik zelf terug verder met de logica. Het eerste wat ik moest doen is de ballon groter maken als er op de knop word geklikt.


```javascript
let balloonScale = 1;
let speedMultiplier = 1;
let isBoosted = false;
```

```javascript
function toggleGrow() {
    if (!isBoosted) {
        // BOOST AAN
        balloonScale = 1.8;     
        speedMultiplier = 0.3; 
        isBoosted = true;
    } else {
        // BOOST UIT
        balloonScale = 1;
        speedMultiplier = 1;
        isBoosted = false;
    }

    balloon.style.transform = `scale(${balloonScale})`;
}
```

Ook wou ik dat alles trager leek te gaan, daarom heb ik ervoor gezorgt dat de wolken en vogels trager gaan als de button actief is.

### vogels

```javascript
let baseSpeed = Math.random() * 3 + 1;
```

```javascript
const step = baseSpeed * speedMultiplier * direction;
```

### wolken

```javascript
const duration = Math.random() * 10 + 8;
```

```javascript
const duration = (Math.random() * 10 + 8) / speedMultiplier;
```

Hetzelfde heb ik gedaan voor de kleine button, maar dan met omgekeerde logica.

## Moeilijkheid spel
Het spel is nu nog wat te makkelijk, daarom zal ik in dit stuk meer vogels toevoegen.

### Meer vogels

```javascript
function spawnRandomBirds() {
    const currentBirds = gameArea.querySelectorAll('.bird').length;
    const targetBirds = Math.floor(Math.random() * 3) + 1; // 1, 2 of 3
    const maxToSpawn = targetBirds - currentBirds;

    if (maxToSpawn <= 0) return; // al genoeg vogels

    for (let i = 0; i < maxToSpawn; i++) {
        spawnBird();
    }
}
```

### Code opschonen
Ook heb ik een opschoninn van mijn code gedaan. Soms staan er nu functies in functies, omdat ik alles bij elkaar wou houden om te testen of de code werkte en om alles makkelijk terug te vinden om aan te passen maar dit is niet hoe het moet staan. Aangezien dat alles tot nu toe werkt, zal ik deze code al wat opschonen.






















