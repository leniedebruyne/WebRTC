// wolken

const cloudContainer = document.querySelector('.clouds');
const maxClouds = 4;

// time
let startTime = null;
let timerInterval = null;
const timeEl = document.querySelector('.time');

// vogel
const bird = document.querySelector('.bird');
const gameArea = document.querySelector('.game');
let direction = 1; 
let speed = 2;
let pos = 0;
let birdExists = false;




// wolken functie

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

// time functie

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    startTime = Date.now();

    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeEl.textContent = `Time: ${formatTime(elapsed)}`;
    }, 1000);
}

// vogel functie
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