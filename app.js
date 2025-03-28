// Buttons to start, stop, pause, reset, and show controls
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const controlsButton = document.getElementById('controls');
const tasksButton = document.getElementById('tasks');
const tasksLayout = document.getElementById('task-layout');
const addTaskButton = document.getElementById('submit-task');
const clearTasksButton = document.getElementById('clear-tasks');
const tasksCheckBox = document.getElementsByClassName('task-checkbox');
const deleteTask = document.getElementsByClassName('delete-task');
const darkModeButton = document.getElementById('dark-mode');

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


// Cap values at 999 minutes as user types
pomodoroTimeInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^\d]/g, '');
    let num = parseInt(this.value);
    // Empty input check
    if (this.value === '') {
        return;
    }
    // Enforce minimum of 1
    if (num < 1) {
        this.value = '';
    }

    // Enforce maximum of 999
    if (num > 999) {
        this.value = '999';
    }
});

shortBreakTimeInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^\d]/g, '');
    let num = parseInt(this.value);
    // Empty input check
    if (this.value === '') {
        return;
    }
    // Enforce minimum of 1
    if (isNaN(num) || num < 1) {
        this.value = '';
    }

    // Enforce maximum of 999
    if (num > 999) {
        this.value = '999';
    }
});

longBreakTimeInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^\d]/g, '');
    let num = parseInt(this.value);
    // Empty input check
    if (this.value === '') {
        return;
    }
    // Enforce minimum of 1
    if (isNaN(num) || num < 1) {
        this.value = '';
    }

    // Enforce maximum of 999
    if (num > 999) {
        this.value = '999';
    }
});

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
    // Validate input
    if (pomodoroTimeInput.value === '' || shortBreakTimeInput.value === '' || longBreakTimeInput.value === '') {
        return;
    }
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

    // Save to localStorage
    localStorage.setItem('pomodoroTime', pomodoroTime);
    localStorage.setItem('shortBreakTime', shortBreakTime);
    localStorage.setItem('longBreakTime', longBreakTime);

    // Update input fields
    pomodoroTimeInput.value = '25';
    shortBreakTimeInput.value = '5';
    longBreakTimeInput.value = '15';

    // Update current timer if needed
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
    // Start the timer
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
// Update the display
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeH1.innerText = formattedTime; 
}

startButton.addEventListener('click', function () {
    startTimer();
    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden'); 
    
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

tasksButton.addEventListener('click', function() {
    tasksLayout.classList.toggle('hidden');
    if (tasksLayout.classList.contains('hidden')) { 
        tasksButton.textContent = "Tasks";
    } else {
        tasksButton.textContent = "Close Tasks";
    }
});

addTaskButton.addEventListener('click', function() {
    // Create a new task element
    const taskInput = document.getElementById('new-task-input');
    const taskList = document.getElementById('submitted-list');
    const task = document.createElement('li');

    // Skip empty tasks
    if (!taskInput.value.trim()) {
        return;
    }

    // Create a checkbox and delete button
    const taskCheckBox = document.createElement('button');
    const deleteTask = document.createElement('button');

    // Create an icon for the checkbox button
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('far', 'fa-circle');
    taskCheckBox.classList.add('task-checkbox');
    taskCheckBox.appendChild(checkIcon);
    
    // Add event listener to the checkbox
    taskCheckBox.addEventListener('click', function() {
        // Toggle between unchecked and checked icons
        checkIcon.classList.toggle('far');
        checkIcon.classList.toggle('fas');
        checkIcon.classList.toggle('fa-circle');
        checkIcon.classList.toggle('fa-check-circle');
        
        // Toggle the completed class on the parent li
        task.classList.toggle('completed');
    });
    
    task.appendChild(taskCheckBox);

    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    taskText.textContent = taskInput.value;
    task.appendChild(taskText);
    
    // Create an icon for the delete button
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash');
    deleteTask.appendChild(deleteIcon);
    deleteTask.classList.add('delete-task');
    
    // Add event listener to delete button
    deleteTask.addEventListener('click', function() {
        task.remove();
    });
    
    task.appendChild(deleteTask);
    
    // Append the completed task to the list
    taskList.appendChild(task);
    
    // Clear input field
    taskInput.value = '';
});

clearTasksButton.addEventListener('click', function() {
    const taskList = document.getElementById('submitted-list');
    taskList.innerHTML = '';
});

// Add this to initialize dark mode based on user preference
// Check if dark mode is preferred or was previously set
const currentTheme = localStorage.getItem("theme");

// If no theme preference is saved, default to dark mode
if (currentTheme === "light") {
    // Only use light mode if explicitly set
    document.body.classList.remove("dark-mode");
    darkModeButton.innerHTML = '<i class="fas fa-moon"></i>';
} else {
    // Default to dark mode
    document.body.classList.add("dark-mode");
    darkModeButton.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("theme", "dark");
}

// Add this to handle dark mode button click
darkModeButton.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    
    // Update button icon
    if (document.body.classList.contains("dark-mode")) {
        darkModeButton.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem("theme", "dark");
    } else {
        darkModeButton.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem("theme", "light");
    }
});
