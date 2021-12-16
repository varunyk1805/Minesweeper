// +++ 1. HTML-розмітка
// +++ 2. Функція рендерингу тіла ігрового поля
// +++ 3. Можливість задавати ширину/висоту ігрового поля після натискання кнопки START
// +++ 4. Приховати комірки ігрового поля/
//        - натисканням лівої кнопки миші відкривати комірки ігрового поля/
//        - натисканням правої кнопки миші ставити позначки на комірки
// +++ 5. Функція генерації індексів комірок з мінами/
//    - вибір складності гри
// +++ 6. Особливий рівень складності
// +++ 7. Автоматичне відкриття сусідніх пустих клітинок (рекурсія)
// 8. Оптимізувати підфункції функції cellOpenAuto
// 9. Комірка з поміткою не повинна відкриватися
// 10. При відкриванні комірки з міною GAME OVER і вибір нової гри
// 11. Відлік часу і відображення кількості ще не знайдених мін
// 12. Локальне зберігання 10 найкращих результатів/рекордів гри в розрізі рівнів складності
//    (рівень складності/тривалість гри/дата і час гри/ім'я гравця)
// 13. Оформити візуальну частину
// 14. В README.md описати функціонал і реалізації

// !!!!! РІВНІ СКЛАДНОСТІ
// * - 9х9 - 10 мін
// ** - 16х16 - 40 мін
// *** - 30*16 - 99 мін
// ??? - 9-30*9-24 - 10-668 мін
// !!!! міни макс 668 (93% від розміру поля)

// !!!!! Видалення усіх символів крім чисел
// let str = '3. Как удалить все буквы из строки с помощью JavaScript?';
// str = str.replace(/[a-zа-яё]/gi, '');

// !!!!! Заборона виділення тексту
// elem.onmousedown = elem.onselectstart = function() {
//   return false;
// };

const widthInput = document.querySelector('.width__input');
const heightInput = document.querySelector('.height__input');
const amountInput = document.querySelector('.amount__input');
const startBtn = document.querySelector('.start-btn');
const minefield = document.querySelector('.minefield');
const beginnerLvl = document.querySelector('#beginner');
const amateurLvl = document.querySelector('#amateur');
const professionalLvl = document.querySelector('#professional');
const specialLvl = document.querySelector('#special');

const minesIndexArray = [];
let minefieldWidth = +widthInput.value;
let minefieldHeight = +heightInput.value;
let minesAmount = +amountInput.value;
let cellsAmount = minefieldWidth * minefieldHeight;
let minesAmountMax = Math.round(cellsAmount * 0.93);

const minesAmountMaxAuto = () => {
    minefieldWidth = +widthInput.value;
    minefieldHeight = +heightInput.value;
    minesAmount = +amountInput.value;
    cellsAmount = minefieldWidth * minefieldHeight;
    minesAmountMax = Math.round(cellsAmount * 0.93);

    if (minesAmount > minesAmountMax) {
        amountInput.setAttribute('value', minesAmountMax);
        amountInput.value = minesAmountMax;
    };
    amountInput.setAttribute('max', minesAmountMax);
};

widthInput.addEventListener('input', minesAmountMaxAuto);
heightInput.addEventListener('input', minesAmountMaxAuto);

const AAA = () => {
    widthInput.setAttribute('disabled', 'disabled');
    heightInput.setAttribute('disabled', 'disabled');
    amountInput.setAttribute('disabled', 'disabled');
};

beginnerLvl.addEventListener('change', AAA);
amateurLvl.addEventListener('change', AAA);
professionalLvl.addEventListener('change', AAA);

specialLvl.addEventListener('change', () => {
    widthInput.removeAttribute('disabled');
    heightInput.removeAttribute('disabled');
    amountInput.removeAttribute('disabled');
});

startBtn.addEventListener('click', event => {
    event.preventDefault();
    minefield.innerHTML = '';

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
    cellsAmount = minefieldWidth * minefieldHeight;
    minefieldRender();
});

minefield.addEventListener('contextmenu', event => {
    event.preventDefault();
});

