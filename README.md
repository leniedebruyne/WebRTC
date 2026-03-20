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

## Code opschonen
Ook heb ik een opschoninn van mijn code gedaan. Soms staan er nu functies in functies, omdat ik alles bij elkaar wou houden om te testen of de code werkte en om alles makkelijk terug te vinden om aan te passen maar dit is niet hoe het moet staan. Aangezien dat alles tot nu toe werkt, zal ik deze code al wat opschonen.

## http -> https
Omdat ik met de kanteling van mijn gsm wil werken om een boost te geven, zal ik moeten werken met https. Daarom heb ik het hoofdstukje security van guthub gevolgd om dit te kunnen doen.
Dit is nu de link om mijn project te bekijken: https://192.168.1.32:3000/

## Eind scherm
Tot nu toe krijg je gewoon een alert als het spel gedaan is, en moet je helemaal opnieuw de qr code gaan scannen om het spel opnieuw te starten. Dit wil ik gaan aanpassen door een eindscherm met een button toe te voegen, die direct het spel herstart.

Als eerste heb ik de functie bijgewerkt die het spel stopt. Ik heb ervoor gezorgt dat de ballon niet meer zichbaar is. En dat er geen botsingen meer kunnen gebeuren tussen de ballon en vogels.

```javascript
function endGame() {
    clearInterval(timerInterval);
    balloon.style.display = 'none';

    const finalTime = Date.now() - startTime;
    if (finalTime > bestTime) {
        bestTime = finalTime;
        localStorage.setItem('bestTime', bestTime);
    }
    updateBestTimeUI();

    gameOver = true; 

    showRestartButton();
}
```
Daarna heb ik bij de animatie functie van de vogels toegevoegd dat als er minder dan 0 levens zijn, de functie end game mag beginnen.

```javascript
     if (!gameOver) {
            if (
                birdRect.left < balloonRect.right &&
                birdRect.right > balloonRect.left &&
                birdRect.top < balloonRect.bottom &&
                birdRect.bottom > balloonRect.top
            ) {
                // botsing
                bird.remove();
                lives--;
                updateLivesUI();
                if (lives <= 0) endGame();
                return;
            }
        }
```
Daarna heb ik ook een resetgame functie gemaakt die je opnieuw 3 levens geeft, de ballon terug zichbaar zet en de botsingen opnieuw actief maakt.

```javascript
function resetGame() {
    lives = 3;
    updateLivesUI();

    balloon.style.display = 'block';
    setNormalMode();

    gameOver = false; 
    startTimer();
}
```

Als laatste heb ik ook een button functie gemaakt, die een button toont als het spel voorbij is. Ik heb de keuze gemaakt om de styling van de button in javascript te doen, omdat ik de controle wou over wanneer ik hem toonde en wanneer niet. Het zou meer werk geweest zijn in css om hem niet te tonen als het spel gaat en wel te tonen als het spel gedaan is.

```javascript
function showRestartButton() {
    if (document.querySelector('#restartBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'restartBtn';
    btn.textContent = 'Speel opnieuw';
    btn.style.position = 'absolute';
    btn.style.top = '50%';
    btn.style.left = '50%';
    btn.style.transform = 'translate(-50%, -50%)';
    btn.style.padding = '20px 40px';
    btn.style.fontSize = '2rem';
    btn.style.borderRadius = '15px';
    btn.style.border = 'none';
    btn.style.background = '#65A9E7';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = 100;

    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        btn.remove();  
        resetGame();    
    });
}
```


## Boost
Nu wil ik verder met het maken van een boost. Het is de bedoeling dat de gebruiker de gsm kan kantelen, en dat zo de ballon sneller lijkt te gaan. In werkelijkheid zal ik juist de omgeving sneller moeten laten bewegen. 

Omdat ik niet direct wist hoe ik hier aan moest beginnen, heb ik wat documentatie opgezogt op MDN:
https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent

Daar heb ik geleerd hoe ik acces kan vragen en met die data iets kan doen.

Ook heb ik deze kleine tutorial gekeken:
https://www.youtube.com/watch?v=fMDuFoqSQfw

Daar kon ik deze theorie in de praktijk zien om dan te veranderen naar mijn eigen logica.

## Planning
Voor volgende week wil ik graag nog meer research doen in het bewegen van de gsm en hoe ik die data kan gebruiken. Ook wil ik graag mijn game nog wat meer optimaliseren en de logica van de boost toevoegen.

## Consult 2
### Feedback spel
Als het spel afgelopen is, komt er nu een button in beeld waar je op kan klikken om het spel opnieuw te starten. Het zou een bere performance zijn om het spel met een timer opnieuw te herstarten en als er iemand connect (dus de qr code heeft gescant), dan met een afteller het spel begint. 

### Technische feedback
#### Javascript en css in apparte bestanden
Alle javascript en css moet uit de index en controller. Dit zal de bestanden overzichtelijker maken, ik kan dit doen met script type modul en dan importeren en exporteren. 

#### Swipe logica een type geven

Ook moet ik bij mijn swipe logica ook met een type werken, dit maakt het consistener.
```javascript
        peer.on('data', data => {
            const message = JSON.parse(data);

            if (message.type === 'move') {
                handleMovement(message.x, message.y);
            }

            if (message.type === 'grow') {
                activateGrow();
            } else if (message.type === 'shrink') {
                activateShrink();
            }
        });
```

#### Else if logica bij grow en shrink

Bij mijn grow en shrink logica is het beter om met een else if te werken, zodat de code niet heel de tijd opnieuw uitgevoerd moet worden. 

```javascript
        peer.on('data', data => {
            const message = JSON.parse(data);

            if (message.type === 'move') {
                handleMovement(message.x, message.y);
            }

            if (message.type === 'grow') {
                activateGrow();
            } else if (message.type === 'shrink') {
                activateShrink();
            }
        });
```

#### Connectie verbroken -> opnieuw qr code scherm


Als de connectie word verbroken, moet het scherm terug resetten naar de qr code.
Als eerste had ik een code nodig die een event kan sturen als de gsm weg gaat.

```javascript
window.addEventListener('beforeunload', () => {
    socket.emit('controllerDisconnected', desktopId);
});
```

Dan heb ik een code nodig in mijn controller die een functie aanroept als dat gebeurd.

```javascript
        socket.on('controllerDisconnected', () => {
            resetToQR();
        });
```

