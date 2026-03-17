
// permision
const permissionScreen = document.getElementById("motionPermission");
const enableMotionBtn = document.getElementById("enableMotion");

// boost
let lastShake = 0;
let boostActive = false;
let boostsLeft = 3;
const dots = document.querySelectorAll(".dot");
const sound = new Audio('/assets/error.mp3');



/* toegang krijgen */
if (enableMotionBtn) {
    enableMotionBtn.addEventListener("click", async () => {

        if (typeof DeviceMotionEvent !== "undefined" &&
            typeof DeviceMotionEvent.requestPermission === "function") {

            const res = await DeviceMotionEvent.requestPermission();
            if (res !== "granted") {
                alert("Motion permission is required to shake!");
                return;
            }
        }

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



/* shake detectie */
function startShakeDetection() {
    window.addEventListener("devicemotion", (e) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc) return;

        const strength = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

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



// Boost logica
window.addEventListener("boost", activateBoost);

function activateBoost() {

    if (boostActive) return;

    boostActive = true;
    window.dispatchEvent(new CustomEvent('boostStateChange', { detail: { active: true } }));

    const oldMultiplier = speedMultiplier;

    speedMultiplier = 5;
    timeMultiplier = 5;

    console.log("boost actief");

    for (let i = 0; i < 3; i++) {
        spawnCloud();
    }

    function endBoost() {
        speedMultiplier = oldMultiplier;
        timeMultiplier = 1;

        // bonus seconden
        elapsedTime += 2000;

        boostActive = false;
        window.dispatchEvent(new CustomEvent('boostStateChange', { detail: { active: false } }));

        console.log("boost voorbij");
    }

    setTimeout(endBoost, 3000);
}


// Ui
function updateBoostUI() {

    dots.forEach((dot, index) => {

        if (index < boostsLeft) {
            dot.style.background = "white"; // nog beschikbaar
        } else {
            dot.style.background = "#797575"; // al gebruikt
        }

    });

}



function initBoost() {
    updateBoostUI();
}


initBoost();