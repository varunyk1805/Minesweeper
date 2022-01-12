const levelBtn = document.querySelector('.level-btn');
const recordsBtn = document.querySelector('.records-btn');
const beginnerBtn = document.querySelector('#record__beginner');
const amateurBtn = document.querySelector('#record__amateur');
const professionalBtn = document.querySelector('#record__profissional');
const closeBtn = document.querySelector('.close-btn');
const backdrop = document.querySelector('.backdrop');
const levelFormModal = document.querySelector('.level__form');
const endGameModal = document.querySelector('.end-game');
const recordsModal = document.querySelector('.records');
const widthInput = document.querySelector('.width__input');
const heightInput = document.querySelector('.height__input');
const amountInput = document.querySelector('.amount__input');
const startBtn = document.querySelector('.start-btn');
const minefield = document.querySelector('.minefield');
const beginnerLvl = document.querySelector('#beginner');
const amateurLvl = document.querySelector('#amateur');
const professionalLvl = document.querySelector('#professional');
const specialLvl = document.querySelector('#special');
const win = document.querySelector('.win');
const newRecord = document.querySelector('.new-record');
const loss = document.querySelector('.loss');
const newGameBtn = document.querySelector('.new-game');
const changeLevelBtn = document.querySelector('.level__change');
const gameTime = document.querySelector('.game-time');
const gameDate = document.querySelector('.game-date');
const bestTime = document.querySelector('.best-time');
const playedGames = document.querySelector('.played-games');
const wonGames = document.querySelector('.won-games');
const percentage = document.querySelector('.percentage');
const recordsTime = document.querySelector('.records-time');
const recordsDate = document.querySelector('.records-date');
const recordsPlayedGames = document.querySelector('.records-played-games');
const recordsWonGames = document.querySelector('.records-won-games');
const recordsPercentage = document.querySelector('.records-percentage');

let timer;
let minesLeft;
const minesIndexArray = [];
let minefieldWidth = +widthInput.value;
let minefieldHeight = +heightInput.value;
const minefieldWidthMax = +widthInput.getAttribute('max');
const minefieldHeightMax = +heightInput.getAttribute('max');
const minefieldWidthMin = +widthInput.getAttribute('min');
const minefieldHeightMin = +heightInput.getAttribute('min');
let minesAmount = +amountInput.value;
let cellsAmount = minefieldWidth * minefieldHeight;
const minesAmountMin = 10;
let minesAmountMax = Math.round(cellsAmount * 0.93);
let timerValue = 0;
let minesLeftAmount = minesAmount;
let cellsHiddenAmount = cellsAmount;
let timerId = null;

levelFormModal.style.display = 'none';
endGameModal.style.display = 'none';
recordsModal.style.display = 'none';

levelBtn.addEventListener('click', () => {
    if (levelFormModal.style.display !== 'none') {
        backdrop.classList.add('is-hidden');
        levelFormModal.style.display = 'none';
        return;
    }
    backdrop.classList.remove('is-hidden');
    levelFormModal.style.display = 'flex';
    recordsModal.style.display = 'none';
    endGameModal.style.display = 'none'
});

// Функція автоматичного визначення максимально допустимої кількості мін
// при вибраних значеннях ширини / висоти поля
const minesAmountMaxAuto = () => {
    minefieldWidth = +widthInput.value;
    minefieldHeight = +heightInput.value;
    if (minefieldWidth > minefieldWidthMax) {
        widthInput.value = minefieldWidthMax;
    };
    if (minefieldWidth < minefieldWidthMin) {
        widthInput.value = minefieldWidthMin;
    };
    if (minefieldHeight > minefieldHeightMax) {
        heightInput.value = minefieldHeightMax;
    };
    if (minefieldHeight < minefieldHeightMin) {
        heightInput.value = minefieldHeightMin;
    };

    minesAmount = +amountInput.value;
    cellsAmount = widthInput.value * heightInput.value;
    minesAmountMax = Math.round(cellsAmount * 0.93);

    if (minesAmount > minesAmountMax) {
        amountInput.setAttribute('value', minesAmountMax);
        amountInput.value = minesAmountMax;
    };
    if (minesAmount < minesAmountMin) {
        amountInput.value = minesAmountMin;
    };

    amountInput.setAttribute('max', minesAmountMax);
};