En dit is de functie die hij aanroept:


```javascript
function resetToQR() {
    const gameDiv = document.querySelector('.game');
    gameDiv.style.display = "none";

    balloon.style.left = `${window.innerWidth / 2 - balloon.offsetWidth / 2}px`;
    balloon.style.top = `${window.innerHeight / 2 - balloon.offsetHeight / 2}px`;

    $qrContainer.style.display = "flex";
    $status.textContent = "Scan QR code met je gsm";

    if (peer) {
        peer.destroy();
        peer = null;
    }
}
```

#### inplaats van een button als het spel eindigd, een afteller. Daarna word je terug naar het begin van het spel gestuurd.
Het is de bedoeling dat als het spel eindigd, je terug word gestuurd naar het begin van het spel met een timer die aftelt. Zo moet je niet elke keer op een button klikken om door te gaan.

Ik heb de functie showRestartButton verwijderd en aan ai gevraagd hoe ik de aftel counter best kan aanpakken. Hij gaf me deze code:


```javascript
function startCountdown() {
    let count = 3;

    const countdownEl = document.createElement('div');
    countdownEl.id = "countdown";

    countdownEl.style.position = "absolute";
    countdownEl.style.top = "50%";
    countdownEl.style.left = "50%";
    countdownEl.style.transform = "translate(-50%, -50%)";
    countdownEl.style.fontSize = "6rem";
    countdownEl.style.fontWeight = "bold";
    countdownEl.style.color = "#fff";
    countdownEl.style.zIndex = 100;

    document.body.appendChild(countdownEl);

    countdownEl.textContent = count;

    const interval = setInterval(() => {
        count--;

        if (count <= 0) {
            clearInterval(interval);
            countdownEl.remove();

            resetGame(); // start opnieuw
        } else {
            countdownEl.textContent = count;
        }
    }, 1000);
}
```

Deze functie moest ik dan aanroepen in mijn endGame functie en ook moest ik er voor zorgen dat het spel pas starte als je een swipe deed.


```javascript
let gameStarted = false;

const sendCursor = e => {

    if (!gameStarted) {
        gameStarted = true;

        if (peer.connected) {
            peer.send(JSON.stringify({
                type: "start"
            }));
        }
    }
}

```

##### Kritische bedenking
Deze ui voelde voor mij nog niet goed aan, op het einde van een spel was er een timer die aftelde, maar er stond geen uitleg wat die timer deed. Als je dan terug gezet was naar het begin, stond er geen uitleg dat je moest swipen om het spel te starten. 

Ik heb er nu voor gezorgt dat als de timer ten einde was, het spel direct opnieuw begon. Later zal ik misschien nog logica toevoegen dat je iets moet doen voor het spel opnieuw start.

```javascript

if (message.type === "start") {
resetGame();
startTimer();
}

```

```javascript

function startCountdown() {
    let count = 3;

    const container = document.createElement('div');
    container.id = "countdownContainer";

    container.style.position = "absolute";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.textAlign = "center";
    container.style.zIndex = 100;
    container.style.color = "#fff";
    container.style.fontSize = "3rem";

    container.textContent = `Reset in ${count}...`;
    document.body.appendChild(container);

    const interval = setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(interval);
            container.remove();
            resetGame();  
            startTimer(); 
        } else {
            container.textContent = `Reset in ${count}...`;
        }
    }, 1000);
}

```


## Boost
Nu ga ik verder met de logica van de boost, het is de bedoeling dat je je gsm kan kantelen om je ballon een boost te geven. je hebt max 3 boosts die je in het spel kan gebruiken. Je kan zien hoeveel boosts je hebt door de bolletjes op de gsm ui. 

Aangezien dat het moet lijken alsof de ballon sneller gaat, moet eigenlijk de rest sneller gaan, dus de vogels en wolken.

### Motion log
Als eerste wou ik beginnen met een log te krijgen als ik mijn gsm schudde. Ik wilde eerst, voordat de ui van mijn gsm zichtbaar was, een button hebben staan die je moest aanklikken op toegang te geven tot schud informatie. Ik had gelezen in de documentatie dat dit moet vanaf ios 13.

Daarom heb ik al eerste een div toegveoegd met de button er in.

```javascript

<div id="motionPermission" class="permission-screen">
    <button id="enableMotion">Enable motion</button>
</div>

```

Ik heb die vlug wat css gegeven, later zal ik deze knop mooier maken.

```javascript

.permission-screen {
    position: fixed;
    inset: 0;
    background: #0008;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

```

Daarna wist ik even niet meer hoe ik verder moest. Ik heb dus ai gebruikt.

#### AI 
##### Prompt
Hoe kan ik permission logica schrijven voor toegang te krijgen tot de data van het schudden van een gsm? Ik heb al een div gemaakt met een button waar je op kan klikken om dan toegang te geven. 

##### Code die ai heeft gegeven

```javascript

// --- MOTION PERMISSION FLOW ---
const permissionScreen = document.getElementById("motionPermission");
const enableMotionBtn = document.getElementById("enableMotion");

enableMotionBtn.addEventListener("click", async () => {

    if (typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function") {

        const res = await DeviceMotionEvent.requestPermission();
        if (res !== "granted") {
            alert("Motion permission is nodig om te shakken!");
            return;
        }
    }

    startShakeDetection();

    permissionScreen.style.display = "none";

    if (peer.connected) {
        peer.send(JSON.stringify({ type: "motionReady" }));
    }
});
```



```javascript

.permission-screen {
    position: fixed;
    inset: 0;
    background: #0008;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

```


```javascript

let lastShake = 0;

function startShakeDetection() {
    window.addEventListener("devicemotion", (e) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc) return;

        const strength = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

        if (strength > 35) {
            const now = Date.now();
            if (now - lastShake > 800) {
                lastShake = now;

                if (peer.connected) {
                    peer.send(JSON.stringify({ type: "shake" }));
                }
            }
        }
    });
}

```

```javascript

if (message.type === "motionReady") {
                console.log("Motion permission granted — game mag starten!");

                const gameDiv = document.querySelector('.game');
                gameDiv.style.display = "block";

                startClouds();
            }

```

```javascript
            if (message.type === "shake") {
                console.log("SHAKE ontvangen van controller!");
            }

```

#### Reflectie
Ik ben blij dat ik wat hulp heb gekregen want zelf was ik er waarschijnlijk niet uitgekomen. Ik vond de code van het toegang vragen best moeilijk te begrijpen.

