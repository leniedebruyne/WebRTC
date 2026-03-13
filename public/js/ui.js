// import
/* import resetBoosts from '/js/controller.js'; */

// wolken
const cloudContainer = document.querySelector('.clouds');
const maxClouds = 4;
const cloud = document.createElement('div');

// time
let startTime = null;
let timerInterval = null;
const timeEl = document.querySelector('.time');
let timeMultiplier = 1;
let timeOffset = 0;
let elapsedTime = 0;
let lastTick = null;

// vogel
const bird = document.querySelector('.bird');
const gameArea = document.querySelector('.game');
let direction = 1;
let speed = 2;
let pos = 0;
let birdExists = false;

// levens
let lives = 3;
let gameOver = false;
const livesContainer = document.querySelector('.hud .lives');

// best time
const bestEl = document.querySelector('.best');
let bestTime = parseInt(localStorage.getItem('bestTime')) || 0;

// grow
let balloonScale = 1;
let speedMultiplier = 1;
let currentMode = "normal";





// wolken functie
function spawnCloud() {
    if (!cloudContainer) {
        return;
    }

    if (cloudContainer.children.length >= maxClouds) {
        return;
    }

    const cloud = document.createElement('div');
    cloud.classList.add('cloud');

    cloud.style.backgroundImage = "url('/assets/Cloud.png')";
    cloud.style.left = Math.random() * 80 + 10 + "vw";

    const scale = Math.random() * 0.6 + 0.7;
    cloud.style.setProperty('--scale', scale);
    const duration = (Math.random() * 10 + 8) / speedMultiplier;


    cloud.style.animation = `rise ${duration}s linear forwards`;

    cloudContainer.appendChild(cloud);

    cloud.addEventListener('animationend', () => {
        cloud.remove();
    });
}

// Elke 2–4 seconden een nieuwe wolk proberen spawnen
function startClouds() {
    if (!cloudContainer) {
        return;
    }

    setInterval(() => {
        spawnCloud();
    }, 1000 / speedMultiplier);
}



// time functie
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    lastTick = Date.now();

    function updateTimer() {

        const now = Date.now();
        const delta = now - lastTick;

        elapsedTime += delta * timeMultiplier;
        lastTick = now;
        timeEl.textContent = `Time: ${formatTime(elapsedTime)}`;
    }

    timerInterval = setInterval(updateTimer, 100);
}



// vogel functie
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

    let baseSpeed = Math.random() * 3 + 1;

    gameArea.appendChild(bird);

    function animate() {
        const step = baseSpeed * speedMultiplier * direction;
        const steps = Math.ceil(Math.abs(step));

        for (let i = 0; i < steps; i++) {
            pos += direction;
            bird.style.left = pos + 'px';

            const birdRect = bird.getBoundingClientRect();

            const balloonImg = balloon.querySelector('img');
            const balloonRect = balloonImg.getBoundingClientRect();
            if (
                birdRect.left < balloonRect.right &&
                birdRect.right > balloonRect.left &&
                birdRect.top < balloonRect.bottom &&
                birdRect.bottom > balloonRect.top
            ) {

                // shield
                if (shieldActive) {
                    bird.remove();
                    birdExists = false;
                    return;
                }


                console.log("Botsing gedetecteerd!");
                bird.remove();
                birdExists = false;

                lives--;
                updateLivesUI();

                if (lives <= 0) {
                    endGame();
                }
                return;
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

const birdInterval = setInterval(spawnBird, 1000);



// levens functie
function animate() {
    pos += speed * direction;
    bird.style.left = pos + 'px';

    // check collision met ballon
    const birdRect = bird.getBoundingClientRect();
    const balloonRect = balloon.getBoundingClientRect();

    if (!gameOver) {
        if (
            birdRect.left < balloonRect.right &&
            birdRect.right > balloonRect.left &&
            birdRect.top < balloonRect.bottom &&
            birdRect.bottom > balloonRect.top
        ) {
            bird.remove();
            birdExists = false;

            lives--;
            updateLivesUI();

            if (lives <= 0) {
                endGame();
            }

            return;
        }
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



// update levens
function updateLivesUI() {
    livesContainer.textContent = '❤️'.repeat(lives);
}



// best time
function updateBestTimeUI() {
    if (bestTime > 0) {
        bestEl.textContent = `Best time: ${formatTime(bestTime)}`;
    } else {
        bestEl.textContent = `Best time: 00:00`;
    }
}



// grow
function activateGrow() {
    if (currentMode === "grow") {
        setNormalMode();
        return;
    }

    balloonScale = 1.8;
    speedMultiplier = 0.3;
    currentMode = "grow";
    balloon.style.transform = `scale(${balloonScale})`;
}



// shrink
function activateShrink() {
    if (currentMode === "shrink") {
        setNormalMode();
        return;
    }

    balloonScale = 0.6;
    speedMultiplier = 1.8;
    currentMode = "shrink";
    balloon.style.transform = `scale(${balloonScale})`;
}



// normal
function setNormalMode() {
    balloonScale = 1;
    speedMultiplier = 1;
    currentMode = "normal";
    balloon.style.transform = `scale(${balloonScale})`;
}



// einde spel
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

    let interval;

    function handleResetCountdown() {
        count--;

        if (count <= 0) {
            clearInterval(interval);
            container.remove();
            resetGame();
            startTimer();
        } else {
            container.textContent = `Reset in ${count}...`;
        }
    }

    interval = setInterval(handleResetCountdown, 1000);
}



// reset
function resetGame() {

    lives = 3;
    updateLivesUI();

    balloon.style.display = 'block';

    setNormalMode();

    gameOver = false;

    clearInterval(timerInterval);

    elapsedTime = 0;
    lastTick = null;

    timeEl.textContent = "Time: 00:00";

    clearTimeout(heartTimeout);
    scheduleHeart();

    if (peer && peer.connected) {
        peer.send(JSON.stringify({ type: "resetBoosts" }));
    }
    /* resetBoosts(); */
}



// end game
function endGame() {
    clearInterval(timerInterval);

    balloon.style.display = 'none';

    const finalTime = elapsedTime;

    if (finalTime > bestTime) {
        bestTime = finalTime;
        localStorage.setItem('bestTime', bestTime);
    }

    updateBestTimeUI();

    gameOver = true;

    startCountdown();
}



function initGame() {
    updateBestTimeUI();
    updateLivesUI();

    scheduleHeart();
    scheduleShield();

    heartCollisionLoop();
}


initGame();