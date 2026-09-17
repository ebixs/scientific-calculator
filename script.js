// ---------------------------------------------------------
// Scientific calculator logic
//
// State model: we track the current entry as a string (so we
// can show "0." while the user is mid-typing), the pending
// operator, and the value that was on screen before the
// operator was pressed. This mirrors how real calculators
// work: operator -> store left side -> wait for right side.
// ---------------------------------------------------------

const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");

let currentEntry = "0";
let previousValue = null;
let pendingOperator = null;
let justEvaluated = false;

function updateDisplay() {
  displayEl.textContent = currentEntry;
}

function updateHistory(text) {
  historyEl.textContent = text;
}

function inputDigit(digit) {
  if (justEvaluated) {
    currentEntry = digit;
    justEvaluated = false;
    return;
  }
  currentEntry = currentEntry === "0" ? digit : currentEntry + digit;
  updateDisplay();
}

function inputDecimal() {
  if (justEvaluated) {
    currentEntry = "0.";
    justEvaluated = false;
    updateDisplay();
    return;
  }
  if (!currentEntry.includes(".")) {
    currentEntry += ".";
    updateDisplay();
  }
}

function clearAll() {
  currentEntry = "0";
  previousValue = null;
  pendingOperator = null;
  justEvaluated = false;
  updateDisplay();
  updateHistory("");
}

function clearEntry() {
  currentEntry = "0";
  updateDisplay();
}

function backspace() {
  if (justEvaluated) return;
  currentEntry = currentEntry.length > 1 ? currentEntry.slice(0, -1) : "0";
  updateDisplay();
}

function applyOperator(op) {
  const value = parseFloat(currentEntry);

  if (pendingOperator && previousValue !== null && !justEvaluated) {
    // Chain calculations: 3 + 4 + 5 should evaluate the running total.
    previousValue = calculate(previousValue, value, pendingOperator);
    currentEntry = String(previousValue);
  } else {
    previousValue = value;
  }

  pendingOperator = op;
  justEvaluated = false;
  updateHistory(`${formatNumber(previousValue)} ${op}`);
}

function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

function equals() {
  if (pendingOperator === null || previousValue === null) return;

  const value = parseFloat(currentEntry);
  const result = calculate(previousValue, value, pendingOperator);

  updateHistory(`${formatNumber(previousValue)} ${pendingOperator} ${formatNumber(value)} =`);
  currentEntry = formatNumber(result);
  previousValue = null;
  pendingOperator = null;
  justEvaluated = true;
  updateDisplay();
}

// --- Scientific single-operand functions ---

function applyUnary(fn, historyLabel) {
  const value = parseFloat(currentEntry);
  const result = fn(value);
  updateHistory(`${historyLabel}(${formatNumber(value)})`);
  currentEntry = formatNumber(result);
  justEvaluated = true;
  updateDisplay();
}

function sqrt() {
  applyUnary((v) => (v < 0 ? NaN : Math.sqrt(v)), "√");
}

function square() {
  applyUnary((v) => v * v, "sqr");
}

function reciprocal() {
  applyUnary((v) => (v === 0 ? NaN : 1 / v), "1/");
}

function percent() {
  // If there's a pending operator, treat % as "percent of the
  // previous value" (e.g. 200 + 10% => 200 + 20).
  const value = parseFloat(currentEntry);
  if (pendingOperator && previousValue !== null) {
    currentEntry = formatNumber((previousValue * value) / 100);
  } else {
    currentEntry = formatNumber(value / 100);
  }
  justEvaluated = true;
  updateDisplay();
}

function startPower() {
  // xʸ behaves like a binary operator: store the base, wait for the exponent.
  applyOperator("^");
}

function formatNumber(n) {
  if (Number.isNaN(n)) return "خطا";
  if (!Number.isFinite(n)) return "خطا";
  // Trim floating point noise, keep up to 10 significant digits.
  const rounded = parseFloat(n.toPrecision(10));
  return String(rounded);
}

// calculate() needs to also understand "^" for power.
const originalCalculate = calculate;
calculate = function (a, b, op) {
  if (op === "^") return Math.pow(a, b);
  return originalCalculate(a, b, op);
};

// ---------------------------------------------------------
// Wire up button clicks
// ---------------------------------------------------------
document.querySelectorAll(".key").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    switch (action) {
      case "digit":
        inputDigit(value);
        break;
      case "decimal":
        inputDecimal();
        break;
      case "operator":
        applyOperator(value);
        break;
      case "power":
        startPower();
        break;
      case "equals":
        equals();
        break;
      case "sqrt":
        sqrt();
        break;
      case "square":
        square();
        break;
      case "reciprocal":
        reciprocal();
        break;
      case "percent":
        percent();
        break;
      case "clear":
        clearAll();
        break;
      case "clear-entry":
        clearEntry();
        break;
      case "backspace":
        backspace();
        break;
    }
  });
});

// ---------------------------------------------------------
// Keyboard support
// ---------------------------------------------------------
window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
  else if (e.key === ".") inputDecimal();
  else if (e.key === "+") applyOperator("+");
  else if (e.key === "-") applyOperator("−");
  else if (e.key === "*") applyOperator("×");
  else if (e.key === "/") {
    e.preventDefault();
    applyOperator("÷");
  } else if (e.key === "Enter" || e.key === "=") equals();
  else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "%") percent();
});