Wat ik wel nog ga veranderen is de logica van de shake in een appart js bestand zetten. Anders staat er te veel logica door elkaar, en het zal nodig zijn voor de volgende stappen om het appart te houden. Daarom heb ik de functies motion permission en shake detection in een appart js bestand gezet.
Ook heb ik een appart css bestand gemaakt voor shake.

Ik heb de button een andere css gegeven zodat hij meer opvalt.

```javascript
#enableMotion {
    font-size: 2rem;
    padding: 20px 40px;
    border-radius: 20px;
    background: #65A9E7;
    color: white;
    border: none;
    font-weight: bold;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    transform: scale(1);
    transition: 0.2s ease;
}

```

Tot nu toe was er en wit scherm op desktop tussen het scannen van de qr code en het wachten op toegang. Daarom heb ik een div toegevoegd met de tekst "Geef toegang op uw gsm ..." Zodat mensen weten dat er daar iets zal moeten gebeuren.


```javascript
<div id="waitingPermission" class="waiting-screen">
    <p>Geef toegang op uw gsm…</p>
</div>
```

```javascript
.waiting-screen {
    position: fixed;
    inset: 0;
    background: #111;
    color: white;
    font-size: 2rem;
    display: none; 
    align-items: center;
    justify-content: center;
    z-index: 999;
}
```

Deze id moet ik dan toevoegen als de peer geconnect is, zodat het overpringt naar dat scherm.


```javascript
peer.on('connect', () => {
    $status.textContent = "Controller connected!";
    $qrContainer.style.display = "none";

    document.getElementById("waitingPermission").style.display = "flex";
});
```

Als de motion is toegestaan, moet dit scherm weer verborgen worden 


```javascript
if (message.type === "motionReady") {
    console.log("Motion permission granted — game mag starten!");

    document.getElementById("waitingPermission").style.display = "none";

    const gameDiv = document.querySelector('.game');
    gameDiv.style.display = "block";

    startClouds();
}
```

## Boost
Nu is het tijd om de boost te maken. Het is de bedoeling dat als de gsm geschud word, je een boost krijgt voor 5 seconden. Het lijkt alsof de ballon sneller gaat, maar het is eigenlijk de wolken en vogels die sneller zullen bewegen. je mag de boost max 3 keer gebruiken, je kunt zien hoeveel boosts je al hebt gebruikt aan de hand van de bolletjes boven het gsm scherm.

### Omgeving sneller bewegen
De eerste logica die ik zal schrijven is het sneller bewegen van de omgeing als er een schud gedetecteerd is.

Omdat ik voor de wolken en vogels al met een multiplier werkte, voor grow en shrink was het makkelijk om die ook te gebruiken bij mijn boost.
Verder heb ik wat meer wolkjes toegevoegd als de boost actief is zodat het wat duidelijker is. Ik heb ervoor gezorgt dat de boost 3 seconden duurt. 


```javascript
window.addEventListener("boost", activateBoost);

function activateBoost() {

    if (boostActive) return;

    boostActive = true;

    const oldMultiplier = speedMultiplier;
    speedMultiplier = 5;

    console.log("boost actief");

    // extra wolken
    for (let i = 0; i < 3; i++) {
        spawnCloud();
    }

    setTimeout(() => {
        speedMultiplier = oldMultiplier;
        boostActive = false;

        console.log("boost voorbij");
    }, 3000);
}
```

Daarna moest ik in mijn desktop.js kunnen zeggen dat als er geshaked word, er een event gebeurd met de naam boost. Dit heb ik gedaan met het window.dispatchEvent. 
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent

Dit zag er zo uit:
```javascript
            if (message.type === "shake") {
                console.log("SHAKE ontvangen van controller");

                window.dispatchEvent(new Event("boost"));
            }
```

### Ui aanpassen
Nu kan je nog zoveel boosts gebruiken als dat je wilt. Het is de bedoeling dat je maar max 3 boost kan gebruiken, en dat je dit aangeduid ziet aan de hand van gekleurde bolletjes.

Ik heb een fucntie gemaakt die de bolletjes update aan de hand van hoeveel boosts er nog zijn.

```javascript
let boostsLeft = 3;
const dots = document.querySelectorAll(".dot");

function updateBoostUI() {

    dots.forEach((dot, index) => {

        if (index < boostsLeft) {
            dot.style.background = "white"; // nog beschikbaar
        } else {
            dot.style.background = "#797575"; // al gebruikt
        }

    });

}
```

Daarna heb ik mijn startShakeDetection functie een beetje aangepast. Ik heb eerst gekeken of er nog boosts over zijn, als die er niet meer zijn gebeurd er niks. Als er wel boosts over zijn verminder ik de counter met 1 en zet ik het bolletje op een grijze kleur. Dan stuur ik een shake bericht naar desktop om de boost functie te starten.

```javascript
 if (boostsLeft > 0 && peer && peer.connected) {

                    boostsLeft--;

                    updateBoostUI();

                    peer.send(JSON.stringify({ type: "shake" }));
                }
```

Hierna werkte de boost maar ik vond dat er nog wat feedback kon zijn als de boost op was. Ik kon gaan werken met een melding, maar als je bezig bent met een spel te spelen is dat super irritand. Daarom heb ik gedacht over een ander soort feedback en ik kwam uit bij het trillen van de gsm als je geen boosts meer hebt.

Ik heb documentatie in MDN gevonden die tonen hoe je je gsm kan laten vibreren met de vibrate metohde.
https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate

Daarom heb ik mijn if statement in startShakeDetection aangevuld met een else en die logica er in.


```javascript
 if (strength > 35) {
            const now = Date.now();
            if (now - lastShake > 800) {
                lastShake = now;

                if (boostsLeft > 0 && peer && peer.connected) {

                    boostsLeft--;

                    updateBoostUI();

                    peer.send(JSON.stringify({ type: "shake" }));
                } else {
                    navigator.vibrate([100, 50, 100]);
                }
            }
        }
```

Ik kwam er helaas achter dat ios vibrate niet ondersteund. Ik moest dus opzoek naar iets anders. Daarom heb ik een bzz sound gedownload en deze in de if statement geplaatst. 

Ook heb ik ervoor gezorgt dat mijn boosts resetten als het spel opnieuw begint. Daarom heb ik een if peer moeten toevoegen in de controller:

