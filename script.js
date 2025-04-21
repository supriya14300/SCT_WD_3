const board = document.getElementById("board");
const statusText = document.getElementById("status");

let currentPlayer = "X"; // Human
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

function createBoard() {
  board.innerHTML = "";
  gameState.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = index;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  });
}

function handleCellClick(event) {
  const index = event.target.dataset.index;

  if (!gameActive || gameState[index] !== "" || currentPlayer !== "X") return;

  makeMove(index, "X");

  if (checkGameOver("X")) return;

  // Let AI (O) play after a short delay
  setTimeout(() => {
    const aiMove = getRandomEmptyCell();
    if (aiMove !== null) {
      makeMove(aiMove, "O");
      checkGameOver("O");
    }
  }, 500);
}

function makeMove(index, player) {
  gameState[index] = player;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  cell.textContent = player;
  currentPlayer = player === "X" ? "O" : "X";
}

function getRandomEmptyCell() {
  const emptyIndices = gameState
    .map((val, idx) => (val === "" ? idx : null))
    .filter((val) => val !== null);

  if (emptyIndices.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}

function checkGameOver(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const won = winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameState[a] === player && gameState[b] === player && gameState[c] === player;
  });

  if (won) {
    statusText.textContent = `Player ${player} wins! 🎉`;
    gameActive = false;
    return true;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a draw! 😬";
    gameActive = false;
    return true;
  }

  statusText.textContent = `Player ${currentPlayer}'s turn`;
  return false;
}

function restartGame() {
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
}

createBoard();
