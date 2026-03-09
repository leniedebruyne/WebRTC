const permissionScreen = document.getElementById("motionPermission");
const enableMotionBtn = document.getElementById("enableMotion");

let lastShake = 0;

let boostActive = false;


/* toegang krijgen */
if (enableMotionBtn) {
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

                if (peer && peer.connected) {
                    peer.send(JSON.stringify({ type: "shake" }));
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