```javascript
if (peer) {
    peer.on('data', (data) => {
        const message = JSON.parse(data);
        if (message.type === "resetBoosts") {
            resetBoosts();
        }
    });
}
```

En een functie reset boost:

```javascript
function resetBoosts() {
    boostsLeft = 3;
    updateBoostUI();
}
```

#### AI hulp
Ik heb gemerkt dat ios niet makkelijk is om voor te coderen. Zelfs een sound toevoegen was niet gemakkelijk. Daarom heb ik ai om hulp gevraagd. Dit was de prompt:
Why does the error sound not play when the boosts are empty?

Dit is wat ai antwoorde:

Most likely because sound.play() is being called from the devicemotion event, which is not treated as a user gesture on many mobile browsers (especially iOS).
So the play call is blocked by autoplay policy.

Also, failures are currently silent because play() promise is not handled.

A practical fix is to unlock audio on the button click (real user interaction), then reuse it later.


```javascript
// ...existing code...
if (enableMotionBtn) {
    enableMotionBtn.addEventListener("click", async () => {
        // ...existing code...

        // unlock audio on user gesture
        try {
            sound.muted = true;
            await sound.play();
            sound.pause();
            sound.currentTime = 0;
            sound.muted = false;
        } catch (err) {
            console.warn("Audio unlock failed:", err);
        }

        startShakeDetection();
        permissionScreen.style.display = "none";

        if (peer && peer.connected) {
            peer.send(JSON.stringify({ type: "motionReady" }));
        }
    });
}
// ...existing code...

function startShakeDetection() {
    window.addEventListener("devicemotion", (e) => {
        // ...existing code...

        if (strength > 35) {
            const now = Date.now();
            if (now - lastShake > 800) {
                lastShake = now;

                if (boostsLeft > 0 && peer && peer.connected) {
                    boostsLeft--;
                    updateBoostUI();
                    peer.send(JSON.stringify({ type: "shake" }));
                } else {
                    sound.currentTime = 0;
                    sound.play().catch(err => {
                        console.warn("Error sound blocked:", err);
                    });
                }
            }
        }
    });
}
```

If it still doesn’t play, verify /assets/error.mp3 actually loads (Network tab, status 200).

#### Reflectie
Dit heeft gewerkt. 
Het eerste is dat ik de auto moest activeren door een gebruikers interactie. Dit werd hier gedaan door die in een click handler te steken. 


### Tijd laten versnellen met boost
Ook moest ik de verstreken tijd wat versnellen als er een boost gebeurd, anders is het natuurlijk niet logisch dat je een boost zou doen.
Ik heb ervoor gekozen dat je wat meer tijd extra krijgt van de boost als extra puntjes als je hem durft gebruiken.

Daarom heb ik voor time ook een multiplier aangemaakt, de boost kan die dan opvangen en sneller maken.

```javascript
let elapsedTime = 0;
let lastTick = null;
let timeMultiplier = 1;

function startTimer() {

    lastTick = Date.now();

    timerInterval = setInterval(() => {

        const now = Date.now();
        const delta = now - lastTick;

        elapsedTime += delta * timeMultiplier;

        lastTick = now;

        timeEl.textContent = `Time: ${formatTime(elapsedTime)}`;

    }, 100);
}
```

En omdat ik nu Elapsed time gebruik moet ik dit ook veranderen in de endGame functie en de resetGame.

## Planning week 3
### Wat heb ik in week 2 gedaan?
In week 3 heb ik redelijk veel tecnische elementen toegevoegd en mijn code beter gemaakt. Dit is een lijst aan dingen die ik heb opgelost / toegevoegd.

1. Alle Javascript en css heb ik in apparte bestandjes gezet. Zo word mijn prpoject overzichtelijker.
2. Als mijn gsm uitgaat, en er dus geen connectie meer is, gaat het spel terug naar het scherm met de qr code.
3. Als je verloren bent (geen levens meer hebt) start er automatisch een reset teller die je dan terug brengt naar een nieuw spel.
4. Ook heb ik de boost logica toegevoegd, denk daarbij aan ontvangen als de telefoon geschud word, omgeving sneller laten bewegen, timer sneller laten gaan, ui aanpassen aan hoeveel boosts je nog over hebt en een geluid laten afspelen als je geen boosts meer over hebt.

### Onboarding
Het eerste wat ik in week 3 wil maken is de onboarding. Ik was lang aan het twijfelen hoe ik dit zou aanpakken: In het spel zelf? Foto's? Tekst? Maar ik besloot om voor een goede ui te gaan en de onboarding op het qr code scherm te zetten. Ik zal de visuals met after effects maken, zo kan ik ook leren hoe ik dit dan in mijn code moet zetten. De mensen zien op deze manier al hoe het spel zal gaan terwijl ze de code scannen.
Ik wil de hoofd interacties op de onboarding tonen, deze zijn: swipen, tikken om groter te worden, tikken om kleiner te worden en gsm schudden voor een boost.

### Bug fixes
Ook zal ik nog een aantal kleine bugs proberen fixen. De eerste is dat de botsing soms niet helemaal acuraat is, soms vlieg je tegen een vogel en neemt er geen hartje af. Ik zal proberen vinden aan wat dit probleem kan liggen. Ook beweegt de ballon soms wat hakkerig, daarvoor zal ik ook een oplossing proberen vinden.

### Extra's
Ook lijkt het me leuk om nog wat extra's aan de game toe te voegen. Dit zijn de ideetjes:
1. Hoe langer je in het spel zit, hoe sneller de ballon vliegt (of hoe meer vogels er zijn).
2. Als er een botsing is met een vogel, moet deze een andere kleur worden (bv. rood).
3. Misschien kan ik nog andere "gevaarlijke" elementen toevoegen zoals een vliegtuig of een boom.

## Consult 3
### Extra functies
Het zou duidelijker zijn waarom je je ballon kan laten krimpen en groeien als je dit moet doen om bijvoorbeeld iets te pakken voor extra hartjes of een shield.

### Technisch
-  Best geen window.... gebruiken maar javascript exporteren met type module
-  Zorg ervoor dat alle functies gelijk worden opgemaakt.
- Disconnect mag inderdaad zoals ik het nu heb maar ik mag nog de peer on toevoegen zodat het zeker goed is. 

## Extra hartjes -> Ballon groot
Het volgende dat ik wil doen is op een random moment svg hartjes naar beneden laten vallen, deze kan je alleen pakken als je ballon groot is, en dan komt er een hartje bij.

