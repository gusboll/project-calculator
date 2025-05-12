let calculation = [];
let currentInput = '0';
let lastOperation = null;
let inverseMode = false;

const buttons = Array.from(document.querySelectorAll('button'));
const inputDisplay = document.querySelector('.userInput');
const inverseToggleButton = document.querySelector('.calculatorInverse');

function updateDisplay(value) {
    inputDisplay.value = value;
}

function getOperator(op) {
    if (!inverseMode) return op;

    switch (op) {
        case '+': return '-';
        case '-': return '+';
        case '*': return '/';
        case '/': return '*';
        default: return op;
    }
}

function calculate(showResult = false) {
    try {
        if (calculation.length === 0) return currentInput;

        const expression = [...calculation, currentInput].join('');

        if (/[^0-9+\-*/. ]/.test(expression)) {
            throw new Error('Invalid operation');
        }

        const result = new Function('return ' + expression)();
        const formattedResult = parseFloat(result.toFixed(10));

        if (showResult) {
            calculation = [];
            currentInput = formattedResult.toString();
            return formattedResult;
        } else {
            return formattedResult;
        }
    } catch (e) {
        return 'Error';
    }
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        const id = button.id;

        if (id === 'btnClear') {
            calculation = [];
            currentInput = '0';
            lastOperation = null;
            updateDisplay(currentInput);
            return;
        }

        if (id === 'btnCE') {
            currentInput = '0';
            updateDisplay(currentInput);
            return;
        }

        if (id === 'btnEquals') {
            if (calculation.length > 0) {
                const result = calculate(true);
                updateDisplay(result);
            }
            return;
        }

        if (['btnAddition', 'btnMinus', 'btnMultiply', 'btnDivision'].includes(id)) {
            const realOp = getOperator(value);

            if (calculation.length > 0 && currentInput !== '0') {
                const partialResult = calculate();
                updateDisplay(partialResult);
                calculation = [partialResult.toString()];
            } else if (currentInput !== '0') {
                calculation.push(currentInput);
            }

            if (lastOperation && calculation.length > 1) {
                calculation.pop();
            }

            calculation.push(realOp);
            currentInput = '0';
            lastOperation = realOp;
            return;
        }

        if (id.startsWith('btn') && (!isNaN(value) || id === 'btnDot')) {
            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                if (value === '.' && currentInput.includes('.')) return;
                currentInput += value;
            }
            updateDisplay(currentInput);
        }
    });
});

document.addEventListener('keydown', (e) => {
    const keyMap = {
        '1': 'btn1', '2': 'btn2', '3': 'btn3',
        '4': 'btn4', '5': 'btn5', '6': 'btn6',
        '7': 'btn7', '8': 'btn8', '9': 'btn9',
        '0': 'btn0', '.': 'btnDot',
        '+': 'btnAddition', '-': 'btnMinus',
        '*': 'btnMultiply', '/': 'btnDivision',
        'Enter': 'btnEquals', '=': 'btnEquals',
        'Escape': 'btnClear', 'Backspace': 'btnCE'
    };

    if (keyMap[e.key]) {
        document.getElementById(keyMap[e.key]).click();
    }
});

// Toggle do modo inverso
inverseToggleButton.addEventListener('click', () => {
    inverseMode = !inverseMode;

    if (inverseMode) {
        inverseToggleButton.textContent = 'Normal Calculator';
        inverseToggleButton.classList.add('active');
    } else {
        inverseToggleButton.textContent = 'Inverse Calculator';
        inverseToggleButton.classList.remove('active');
    }

    console.log(`Inverse mode: ${inverseMode}`);
});


updateDisplay(currentInput);