const minesIndexRandomUnique = () => {
    const minesIndexRandom = Math.round(Math.random() * (cellsAmount - 1) + 1);
    if (!minesIndexArray.includes(minesIndexRandom)) {
        minesIndexArray.push(minesIndexRandom);
    } else {
        minesIndexRandomUnique();
    };
};

const minesGeneration = value => {
    minesIndexArray.length = 0;
    for (let i = 1; i <= value; i += 1) {
        minesIndexRandomUnique();
    };
};

minefield.addEventListener('mousedown', event => {
    event.preventDefault();
    let cellIndex = event.target.getAttribute('id');
    let valueId = `#${cellIndex}`;
    let cellCurrent = document.querySelector(valueId);

    const cellOpenAuto = item => {
        if (item.textContent.trim() !== '') return;

        cellIndex = item.getAttribute('id');

        if (item.textContent.trim() === '') {
            // Видалення усіх символів крім чисел із cellIndex
            const numberOfcellIndex = +cellIndex.replace(/[a-zа-яё]/gi, '');

            const cellOpenAutoRight = () => {
                cellIndex = `index${numberOfcellIndex + 1}`;
                valueId = `#${cellIndex}`;
                cellCurrent = document.querySelector(valueId);
                if (!cellCurrent.classList.contains('cell--open')) {
                    cellCurrent.classList.remove('cell--hidden');
                    cellCurrent.classList.remove('cell--flag');
                    cellCurrent.classList.add('cell--open');
                    cellOpenAuto(cellCurrent);
                };
            };
            const cellOpenAutoDownRight = () => {
                cellIndex = `index${numberOfcellIndex + minefieldWidth + 1}`;
                valueId = `#${cellIndex}`;
                cellCurrent = document.querySelector(valueId);
                if (!cellCurrent.classList.contains('cell--open')) {
                    cellCurrent.classList.remove('cell--hidden');
                    cellCurrent.classList.remove('cell--flag');
                    cellCurrent.classList.add('cell--open');
                    cellOpenAuto(cellCurrent);
                };
            };
            const cellOpenAutoDown = () => {
                cellIndex = `index${numberOfcellIndex + minefieldWidth}`;
                valueId = `#${cellIndex}`;
                cellCurrent = document.querySelector(valueId);
                if (!cellCurrent.classList.contains('cell--open')) {
                    cellCurrent.classList.remove('cell--hidden');
                    cellCurrent.classList.remove('cell--flag');
                    cellCurrent.classList.add('cell--open');
                    cellOpenAuto(cellCurrent);
                };
            };
            const cellOpenAutoDownLeft = () => {
                cellIndex = `index${numberOfcellIndex + minefieldWidth - 1}`;
                valueId = `#${cellIndex}`;
                cellCurrent = document.querySelector(valueId);
                if (!cellCurrent.classList.contains('cell--open')) {
                    cellCurrent.classList.remove('cell--hidden');
                    cellCurrent.classList.remove('cell--flag');
                    cellCurrent.classList.add('cell--open');
                    cellOpenAuto(cellCurrent);
                };
            };
            const cellOpenAutoLeft = () => {
                cellIndex = `index${numberOfcellIndex - 1}`;
                valueId = `#${cellIndex}`;
                cellCurrent = document.querySelector(valueId);
                if (!cellCurrent.classList.contains('cell--open')) {
                    cellCurrent.classList.remove('cell--hidden');
                    cellCurrent.classList.remove('cell--flag');
                    cellCurrent.classList.add('cell--open');
                    cellOpenAuto(cellCurrent);
                };
            };
            const cellOpenAutoUpLeft = () => {
                cellIndex = `index${numberOfcellIndex - minefieldWidth - 1}`;
                valueId = `#${cellIndex}`;
                cellCurrent = document.querySelector(valueId);
                if (!cellCurrent.classList.contains('cell--open')) {
                    cellCurrent.classList.remove('cell--hidden');
                    cellCurrent.classList.remove('cell--flag');
                    cellCurrent.classList.add('cell--open');
                    cellOpenAuto(cellCurrent);
                };
            };
            const cellOpenAutoUp = () => {
                cellIndex = `index${numberOfcellIndex - minefieldWidth}`;
                valueId = `#${cellIndex}`;
                cellCurrent = document.querySelector(valueId);
                if (!cellCurrent.classList.contains('cell--open')) {
                    cellCurrent.classList.remove('cell--hidden');
                    cellCurrent.classList.remove('cell--flag');
                    cellCurrent.classList.add('cell--open');
                    cellOpenAuto(cellCurrent);
                };
            };
            const cellOpenAutoUpRight = () => {
                cellIndex = `index${numberOfcellIndex - minefieldWidth + 1}`;
                valueId = `#${cellIndex}`;
                cellCurrent = document.querySelector(valueId);
                if (!cellCurrent.classList.contains('cell--open')) {
                    cellCurrent.classList.remove('cell--hidden');
                    cellCurrent.classList.remove('cell--flag');
                    cellCurrent.classList.add('cell--open');
                    cellOpenAuto(cellCurrent);
                };
            };
            // Відкриття комірки у верхньому лівому куті
            if (numberOfcellIndex === 1) {
                cellOpenAutoRight();
                cellOpenAutoDownRight();
                cellOpenAutoDown();
            };
            // Відкриття комірки у верхньому правому куті
            if (numberOfcellIndex === minefieldWidth) {
                cellOpenAutoDown();
                cellOpenAutoDownLeft();
                cellOpenAutoLeft();    
            };
            // Відкриття комірок у першому рядку окрім верхньої лівої та верхньої правої
            if (numberOfcellIndex > 1 && numberOfcellIndex < minefieldWidth) {
                cellOpenAutoRight();
                cellOpenAutoDownRight();
                cellOpenAutoDown();
                cellOpenAutoDownLeft();
                cellOpenAutoLeft();
            };
            // Відкриття комірки у нижньому лівому куту
            if (numberOfcellIndex === cellsAmount - minefieldWidth + 1) {
                cellOpenAutoUp();
                cellOpenAutoUpRight();
                cellOpenAutoRight();
            };
            // Відкриття комірки у нижньому правому куті
            if (numberOfcellIndex === cellsAmount) {
                cellOpenAutoLeft();
                cellOpenAutoUpLeft();
                cellOpenAutoUp();
            };
            // Відкриття комірок у нижньому рядку окрім нижньої лівої та нижньої правої
            if (numberOfcellIndex > cellsAmount - minefieldWidth + 1 && numberOfcellIndex < cellsAmount) {
                cellOpenAutoLeft();
                cellOpenAutoUpLeft();
                cellOpenAutoUp();
                cellOpenAutoUpRight();
                cellOpenAutoRight();
            };
            // Відкриття комірок у першому стовпчику окрім верхньої лівої та нижньої лівої комірок
            if (numberOfcellIndex % minefieldWidth === 1 && numberOfcellIndex !== 1 && numberOfcellIndex !== cellsAmount - minefieldWidth + 1) {
                cellOpenAutoUp();
                cellOpenAutoUpRight();
                cellOpenAutoRight();
                cellOpenAutoDownRight();
                cellOpenAutoDown();
            };
            // Відкриття комірок у останньому стовпчику окрім верхньої правої та нижньої правої комірок
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

    if (event.button === 0) {
        cellCurrent.classList.remove('cell--hidden');
        cellCurrent.classList.remove('cell--flag');
        cellCurrent.classList.add('cell--open');
        cellOpenAuto(cellCurrent);
    };
    if (event.button === 2 && cellCurrent.classList.contains('cell--hidden')) {
        return cellCurrent.classList.replace('cell--hidden', 'cell--flag');
    };
    if (event.button === 2 && cellCurrent.classList.contains('cell--flag')) {
        return cellCurrent.classList.replace('cell--flag', 'cell--hidden');
    };
});

const minefieldRender = () => {
    minesGeneration(minesAmount);
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
};

minefieldRender();