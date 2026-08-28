// script.js
// Tarefas implementadas até agora:
// - "Implementar as quatro operações básicas" (RF01)
// - "Implementar lógica de entrada de números" (RF03, CB03, CB06)
// - "Implementar o botão de limpar (C/AC)" (RF02, CB10)
// - "Tratar divisão por zero" (CB01, CA01)
// - "Tratar entrada via teclado" (RF04, CB09)
// - Formatação de resultado para o checklist final (CB07, CB08)
//
// Todas as tarefas de script.js do task.md estão implementadas.

// ---------------------------------------------------------------------------
// Estado da calculadora (plan.md, seção 3.2)
// ---------------------------------------------------------------------------
const state = {
  displayValue: '0',        // string exibida no visor (plan.md, seção 3.1)
  firstOperand: null,       // primeiro número da operação (Number ou null)
  operator: null,           // operador pendente: '+', '-', '*', '/'
  waitingForSecondOperand: false, // true logo após clicar em um operador
  isError: false,           // true quando o visor está mostrando uma mensagem de erro
};

// ---------------------------------------------------------------------------
// Elementos do DOM
// ---------------------------------------------------------------------------
const displayElement = document.querySelector('.display');
const digitButtons = document.querySelectorAll('[data-digit]');
const decimalButton = document.querySelector('[data-decimal]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const clearButton = document.querySelector('[data-action="clear"]');
const allClearButton = document.querySelector('[data-action="all-clear"]');

// ---------------------------------------------------------------------------
// Atualização do visor
// ---------------------------------------------------------------------------
function updateDisplay() {
  displayElement.textContent = state.displayValue;
}

// ---------------------------------------------------------------------------
// Entrada de dígitos (RF03)
// ---------------------------------------------------------------------------
function inputDigit(digit) {
  // Enquanto a calculadora estiver em estado de erro, a entrada fica
  // bloqueada até o usuário limpar com "C" ou "AC" (CA01).
  if (state.isError) return;

  const { displayValue, waitingForSecondOperand } = state;

  if (waitingForSecondOperand) {
    // Começa a digitar o segundo número, substituindo o visor
    state.displayValue = digit;
    state.waitingForSecondOperand = false;
  } else {
    // Enquanto o visor for '0', o primeiro dígito substitui em vez de
    // concatenar (evita "00", "05" etc.)
    state.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

// ---------------------------------------------------------------------------
// Entrada do ponto decimal (RF03 + casos de borda CB03 e CB06)
// ---------------------------------------------------------------------------
function inputDecimal() {
  if (state.isError) return;

  // Se o usuário acabou de clicar em um operador, o ponto decimal inicia
  // um novo número como "0." (equivalente a começar digitando ".5" → CB06).
  if (state.waitingForSecondOperand) {
    state.displayValue = '0.';
    state.waitingForSecondOperand = false;
    return;
  }

  // CB03: ignora pontos decimais repetidos — só adiciona o ponto se o
  // número atual ainda não tiver um.
  if (!state.displayValue.includes('.')) {
    state.displayValue += '.';
  }
}

// ---------------------------------------------------------------------------
// Apagar último dígito (RF04 — tecla Backspace)
// ---------------------------------------------------------------------------
function backspace() {
  if (state.isError) return;

  // Se o usuário ainda não começou a digitar o segundo número, não há
  // o que apagar no visor atual (que mostra o primeiro operando confirmado).
  if (state.waitingForSecondOperand) return;

  state.displayValue =
    state.displayValue.length > 1 ? state.displayValue.slice(0, -1) : '0';
}

// ---------------------------------------------------------------------------
// Botões de limpar (RF02)
// ---------------------------------------------------------------------------

// "C" limpa apenas a entrada atual, mantendo operador e primeiro operando
// já confirmados (CB10 / CA07). Se a calculadora estiver em erro, "C"
// também funciona como saída do erro (comportamento equivalente a "AC",
// já que não há operação parcial confiável para preservar após um erro).
function clearEntry() {
  if (state.isError) {
    allClear();
    return;
  }
  state.displayValue = '0';
}

// "AC" zera todo o estado da calculadora (CA06), incluindo o estado de erro.
// Também usada pela tecla Esc (RF04).
function allClear() {
  state.displayValue = '0';
  state.firstOperand = null;
  state.operator = null;
  state.waitingForSecondOperand = false;
  state.isError = false;
}

// ---------------------------------------------------------------------------
// Exibição de erro (CB01 / CA01)
// ---------------------------------------------------------------------------
function showError(message) {
  state.displayValue = message;
  state.isError = true;
  state.operator = null;
  state.waitingForSecondOperand = false;
}

// ---------------------------------------------------------------------------
// As quatro operações básicas (RF01)
// Recebem e retornam Number — a conversão de string só acontece aqui,
// no momento exato do cálculo (plan.md, seção 3.1).
// ---------------------------------------------------------------------------
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

// Mapa de operador → função, usado tanto ao trocar de operador
// quanto ao pressionar "=".
const operations = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
};

function calculate(firstOperand, secondOperand, operator) {
  const operation = operations[operator];
  return operation(firstOperand, secondOperand);
}

// ---------------------------------------------------------------------------
// Formatação do resultado para exibição (CB07 / CB08)
// Garante que o visor sempre mostre um valor legível, sem estourar o
// layout, mesmo com muitas casas decimais ou números muito grandes.
// ---------------------------------------------------------------------------
const MAX_DECIMAL_PLACES = 8;   // CB07: até 8-10 casas decimais
const MAX_DISPLAY_LENGTH = 12;  // CB08: acima disso, usa notação científica

function formatResult(number) {
  let str = String(number);

  // CB07: muitas casas decimais → arredonda e remove zeros à direita
  if (str.includes('.') && str.split('.')[1].length > MAX_DECIMAL_PLACES) {
    str = number
      .toFixed(MAX_DECIMAL_PLACES)
      .replace(/0+$/, '')
      .replace(/\.$/, '');
  }

  // CB08: número muito grande/longo para a tela → notação científica
  if (str.replace('-', '').length > MAX_DISPLAY_LENGTH) {
    str = number.toExponential(6);
  }

  return str;
}

// Camada de validação antes de calcular: intercepta divisão por zero
// (CB01) para nunca deixar "Infinity"/"NaN" chegar ao visor, e nunca
// deixa uma exceção escapar (RNF02 — a calculadora não pode travar).
// Retorna o resultado numérico, ou null se um erro foi exibido.
function safeCalculate(firstOperand, secondOperand, operator) {
  if (operator === '/' && secondOperand === 0) {
    showError('Erro: divisão por zero');
    return null;
  }
  return calculate(firstOperand, secondOperand, operator);
}

// ---------------------------------------------------------------------------
// Clique/tecla de operador (+, -, ×, ÷)
// ---------------------------------------------------------------------------
function handleOperator(nextOperator) {
  if (state.isError) return;

  const inputValue = Number(state.displayValue);

  // Caso já exista uma operação pendente e o usuário já tenha digitado
  // o segundo número, resolve a operação em andamento antes de continuar
  // a sequência (permite encadear: 5 + 3 × 2 → CA03).
  if (state.operator && !state.waitingForSecondOperand) {
    const result = safeCalculate(state.firstOperand, inputValue, state.operator);

    // Se safeCalculate detectou divisão por zero, a mensagem de erro já
    // está no visor — interrompe aqui sem continuar a cadeia de operações.
    if (result === null) return;

    state.displayValue = formatResult(result);
    state.firstOperand = result;
  } else {
    state.firstOperand = inputValue;
  }

  // Se dois operadores forem clicados/digitados em sequência, o último
  // substitui o anterior (comportamento de CB04 — não empilha operadores).
  state.operator = nextOperator;
  state.waitingForSecondOperand = true;
}

// ---------------------------------------------------------------------------
// Clique/tecla de "=" (Enter)
// ---------------------------------------------------------------------------
function handleEquals() {
  if (state.isError) return;

  const inputValue = Number(state.displayValue);

  // Sem operador pendente: não há o que calcular (CA04).
  if (state.operator === null || state.waitingForSecondOperand) {
    return;
  }

  const result = safeCalculate(state.firstOperand, inputValue, state.operator);

  // CA01: em caso de divisão por zero, a mensagem de erro já foi exibida
  // por safeCalculate — não sobrescreve o visor com o resultado.
  if (result === null) return;

  state.displayValue = formatResult(result);
  state.firstOperand = result;
  state.operator = null;
  state.waitingForSecondOperand = false;
}

// ---------------------------------------------------------------------------
// Ligação dos eventos de mouse (cliques nos botões)
// ---------------------------------------------------------------------------
digitButtons.forEach((button) => {
  button.addEventListener('click', () => {
    inputDigit(button.dataset.digit);
    updateDisplay();
  });
});

decimalButton.addEventListener('click', () => {
  inputDecimal();
  updateDisplay();
});

operatorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleOperator(button.dataset.operator);
    updateDisplay();
  });
});

