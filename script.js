/* -------------------------------------------------------------------------------------------------------------------
A square is just a cell on the board and can be "random" = empty,
1 = player1, 2 = player2 */
function Square(randomInitalValue) {
  let id = 0;
  let value = randomInitalValue;
  let playerName = '';

  const setId = function(divId) {
    id = divId
  };
  const getId = function() {
    return id
  };
  const getPlayerName = function() {
    return playerName
  };
  const setPlayerName = function(name) {
    playerName = name
  };
  const getValue = function() {
    return value
  };
  const setValue = (token) => {
    value = token
  };
  const reset = function() {
    id = 0;
    value = Math.random() * 10 + 3;
    value = value.toFixed(2);
    playerName = '';
  };

  return {
    getValue,
    setValue,
    getPlayerName,
    setPlayerName,
    getId,
    setId,
    reset
  };
}

function GameBoard() {
  let board = [];
  let rows = 3;
  let cols = 3;
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      let randomInitalValue = Math.random() * 10 + 3;
      randomInitalValue = randomInitalValue.toFixed(2);
      board[i].push(Square(randomInitalValue));
    }
  };

  const resetBoard =
      function() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        board[i][j].reset();
      }
    };
  }

  const setFreeCell = function(id, playerName, token) {
    let boardLenght = board.length;
    let cellIdExists = 0;
    // Check if the board cell id already exists in our board game
    for (let i = 0; i < boardLenght; i++) {
      cellIdExists = board[i].findIndex((cell) => {return cell.getId() == id});
      if (cellIdExists != -1) {
        console.log(
            `STEP1: A fost gasit in matrice pe randul ${i} coloana ` +
            cellIdExists + `\n`);
        return false;
      }
    };

    if (id <= 3) {
      board[0][id - 1].setId(id);
      board[0][id - 1].setValue(token);
      board[0][id - 1].setPlayerName(playerName);
    } else if (id <= 6) {
      board[1][id - 3 - 1].setId(id);
      board[1][id - 3 - 1].setValue(token);
      board[1][id - 3 - 1].setPlayerName(playerName);
    } else {
      board[2][id - 6 - 1].setId(id);
      board[2][id - 6 - 1].setValue(token);
      board[2][id - 6 - 1].setPlayerName(playerName);
    }
    /*   Set id to a free cell ANOTHER WAY
      let freeCell = false;
      for (let i = 0; i < boardLenght; i++) {
          board[i][freeCell].setValue(token);
          board[i][freeCell].setPlayerName(playerName);
          break;
        }
      }; */
  };

  const getBoard = () => board;

  return {
    getBoard, setFreeCell, resetBoard
  }
};

// -------------------------------------------------------------------------------------------------------------------
// Verifiy if the game is over
function gameStatus(board) {
  let gameStatus = {
    status: 'playing',
    winner: undefined,
  };

  let freeSpace = false;
  for (let i = 0; i < 3 && gameStatus.status === 'playing'; i++) {
    // We check the DIAGONALS
    if (board[0][0].getValue() == board[1][1].getValue() &&
            board[1][1].getValue() == board[2][2].getValue() ||
        board[0][2].getValue() == board[1][1].getValue() &&
            board[1][1].getValue() == board[2][0].getValue()) {
      console.log(board[1][1].getPlayerName() + ' wins!');
      gameStatus.status = 'end';
      gameStatus.winner = board[1][1].getPlayerName();
      break;
    }
    // We check the lines and columns
    if (board[i][0].getValue() == board[i][1].getValue() &&
        board[i][1].getValue() == board[i][2].getValue()) {
      console.log(board[i][1].getPlayerName() + ' wins!');
      gameStatus.status = 'end';
      gameStatus.winner = board[i][1].getPlayerName();
      break;
    } else if (
        board[0][i].getValue() == board[1][i].getValue() &&
        board[1][i].getValue() == board[2][i].getValue()) {
      console.log(board[1][i].getPlayerName() + ' wins!');
      gameStatus.status = 'end';
      gameStatus.winner = board[1][i].getPlayerName();
      break;
    }

    // We check if there are no more spaces
    for (let j = 0; j < board[i].length && !freeSpace; j++) {
      freeSpace = board[i].some((cell) => cell.getId() == 0);
    }
  }

  if (!freeSpace && gameStatus.status == 'playing') {
    gameStatus.status = 'draw';
    return gameStatus;
  }

  return gameStatus;
}

