document.getElementById('set-timer').addEventListener('click', () => {
    const timeInput = document.getElementById('time-input').value;
    const timeParts = timeInput.split(':');

    if (timeParts.length === 3) {
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        const seconds = parseInt(timeParts[2]) || 0;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        if (totalSeconds > 0) {
            document.getElementById('current-timer').textContent = formatTime(totalSeconds);
            document.getElementById('current-timer-active').textContent = formatTime(totalSeconds);
            document.getElementById('delete-current-timer').classList.remove('hidden');
            createTimer(totalSeconds);
            document.getElementById('timer-setup').classList.add('hidden');
            document.getElementById('active-timers-window').classList.remove('hidden');
        }
    } else {
        alert('Please enter a valid time in hh:mm:ss format.');
    }
});

document.getElementById('delete-current-timer').addEventListener('click', () => {
    document.getElementById('current-timer').textContent = 'No current time available';
    document.getElementById('current-timer-active').textContent = 'No current time available';
    document.getElementById('delete-current-timer').classList.add('hidden');
    stopAllTimers();
});

const timersContainer = document.getElementById('timers-container');
const timerSound = document.getElementById('timer-sound');
let timers = [];

function createTimer(totalSeconds) {
    const timerId = Date.now();
    const timerElement = document.createElement('div');
    timerElement.classList.add('timer');
    timerElement.setAttribute('data-id', timerId);

    const timeDisplay = document.createElement('span');
    timeDisplay.textContent = formatTime(totalSeconds);
    timerElement.appendChild(timeDisplay);

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop Timer';
    stopButton.classList.add('small-button');
    stopButton.addEventListener('click', () => stopTimer(timerId));
    timerElement.appendChild(stopButton);

    timersContainer.appendChild(timerElement);

    const timerInterval = setInterval(() => {
        totalSeconds--;
        timeDisplay.textContent = formatTime(totalSeconds);

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerElement.classList.add('timer-ended');
            timeDisplay.textContent = 'Time’s up!';
            stopButton.remove();
            timerSound.play();
        }
    }, 1000);

    timers.push({ timerId, timerInterval });
}

function stopTimer(timerId) {
    const timerIndex = timers.findIndex(t => t.timerId === timerId);
    if (timerIndex !== -1) {
        clearInterval(timers[timerIndex].timerInterval);
        const timerElement = document.querySelector(`.timer[data-id='${timerId}']`);
        if (timerElement) {
            timerElement.remove();
        }
        timers.splice(timerIndex, 1);
    }
}

function stopAllTimers() {
    timers.forEach(timer => clearInterval(timer.timerInterval));
    timers = [];
    document.getElementById('timers-container').innerHTML = '';
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
}

function padTime(time) {
    return String(time).padStart(2, '0');
}
