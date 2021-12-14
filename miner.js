// +++ 1. HTML-розмітка
// +++ 2. Функція рендерингу тіла ігрового поля
// +++ 3. Можливість задавати ширину/висоту ігрового поля після натискання кнопки START
// +++ 4. Приховати комірки ігрового поля/
//        - натисканням лівої кнопки миші відкривати комірки ігрового поля/
//        - натисканням правої кнопки миші ставити позначки на комірки
// 5. Функція генерації індексів комірок з мінами/
//    - вибір складності гри
// 6. Автоматичне відкриття сусідніх пустих клітинок
// 7. Локальне зберігання 10 найкращих результатів/рекордів гри в розрізі рівнів складності гри
// 8. Користувацький рівень складності
// 9. Таймер для різних рівнів гри


// РІВНІ СКЛАДНОСТІ
// * - 10х10 - 10 мін
// ** - 16х16 - 40 мін
// *** - 30*16 - 99 мін
// ??? - 9-30*9-24 - 10-668 мін


const widthInput = document.querySelector('.width__input');
const heightInput = document.querySelector('.height__input');
const valueInput = document.querySelector('.value__input');
const startBtn = document.querySelector('.start-btn');
const miner = document.querySelector('.miner');

let mines = [];

const minerArray = [];
let widthMiner = +widthInput.value;
let heightMiner = +heightInput.value;
let valueMiner = +valueInput.value;
let valueItems = widthMiner * heightMiner;

valueInput.setAttribute('max', valueItems);

widthInput.addEventListener('input', () => {
    valueMiner = +valueInput.value;
    widthMiner = +widthInput.value;
    valueItems = widthMiner * heightMiner;
    if (valueMiner > valueItems) {
        valueInput.setAttribute('value', valueItems);
        valueInput.value = valueItems;
    };
    valueInput.setAttribute('max', valueItems);
});

heightInput.addEventListener('input', () => {
    valueMiner = +valueInput.value;
    heightMiner = +heightInput.value;
    valueItems = widthMiner * heightMiner;
    if (valueMiner > valueItems) {
        valueInput.setAttribute('value', valueItems);
        valueInput.value = valueItems;
    };
    valueInput.setAttribute('max', valueItems);
});

startBtn.addEventListener('click', event => {
    event.preventDefault();
    miner.innerHTML = '';
    widthMiner = +widthInput.value;
    heightMiner = +heightInput.value;
    valueMiner = +valueInput.value;
    valueItems = widthMiner * heightMiner;
    renderMiner();
});

miner.addEventListener('contextmenu', event => {
    event.preventDefault();
});

const numberRandomUnique = () => {
    const numberRandom = Math.round(Math.random() * (valueItems - 1) + 1);
    if (!mines.includes(numberRandom)) {
        mines.push(numberRandom);
    } else {
        numberRandomUnique();
    };
};

const minesGeneration = value => {
    mines = [];
    for (let i = 1; i <= value; i += 1) {
        numberRandomUnique();
    };
};

miner.addEventListener('mousedown', event => {
    event.preventDefault();
    const itemClicked = event.target;
    if (event.button === 0 && itemClicked.classList.contains('overlay')
        || event.button === 0 && itemClicked.classList.contains('overlay-flag')
        || event.button === 0 && itemClicked.classList.contains('overlay-mine')) {
        itemClicked.style.display = 'none';
    };
    if (event.button === 2 && itemClicked.classList.contains('overlay')) {
       return itemClicked.classList.replace('overlay', 'overlay-flag');
    };
    if (event.button === 2 && itemClicked.classList.contains('overlay-flag')) {
       return itemClicked.classList.replace('overlay-flag', 'overlay-mine');
    };
    if (event.button === 2 && itemClicked.classList.contains('overlay-mine')) {
       return itemClicked.classList.replace('overlay-mine', 'overlay');
    };
});

const renderMiner = () => {
    minesGeneration(valueMiner);
    const minerStrings = [];

    for (let i = 0; i < heightMiner; i += 1) {
        const minerItems = [];
        for (let j = 1; j <= widthMiner; j += 1) {
            const index = i * widthMiner + j;
            let minerItemsText = 0;
            
            if (mines.includes(index)) {
                minerItems.push(
                    `
                    <div class="mine">
                        X
                        <div class="overlay">
                        </div>
                    </div>
                    `
                );
            } else {
                if (i !== 0
                    && j > 1
                    && mines.includes(index - widthMiner - 1)) {
                    minerItemsText += 1;
                };

                if (i !== 0
                    && mines.includes(index - widthMiner)) {
                    minerItemsText += 1;
                };

                if (i !== 0
                    && j < widthMiner
                    && mines.includes(index - widthMiner + 1)) {
                    minerItemsText += 1;
                };

                if (j > 1
                    && mines.includes(index - 1)) {
                    minerItemsText += 1;
                };

                if (j < widthMiner
                    && mines.includes(index + 1)) {
                    minerItemsText += 1;
                };

                if (i !== heightMiner - 1
                    && j > 1
                    && mines.includes(index + widthMiner - 1)) {
                    minerItemsText += 1;
                };

                if (i !== heightMiner - 1
                    && mines.includes(index + widthMiner)) {
                    minerItemsText += 1;
                };

                if (i !== heightMiner - 1
                    && j < widthMiner
                    && mines.includes(index + widthMiner + 1)) {
                    minerItemsText += 1;
                };

                if (minerItemsText === 0) {
                    minerItemsText = '';
                };

                minerItems.push(
                    `
                    <div class="not-mine">
                        ${minerItemsText}
                        <div class="overlay">
                        </div>
                    </div>
                    `
                );
            };
        };

        const AAA = minerItems.join('');
        minerStrings.push(`<div class="div-strings">${AAA}</div>`);
    };
    const minerRender = minerStrings.join('');
    miner.insertAdjacentHTML('beforeend', minerRender);
};

renderMiner();