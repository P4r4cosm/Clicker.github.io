document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const gameArea = document.getElementById('gameArea');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const topList = document.getElementById('topList');

    let score = 0;
    let timeLeft = 30;
    let isGameActive = false;
    let timerInterval;

    // Запуск игры
    startButton.addEventListener('click', startGame);

    function startGame() {
        // Сброс параметров
        score = 0;
        timeLeft = 30;
        isGameActive = true;
        startButton.style.display = 'none';
        gameArea.innerHTML = '';
        updateDisplays();

        // Таймер
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplays();
            if (timeLeft <= 0) endGame();
        }, 1000);

        // Создание цели сразу и запуск цикла появления
        createTarget();
        setTimeout(createTargetLoop, Math.random() * 500 + 100);
    }

    function createTargetLoop() {
        if (!isGameActive) return;
        createTarget();
        // Случайный интервал появления (примерно 0.3 - 0.6 сек)
        const nextInterval = Math.random() * 500 + 100;
        setTimeout(createTargetLoop, nextInterval);
    }

    function createTarget() {
        const target = document.createElement('div');
        target.className = 'target';

        // Случайный размер (30-70px)
        const size = Math.floor(Math.random() * 41) + 30;
        target.style.width = size + 'px';
        target.style.height = size + 'px';

        // Случайный цвет
        target.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;

        // Позиционирование с учётом размера
        const gameAreaRect = gameArea.getBoundingClientRect();
        const maxX = gameAreaRect.width - size;
        const maxY = gameAreaRect.height - size;

        target.style.left = Math.random() * maxX + 'px';
        target.style.top = Math.random() * maxY + 'px';

        // Обработчик клика
        target.addEventListener('click', () => {
            if (!isGameActive) return;
            score++;
            updateDisplays();
            target.remove();
        });

        gameArea.appendChild(target);
    }

    function endGame() {
        isGameActive = false;
        clearInterval(timerInterval);
        gameArea.innerHTML = '';
        startButton.style.display = 'block';
        saveResult();
        showTopResults();
    }

    function updateDisplays() {
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
    }

    function saveResult() {
        const topResults = JSON.parse(localStorage.getItem('clickerTop')) || [];
        topResults.push(score);
        topResults.sort((a, b) => b - a);
        localStorage.setItem('clickerTop', JSON.stringify(topResults.slice(0, 5)));
    }

    function showTopResults() {
        const topResults = JSON.parse(localStorage.getItem('clickerTop')) || [];
        // Сортируем и обрезаем массив перед отображением
        const sortedResults = [...topResults].sort((a, b) => b - a).slice(0, 5);

        topList.innerHTML = sortedResults
            .map((score, index) => `<li>${index + 1}. ${score}</li>`)
            .join('');
    }

    // Инициализация при загрузке
    showTopResults();
});
