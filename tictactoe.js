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

const showTokenOutline = (e) => {
    if (e.target.dataset.used > 0) return;
    if (!e.target.style.backgroundImage) {
        console.log("Setting background url")
        if (game.getActivePlayer().token == 1) {
            e.target.style.backgroundImage = "url('assets/icon-x-outline.svg')";
        } else {
            e.target.style.backgroundImage = "url('assets/icon-o-outline.svg')";
        }
    }
}

const gameBoardSquares = document.querySelectorAll('.game-cell');

const activateBtn = (element) =>{
    function removeTransition(e){
        if(e.propertyName !== 'transform') return;
        e.target.classList.remove('clicked');     
    }
    element.classList.add('clicked');
    element.addEventListener('transitionend', removeTransition);
}


gameBoardSquares.forEach((cell) => {
    cell.addEventListener("click", (e) =>{
        if (e.target.dataset.used == 0) {
            activateBtn(e.target)
            if (game.getActivePlayer().token == 1) {
                e.target.style.backgroundImage = "url('assets/icon-x.svg')";
            } else {
                e.target.style.backgroundImage = "url('assets/icon-o.svg')";
            }
            game.playRound(e.target.dataset.row, e.target.dataset.column);
    
            e.target.dataset.used++;
        }
    })
    cell.addEventListener("mouseover", showTokenOutline);

    cell.addEventListener("mouseout", (e) => {
        if (e.target.dataset.used == 0) {
            e.target.style.backgroundImage = "";
        }
    })
})