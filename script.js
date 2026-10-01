const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let currentValue = '0';
let previousValue = null;
let pendingOperator = null;
let justEvaluated = false;
let startFresh = false;

const operatorSymbols = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

function updateDisplay() {
  resultEl.textContent = currentValue;
  if (pendingOperator && previousValue !== null) {
    expressionEl.textContent = `${previousValue} ${operatorSymbols[pendingOperator]}`;
  } else {
    expressionEl.textContent = '';
  }
}

function inputDigit(digit) {
  if (justEvaluated || startFresh) {
    currentValue = digit === '.' ? '0.' : digit;
    justEvaluated = false;
    startFresh = false;
    return;
  }
  if (digit === '.' && currentValue.includes('.')) return;
  if (currentValue === '0' && digit !== '.') {
    currentValue = digit;
  } else {
    currentValue += digit;
  }
}

function compute(a, b, operator) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  switch (operator) {
    case '+': return numA + numB;
    case '-': return numA - numB;
    case '*': return numA * numB;
    case '/': return numB === 0 ? NaN : numA / numB;
    default: return numB;
  }
}

function formatResult(value) {
  if (Number.isNaN(value)) return 'Error';
  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
}

function setOperator(operator) {
  if (pendingOperator && previousValue !== null && !justEvaluated && !startFresh) {
    const result = compute(previousValue, currentValue, pendingOperator);
    currentValue = formatResult(result);
  }
  previousValue = currentValue;
  pendingOperator = operator;
  justEvaluated = false;
  startFresh = true;
}

function equals() {
  if (pendingOperator === null || previousValue === null) return;
  const result = compute(previousValue, currentValue, pendingOperator);
  currentValue = formatResult(result);
  previousValue = null;
  pendingOperator = null;
  justEvaluated = true;
  startFresh = false;
}

function clearAll() {
  currentValue = '0';
  previousValue = null;
  pendingOperator = null;
  justEvaluated = false;
  startFresh = false;
}

function backspace() {
  if (justEvaluated || startFresh) {
    clearAll();
    return;
  }
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
}

function percent() {
  currentValue = formatResult(parseFloat(currentValue) / 100);
}

document.querySelector('.buttons').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, value } = button.dataset;

  if (value && !Number.isNaN(Number(value))) {
    inputDigit(value);
  } else if (value === '.') {
    inputDigit('.');
  } else if (value && ['+', '-', '*', '/'].includes(value)) {
    setOperator(value);
  } else if (action === 'equals') {
    equals();
  } else if (action === 'clear') {
    clearAll();
  } else if (action === 'backspace') {
    backspace();
  } else if (action === 'percent') {
    percent();
  }

  updateDisplay();
});

document.addEventListener('keydown', (event) => {
  const { key } = event;
  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
  } else if (key === '.') {
    inputDigit('.');
  } else if (['+', '-', '*', '/'].includes(key)) {
    setOperator(key);
  } else if (key === 'Enter' || key === '=') {
    equals();
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === 'Escape') {
    clearAll();
  } else if (key === '%') {
    percent();
  } else {
    return;
  }
  updateDisplay();
});

updateDisplay();
