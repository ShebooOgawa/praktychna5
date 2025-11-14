// --- 1. Вибір елементів ---
const resultInput = document.getElementById('result');
const buttons = document.querySelector('.buttons');

// --- 2. Змінні стану калькулятора ---
let currentInput = '0';   // Значення, що зараз на дисплеї
let operator = null;      // Поточний оператор (+, -, *, /)
let previousInput = null; // Попереднє число (перший операнд)

// НОВА ЗМІННА:
// Цей "прапорець" показує, що ми вже натиснули оператор
// і наступне введене число має "перезаписати" дисплей.
let waitingForNextInput = false;

// --- 3. Головний слухач подій (Делегування) ---
buttons.addEventListener('click', (event) => {
    const target = event.target; 
    if (!target.matches('button')) {
        return;
    }

    const value = target.dataset.value;

    if (target.classList.contains('operator')) {
        handleOperator(value);
    } else if (target.classList.contains('equals')) {
        handleEquals();
    } else if (target.classList.contains('clear')) {
        handleClear();
    } else if (value === '.') {
        handleDecimal();
    } else {
        handleNumber(value);
    }

    // Оновлюємо дисплей ПІСЛЯ кожної дії
    updateDisplay();
});

// --- 4. Функція для обчислень ---
// (Винесена в окрему функцію для чистоти коду)
function calculate(first, second, op) {
    const prev = parseFloat(first);
    const current = parseFloat(second);

    if (isNaN(prev) || isNaN(current)) return null;

    let result;
    switch (op) {
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
            if (current === 0) {
                alert("Помилка: Ділення на нуль!");
                return '0'; // Повертаємо '0' у разі помилки
            }
            result = prev / current;
            break;
        default:
            return null;
    }
    return result.toString();
}

// --- 5. Допоміжні функції (ОНОВЛЕНА ЛОГІКА) ---

function updateDisplay() {
    resultInput.value = currentInput;
}

function handleNumber(number) {
    // ЯКЩО ми чекаємо на нове число (тобто, щойно натиснули "+"),
    // то це число (наприклад, "3") має ЗАМІНИТИ те, що на дисплеї.
    if (waitingForNextInput) {
        currentInput = number;
        waitingForNextInput = false; // Вимикаємо прапорець
    } else {
        // Інакше - просто додаємо цифри
        currentInput = (currentInput === '0') ? number : currentInput + number;
    }
}

function handleDecimal() {
    // Якщо ми починаємо вводити нове число з крапки
    if (waitingForNextInput) {
        currentInput = '0.';
        waitingForNextInput = false;
        return;
    }
    
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

function handleOperator(nextOperator) {
    // Якщо previousInput ще немає, просто зберігаємо поточне число
    if (previousInput === null) {
        previousInput = currentInput;
    } 
    // **ЛОГІКА ЛАНЦЮГІВ (7 + 3 - ...) **
    // Якщо оператор вже є, значить, це *друга* операція.
    else if (operator) {
        const result = calculate(previousInput, currentInput, operator);
        currentInput = result; // Показуємо проміжний результат!
        previousInput = result; // Він стає новим першим операндом
    }

    // Готуємось до наступного введення
    waitingForNextInput = true;
    operator = nextOperator; // Зберігаємо новий оператор
}

function handleEquals() {
    // Обчислюємо, лише якщо є всі компоненти
    if (operator && previousInput !== null) {
        currentInput = calculate(previousInput, currentInput, operator);
        
        // Скидаємо стан для нових обчислень
        operator = null;
        previousInput = null;
        waitingForNextInput = false; // Не чекаємо, бо обчислення завершено
    }
}

function handleClear() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForNextInput = false;
}

// --- 6. Початкове завантаження ---
updateDisplay();
