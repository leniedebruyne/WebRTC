/* client code, desktop */


const socket = io();

const $url = document.getElementById('url');
const $status = document.getElementById('status');
const $qrContainer = document.getElementById('qrContainer');

let peer = null;
let cursor = null;
let currentControllerId = null;

const balloon = document.querySelector('.balloon');


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

            if (message.type === 'move') {
                handleMovement(message.x, message.y);
            }

            if (message.type === 'grow') {
                activateGrow();
            } else if (message.type === 'shrink') {
                activateShrink();
            }
        });

        peer.on('connect', () => {
            $status.textContent = "Controller connected!";
            $qrContainer.style.display = "none";
        });

        socket.on('controllerDisconnected', () => {
            resetToQR();
        });

        peer.on('connect', () => {
            $status.textContent = "Controller connected!";
            $qrContainer.style.display = "none";

            const gameDiv = document.querySelector('.game');
            gameDiv.style.display = "block"; // show de game

            startClouds();
            startTimer();
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