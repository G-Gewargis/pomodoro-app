const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const controlsButton = document.getElementById('controls');
const timeDisplay = document.getElementById('time');
const timeH1 = timeDisplay.querySelector('h1'); // Get the h1 element inside timeDisplay

let timeLeft = 1500; // 25 minutes in seconds
let timerInterval;

function startTimer() {
    timerInterval = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            return;
        }
        timeLeft--;
        updateDisplay();
    }, 1000);
}

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeH1.innerText = formattedTime; 
}

startButton.addEventListener('click', function () {
    startTimer();
    startButton.hidden = true;
    pauseButton.hidden = false; // Show pause button when timer starts
});

pauseButton.addEventListener('click', function () {
    clearInterval(timerInterval);
    startButton.hidden = false; // Show start button again when paused
    pauseButton.hidden = true; // Hide pause button
});

resetButton.addEventListener('click', function () {
    clearInterval(timerInterval);
    timeLeft = 1500;
    updateDisplay();
    startButton.hidden = false; // Reset start button to be visible
    pauseButton.hidden = true;  // Reset pause button to be hidden
});