// Автоматичне визначення максимально допустимої кількості мін
// при зміні значень ширини / висоти поля та при зміні значення кількості мін
widthInput.addEventListener('blur', minesAmountMaxAuto);
heightInput.addEventListener('blur', minesAmountMaxAuto);
amountInput.addEventListener('blur', minesAmountMaxAuto);

// Функція деактивації полів вводу значень ширини/висоти поля, кількості мін
const inputDisabled = () => {
    widthInput.setAttribute('disabled', 'disabled');
    heightInput.setAttribute('disabled', 'disabled');
    amountInput.setAttribute('disabled', 'disabled');
};

let records = {};

records = JSON.parse(localStorage.getItem('records'));

if (records === null) {
    records = {
        beginner: {
            time: 0,
            date: 0,
            playedGames: 0,
            wonGames: 0,
        },
        amateur: {
            time: 0,
            date: 0,
            playedGames: 0,
            wonGames: 0,
        },
        professional: {
            time: 0,
            date: 0,
            playedGames: 0,
            wonGames: 0,
        },
    };
};

const beginnerRecords = () => {
    recordsPlayedGames.textContent = `Played games: ${records.beginner.playedGames}`;
    recordsWonGames.textContent = `Won games: ${records.beginner.wonGames}`;

    if (records.beginner.wonGames === 0) {
        recordsTime.textContent = `Time: --- sec`;
        recordsDate.textContent = `Date: ---`;
        
        if (records.beginner.playedGames > 0) {
            recordsPercentage.textContent = `Percentage: 0 %`;
            return;
        };
        recordsPercentage.textContent = `Percentage: --- %`;
        return;
    }

    recordsTime.textContent = `Time: ${records.beginner.time} sec`;
    recordsDate.textContent = `Date: ${records.beginner.date}`;
    recordsPercentage.textContent = `Percentage: ${Math.round((records.beginner.wonGames / records.beginner.playedGames) * 100)} %`;
};

const amateurRecords = () => {
    recordsPlayedGames.textContent = `Played games: ${records.amateur.playedGames}`;
    recordsWonGames.textContent = `Won games: ${records.amateur.wonGames}`;

    if (records.amateur.wonGames === 0) {
        recordsTime.textContent = `Time: --- sec`;
        recordsDate.textContent = `Date: ---`;
        
        if (records.amateur.playedGames > 0) {
            recordsPercentage.textContent = `Percentage: 0 %`;
            return;
        };
        recordsPercentage.textContent = `Percentage: --- %`;
        return;
    }

    recordsTime.textContent = `Time: ${records.amateur.time} sec`;
    recordsDate.textContent = `Date: ${records.amateur.date}`;
    recordsPercentage.textContent = `Percentage: ${Math.round((records.amateur.wonGames / records.amateur.playedGames) * 100)} %`;
};

const professionalRecords = () => {
    recordsPlayedGames.textContent = `Played games: ${records.professional.playedGames}`;
    recordsWonGames.textContent = `Won games: ${records.professional.wonGames}`;

    if (records.professional.wonGames === 0) {
        recordsTime.textContent = `Time: --- sec`;
        recordsDate.textContent = `Date: ---`;
        
        if (records.professional.playedGames > 0) {
            recordsPercentage.textContent = `Percentage: 0 %`;
            return;
        };
        recordsPercentage.textContent = `Percentage: --- %`;
        return;
    }

    recordsTime.textContent = `Time: ${records.professional.time} sec`;
    recordsDate.textContent = `Date: ${records.professional.date}`;
    recordsPercentage.textContent = `Percentage: ${Math.round((records.professional.wonGames / records.professional.playedGames) * 100)} %`;
};

recordsBtn.addEventListener('click', () => {
    if (recordsModal.style.display !== 'none') {
        backdrop.classList.add('is-hidden');
        recordsModal.style.display = 'none';
        return;        
    };
    backdrop.classList.remove('is-hidden');
    recordsModal.style.display = 'flex'
    levelFormModal.style.display = 'none';
    endGameModal.style.display = 'none';

    if (beginnerBtn.checked) beginnerRecords();
    if (amateurBtn.checked) amateurRecords();
    if (professionalBtn.checked) professionalRecords();
});