Het eerste wat ik wil doen is de hartjes op een random tijd van 6-10 seconden laten vallen. 

Ik heb als eerst een div toegevoegd in mijn html.
```javascript
        <!--random hartjes-->
        <div class="hearts"></div>
```

Dan heb ik die wat styling gegeven met css.
```javascript
.heart {
    position: absolute;
    top: -80px;
    width: 80px;
    height: 80px;
    animation: fall 5s linear forwards;
}

.heart svg {
    width: 100%;
    height: 100%;
}
```

Ook heb ik css gebruikt om de val te animeren.
```javascript
@keyframes fall {
    to {
        transform: translateY(110vh);
    }
}
```

Daarna heb ik in javascript de svg toegevoegd en gezorg dat het hartje op een random plaats horizontaal spawnt. 
```javascript
function spawnHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');

    heart.style.left = Math.random() * 90 + "vw";

    heart.innerHTML = `
<svg viewBox="0 0 32 32">
  <path fill="red" d="M16,28.261c-0.757,0-1.515-0.288-2.094-0.867C6.02,20.258,2.02,15.86,2.02,11.275c0-4.001,3.251-7.253,7.253-7.253 c2.115,0,3.955,0.925,5.253,2.464c1.298-1.539,3.138-2.464,5.253-2.464c4.001,0,7.253,3.252,7.253,7.253 c0,4.585-4,8.583-11.886,16.119C17.515,27.973,16.757,28.261,16,28.261z"/>
</svg>
`;

    gameArea.appendChild(heart);

    heart.addEventListener('animationend', () => {
        heart.remove();
    });

}
```

Ook heb ik een kleine functie geschreven die zegt dat het hartje op een random tijd mag vallen. 
```javascript
function scheduleHeart() {

    const randomTime = Math.random() * 4000 + 6000;

    heartTimeout = setTimeout(heartLoop, randomTime);
}
```

Nu is het de bedoeling dat je het hartje kan pakken, en dat er dan een extra leven bijkomt, maar dat kan alleen als de ballon groot is. 

Daarom heb ik weer een botsing logica gemaakt, de meeste logica van de vogel heb ik kunnen gerbruiken, maar er is 1 groot verschil, de logica werkt alleen als de ballon groot is. 

```javascript
function checkHeartCollision() {

    if (currentMode !== "grow") return;

    const balloonRect = balloon.getBoundingClientRect();
    const hearts = document.querySelectorAll('.heart');

    hearts.forEach(heart => {

        const heartRect = heart.getBoundingClientRect();

        if (
            heartRect.left < balloonRect.right &&
            heartRect.right > balloonRect.left &&
            heartRect.top < balloonRect.bottom &&
            heartRect.bottom > balloonRect.top
        ) {

            if (lives < 3) {
                lives++;
                updateLivesUI();
            }

            heart.remove();
        }

    });
}
```
## Shield -> Ballon kleiner
Nu wil ik logica maken dat als de ballon kleiner is, en je botst tegen een schild, dat je voor 8 seconden geen bostsingen kunt hebben.
Ik heb weer veel logica kunnen gebruiken van de botsing, nu was het verschil dat de ballon klein moest zijn om het schild te kunnen pakken, en dat je dan geen botsingen hebt voor 8 seconden. Ook heb ik visueel toegevoegd dat je beschermd bent.

Eerst heb ik een functie geschreven die shields gaat spawnen, dit is eigenlijk deelfde code als de hartjes, behalve dat ze een andere svg hebben.

```javascript
// shield
const shieldContainer = document.createElement('div');
let shieldTimeout;
let shieldActive = false;

function spawnShield() {

    const shield = document.createElement('div');
    shield.classList.add('shield');

    shield.style.left = Math.random() * 90 + "vw";

    shield.innerHTML = `
<svg viewBox="0 0 24 24">
<path fill="#41416e" d="M20.237,6.289C17.142,5.256,13.36,3.3,12.55,2.474a.748.748,0,0,0-.529-.224.82.82,0,0,0-.532.216A20.312,20.312,0,0,1,3.8,6.409a.749.749,0,0,0-.546.721c0,8.232,1.279,12.515,8.545,14.591a.746.746,0,0,0,.412,0C19.517,19.632,20.75,15.492,20.75,7A.75.75,0,0,0,20.237,6.289Z"/>
</svg>
`;

    gameArea.appendChild(shield);

    shield.addEventListener('animationend', () => {
        shield.remove();
    });

}
```

Dan heb ik ook weer een functie gemaakt om de shields te laten spawnen op een random tijdstip, ook deze code is gelijk aan de hartjes code.

```javascript
function scheduleShield() {

    const randomTime = Math.random() * 8000 + 12000;

    shieldTimeout = setTimeout(shieldLoop, randomTime);
}
```

Ook de shield collision is dezelfde code, met uitzondering dat de ballon nu op shrink moet staan.

```javascript
function checkHeartCollision() {

    if (currentMode !== "grow") return;

    const balloonRect = balloon.getBoundingClientRect();
    const hearts = document.querySelectorAll('.heart');

    hearts.forEach(heart => {

        const heartRect = heart.getBoundingClientRect();

        if (
            heartRect.left < balloonRect.right &&
            heartRect.right > balloonRect.left &&
            heartRect.top < balloonRect.bottom &&
            heartRect.bottom > balloonRect.top
        ) {

            if (lives < 3) {
                lives++;
                updateLivesUI();
            }

            heart.remove();
        }

    });
}
```

Daarna heb ik de spawnbird functie een klein beetje moeten aanpassen met de logica van de shield. Als het shield active is, word er geen botsing herkend.
```javascript
                // shield
                if (shieldActive) {
                    bird.remove();
                    birdExists = false;
                    return;
                }
```

Ook heb ik nog een functie toegoegd die visueel een pulsering geeft rond de ballon, zodat het duidelijk is dat je beschermd bent. Ik wist niet zo goed hoe ik dit moest aanpakken, dus heb ik dit aan ai gevraagd.

### Ai
#### Prompt
hey, I want to create a visual shield around the balloon if the shield function is active. I want to do this mostly with css. How do I approach this?

#### Antwoord
Ayy yessss, we can make it clear that the balloon is temporarily protected by giving it a glowy shield effect while shieldActive is true. You can do that entirely via CSS and an extra class. Here's how to add that cleverly:

