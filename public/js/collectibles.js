// power hartjes
const heartContainer = document.querySelector('.hearts');
let heartTimeout;

// shield
const shieldContainer = document.createElement('div');
let shieldTimeout;
let shieldActive = false;


// Power hartjes
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

function heartLoop() {
    spawnHeart();
    scheduleHeart();
}

function scheduleHeart() {

    const randomTime = Math.random() * 8000 + 12000;

    heartTimeout = setTimeout(heartLoop, randomTime);
}

// hart botsing
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

function heartCollisionLoop() {
    checkHeartCollision();
    checkShieldCollision();

    requestAnimationFrame(heartCollisionLoop);
}

// shield
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

function shieldLoop() {
    spawnShield();
    scheduleShield();
}

function scheduleShield() {

    const randomTime = Math.random() * 8000 + 12000;

    shieldTimeout = setTimeout(shieldLoop, randomTime);
}

function checkShieldCollision() {

    if (currentMode !== "shrink") return;

    const balloonRect = balloon.getBoundingClientRect();
    const shields = document.querySelectorAll('.shield');

    shields.forEach(shield => {

        const shieldRect = shield.getBoundingClientRect();

        if (
            shieldRect.left < balloonRect.right &&
            shieldRect.right > balloonRect.left &&
            shieldRect.top < balloonRect.bottom &&
            shieldRect.bottom > balloonRect.top
        ) {

            activateShield();
            shield.remove();
        }

    });
}

function activateShield() {
    shieldActive = true;
    balloon.classList.add('shielded'); // <-- show visual shield

    setTimeout(() => {
        shieldActive = false;
        balloon.classList.remove('shielded'); // <-- hide visual shield
    }, 8000);
}
