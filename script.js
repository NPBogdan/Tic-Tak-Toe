const gameBoard = (function(){
    let board = [];
    let rows = 3;
    let cols = 3;
    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < cols; j++){
            let random = Math.random() * 10
            random = random.toFixed(2);
            board[i].push(Square(random));
        }
    }

    const getBoard = () => board;
    
    const printBoard = () => {
        let boardValues = board.map(function(row){
            return row.map(function(cell){
                return cell.getValue();
            });
        })
        console.log(boardValues);
    }

    return {
        getBoard,
        printBoard
    }
})();

// -------------------------------------------------------------------------------------------------------------------
//A square is just a cell on the board and can be 0 = empty, 1 = player1, 2 = player2
function Square(initialCellValue){
    let value = initialCellValue;
    let playerName = undefined;
    const getPlayerName = function(){ return playerName};
    const setPlayerName = function(name){ playerName = name};
    const getValue = function() { return value};
    const setValue = (token) => {value = token};
    return {getValue,setValue,getPlayerName,setPlayerName};
}


// -------------------------------------------------------------------------------------------------------------------
//Verifiy if the game is over
function gameStatus(board){
    let gameStatus = {
        status : "playing",
        winner : undefined,
    };

    for(let i = 0; i < 3 && gameStatus.status === "playing"; i++){
    console.log(board[i][1].getValue());

     //If there is a winner to row or collumn we check the diagonals
     if(gameStatus.status === "playing"){
        if(board[0][0].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[2][2].getValue() || 
        board[0][2].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[2][0].getValue()){
            console.log(board[1][1].getPlayerName() + "wins!");
            gameStatus.status = "end"; 
        }
    }       

        if(board[i][0].getValue() == board[i][1].getValue() && board[i][1].getValue() == board[i][2].getValue() || 
        board[0][i].getValue() == board[1][i].getValue() && board[1][i].getValue() == board[2][i].getValue()){
            console.log(board[i][1].getPlayerName() + " wins!");
            gameStatus.status = "end";
            }
        }

    return gameStatus;
}

// -------------------------------------------------------------------------------------------------------------------
//The main funcion that will take care of state, player's turn and if the game is over
function gameController(
    playerOne = "Player 1",
    playerTwo = "Player 2"
){
    let players = [
        {
            name: playerOne,
            token: 1
        },
        {
            name: playerTwo,
            token: 2
        }
    ];

    playerTurn = players[0];
    let endGame = false;
    for(let i = 1; i <= 9 && !endGame; i++){
        let position = prompt("Enter row and column (From 0 to 2):");
        let row = parseInt(position.slice(0,1));
        let col = parseInt(position.slice(2));
        
        let currentSelectedPosition = gameBoard.getBoard()[row][col].getValue();

        if(currentSelectedPosition != 1 &&  currentSelectedPosition != 2){
            gameBoard.getBoard()[row][col].setValue(playerTurn.token);
            gameBoard.getBoard()[row][col].setPlayerName(playerTurn.name);
            console.log(playerTurn.name);
        }
        else {
             console.log("Pozitie ocupata de " + playerTurn.name + "! \n");
        }
        
        //Change the players turn
        playerTurn = playerTurn === players[0] ? players[1] : players[0];

        //Print the board
        gameBoard.printBoard();

        //Check if somebody wins or is draw
        const finalStatus = gameStatus(gameBoard.getBoard());
        if(finalStatus.status === 'end'){
            endGame = true;
        }
    }
    if(endGame == false){
        console.log("Rounds over! No winner boys today!");
    }
}