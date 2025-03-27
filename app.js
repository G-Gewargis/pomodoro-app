
// Buttons to start, stop, pause, reset, and show controls
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const controlsButton = document.getElementById('controls');

// Time display
const timeDisplay = document.getElementById('time');
const timeH1 = timeDisplay.querySelector('h1'); // Get the h1 element inside timeDisplay

// Controls to switch between pomodoro, short break, and long break
const pomdodoro = document.getElementById('pomodoro');
const shortBreak = document.getElementById('short-break');
const longBreak = document.getElementById('long-break');

// Sounds
const alarmSound = new Audio('./sounds/alarm-clock.mp3'); 

// States
let shortBreakState = false;
let longBreakState = false;
let pomodoroState = true;
// Time left in seconds
let timeLeft = 1500; // 25 minutes in seconds
let timerInterval;

function startTimer() {
    timerInterval = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alarmSound.play();
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
    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden'); // Show pause button when timer starts
    
});

pauseButton.addEventListener('click', function () {
    clearInterval(timerInterval);
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});

resetButton.addEventListener('click', function () {
    clearInterval(timerInterval);
    if (pomodoroState) {
        timeLeft = 1500;
    }
    else if (shortBreakState) {
        timeLeft = 300;
    }
    else if (longBreakState) {
        timeLeft = 900;
    }

    updateDisplay();
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});

pomdodoro.addEventListener('click', function () {
    pomodoroState = true;
    shortBreakState = false;
    longBreakState = false;
    clearInterval(timerInterval);
    timeLeft = 1500;
    updateDisplay();
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});

shortBreak.addEventListener('click', function () {
    pomodoroState = false;
    shortBreakState = true;
    longBreakState = false;
    clearInterval(timerInterval);
    timeLeft = 300;
    updateDisplay();
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});

longBreak.addEventListener('click', function () {
    pomodoroState = false;
    shortBreakState = false;
    longBreakState = true;
    clearInterval(timerInterval);
    timeLeft = 900;
    updateDisplay();
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});