```javascript
.balloon.shielded {
  box-shadow: 0 0 20px 10px rgba(65, 65, 110, 0.7);
  transition: box-shadow 0.3s ease-in-out;
  border-radius: 50%;
}
```
- box-shadow creates a blue/purple glow around the balloon.

- transition ensures smooth fade in/out.

- border-radius: 50% keeps it round when enlarging/reducing.

Modify JS in activateShield()

You want to add and remove the class when shield is active:

```javascript
function activateShield() {
    shieldActive = true;
    balloon.classList.add('shielded'); // <-- show visual shield

    setTimeout(() => {
        shieldActive = false;
        balloon.classList.remove('shielded'); // <-- hide visual shield
    }, 8000);
}
```

#### Reflectie
De functionaliteit heeft ai goed kunnen oplossen, ik wou graag dat de meeste styling in css gebeurde en dit is goed gelukt. Wat ik wel nog zie is dat de shield nog niet echt game waardig is. Ik heb zelf een after class toegoegd zodat ik wat emeer controle heb over de vorm van de shield.

Ik heb aan Copilot gevraagd of hij de shield visueel wat intressanter kon maken, zodat het wat meer leek op een echte game. Hij heeft een leuke css animatie toegevoegd die pulseerd.

```javascript
.balloon.shielded::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 120%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    pointer-events: none;

    box-shadow:
        0 0 25px 12px rgba(80, 120, 255, 0.6),
        inset 0 0 20px rgba(255, 255, 255, 0.4);

    animation: shieldPulse 1.2s ease-in-out infinite;
}

@keyframes shieldPulse {
    0% {
        box-shadow:
            0 0 25px 12px rgba(80, 120, 255, 0.6),
            inset 0 0 20px rgba(255, 255, 255, 0.4);
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        box-shadow:
            0 0 35px 18px rgba(120, 160, 255, 0.8),
            inset 0 0 25px rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%) scale(1.05);
    }

    100% {
        box-shadow:
            0 0 25px 12px rgba(80, 120, 255, 0.6),
            inset 0 0 20px rgba(255, 255, 255, 0.4);
        transform: translate(-50%, -50%) scale(1);
    }
}
```



## Onboarding
Ik was lang aan het twijfelen hoe ik mijn onboarding zou aanpakken, ik was aan het denken over textuele uitleg, foto's, ... maar uiteindelijk ben ik voor een animatie gegaan. Ik heb dit gekozen voor de user ux, omdat gebruikers zo niet een hele tekst moeten lezen voor ze het kunnen gebruiken. Ze kunnen de kleine tutorial bekijken en dan begrijpen ze hoe het spel werkt.

Ik heb deze stappen in mijn onboarding video verwerkt:
1. Swipen om de ballon te bewegen.
2. Tikken om de ballon groter te maken en om extra levens te pakken.
3. Tikken om de ballon kleiner te maken en om een bescherming te pakken.
4. Telefoon schudden om een boost te krijgen.

Deze onboarding heb ik boven mijn qr code geplaatst. Ook heb ik nog wat styling toegevoegd voor deze pagina. Dit is de html, met de video er in en een extra div voor styling.

```javascript
    <div id="qrContainer">
        <p id="status">Scan QR code met je gsm</p>

        <div class="qr-card">
            <video class="onboarding-video" autoplay muted loop playsinline>
                <source src="/assets/Onboarding.mp4" type="video/mp4">
            </video>

            <div id="qr"></div>
        </div>

        <a id="url" target="_blank"></a>
    </div>
```

En dit is de css met extra styling.

```javascript
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: linear-gradient(to top, #65A9E7, #D7ECFE);
    font-family: 'Arial', sans-serif;
}

#qrContainer {
    position: fixed;
    inset: 0;
    background: linear-gradient(to top, #65A9E7, #D7ECFE);
    z-index: 1000;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 40px;
}

.qr-card {
    display: flex;
    gap: 40px;
    padding: 40px 50px;
    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    align-items: center;
}

#status {
    font-size: 3rem;
    font-weight: 700;
    color: #204062;
    margin-bottom: 40px;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.onboarding-video {
    width: 650px;
    max-width: 60vw;
    border-radius: 16px;
    border: 3px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}


#qr {
    padding: 16px;
    background: white;
    border-radius: 14px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

#url {
    opacity: 0;
}
```

## Status ui
Op het consult werd er gesproken over een ui op dekstop, die aantoont hoe groot je ballon is op het moment van spelen, en hoe snel deze gaat. Dit vond ik een leuk idee dus heb ik geprobeerd om dit zelf ook toe te voegen. ik ben begonnen met de html. Ik heb ervoor gekozen om te werken met een aside, omdat het aan de zijkant van het scherm zal komen.

verder wist ik niet hoe ik de link kon gaan maken met de ui en de groote en snelheid van de ballon. Daarom heb ik ai ingeschakeld.

### AI
#### Prompt
Hey, I want to create a UI block on the side of my desktop. It should show how big the balloon is at any given moment during gameplay, and how fast it’s moving. That way, the user gets real-time updates. I’m wondering how I should combine the logic of all the different functions into that UI block.

#### Antwoord
Updated

public/index.html
public/css/desktop.css
public/js/ui.js
public/js/shake.js
What you see now on desktop

Left status bar in the game with:
Size: Small / Medium / Large
Speed: Slow / Medium / Fast
Boost status: Boost off / Boost active
Grow ⇒ large + slow
Shrink ⇒ small + fast
Boost temporarily increases the displayed speed by 1 step (max Fast)
In reset/normal mode, the status reverts to medium + medium
Would you like me to also hide the same status bar until the game has started (and only display it after motion permission)?

```javascript
        <aside class="status-sidebar-desktop">
            <div class="status-card-desktop">
                <p class="status-label-desktop">Grootte</p>
                <p class="status-value-desktop status-size-value">Middelmatig</p>
                <div class="status-steps-desktop">
                    <span class="status-pill-desktop" data-size="small">Klein</span>
                    <span class="status-pill-desktop is-active" data-size="medium">Middel</span>
                    <span class="status-pill-desktop" data-size="large">Groot</span>
                </div>
            </div>

            <div class="status-card-desktop">
                <p class="status-label-desktop">Snelheid</p>
                <p class="status-value-desktop status-speed-value">Middel</p>
                <div class="status-steps-desktop">
                    <span class="status-pill-desktop" data-speed="slow">Traag</span>
                    <span class="status-pill-desktop is-active" data-speed="medium">Middel</span>
                    <span class="status-pill-desktop" data-speed="fast">Snel</span>
                </div>
                <p class="boost-state-desktop">Boost uit</p>
            </div>
        </aside>
```


