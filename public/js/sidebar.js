let currentMode = "normal";
let boostStatusActive = false;

const sizeValueDesktopEl = document.querySelector('.status-size-value');
const speedValueDesktopEl = document.querySelector('.status-speed-value');

const gaugeFill = document.querySelector('.gauge-fill');
const sizeFill = document.querySelector('.size-fill');

const boostSwitch = document.querySelector('.boost-switch');
const boostLabel = document.querySelector('.boost-label');

function getSpeedRotation(speed) {
    switch (speed) {
        case 'slow': return -60;
        case 'medium': return 0;
        case 'fast': return 60;
        default: return 0;
    }
}

function getSizeHeight(size) {
    switch (size) {
        case 'small': return 30;
        case 'medium': return 60;
        case 'large': return 100;
        default: return 60;
    }
}

const DESKTOP_STATUS_LABELS = {
    size: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
    },
    speed: {
        slow: 'Slow',
        medium: 'Medium',
        fast: 'Fast'
    }
};

export const desktopStatus = {
    size: 'medium',
    speed: 'medium'
};


function getDisplayedSpeedDesktop() {
    const order = ['slow', 'medium', 'fast'];
    const baseIndex = order.indexOf(desktopStatus.speed);

    if (!boostStatusActive) {
        return desktopStatus.speed;
    }

    return order[Math.min(baseIndex + 1, order.length - 1)];
}

export function renderDesktopStatus() {
    const displayedSpeed = getDisplayedSpeedDesktop();

    if (gaugeFill) {
        const rotation = getSpeedRotation(displayedSpeed);
        gaugeFill.style.transform = `rotate(${rotation}deg)`;
    }

    if (sizeFill) {
        const height = getSizeHeight(desktopStatus.size);
        sizeFill.style.height = `${height}%`;
    }

    // text labels
    if (sizeValueDesktopEl) {
        sizeValueDesktopEl.textContent = DESKTOP_STATUS_LABELS.size[desktopStatus.size];
    }

    if (speedValueDesktopEl) {
        speedValueDesktopEl.textContent = DESKTOP_STATUS_LABELS.speed[displayedSpeed];
    }


    if (boostSwitch && boostLabel) {
        boostSwitch.classList.toggle('active', boostStatusActive);
        boostLabel.textContent = boostStatusActive ? 'Active' : 'Inactive';
    }
}

window.addEventListener('boostStateChange', (event) => {
    let isActive = false;

    if (event.detail && event.detail.active) {
        isActive = true;
    }

    boostStatusActive = isActive;
    renderDesktopStatus();
});