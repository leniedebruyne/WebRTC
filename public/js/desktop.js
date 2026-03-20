/* client code, desktop */
import { startClouds, resetGame, startTimer, activateGrow, activateShrink, activateBoost } from './ui.js';

// socket en peer
const socket = io();
const $url = document.getElementById('url');
const $status = document.getElementById('status');
const $qrContainer = document.getElementById('qrContainer');
export let peer = null;
let currentControllerId = null;

// ballon
export const balloon = document.querySelector('.balloon');

// reset
const gameDiv = document.querySelector('.game');




// QR genereren wanneer desktop connect
socket.on('connect', () => {

    const url = `${window.location.origin}/controller.html?id=${socket.id}`;

    $url.textContent = url;
    $url.href = url;

    const qr = qrcode(4, 'L');
    qr.addData(url);
    qr.make();
    document.getElementById('qr').innerHTML = qr.createImgTag(4);
});

// Signalling via socket
socket.on('signal', ({ senderId, signal }) => {
    currentControllerId = senderId;

    // Maak peer enkel aan bij eerste connect
    if (!peer) {
        peer = new SimplePeer({
            initiator: false,
            trickle: true
        });

        // Stuur signalling data terug
        peer.on('signal', data => {
            socket.emit('signal', {
                targetId: currentControllerId,
                signal: data
            });
        });

        // 1x initial position
        balloon.style.left = `${window.innerWidth / 2 - balloon.offsetWidth / 2}px`;
        balloon.style.top = `${window.innerHeight / 2 - balloon.offsetHeight / 2}px`;

        // Wanneer data binnenkomt (cursor)
        peer.on('data', data => {
            const message = JSON.parse(data);

            if (message.type === "motionReady") {
                document.getElementById("waitingPermission").style.display = "none";

                const gameDiv = document.querySelector('.game');
                gameDiv.style.display = "block";

                startClouds();
            }

            if (message.type === "start") {
                resetGame();
                startTimer();
            }

            if (message.type === "shake") {
                activateBoost();
            }

            if (message.type === 'move') {
                handleMovement(message.x, message.y);
            }

            if (message.type === 'grow') {
                activateGrow();
            } else if (message.type === 'shrink') {
                activateShrink();
            }
        });

        socket.on('controllerDisconnected', () => {
            resetToQR();
        });

        socket.on('peerDisconnected', () => {
            resetToQR();
        });

        peer.on('connect', () => {
            $status.textContent = "Controller connected!";
            $qrContainer.style.display = "none";

            document.getElementById("waitingPermission").style.display = "flex";
        });



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
    }

    peer.signal(signal);
});



// reset bij disconnect
function resetToQR() {
    gameDiv.style.display = "none";

    balloon.style.left = `${window.innerWidth / 2 - balloon.offsetWidth / 2}px`;
    balloon.style.top = `${window.innerHeight / 2 - balloon.offsetHeight / 2}px`;

    $qrContainer.style.display = "flex";
    $status.textContent = "Scan the QR code with your cell phone";

    if (peer) {
        peer.destroy();
        peer = null;
    }
}

window.addEventListener('requestResetBoosts', () => {
    if (peer && peer.connected) {
        peer.send(JSON.stringify({ type: "resetBoosts" }));
    }
});