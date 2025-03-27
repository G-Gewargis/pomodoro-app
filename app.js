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

// Settings modal elements
const settingsModal = document.getElementById('settings-modal');
const closeSettingsButton = document.getElementById('close-settings');
const saveSettingsButton = document.getElementById('save-settings');
const resetSettingsButton = document.getElementById('reset-settings');
const pomodoroTimeInput = document.getElementById('pomodoro-time');
const shortBreakTimeInput = document.getElementById('short-break-time');
const longBreakTimeInput = document.getElementById('long-break-time');

// Default times (in seconds)
const DEFAULT_POMODORO_TIME = 1500; // 25 minutes
const DEFAULT_SHORT_BREAK_TIME = 300; // 5 minutes
const DEFAULT_LONG_BREAK_TIME = 900; // 15 minutes

// Load saved settings or use defaults
let pomodoroTime = localStorage.getItem('pomodoroTime') ? parseInt(localStorage.getItem('pomodoroTime')) : DEFAULT_POMODORO_TIME;
let shortBreakTime = localStorage.getItem('shortBreakTime') ? parseInt(localStorage.getItem('shortBreakTime')) : DEFAULT_SHORT_BREAK_TIME;
let longBreakTime = localStorage.getItem('longBreakTime') ? parseInt(localStorage.getItem('longBreakTime')) : DEFAULT_LONG_BREAK_TIME;

// Initialize input fields with current values
pomodoroTimeInput.value = pomodoroTime / 60;
shortBreakTimeInput.value = shortBreakTime / 60;
longBreakTimeInput.value = longBreakTime / 60;

// Rename controls button to settings for clarity
controlsButton.textContent = "Settings";

// Open settings modal
controlsButton.addEventListener('click', function() {
    settingsModal.classList.remove('hidden');
});

// Close settings modal
closeSettingsButton.addEventListener('click', function() {
    settingsModal.classList.add('hidden');
});

// Close modal when clicking outside
settingsModal.addEventListener('click', function(event) {
    if (event.target === settingsModal) {
        settingsModal.classList.add('hidden');
    }
});

// Save settings
saveSettingsButton.addEventListener('click', function() {
    // Convert minutes to seconds
    pomodoroTime = parseInt(pomodoroTimeInput.value) * 60;
    shortBreakTime = parseInt(shortBreakTimeInput.value) * 60;
    longBreakTime = parseInt(longBreakTimeInput.value) * 60;
    
    // Save to localStorage
    localStorage.setItem('pomodoroTime', pomodoroTime);
    localStorage.setItem('shortBreakTime', shortBreakTime);
    localStorage.setItem('longBreakTime', longBreakTime);
    
    // Update current timer if needed
    if (pomodoroState) {
        timeLeft = pomodoroTime;
    } else if (shortBreakState) {
        timeLeft = shortBreakTime;
    } else if (longBreakState) {
        timeLeft = longBreakTime;
    }
    
    // Update display and close modal
    updateDisplay();
    settingsModal.classList.add('hidden');
});

// Reset settings to default
resetSettingsButton.addEventListener('click', function() {
    pomodoroTime = DEFAULT_POMODORO_TIME;
    shortBreakTime = DEFAULT_SHORT_BREAK_TIME;
    longBreakTime = DEFAULT_LONG_BREAK_TIME;

    localStorage.setItem('pomodoroTime', pomodoroTime);
    localStorage.setItem('shortBreakTime', shortBreakTime);
    localStorage.setItem('longBreakTime', longBreakTime);

    pomodoroTimeInput.value = '25';
    shortBreakTimeInput.value = '5';
    longBreakTimeInput.value = '15';

    if (pomodoroState) {
        timeLeft = pomodoroTime;
    } else if (shortBreakState) {
        timeLeft = shortBreakTime;
    } else if (longBreakState) {
        timeLeft = longBreakTime;
    }
    updateDisplay();
});

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
        timeLeft = pomodoroTime;
    }
    else if (shortBreakState) {
        timeLeft = shortBreakTime;
    }
    else if (longBreakState) {
        timeLeft = longBreakTime;
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
    timeLeft = pomodoroTime;
    updateDisplay();
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});

shortBreak.addEventListener('click', function () {
    pomodoroState = false;
    shortBreakState = true;
    longBreakState = false;
    clearInterval(timerInterval);
    timeLeft = shortBreakTime;
    updateDisplay();
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});

longBreak.addEventListener('click', function () {
    pomodoroState = false;
    shortBreakState = false;
    longBreakState = true;
    clearInterval(timerInterval);
    timeLeft = longBreakTime;
    updateDisplay();
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});