beginnerBtn.addEventListener('click', beginnerRecords);

amateurBtn.addEventListener('click', amateurRecords);

professionalBtn.addEventListener('click', professionalRecords);

closeBtn.addEventListener('click', () => {
    backdrop.classList.add('is-hidden');
    beginnerBtn.checked = true;
});

// Деактивація полів вводу значень ширини/висоти поля, кількості мін 
// при виборі рівня складності відмінного від особливого рівня складності
beginnerLvl.addEventListener('change', inputDisabled);
amateurLvl.addEventListener('change', inputDisabled);
professionalLvl.addEventListener('change', inputDisabled);

// Функція активації полів вводу значень ширини/висоти поля, кількості мін
const inputEnabled = () => {
    widthInput.removeAttribute('disabled');
    heightInput.removeAttribute('disabled');
    amountInput.removeAttribute('disabled');
};

// Деактивація полів вводу значень ширини/висоти поля, кількості мін 
// при виборі рівня особливого рівня складності
specialLvl.addEventListener('change', inputEnabled);

// Функція запуску гри з вибраним рівнем складності
const startGame = event => {
    event.preventDefault();
    minefield.innerHTML = '';
    clearInterval(timerId);

    if (beginnerLvl.checked) {
        minefieldWidth = 9;
        minefieldHeight = 9;
        minesAmount = 10;
    };
    if (amateurLvl.checked) {
        minefieldWidth = 16;
        minefieldHeight = 16;
        minesAmount = 40;
    };
    if (professionalLvl.checked) {
        minefieldWidth = 30;
        minefieldHeight = 16;
        minesAmount = 99;
    };
    if (specialLvl.checked) {
        minefieldWidth = +widthInput.value;
        minefieldHeight = +heightInput.value;
        minesAmount = +amountInput.value;
    };

    timerValue = 0;
    minesLeftAmount = minesAmount;
    cellsAmount = minefieldWidth * minefieldHeight;
    cellsHiddenAmount = cellsAmount;
    backdrop.classList.add('is-hidden');
    endGameModal.style.display = 'none';
    win.style.display = 'none';
    newRecord.style.display = 'none';
    loss.style.display = 'none';
    levelFormModal.style.display = 'none';
    minefieldRender();
    minefield.addEventListener('mousedown', clickCell);
};

// Запуск гри з вибраним рівнем складності
startBtn.addEventListener('click', startGame);
newGameBtn.addEventListener('click', startGame);
changeLevelBtn.addEventListener('click', () => {
    endGameModal.style.display = 'none';
    levelFormModal.style.display = 'flex';
});

// Скасування дефолтних налаштувань при натисканні правої клавіші мишки у браузері
document.addEventListener('contextmenu', event => {
    event.preventDefault();
});

// Функція генерації унікального індексу комірки, в якій буде знаходитись міна
const minesIndexRandomUnique = () => {
    const minesIndexRandom = Math.round(Math.random() * (cellsAmount - 1) + 1);
    if (!minesIndexArray.includes(minesIndexRandom)) {
        minesIndexArray.push(minesIndexRandom);
    } else {
        minesIndexRandomUnique();
    };
};

// Функція генерації масиву унікальних індексів комірок, в яких будуть знаходитись міни
const minesGeneration = value => {
    minesIndexArray.length = 0;
    for (let i = 1; i <= value; i += 1) {
        minesIndexRandomUnique();
    };
};

const openAllCell = () => {
    for (let i = 1; i <= cellsAmount; i += 1) {
        let cellId = `#index${i}`;
        let cellItem = document.querySelector(cellId);
        if (!cellItem.classList.contains('cell--open')
            && !cellItem.classList.contains('cell--mine')) {
            cellItem.classList.remove('cell--hidden');
            cellItem.classList.add('cell--open');
        };
        if (!cellItem.classList.contains('cell--open')
            && cellItem.classList.contains('cell--mine')) {
            cellItem.classList.remove('cell--hidden');
            cellItem.classList.remove('cell--flag');
        };
    };
};

