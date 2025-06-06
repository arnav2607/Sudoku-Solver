const grid = document.getElementById('sudoku_grid');
const loading = document.getElementById('loading');
const notification = document.getElementById('notification');
let board = Array.from({ length: 9 }, () => Array(9).fill(0));

// Create the enhanced grid
for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('min', 1);
    input.setAttribute('max', 9);
    input.setAttribute('id', `${i}-${j}`);
    input.setAttribute('maxlength', 1);
    
    // Add input validation
    input.addEventListener('input', function(e) {
      if (e.target.value.length > 1) {
        e.target.value = e.target.value.slice(0, 1);
      }
      if (e.target.value < 1 || e.target.value > 9) {
        e.target.value = '';
      }
    });

    // Add 3×3 bold borders
    input.style.border = '1px solid #ccc'; // Default thin border
    if (i % 3 === 0) input.style.borderTop = '6pt solid black';
    if (j % 3 === 0) input.style.borderLeft = '6pt solid black';
    if (i === 8) input.style.borderBottom = '6pt solid black';
    if (j === 8) input.style.borderRight = '6pt solid black';

    grid.appendChild(input);
  }
}


function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function readBoard() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const val = document.getElementById(`${i}-${j}`).value;
      board[i][j] = val === "" ? 0 : parseInt(val);
    }
  }
}

function updateBoardUI() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const input = document.getElementById(`${i}-${j}`);
      input.value = board[i][j] !== 0 ? board[i][j] : "";
      
      // Add animation for solved cells
      if (board[i][j] !== 0) {
        input.style.animation = 'pulse 0.6s ease';
        setTimeout(() => {
          input.style.animation = '';
        }, 600);
      }
      
    }
  }
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board, row = 0, col = 0) {
  if (row === 9) return true;
  if (col === 9) return solveSudoku(board, row + 1, 0);
  if (board[row][col] !== 0) return solveSudoku(board, row, col + 1);

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board, row, col + 1)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

function isValidBoard() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const num = board[i][j];
      if (num !== 0) {
        board[i][j] = 0;
        if (!isValid(board, i, j, num)) {
          board[i][j] = num;
          return false;
        }
        board[i][j] = num;
      }
    }
  }
  return true;
}

// Enhanced button functionality
document.getElementById('SolvePuzzle').onclick = function () {
  readBoard();
  
  if (!isValidBoard()) {
    showNotification("❌ Invalid Sudoku! Please check your entries.", "error");
    return;
  }

  loading.classList.add('show');
  
  // Add small delay for better UX
  setTimeout(() => {
    if (solveSudoku(board)) {
      updateBoardUI();
      showNotification("🎉 Puzzle solved successfully!", "success");
    } else {
      showNotification("😕 No solution exists for this puzzle!", "error");
    }
    loading.classList.remove('show');
  }, 800);
};

document.getElementById('ValidatePuzzle').onclick = function () {
  readBoard();
  if (isValidBoard()) {
    showNotification("✅ Sudoku board is valid!", "success");
  } else {
    showNotification("❌ Invalid Sudoku board!", "error");
  }
};

document.getElementById('GetPuzzle').onclick = function () {
  loading.classList.add('show');
  
  fetch('https://sugoku.onrender.com/board?difficulty=easy')
    .then((res) => res.json())
    .then((data) => {
      board = data.board;
      updateBoardUI();
      showNotification("🎲 New puzzle loaded!", "success");
      loading.classList.remove('show');
    })
    .catch((error) => {
      showNotification("⚠️ Failed to load puzzle. Try again!", "error");
      loading.classList.remove('show');
    });
};