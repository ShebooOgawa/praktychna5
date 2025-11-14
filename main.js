// main.js

// --- 1. Ваші початкові змінні ---
const resultInput = document.getElementById('result');
const buttons = document.querySelector('.buttons');

let currentInput = '0';   // Число, що зараз вводиться
let operator = null;      // Поточний оператор (+, -, *, /)
let previousInput = null; // Попереднє число (перший операнд)

// --- 2. Головний слухач подій (Делегування) ---
// Ми додаємо ОДИН слухач до контейнера .buttons
// Він буде "ловити" кліки на всіх кнопках всередині

buttons.addEventListener('click', (event) => {
    const target = event.target; // Кнопка, на яку натиснули

    // Переконуємося, що клікнули саме на кнопку, а не на простір між ними
    if (!target.matches('button')) {
        return;
    }

    // Отримуємо значення кнопки з її data-атрибуту
    const value = target.dataset.value;

    // --- 3. Визначення типу кнопки та виклик функції ---
    // Ми перевіряємо КЛАС кнопки, щоб зрозуміти її ТИП
    
    if (target.classList.contains('operator')) {
        handleOperator(value);
    } else if (target.classList.contains('equals')) {
        handleEquals();
    } else if (target.classList.contains('clear')) {
        handleClear();
    } else if (value === '.') {
        handleDecimal();
    } else {
        // Якщо це не оператор, не "дорівнює" і не "C" - це число
        handleNumber(value);
    }

    // Оновлюємо дисплей ПІСЛЯ кожної дії
    updateDisplay();
});

// --- 4. Допоміжні функції ---

/**
 * Оновлює дисплей (input#result) поточним значенням.
 * ВАЖЛИВО: для <input> ми використовуємо .value, а не .innerText
 */
function updateDisplay() {
    resultInput.value = currentInput;
}

/**
 * Обробляє введення цифр (0-9).
 * @param {string} number - Натиснута цифра.
 */
function handleNumber(number) {
    // Якщо '0' або введено оператор, замінюємо '0' новим числом
    if (currentInput === '0') {
        currentInput = number;
    } else {
        // Інакше - додаємо цифру до кінця
        currentInput += number;
    }
}

/**
 * Обробляє натискання десяткової крапки (.).
 */
function handleDecimal() {
    // Запобігаємо додаванню кількох крапок (наприклад, "5.5.5")
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

/**
 * Обробляє натискання оператора (+, -, *, /).
 * @param {string} nextOperator - Оператор, який натиснули.
 */
function handleOperator(nextOperator) {
    // Обробка ланцюгових операцій (наприклад, 5 + 5 - 2)
    // Якщо ми вже маємо перше число і оператор, то спочатку рахуємо
    if (previousInput !== null && operator) {
        handleEquals();
    }
    
    // Зберігаємо стан для наступного обчислення
    previousInput = currentInput;
    currentInput = '0'; // Готуємось до введення другого числа
    operator = nextOperator; // Зберігаємо сам оператор
}

/**
 * Виконує обчислення при натисканні "=".
 */
function handleEquals() {
    // Потрібні обидва операнди та оператор
    if (operator === null || previousInput === null) {
        return; // Нічого не робити, якщо чогось не вистачає
    }

    let result;
    // Перетворюємо рядки в числа для математики
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    // Додаткова перевірка, чи це справді числа
    if (isNaN(prev) || isNaN(current)) {
        return;
    }

    // Виконуємо операцію відповідно до 'operator'
    // Ми використовуємо '*' та '/' згідно з вашими data-value
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            // Важлива перевірка ділення на нуль!
            if (current === 0) {
                alert("Помилка: Ділення на нуль!");
                handleClear(); // Скидаємо калькулятор
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    // Оновлюємо стан калькулятора результатом
    currentInput = result.toString();
    operator = null;
    previousInput = null;
}

/**
 * Скидає калькулятор до початкового стану (кнопка "C").
 */
function handleClear() {
    currentInput = '0';
    operator = null;
    previousInput = null;
}

// --- 5. Початкове завантаження ---
// Переконуємося, що дисплей показує '0' при першому завантаженні сторінки
updateDisplay();