// -------------------------------------------------------------------------------------------------------------------
// A square is just a cell on the board and can be "random" = empty,
// 1 = player1, 2 = player2
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
  return {getValue, setValue, getPlayerName, setPlayerName, getId, setId};
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

  const setFreeCell = function(id, playerName, token) {
    let boardLenght = board.length;
    let cellIdExists = 0;
    console.log('DOM ID : ' + id);
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

    /*   Set id to a free cell ANOTHER WAY
      let freeCell = false;
      for (let i = 0; i < boardLenght; i++) {
        freeCell = board[i].findIndex((cell) => {return cell.getId() == 0});
        if (freeCell != -1) {
          board[i][freeCell].setId(id);
          board[i][freeCell].setValue(token);
          board[i][freeCell].setPlayerName(playerName);
          break;
        }
      }; */

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
  };

  const getBoard = () => board;

  return {
    getBoard, setFreeCell
  }
};

// -------------------------------------------------------------------------------------------------------------------
// Verifiy if the game is over
function gameStatus(board) {
  let gameStatus = {
    status: 'playing',
    winner: undefined,
  };

  for (let i = 0; i < 3 && gameStatus.status === 'playing'; i++) {
    /* for (let i = 0; i < board.length; i++) {
     for (let j = 0; j < board.length; j++) {
       console.log(board[i][j].getId());
     }
     console.log(`\n`);
     ;
   }  */

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
            board[i][1].getValue() == board[i][2].getValue() ||
        board[0][i].getValue() == board[1][i].getValue() &&
            board[1][i].getValue() == board[2][i].getValue()) {
      console.log(board[i][1].getPlayerName() + ' wins!');
      gameStatus.status = 'end';
      gameStatus.winner = board[i][1].getPlayerName();
    }
  }
  return gameStatus;
}

// -------------------------------------------------------------------------------------------------------------------
// The main funcion that will take care of state, player's turn and if the game
// is over
function gameController(playerOne = 'Player 1', playerTwo = 'Player 2') {
  let board = GameBoard();
  let players = [{name: playerOne, token: 1}, {name: playerTwo, token: 2}];
  let playerTurn = players[0];

  const getPlayerTurn = () => {
    return playerTurn;
  };

  function playRound(cellId) {
    // Set the cell
    let freeCell = board.setFreeCell(cellId, playerTurn.name, playerTurn.token);
    if (freeCell == false) {
      console.log(`This position is ocupied or no more spaces left!`);
      return false;
    }

    // Change the player's turn
    playerTurn = playerTurn === players[0] ? players[1] : players[0];

    // Check if somebody wins
    let finalStatus = gameStatus(board.getBoard());
    return {finalStatus};
  }

  return {
    playRound, getPlayerTurn, boardGame: board.getBoard()
  }
}

//------------------------------------------------------------------------------------------------------------------
// The function to update DOM and state of the game
function ScreenController() {
  const game = gameController();
  const boardCells = document.querySelectorAll('#gameBoard > button');
  const playerParagraph = document.querySelector('#playerTurn')

  playerParagraph.textContent = `${game.getPlayerTurn().name}'s turn`;

  function activateCell() {
    boardCells.forEach(function(cell) {
      cell.addEventListener('click', function(e) {
        buttonId = e.target.getAttribute('data-id');
        e.target.setAttribute('disabled', true);
        e.target.textContent = game.getPlayerTurn().token;
        let gameStatus = game.playRound(buttonId);

        // If the game is over
        if (gameStatus.finalStatus.status === 'end') {
          playerParagraph.textContent =
              `${gameStatus.finalStatus.winner} wins the game!`;
          let boardCells = document.querySelectorAll('#gameBoard > button');
          boardCells.forEach(function(cell) {
            cell.setAttribute('disabled', true);
          })
        }
      })
    })
  }

  if (gameStatus(game.boardGame).status === 'end') {
    playerParagraph.textContent = `Its a draw!`;
  }

  function updateScreenBoard(board) {
    let playTurnDiv = document.querySelector('#playerTurn');
    playTurnDiv.textContent =
        `${game.getPlayerTurn()} turn now, please click a cell:`;
  }

  // Here we just "activate" the board so players can click them
  document.querySelector('#btnStart').addEventListener('click', function() {
    activateCell();
  })
}

console.log(ScreenController());

// let position = prompt("Enter row and column (From 0 to 2):");
// let row = parseInt(position.slice(0,1));
// let col = parseInt(position.slice(2));