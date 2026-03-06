/* client code, gsm */

const socket = io();
const desktopId = new URLSearchParams(window.location.search).get('id');

const swipeSection = document.querySelector('.swipe-section');

const startScreen = document.getElementById("startScreen");

let gameStarted = false;

if (!desktopId) {
    alert("Missing desktop ID in URL!");
}

const $touchCursor = document.getElementById('touchCursor');

// Controller is initiator
const peer = new SimplePeer({
    initiator: true,
    trickle: true
});

// Signalling naar desktop sturen
peer.on('signal', data => {
    socket.emit('signal', {
        targetId: desktopId,
        signal: data
    });
});

// Signalling ontvangen
socket.on('signal', ({ signal }) => {
    peer.signal(signal);
});

peer.on('connect', () => {
    console.log("Controller connected to desktop");
    socket.emit('registerController', desktopId);
});

// Wanneer desktop disconnect
window.addEventListener('beforeunload', () => {
    socket.emit('controllerDisconnected', desktopId);
});


// swipe
// Cursor sturen
const sendCursor = e => {
    const rect = swipeSection.getBoundingClientRect();

    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    if (!gameStarted) {
        gameStarted = true;

        if (peer.connected) {
            peer.send(JSON.stringify({
                type: "start"
            }));
        }
    }

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

    // Visuele blauwe bol
    $touchCursor.style.left = `${rect.left + localX}px`;
    $touchCursor.style.top = `${rect.top + localY}px`;

    if (peer.connected) {
        peer.send(JSON.stringify({
            type: 'move',
            x: x,
            y: y
        }));
    }
};

const handleTouch = e => {
    e.preventDefault();
    sendCursor(e.touches[0]);
};

swipeSection.addEventListener('mousemove', sendCursor);
swipeSection.addEventListener('touchstart', handleTouch, { passive: false });
swipeSection.addEventListener('touchmove', handleTouch, { passive: false });

// grow
const growBtn = document.querySelector('.grow');

growBtn.addEventListener('click', () => {
    if (peer.connected) {
        peer.send(JSON.stringify({ type: 'grow' }));
    }
});

// shrink
const shrinkBtn = document.querySelector('.shrink');

shrinkBtn.addEventListener('click', () => {
    if (peer.connected) {
        peer.send(JSON.stringify({ type: 'shrink' }));
    }
});


