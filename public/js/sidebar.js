let currentMode = "normal";
let boostStatusActive = false;

const sizeValueDesktopEl = document.querySelector('.status-size-value');
const speedValueDesktopEl = document.querySelector('.status-speed-value');
const boostStateDesktopEl = document.querySelector('.boost-state-desktop');
const sizePillsDesktop = document.querySelectorAll('.status-pill-desktop[data-size]');
const speedPillsDesktop = document.querySelectorAll('.status-pill-desktop[data-speed]');

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

const desktopStatus = {
    size: 'medium',
    speed: 'medium'
};



function updateStatusPillsDesktop(pills, activeValue, key) {
    pills.forEach((pill) => {
        const isActive = pill.dataset[key] === activeValue;
        pill.classList.toggle('is-active', isActive);
    });
}

function getDisplayedSpeedDesktop() {
    const order = ['slow', 'medium', 'fast'];
    const baseIndex = order.indexOf(desktopStatus.speed);

    if (!boostStatusActive) {
        return desktopStatus.speed;
    }

    return order[Math.min(baseIndex + 1, order.length - 1)];
}

function renderDesktopStatus() {
    const displayedSpeed = getDisplayedSpeedDesktop();

    if (sizeValueDesktopEl) {
        sizeValueDesktopEl.textContent = DESKTOP_STATUS_LABELS.size[desktopStatus.size];
    }

    if (speedValueDesktopEl) {
        speedValueDesktopEl.textContent = DESKTOP_STATUS_LABELS.speed[displayedSpeed];
    }

    updateStatusPillsDesktop(sizePillsDesktop, desktopStatus.size, 'size');
    updateStatusPillsDesktop(speedPillsDesktop, displayedSpeed, 'speed');

    if (boostStateDesktopEl) {
        boostStateDesktopEl.textContent = boostStatusActive ? 'Boost active' : 'Boost inactive';
        boostStateDesktopEl.classList.toggle('is-active', boostStatusActive);
    }
}

window.addEventListener('boostStateChange', (event) => {
    boostStatusActive = !!event.detail?.active;
    renderDesktopStatus();
});