equalsButton.addEventListener('click', () => {
  handleEquals();
  updateDisplay();
});

clearButton.addEventListener('click', () => {
  clearEntry();
  updateDisplay();
});

allClearButton.addEventListener('click', () => {
  allClear();
  updateDisplay();
});

// ---------------------------------------------------------------------------
// Ligação dos eventos de teclado (RF04)
// Um único listener no document, reaproveitando exatamente as mesmas
// funções internas usadas pelos cliques do mouse (plan.md, seção 3.6),
// para que mouse e teclado produzam sempre o mesmo resultado (CA11).
// ---------------------------------------------------------------------------
const OPERATOR_KEY_MAP = {
  '+': '+',
  '-': '-',
  '*': '*',
  'x': '*',
  'X': '*',
  '/': '/',
};

document.addEventListener('keydown', (event) => {
  const { key } = event;

  // Dígitos 0-9
  if (key >= '0' && key <= '9') {
    inputDigit(key);
    updateDisplay();
    return;
  }

  // Ponto decimal
  if (key === '.') {
    inputDecimal();
    updateDisplay();
    return;
  }

  // Operadores (+, -, *, x, /)
  if (key in OPERATOR_KEY_MAP) {
    // Evita comportamento padrão do navegador para "/" (ex.: busca rápida no Firefox)
    event.preventDefault();
    handleOperator(OPERATOR_KEY_MAP[key]);
    updateDisplay();
    return;
  }

  // Igual (Enter ou "=")
  if (key === 'Enter' || key === '=') {
    event.preventDefault(); // evita submeter formulários, se houver
    handleEquals();
    updateDisplay();
    return;
  }

  // Apagar último dígito
  if (key === 'Backspace') {
    backspace();
    updateDisplay();
    return;
  }

  // Esc → equivalente a "AC"
  if (key === 'Escape') {
    allClear();
    updateDisplay();
    return;
  }

  // CB09: qualquer outra tecla não mapeada (ex.: letras) não faz nada
  // e não gera erro nem trava a calculadora.
});

// Estado inicial do visor
updateDisplay();