const clickCell = event => {
    event.preventDefault();
    let cellIndex = event.target.getAttribute('id');
    let valueId = `#${cellIndex}`;
    let cellCurrent = document.querySelector(valueId);

    // Функція автоматичного відкриття сусідніх комірок(за умови що усі вони не містять жодної міни)
    // при відкритті комірки без міни
    const cellOpenAuto = item => {
        if (item.textContent.trim() !== '') return;

        cellIndex = item.getAttribute('id');

        if (item.textContent.trim() === '') {
            // Видалення усіх символів крім чисел із cellIndex
            const numberOfcellIndex = +cellIndex.replace(/[a-zа-яё]/gi, '');

            // Функція відкриття комірки за індексом
            const cellOpen = () => {
                valueId = `#${cellIndex}`;
                cellCurrent = document.querySelector(valueId);
                if (!cellCurrent.classList.contains('cell--open')) {
                    if (cellCurrent.classList.contains('cell--flag')) {
                        minesLeftAmount += 1;
                        minesLeft.textContent = `Mines: ${minesLeftAmount}`;
                        cellCurrent.classList.remove('cell--flag');
                    }
                    cellCurrent.classList.remove('cell--hidden');
                    cellCurrent.classList.add('cell--open');
                    cellsHiddenAmount -= 1;
                    cellOpenAuto(cellCurrent);
                };
            };

            // Функція автоматичного відкриття комірки - "правого сусіда"
            const cellOpenAutoRight = () => {
                cellIndex = `index${numberOfcellIndex + 1}`;
                cellOpen();
            };
            // Функція автоматичного відкриття комірки - "нижнього правого сусіда"
            const cellOpenAutoDownRight = () => {
                cellIndex = `index${numberOfcellIndex + minefieldWidth + 1}`;
                cellOpen();
            };
            // Функція автоматичного відкриття комірки - "нижнього сусіда"
            const cellOpenAutoDown = () => {
                cellIndex = `index${numberOfcellIndex + minefieldWidth}`;
                cellOpen();
            };
            // Функція автоматичного відкриття комірки - "нижнього лівого сусіда"
            const cellOpenAutoDownLeft = () => {
                cellIndex = `index${numberOfcellIndex + minefieldWidth - 1}`;
                cellOpen();
            };
            // Функція автоматичного відкриття комірки - "лівого сусіда"
            const cellOpenAutoLeft = () => {
                cellIndex = `index${numberOfcellIndex - 1}`;
                cellOpen();
            };
            // Функція автоматичного відкриття комірки - "верхнього лівого сусіда"
            const cellOpenAutoUpLeft = () => {
                cellIndex = `index${numberOfcellIndex - minefieldWidth - 1}`;
                cellOpen();
            };
            // Функція автоматичного відкриття комірки - "верхнього сусіда"
            const cellOpenAutoUp = () => {
                cellIndex = `index${numberOfcellIndex - minefieldWidth}`;
                cellOpen();
            };
            // Функція автоматичного відкриття комірки - "верхнього правого сусіда"
            const cellOpenAutoUpRight = () => {
                cellIndex = `index${numberOfcellIndex - minefieldWidth + 1}`;
                cellOpen();
            };
            // Відкриття комірки, що знаходиться у верхньому лівому куті
            if (numberOfcellIndex === 1) {
                cellOpenAutoRight();
                cellOpenAutoDownRight();
                cellOpenAutoDown();
            };
            // Відкриття комірки, що знаходиться у верхньому правому куті
            if (numberOfcellIndex === minefieldWidth) {
                cellOpenAutoDown();
                cellOpenAutoDownLeft();
                cellOpenAutoLeft();    
            };
            // Відкриття комірок, що знаходяться у першому рядку, окрім крайньої лівої та крайньої правої комірок
            if (numberOfcellIndex > 1 && numberOfcellIndex < minefieldWidth) {
                cellOpenAutoRight();
                cellOpenAutoDownRight();
                cellOpenAutoDown();
                cellOpenAutoDownLeft();
                cellOpenAutoLeft();
            };
            // Відкриття комірки, що знаходиться у нижньому лівому куту
            if (numberOfcellIndex === cellsAmount - minefieldWidth + 1) {
                cellOpenAutoUp();
                cellOpenAutoUpRight();
                cellOpenAutoRight();
            };
            // Відкриття комірки, що знаходиться у нижньому правому куті
            if (numberOfcellIndex === cellsAmount) {
                cellOpenAutoLeft();
                cellOpenAutoUpLeft();
                cellOpenAutoUp();
            };
            // Відкриття комірок, що знаходяться у нижньому рядку, окрім крайньої лівої та крайньої правої комірок
            if (numberOfcellIndex > cellsAmount - minefieldWidth + 1 && numberOfcellIndex < cellsAmount) {
                cellOpenAutoLeft();
                cellOpenAutoUpLeft();
                cellOpenAutoUp();
                cellOpenAutoUpRight();
                cellOpenAutoRight();
            };
            // Відкриття комірок, що знаходяться у першому стовпчику, окрім крайньої верхньої та крайньої нижньої комірок
            if (numberOfcellIndex % minefieldWidth === 1 && numberOfcellIndex !== 1 && numberOfcellIndex !== cellsAmount - minefieldWidth + 1) {
                cellOpenAutoUp();
                cellOpenAutoUpRight();
                cellOpenAutoRight();
                cellOpenAutoDownRight();
                cellOpenAutoDown();
            };
            // Відкриття комірок, що знаходяться у останньому стовпчику, окрім крайньої верхньої та крайньої нижньої комірок
            if (numberOfcellIndex % minefieldWidth === 0 && numberOfcellIndex !== minefieldWidth && numberOfcellIndex !== cellsAmount) {
                cellOpenAutoDown();
                cellOpenAutoDownLeft();
                cellOpenAutoLeft();
                cellOpenAutoUpLeft();
                cellOpenAutoUp();
            };
            // Відкриття інших комірок
            if (numberOfcellIndex > minefieldWidth && numberOfcellIndex < cellsAmount - minefieldWidth && numberOfcellIndex % minefieldWidth !== 1 && numberOfcellIndex % minefieldWidth !== 0) {
                cellOpenAutoRight();
                cellOpenAutoDownRight();
                cellOpenAutoDown();
                cellOpenAutoDownLeft();
                cellOpenAutoLeft();
                cellOpenAutoUpLeft();
                cellOpenAutoUp();
                cellOpenAutoUpRight(); 
            };
        };
    };

    // Відкриття комірки при нажиманні по ній лівої клавіші мишки
    if (event.button === 0) {
        if (cellsHiddenAmount === cellsAmount) {
            timerId = setInterval(() => {
                timerValue += 1;
                timer.textContent = `Time: ${timerValue}`;
            }, 1000);
        };

        if (cellCurrent.classList.contains('cell--flag')) return;
        if (cellCurrent.classList.contains('cell--open')) return;
        if (cellCurrent.classList.contains('cell--mine')) {
            clearInterval(timerId);
            openAllCell();
            loss.style.display = 'inline';
            gameTime.textContent = `Time: ${timerValue} sec`;
            const dateGame = new Date;
            gameDate.textContent = `Date: ${String(dateGame.getUTCMonth() + 1).padStart(2, '0')}.${String(dateGame.getUTCDate()).padStart(2, '0')}.${dateGame.getUTCFullYear()}`;
            
            if (beginnerLvl.checked) {
                records.beginner.playedGames += 1;
                playedGames.textContent = `Played games: ${records.beginner.playedGames}`;
                wonGames.textContent = `Won games: ${records.beginner.wonGames}`;
                percentage.textContent = `Percentage: ${Math.round((records.beginner.wonGames / records.beginner.playedGames) * 100)} %`;
                if (records.beginner.time === 0) {
                    bestTime.textContent = 'Best time: --- sec';
                }
                if (records.beginner.time !== 0) {
                    bestTime.textContent = `Best time: ${records.beginner.time} sec`;
                };
            };
            if (amateurLvl.checked) {
                records.amateur.playedGames += 1;
                playedGames.textContent = `Played games: ${records.amateur.playedGames}`;
                wonGames.textContent = `Won games: ${records.amateur.wonGames}`;
                percentage.textContent = `Percentage: ${Math.round((records.amateur.wonGames / records.amateur.playedGames) * 100)} %`;
                if (records.amateur.time === 0) {
                    bestTime.textContent = 'Best time: --- sec';
                }
                if (records.amateur.time !== 0) {
                    bestTime.textContent = `Best time: ${records.amateur.time} sec`;
                };
            };
            if (professionalLvl.checked) {
                records.professional.playedGames += 1;
                playedGames.textContent = `Played games: ${records.professional.playedGames}`;
                wonGames.textContent = `Won games: ${records.professional.wonGames}`;
                percentage.textContent = `Percentage: ${Math.round((records.professional.wonGames / records.professional.playedGames) * 100)} %`;
                if (records.professional.time === 0) {
                    bestTime.textContent = 'Best time: --- sec';
                }
                if (records.professional.time !== 0) {
                    bestTime.textContent = `Best time: ${records.professional.time} sec`;
                };
            };
            localStorage.setItem('records', JSON.stringify(records));
            backdrop.classList.remove('is-hidden');
            endGameModal.style.display = 'flex';
            levelFormModal.style.display = 'none';
            recordsModal.style.display = 'none';
            minefield.removeEventListener('mousedown', clickCell);
            return;
        };
        cellCurrent.classList.remove('cell--hidden');
        cellCurrent.classList.add('cell--open');
        cellsHiddenAmount -= 1;

        if (cellsHiddenAmount === minesAmount) {
            clearInterval(timerId);
            win.style.display = 'inline';
            gameTime.textContent = `Time: ${timerValue} sec`;
            const dateGame = new Date;
            gameDate.textContent = `Date: ${String(dateGame.getUTCMonth() + 1).padStart(2, '0')}.${String(dateGame.getUTCDate()).padStart(2, '0')}.${dateGame.getUTCFullYear()}`;
            
            if (beginnerLvl.checked) {
                records.beginner.playedGames += 1;
                records.beginner.wonGames += 1;
                playedGames.textContent = `Played games: ${records.beginner.playedGames}`;
                wonGames.textContent = `Won games: ${records.beginner.wonGames}`;
                percentage.textContent = `Percentage: ${Math.round((records.beginner.wonGames / records.beginner.playedGames) * 100)} %`;
                if (records.beginner.time < timerValue) { 
                   bestTime.textContent = `Best time: ${records.beginner.time} sec`;
                };
                if (records.beginner.time > timerValue || records.beginner.time === 0) {
                    bestTime.textContent = `Best time: ${timerValue} sec`;
                    records.beginner.time = timerValue;
                    newRecord.style.display = 'inline';
                    records.beginner.date = `${String(dateGame.getUTCMonth() + 1).padStart(2, '0')}.${String(dateGame.getUTCDate()).padStart(2, '0')}.${dateGame.getUTCFullYear()}`;
                };
            };
            if (amateurLvl.checked) {
                records.amateur.playedGames += 1;
                records.amateur.wonGames += 1;
                playedGames.textContent = `Played games: ${records.amateur.playedGames}`;
                wonGames.textContent = `Won games: ${records.amateur.wonGames}`;
                percentage.textContent = `Percentage: ${Math.round((records.amateur.wonGames / records.amateur.playedGames) * 100)} %`;
                if (records.amateur.time < timerValue) { 
                   bestTime.textContent = `Best time: ${records.amateur.time} sec`;
                };
                if (records.amateur.time > timerValue || records.amateur.time === 0) {
                    bestTime.textContent = `Best time: ${timerValue} sec`;
                    records.amateur.time = timerValue;
                    newRecord.style.display = 'inline';
                    records.amateur.date = `${String(dateGame.getUTCMonth() + 1).padStart(2, '0')}.${String(dateGame.getUTCDate()).padStart(2, '0')}.${dateGame.getUTCFullYear()}`;
                };
            };
            if (professionalLvl.checked) {
                records.professional.playedGames += 1;
                records.professional.wonGames += 1;
                playedGames.textContent = `Played games: ${records.professional.playedGames}`;
                wonGames.textContent = `Won games: ${records.professional.wonGames}`;
                percentage.textContent = `Percentage: ${Math.round((records.professional.wonGames / records.professional.playedGames) * 100)} %`;
                if (records.beginner.time < timerValue) { 
                   bestTime.textContent = `Best time: ${records.amateur.time} sec`;
                };
                if (records.professional.time > timerValue || records.professional.time === 0) {
                    bestTime.textContent = `Best time: ${timerValue} sec`;
                    records.professional.time = timerValue;
                    newRecord.style.display = 'inline';
                    records.professional.date = `${String(dateGame.getUTCMonth() + 1).padStart(2, '0')}.${String(dateGame.getUTCDate()).padStart(2, '0')}.${dateGame.getUTCFullYear()}`;
                };
            };

            localStorage.setItem('records', JSON.stringify(records));
            backdrop.classList.remove('is-hidden');
            endGameModal.style.display = 'flex';
            levelFormModal.style.display = 'none';
            recordsModal.style.display = 'none';
            minefield.removeEventListener('mousedown', clickCell);
            return;
        }
        cellOpenAuto(cellCurrent);
    };

    // встановлення/зняття позначки з комірки при натисканні по ній правої клавіші мишки
    if (event.button === 2 && cellCurrent.classList.contains('cell--hidden')) {
        minesLeftAmount -= 1;
        minesLeft.textContent = `Mines: ${minesLeftAmount}`;
        return cellCurrent.classList.replace('cell--hidden', 'cell--flag');
    };
    if (event.button === 2 && cellCurrent.classList.contains('cell--flag')) {
        minesLeftAmount += 1;
        minesLeft.textContent = `Mines: ${minesLeftAmount}`;
        return cellCurrent.classList.replace('cell--flag', 'cell--hidden');
    };
};

