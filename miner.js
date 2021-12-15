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
// 7а. Написати функцію відкриття сусідніх комірок
// 8. Таймер для різних рівнів гри
// 9. Локальне зберігання 10 найкращих результатів/рекордів гри в розрізі рівнів складності гри

// РІВНІ СКЛАДНОСТІ
// * - 9х9 - 10 мін
// ** - 16х16 - 40 мін
// *** - 30*16 - 99 мін
// ??? - 9-30*9-24 - 10-668 мін
// !!!! міни макс 668 (93% від розміру поля)

// Видалення усіх символів крім чисел
// let str = '3. Как удалить все буквы из строки с помощью JavaScript?';
// str = str.replace(/[a-zа-яё]/gi, '');

const widthInput = document.querySelector('.width__input');
const heightInput = document.querySelector('.height__input');
const valueInput = document.querySelector('.value__input');
const startBtn = document.querySelector('.start-btn');
const miner = document.querySelector('.miner');
const beginnerLvl = document.querySelector('#beginner');
const amateurLvl = document.querySelector('#amateur');
const professionalLvl = document.querySelector('#professional');
const specialLvl = document.querySelector('#special');

let mines = [];

const minerArray = [];
let widthMiner = +widthInput.value;
let heightMiner = +heightInput.value;
let valueMiner = +valueInput.value;
let valueItems = widthMiner * heightMiner;

