
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

    if (peer && peer.connected) {
        peer.send(JSON.stringify({ type: "motionReady" }));
    }
});

// --- SHAKE DETECTION ---
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

                if (peer && peer.connected) {
                    peer.send(JSON.stringify({ type: "shake" }));
                }
            }
        }
    });
}