```javascript
.status-sidebar-desktop {
    position: absolute;
    top: 140px;
    left: 24px;
    width: 220px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 12;
}

.status-card-desktop {
    padding: 14px 12px;
    border-radius: 16px;
    background: rgba(248, 250, 254, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.status-label-desktop {
    margin: 0;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #2f5f9d;
    opacity: 0.9;
}

.status-value-desktop {
    margin: 6px 0 10px;
    font-size: 30px;
    line-height: 1.05;
    font-weight: 700;
    color: #1f4777;
}

.status-steps-desktop {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.status-pill-desktop {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.55);
    color: rgba(42, 83, 134, 0.65);
}

.status-pill-desktop.is-active {
    background: #4174AC;
    color: #fff;
    font-weight: 700;
}

.boost-state-desktop {
    margin: 10px 0 0;
    font-size: 15px;
    color: #2f5f9d;
    opacity: 0.88;
}

.boost-state-desktop.is-active {
    color: #184a84;
    font-weight: 700;
}
```

```javascript
    window.dispatchEvent(new CustomEvent('boostStateChange', { detail: { active: true } }));
            window.dispatchEvent(new CustomEvent('boostStateChange', { detail: { active: false } }));


```


```javascript
let boostStatusActive = false;

const sizeValueDesktopEl = document.querySelector('.status-size-value');
const speedValueDesktopEl = document.querySelector('.status-speed-value');
const boostStateDesktopEl = document.querySelector('.boost-state-desktop');
const sizePillsDesktop = document.querySelectorAll('.status-pill-desktop[data-size]');
const speedPillsDesktop = document.querySelectorAll('.status-pill-desktop[data-speed]');

const DESKTOP_STATUS_LABELS = {
    size: {
        small: 'Klein',
        medium: 'Middelmatig',
        large: 'Groot'
    },
    speed: {
        slow: 'Traag',
        medium: 'Middel',
        fast: 'Snel'
    }
};

const desktopStatus = {
    size: 'medium',
    speed: 'medium'
};





function updateStatusPillsDesktop(pills, activeValue, key) {
    pills.forEach((pill) => {
        const isActive = pill.dataset[key] === activeValue;
        pill.classList.toggle('is-active', isActive);
    });
}

function getDisplayedSpeedDesktop() {
    const order = ['slow', 'medium', 'fast'];
    const baseIndex = order.indexOf(desktopStatus.speed);

    if (!boostStatusActive) {
        return desktopStatus.speed;
    }

    return order[Math.min(baseIndex + 1, order.length - 1)];
}

function renderDesktopStatus() {
    const displayedSpeed = getDisplayedSpeedDesktop();

    if (sizeValueDesktopEl) {
        sizeValueDesktopEl.textContent = DESKTOP_STATUS_LABELS.size[desktopStatus.size];
    }

    if (speedValueDesktopEl) {
        speedValueDesktopEl.textContent = DESKTOP_STATUS_LABELS.speed[displayedSpeed];
    }

    updateStatusPillsDesktop(sizePillsDesktop, desktopStatus.size, 'size');
    updateStatusPillsDesktop(speedPillsDesktop, displayedSpeed, 'speed');

    if (boostStateDesktopEl) {
        boostStateDesktopEl.textContent = boostStatusActive ? 'Boost actief' : 'Boost uit';
        boostStateDesktopEl.classList.toggle('is-active', boostStatusActive);
    }
}

window.addEventListener('boostStateChange', (event) => {
    boostStatusActive = !!event.detail?.active;
    renderDesktopStatus();
});
```


```javascript
    desktopStatus.size = 'large';
    desktopStatus.speed = 'slow';
    renderDesktopStatus();

        desktopStatus.size = 'small';
    desktopStatus.speed = 'fast';
    renderDesktopStatus();

        desktopStatus.size = 'medium';
    desktopStatus.speed = 'medium';
    renderDesktopStatus();

        renderDesktopStatus();

```

### Reflectie
Ai heeft dit stuk eigenlijk helemaal voor mij geschreven, behalve de index file dan. Wel heb ik de logica van de ui in een appart sidebar.js bestand gestopt, zodat ik deze logica nog eens kan bekijken en aanpassen waar nodig. 

## Planning week 4
Voor volgende week wil ik graag de finishing toutches aan mijn game geven. Er zijn een paar kleine bugs zoals de bosting met de ballon en vogel die niet smooth gebeuren of de ballon die een beetje hapert. Deze zal ik nog proberen oplossen. Ook de feedback van het volgende consult zal ik nog meenemen.

### Wat heb ik in week 3 gedaan?
In week 3 heb ik ervoor gezorgt dat mijn game wat meer waarde kreeg. 
- Ik heb ervoor gezorgt dat je de ballon groter moest maken om hartjes te kunnen vangen en kleiner voor een schild. 
- Ook heb ik de onboarding aan mijn spel toegevoegd op het qr code spel zodat het duidelijk was hoe het spel in zijn werg ging.
- Ook heb ik een ui kader gemaakt die toont hoe snel en hoe groot je ballon is.

## Consult 3
In dit consult hebben we de finishing toutches besproken. Dit zijn de dingen die ik nog zal veranderen:
- Het is beter om de ballon status visueel weer te geven.
- Ook heb ik mijn probeersels van functie exports getoont die niet lukten, we hebben bekeken hoe ik dit beter kan aanpakken. Dit zal ik nog verweken in mijn code.

## Visuele ui
Op het consult is er besproken dat het beter was om de gegevens van de ballon visueel weer te geven. Nu staat er een lader langs de zijkant die aangeeft of de ballon "small, medium of large" is en "slow, normal of fast". Op het consult werd er besproken dat het leuk zou zijn om de snelheid met een meter weer te geven. Daar ben ik dus mee begonnen. De grootte zal ik weergeven door een verticale bar die zich vult aan de hand van de groote van de ballon. Ook heb ik besloten om de boost ook visueler te maken, door een toggle.

Ik heb mijn html een beetje moeten aanpassen, ik heb vooral gebruik gemaakt van div's.