minefield.addEventListener('mousedown', clickCell);

// Функція створення мінного (ігрового) поля та присвоєння індексів коміркам поля
const minefieldRender = () => {
    minesGeneration(minesAmount);

    let widthMinefield = 23 * minefieldWidth;
    minefield.style.width = `${widthMinefield}px`;
    const minefieldStringMarkupArray = [];

    for (let i = 0; i < minefieldHeight; i += 1) {
        const cellsMarkupArray = [];
        for (let j = 1; j <= minefieldWidth; j += 1) {
            const index = i * minefieldWidth + j;
            let cellText = 0;
            
            if (minesIndexArray.includes(index)) {
                cellsMarkupArray.push(
                    `
                    <div class="cell cell--mine cell--hidden" id="index${index}">
                        X
                    </div>
                    `
                );
            } else {
                if (i !== 0
                    && j > 1
                    && minesIndexArray.includes(index - minefieldWidth - 1)) {
                    cellText += 1;
                };

                if (i !== 0
                    && minesIndexArray.includes(index - minefieldWidth)) {
                    cellText += 1;
                };

                if (i !== 0
                    && j < minefieldWidth
                    && minesIndexArray.includes(index - minefieldWidth + 1)) {
                    cellText += 1;
                };

                if (j > 1
                    && minesIndexArray.includes(index - 1)) {
                    cellText += 1;
                };

                if (j < minefieldWidth
                    && minesIndexArray.includes(index + 1)) {
                    cellText += 1;
                };

                if (i !== minefieldHeight - 1
                    && j > 1
                    && minesIndexArray.includes(index + minefieldWidth - 1)) {
                    cellText += 1;
                };

                if (i !== minefieldHeight - 1
                    && minesIndexArray.includes(index + minefieldWidth)) {
                    cellText += 1;
                };

                if (i !== minefieldHeight - 1
                    && j < minefieldWidth
                    && minesIndexArray.includes(index + minefieldWidth + 1)) {
                    cellText += 1;
                };

                if (cellText === 0) {
                    cellText = '';
                };

                cellsMarkupArray.push(
                    `
                    <div class="cell cell--hidden" id="index${index}">
                        ${cellText}
                    </div>
                    `
                );
            };
        };

        const minefieldStringMarkup = cellsMarkupArray.join('');
        minefieldStringMarkupArray.push(`<div class="minefield__string">${minefieldStringMarkup}</div>`);
    };
    const minefieldMarkup = minefieldStringMarkupArray.join('');
    minefield.insertAdjacentHTML('beforeend', minefieldMarkup);
    minesLeft = document.querySelector('.mines-left');
    timer = document.querySelector('.timer');
    minesLeft.textContent = `Mines: ${minesLeftAmount}`;
    timer.textContent = `Time: ${timerValue}`
};

// Створення мінного (ігрового) поля
minefieldRender();