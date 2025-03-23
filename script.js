document.addEventListener('DOMContentLoaded', function () {
    const cellsBoard = document.querySelector('.cells-board');
    if (!cellsBoard) {
        console.error('Элемент .cells-board не найден.');
        return;
    }

    let originalState = cellsBoard.innerHTML;

    const params = new URLSearchParams(window.location.search);
    const botName = params.get('botName') || 'Unknown';
    const language = params.get('language') || 'en';

    const botNameElement = document.getElementById('botName');
    if (botNameElement) {
        botNameElement.textContent = botName;
        botNameElement.style.display = 'block';
        botNameElement.style.color = 'white';
    }

    function hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.remove('fade-in');
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('hidden');
                document.body.classList.add('fade-in');
            }, 1000);
        }
    }
    setTimeout(hidePreloader, 3000);

    const trapsOptions = [1, 3, 5, 7];
    const trapsToCellsOpenMapping = {
        1: 10,
        3: 5,
        5: 4,
        7: 3
    };
    let currentPresetIndex = 0;
    const trapsAmountElement = document.getElementById('trapsAmount');
    const prevPresetBtn = document.getElementById('prev_preset_btn');
    const nextPresetBtn = document.getElementById('next_preset_btn');

    function updateTrapsAmount() {
        if (trapsAmountElement) {
            trapsAmountElement.textContent = trapsOptions[currentPresetIndex];
        }
    }

    if (prevPresetBtn) {
        prevPresetBtn.addEventListener('click', function () {
            if (currentPresetIndex > 0) {
                currentPresetIndex--;
                updateTrapsAmount();
            }
        });
    }
    if (nextPresetBtn) {
        nextPresetBtn.addEventListener('click', function () {
            if (currentPresetIndex < trapsOptions.length - 1) {
                currentPresetIndex++;
                updateTrapsAmount();
            }
        });
    }
    updateTrapsAmount();

    function attachCellClickListeners() {
        const cells = document.querySelectorAll('.cells-board .cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                cell.style.transform = 'scale(0.7)';
                setTimeout(() => {
                    cell.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    let isFirstPlay = true;

    // Получаем кнопку и элемент для отображения счетчика
    const playButton = document.getElementById('playButton');
    const counterElement = document.getElementById('playCounter');

    // Функция для получения счетчика из localStorage
    function getPlayCount() {
        const today = new Date().toISOString().slice(0, 10);
        const savedData = localStorage.getItem('playCountData');

        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.date === today) {
                return data.count;
            }
        }

        return 3;
    }

    // Функция для сохранения счетчика в localStorage
    function setPlayCount(count) {
        const today = new Date().toISOString().slice(0, 10);
        const data = {
            date: today,
            count: count,
        };
        localStorage.setItem('playCountData', JSON.stringify(data));
    }

    // Функция для обновления отображения счетчика
    function updateCounter() {
        const count = getPlayCount();
        counterElement.textContent = `${count}/3`;

        if (count === 0) {
            playButton.disabled = true;
        } else {
            playButton.disabled = false;
        }
    }

    // Функция для сброса счетчика
    function resetCounter() {
        // Проверяем, остались ли попытки
        if (getPlayCount() > 0) {
            setPlayCount(3);
            updateCounter();
        }
    }

    // Функция для планирования сброса счетчика
    function scheduleReset() {
        const now = new Date();
        const resetTime = new Date(now);
        resetTime.setHours(8, 0, 0, 0);

        if (now > resetTime) {
            resetTime.setDate(resetTime.getDate() + 1);
        }

        const delay = resetTime - now;

        setTimeout(() => {
            resetCounter();
            scheduleReset();
        }, delay);
    }

    // Инициализация
    updateCounter();
    scheduleReset();

    if (playButton) {
        playButton.addEventListener('click', function () {
            let count = getPlayCount();

            if (count > 0) {
                // Выполняем действие кнопки
                // ... ваш код ...

                playButton.disabled = true;

                let cells = document.querySelectorAll('.cells-board .cell');

                if (!isFirstPlay) {
                    cellsBoard.innerHTML = originalState;
                    attachCellClickListeners();
                    cells = document.querySelectorAll('.cells-board .cell');
                }

                const trapsAmount = parseInt(trapsAmountElement.textContent);
                const cellsToOpen = trapsToCellsOpenMapping[trapsAmount] || 0;
                const selectedCells = [];

                while (selectedCells.length < cellsToOpen) {
                    const randomIndex = Math.floor(Math.random() * cells.length);