beginnerLvl.addEventListener('change', () => {
    widthInput.setAttribute('disabled', 'disabled');
    heightInput.setAttribute('disabled', 'disabled');
    valueInput.setAttribute('disabled', 'disabled');
    widthInput.value = 9;
    heightInput.value = 9;
    valueInput.value = 10;
});
amateurLvl.addEventListener('change', () => {
    widthInput.setAttribute('disabled', 'disabled');
    heightInput.setAttribute('disabled', 'disabled');
    valueInput.setAttribute('disabled', 'disabled');
    widthInput.value = 9;
    heightInput.value = 9;
    valueInput.value = 10;
});
professionalLvl.addEventListener('change', () => {
    widthInput.setAttribute('disabled', 'disabled');
    heightInput.setAttribute('disabled', 'disabled');
    valueInput.setAttribute('disabled', 'disabled');
    widthInput.value = 9;
    heightInput.value = 9;
    valueInput.value = 10;
});
specialLvl.addEventListener('change', () => {
    widthInput.removeAttribute('disabled');
    heightInput.removeAttribute('disabled');
    valueInput.removeAttribute('disabled');
});

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

    if (beginnerLvl.checked) {
        widthMiner = 9;
        heightMiner = 9;
        valueMiner = 10;
    };
    if (amateurLvl.checked) {
        widthMiner = 16;
        heightMiner = 16;
        valueMiner = 40;
    };
    if (professionalLvl.checked) {
        widthMiner = 30;
        heightMiner = 16;
        valueMiner = 99;
    };
    if (specialLvl.checked) {
        widthMiner = +widthInput.value;
        heightMiner = +heightInput.value;
        valueMiner = +valueInput.value;
    };
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
    let itemIndex = event.target.getAttribute('id');
    let valueId = `#${itemIndex}`;
    let itemCurrent = document.querySelector(valueId);

    const itemOpenAuto = (item) => {
        if (item.textContent.trim() !== '') return;

        itemIndex = item.getAttribute('id');

        if (item.textContent.trim() === '') {
            // Видалення усіх символів крім чисел із itemIndex
            const numberOfItemIndex = +itemIndex.replace(/[a-zа-яё]/gi, '');

            const openItemRight = () => {
                itemIndex = `index${numberOfItemIndex + 1}`;
                valueId = `#${itemIndex}`;
                itemCurrent = document.querySelector(valueId);
                if (!itemCurrent.classList.contains('item__open')) {
                    console.log(itemIndex);
                    itemCurrent.classList.remove('item__hidden');
                    itemCurrent.classList.remove('item__mark');
                    itemCurrent.classList.add('item__open');
                    itemOpenAuto(itemCurrent);
                };
            };
            const openItemDownRight = () => {
                itemIndex = `index${numberOfItemIndex + widthMiner + 1}`;
                valueId = `#${itemIndex}`;
                itemCurrent = document.querySelector(valueId);
                if (!itemCurrent.classList.contains('item__open')) {
                    console.log(itemIndex);
                    itemCurrent.classList.remove('item__hidden');
                    itemCurrent.classList.remove('item__mark');
                    itemCurrent.classList.add('item__open');
                    itemOpenAuto(itemCurrent);
                };
            };
            const openItemDown = () => {
                itemIndex = `index${numberOfItemIndex + widthMiner}`;
                valueId = `#${itemIndex}`;
                itemCurrent = document.querySelector(valueId);
                if (!itemCurrent.classList.contains('item__open')) {
                    console.log(itemIndex);
                    itemCurrent.classList.remove('item__hidden');
                    itemCurrent.classList.remove('item__mark');
                    itemCurrent.classList.add('item__open');
                    itemOpenAuto(itemCurrent);
                };
            };
            const openItemDownLeft = () => {
                itemIndex = `index${numberOfItemIndex + widthMiner - 1}`;
                valueId = `#${itemIndex}`;
                itemCurrent = document.querySelector(valueId);
                if (!itemCurrent.classList.contains('item__open')) {
                    console.log(itemIndex);
                    itemCurrent.classList.remove('item__hidden');
                    itemCurrent.classList.remove('item__mark');
                    itemCurrent.classList.add('item__open');
                    itemOpenAuto(itemCurrent);
                };
            };
            const openItemLeft = () => {
                itemIndex = `index${numberOfItemIndex - 1}`;
                valueId = `#${itemIndex}`;
                itemCurrent = document.querySelector(valueId);
                if (!itemCurrent.classList.contains('item__open')) {
                    console.log(itemIndex);
                    itemCurrent.classList.remove('item__hidden');
                    itemCurrent.classList.remove('item__mark');
                    itemCurrent.classList.add('item__open');
                    itemOpenAuto(itemCurrent);
                };
            };
            const openItemUpLeft = () => {
                itemIndex = `index${numberOfItemIndex - widthMiner - 1}`;
                valueId = `#${itemIndex}`;
                itemCurrent = document.querySelector(valueId);
                if (!itemCurrent.classList.contains('item__open')) {
                    console.log(itemIndex);
                    itemCurrent.classList.remove('item__hidden');
                    itemCurrent.classList.remove('item__mark');
                    itemCurrent.classList.add('item__open');
                    itemOpenAuto(itemCurrent);
                };
            };
            const openItemUp = () => {
                itemIndex = `index${numberOfItemIndex - widthMiner}`;
                valueId = `#${itemIndex}`;
                itemCurrent = document.querySelector(valueId);
                if (!itemCurrent.classList.contains('item__open')) {
                    console.log(itemIndex);
                    itemCurrent.classList.remove('item__hidden');
                    itemCurrent.classList.remove('item__mark');
                    itemCurrent.classList.add('item__open');
                    itemOpenAuto(itemCurrent);
                };
            };
            const openItemUpRight = () => {
                itemIndex = `index${numberOfItemIndex - widthMiner + 1}`;
                valueId = `#${itemIndex}`;
                itemCurrent = document.querySelector(valueId);
                if (!itemCurrent.classList.contains('item__open')) {
                    console.log(itemIndex);
                    itemCurrent.classList.remove('item__hidden');
                    itemCurrent.classList.remove('item__mark');
                    itemCurrent.classList.add('item__open');
                    itemOpenAuto(itemCurrent);
                };
            };

            // Відкриття комірки у верхньому лівому куті
            if (numberOfItemIndex === 1) {
                openItemRight();
                openItemDownRight();
                openItemDown();
            }

            // Відкриття комірки у верхньому правому куті
            if (numberOfItemIndex === widthMiner) {
                openItemDown();
                openItemDownLeft();
                openItemLeft();    
            }

            // Відкриття комірок у першому рядку окрім верхньої лівої та верхньої правої
            if (numberOfItemIndex > 1 && numberOfItemIndex < widthMiner) {
                openItemRight();
                openItemDownRight();
                openItemDown();
                openItemDownLeft();
                openItemLeft();
            }

            // Відкриття комірки у нижньому лівому куту
            if (numberOfItemIndex === valueItems - widthMiner + 1) {
                openItemUp();
                openItemUpRight();
                openItemRight();
            }

            // Відкриття комірки у нижньому правому куті
            if (numberOfItemIndex === valueItems) {
                openItemLeft();
                openItemUpLeft();
                openItemUp();
            };

            // Відкриття комірок у нижньому рядку окрім нижньої лівої та нижньої правої
            if (numberOfItemIndex > valueItems - widthMiner + 1 && numberOfItemIndex < valueItems) {
                openItemLeft();
                openItemUpLeft();
                openItemUp();
                openItemUpRight();
                openItemRight();
            };

            // Відкриття комірок у першому стовпчику окрім верхньої лівої та нижньої лівої комірок
            if (numberOfItemIndex % widthMiner === 1 && numberOfItemIndex !== 1 && numberOfItemIndex !== valueItems - widthMiner + 1) {
                openItemUp();
                openItemUpRight();
                openItemRight();
                openItemDownRight();
                openItemDown();
            };

            // Відкриття комірок у останньому стовпчику окрім верхньої правої та нижньої правої комірок
            if (numberOfItemIndex % widthMiner === 0 && numberOfItemIndex !== widthMiner && numberOfItemIndex !== valueItems) {
                openItemDown();
                openItemDownLeft();
                openItemLeft();
                openItemUpLeft();
                openItemUp();
            };

            // Відкриття інших комірок
            if (numberOfItemIndex > widthMiner && numberOfItemIndex < valueItems - widthMiner && numberOfItemIndex % widthMiner !== 1 && numberOfItemIndex % widthMiner !== 0) {
                openItemRight();
                openItemDownRight();
                openItemDown();
                openItemDownLeft();
                openItemLeft();
                openItemUpLeft();
                openItemUp();
                openItemUpRight(); 
            };
        };
    };

    if (event.button === 0) {
        itemCurrent.classList.remove('item__hidden');
        itemCurrent.classList.remove('item__mark');
        itemCurrent.classList.add('item__open');
        itemOpenAuto(itemCurrent);
    };
    if (event.button === 2 && itemCurrent.classList.contains('item__hidden')) {
        return itemCurrent.classList.replace('item__hidden', 'item__mark');
    };
    if (event.button === 2 && itemCurrent.classList.contains('item__mark')) {
        return itemCurrent.classList.replace('item__mark', 'item__hidden');
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
                    <div class="mine item__hidden" id="index${index}">
                        X
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
                    <div class="not-mine item__hidden" id="index${index}">
                        ${minerItemsText}
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