/* -------------------------------------------------------------------------------------------------------------------
The main funcion that will take care of state, player's turn and if the game
is over */
function gameController(playerOne = 'Player 1', playerTwo = 'Player 2') {
  let board = GameBoard();
  let players = [{name: playerOne, token: 1}, {name: playerTwo, token: 2}];
  let playerTurn = players[0];
  const getPlayerTurn = () => {
    return playerTurn;
  };
  const setPlayersName = function(player1, player2) {
    players[0].name = player1;
    players[1].name = player2;
  };
  const resetPlayerTurn = () => {
    return playerTurn = players[0];
    ;
  };

  function playRound(cellId) {
    // Set the cell
    board.setFreeCell(cellId, playerTurn.name, playerTurn.token);

    // Change the player's turn
    playerTurn = playerTurn === players[0] ? players[1] : players[0];

    // Check if somebody wins
    let finalStatus = gameStatus(board.getBoard());
    return {finalStatus};
  }

  return {
    playRound, getPlayerTurn, boardGame: board.getBoard(),
        resetBoard: board.resetBoard, resetPlayerTurn, setPlayersName
  }
}

/* ------------------------------------------------------------------------------------------------------------------
The function to update DOM and state of the game */
function ScreenController() {
  document.addEventListener('DOMContentLoaded', function() {
    dialog.showModal();
  })

  const welcomeH1 = document.querySelector('dialog > form > h1');
  setTimeout(function() {
    welcomeH1.remove();
  }, 4000);

  let game = gameController();
  const boardCells = document.querySelectorAll('#gameBoard > button');
  const playerParagraph = document.querySelector('#playerTurn')
  const startButton = document.querySelector('#btnStart');
  const dialog = document.querySelector('#dialog');
  playerParagraph.textContent = `${game.getPlayerTurn().name}'s turn`;

  // Get and set dialog players name
  const getSetDialogPlayerNames = function() {
    let player1 = document.querySelector('#player1').value;
    let player2 = document.querySelector('#player2').value;
    if (player1 != '' && player2 != '') {
      game.setPlayersName(player1, player2);
    }
  };

  // Reset the game
  document.querySelector('#btnReset').addEventListener('click', () => {
    dialog.showModal();
    game.resetBoard();
    game.resetPlayerTurn();

    startButton.classList.remove('btnStartClicked');

    boardCells.forEach((uiCell) => {
      uiCell.textContent = '---';
      uiCell.setAttribute('disabled', true);
      uiCell.removeEventListener('click', setCell);
    });
  })

  // Activate board cells
  function activateCell() {
    boardCells.forEach(function(cell) {
      cell.addEventListener('click', setCell);
    })
  }

  const setCell = (event) => {
    buttonId = event.target.getAttribute('data-id');
    event.target.setAttribute('disabled', true);
    let gameStatus = game.playRound(buttonId);

    // If the game is over
    if (gameStatus.finalStatus.status === 'end') {
      playerParagraph.textContent =
          `${gameStatus.finalStatus.winner} wins the game!`;

      boardCells.forEach(function(cell) {
        cell.setAttribute('disabled', true);
      })
      updateScreenBoard(game);
      return;

    } else if (gameStatus.finalStatus.status === 'draw') {
      console.log(gameStatus.finalStatus.status);
      playerParagraph.textContent = `Its a draw!`;
      boardCells.forEach(function(cell) {
        cell.setAttribute('disabled', true);
      })
      updateScreenBoard(game);
      return;
    }
    playerParagraph.textContent = `${game.getPlayerTurn().name}'s turn`;
    updateScreenBoard(game);
  };

  // We update the UI board with the current state of the game
  function updateScreenBoard(board) {
    board.boardGame.forEach(function(row) {
      row.forEach((cell) => {
        let cellId = cell.getId();
        if (cellId != 0) {
          if (cell.getValue() === 1) {
            boardCells[cellId - 1].textContent = `X`;
          } else {
            boardCells[cellId - 1].textContent = `O`;
          }
        }
      })
    });
  }

  // Here we just "activate" the board so players can click them
  startButton.addEventListener('click', function(event) {
    boardCells.forEach((element) => {
      element.removeAttribute('disabled');
    })
    event.target.classList.add('btnStartClicked');
    getSetDialogPlayerNames();
    playerParagraph.textContent = `${game.getPlayerTurn().name}'s turn`;
    dialog.close();
    activateCell();
  })
}

console.log(ScreenController());