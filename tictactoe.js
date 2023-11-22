function Gameboard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    // 2d array that represents the game board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player) => {

        // Check if the cell is taken already
        if (board[row][column].getValue() > 0) return;

        // Else place it
        board[row][column].addToken(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {getBoard, placeToken, printBoard};

}

function Cell() {
    let value = 0;
    
    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;
    
    return {
        addToken,
        getValue
    };
}

function GameController (
    playerOneName = 'X',
    playerTwoName = 'O'
){
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }  
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    const playRound = (row, column) => {
        board.placeToken(row, column, getActivePlayer().token)
        switchPlayerTurn();
        printNewRound();
    };

    //initial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer
    }; 
}

const game = GameController();

const showTokenOutline = () => {

}

const gameBoardSquares = document.querySelectorAll('.game-cell');

gameBoardSquares.forEach((cell) => {
    cell.addEventListener("click", (e) =>{
        console.log("row: "+ e.target.dataset.row);
        console.log("column: "+ e.target.dataset.column);
        game.playRound(e.target.dataset.row, e.target.dataset.column);
    });
    cell.addEventListener("mouseover", showTokenOutline);
})