```javascript
<!-- SIZE -->
            <div class="status-card-desktop">
                <p class="status-label-desktop">Size</p>

                <div class="size-indicator">
                    <div class="size-bar">
                        <div class="size-fill"></div>
                    </div>
                </div>

                <p class="status-value-desktop status-size-value">Medium</p>
            </div>


            <!-- SPEED -->
            <div class="status-card-desktop">
                <p class="status-label-desktop">Speed</p>

                <div class="speed-gauge">
                    <div class="gauge-fill"></div>
                </div>

                <p class="status-value-desktop status-speed-value">Medium</p>
            </div>

            <!-- BOOST -->
            <div class="status-card-desktop boost-card">
                <p class="status-label-desktop">Boost</p>
            
                <div class="boost-toggle">
                    <div class="boost-switch">
                        <div class="boost-knob"></div>
                    </div>
                    <span class="boost-label">Inactive</span>
                </div>
            </div>

```

Deze heb ik dan visueel gemaakt met css. Hiervoor heb ik een beetje hulp gevraagd aan ai, omdat ik graag in css alles wou tekenen. Dit kwam uit het resultaat:



```javascript
/* speed */
.speed-gauge {
    width: 120px;
    height: 60px;
    border-radius: 120px 120px 0 0;
    background: #D7ECFE;
    overflow: hidden;
    position: relative;
    border: 2px solid #1f4777;
    margin: 10px 0;
}

.gauge-fill {
    width: 200%;
    height: 200%;
    position: absolute;
    bottom: -100%;
    left: -50%;
    background: conic-gradient(#65A9E7 0deg,
            #4174AC 120deg,
            #1f4777 240deg);
    transform: rotate(-90deg);
    transform-origin: center;
    transition: transform 0.4s ease;
}


/* size */
.size-indicator {
    width: 60px;
    height: 100px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.size-bar {
    width: 20px;
    height: 100%;
    background: #D7ECFE;
    border: 2px solid #1f4777;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.size-fill {
    width: 100%;
    height: 0%;
    background: linear-gradient(to top,
            #4174AC,
            #65A9E7);

    position: absolute;
    bottom: 0;
    left: 0;

    transition: height 0.3s ease;
}

.status-label-desktop {
    margin-bottom: 12px;
}



/* boost */
.boost-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.boost-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
}

.boost-switch {
    width: 50px;
    height: 26px;
    background: #D7ECFE;
    border: 2px solid #1f4777;
    border-radius: 20px;

    display: flex;
    align-items: center;
    padding: 2px;
    position: relative;
    transition: background 0.3s ease;
}

.boost-knob {
    width: 18px;
    height: 18px;
    background: #1f4777;
    border-radius: 50%;
    transition: margin-left 0.3s ease;
}


.boost-switch.active .boost-knob {
    margin-left: auto;
}

.boost-label {
    font-size: 1rem;
    color: #1f4777;
}

```

Als laatste heb ik de logica van de woorden weg gedaan, deze had ik namelijk niet meer nodig. Wat ik heb toegevoegd zijn gewoon de variabelen van de speed, size en boost:

```javascript
const sizeValueDesktopEl = document.querySelector('.status-size-value');
const speedValueDesktopEl = document.querySelector('.status-speed-value');
```

En dan ben ik begonnen met de logica voor de speed meter. Ik heb ervoor gezorgt dat de woorden zoals slow, medium, fast, ... wordt omgezet naar getallen. Zo kan ik deze getallen gebruiken in de rotatie van de meter.

```javascript
function getSpeedRotation(speed) {
    switch (speed) {
        case 'slow': return -60;
        case 'medium': return 0;
        case 'fast': return 60;
        default: return 0;
    }
}


```

Daarna heb ik de logica toegepast dat als er een element is om te roteren, dan haalt de functie de rotatiehoek op via getSpeedRotation en past daarna het CSS rotate toe.


```javascript
    if (gaugeFill) {
        const rotation = getSpeedRotation(displayedSpeed);
        gaugeFill.style.transform = `rotate(${rotation}deg)`;
    }

```

Voor de size indicator logica heb ik net hetzelfde gedaan maar dan voor de size van de ballon.


```javascript
const sizeFill = document.querySelector('.size-fill');

```

```javascript
function getSizeHeight(size) {
    switch (size) {
        case 'small': return 30;
        case 'medium': return 60;
        case 'large': return 100;
        default: return 60;
    }
}

```


```javascript
    if (sizeFill) {
        const height = getSizeHeight(desktopStatus.size);
        sizeFill.style.height = `${height}%`;
    }
```

Voor de boost logica heb ik gewoon gezorgt voor een toggle knop die aan of uit staat.

```javascript
const boostSwitch = document.querySelector('.boost-switch');
const boostLabel = document.querySelector('.boost-label');
```


```javascript
    if (boostSwitch && boostLabel) {
        boostSwitch.classList.toggle('active', boostStatusActive);
        boostLabel.textContent = boostStatusActive ? 'Active' : 'Inactive';
    }
```

## Code opkuisen
Daarna heb ik er mijn werk van gemaakt om alle code eens goed te doorlopen en op te kuisen. Ik heb alle ongebruikte variabelen weg gedaan en ook heb ik gezien dat ik 2 keer een functie animation had die eigenlijk hetzelfde deed, dus 1 daarvan heb ik weg gedaan. Wat ik wel heb opgemerkt is dat in de ui.js sommige variabelen in het grijs staan, met de tekst "'...' is declared but its value is never read.". Dit vind ik raar want de variabelen worden wel degelijk gebruikt in mijn code. Voor de rest is alles inorde om in te leveren.

## Reflectie
Ik vond dit een leuke en leerzame opdracht. Het was interessant om te zien hoe weinig code je eigenlijk nodig hebt om een connectie te maken tussen verschillende apparaten en daar informatie tussen door te sturen.

Ook heb ik Copilot leren gebruiken in mijn code. In het begin moest ik hier wel even aan wennen, omdat het mijn code automatisch aanvulde en ik niet meteen doorhad dat je die suggesties ook gewoon kunt weigeren. Toen ik dat eenmaal doorhad, werkte ik er eigenlijk best graag mee.

Daarnaast heb ik mezelf gepusht om eerst zelf na te denken over hoe ik iets zou aanpakken, voordat ik AI om hulp vroeg. Zo kon ik mijn eigen code skills blijven verbeteren.






























