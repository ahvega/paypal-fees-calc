function calculateFees() {
    // Calculation logic here
}

function updateResult(result) {
    document.getElementById('result').textContent = result;
}

function handleWindowResize() {
    // Adjust layout for new dimensions
    document.body.style.fontSize = Math.min(16, window.innerHeight / 60) + 'px';
}

function handleOrientationChange() {
    // Adjust layout for portrait/landscape
    if (window.innerHeight > window.innerWidth) {
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
    } else {
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
    }
}

window.addEventListener('resize', handleWindowResize);
window.addEventListener('orientationchange', handleOrientationChange);

// Initial setup
handleWindowResize();
handleOrientationChange();
