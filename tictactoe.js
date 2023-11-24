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

    const resetBoard = () => {
        board.map((row) => row.map((cell) => cell.resetValue()))
    }

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

    return {getBoard, placeToken, printBoard, resetBoard};

}

function Cell() {
    let value = 0;
    
    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    const resetValue = () => value = 0;
    
    return {
        addToken,
        getValue,
        resetValue
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
        // checkWinner();
        console.log("is the game a tie?: "+ checkTie(board));
        screen.updateTurnDisplay();
    };

    
    const allEqual = (arr) => arr.every(val => val === arr[0]);

    const checkRows = (board) => {
        const numRows = board.getBoard().length;
        const numCols = board.getBoard()[0].length;
        
        // check all rows for a winner

        for (let row = 0; row < numRows; row++) {
            let possibleWin = [];
            for (let column = 0; column < numCols; column++) {
                possibleWin.push(board.getBoard()[row][column].getValue())

                if ((possibleWin.length == numCols) && (possibleWin[0] != 0)) {
 
                    if (allEqual(possibleWin)) {
                        console.log ("row win condition met")
                        return true;
                    }
                }
            }
        }

        return false;
    }

    const restartGame = () => {
        // reset the logical board
        board.resetBoard();

        // reset the turn to player X
        if (getActivePlayer().token == 2 ){
            switchPlayerTurn();
        }
    }

    const checkColumns = board => {
        const numRows = board.getBoard().length;
        const numCols = board.getBoard()[0].length;

        for (let column = 0; column < numRows; column++) {
            let possibleWin = [];
            for (let row = 0; row < numCols; row++) {
                possibleWin.push(board.getBoard()[row][column].getValue())

                if ((possibleWin.length == numCols) && (possibleWin[0] != 0)) {
 
                    if (allEqual(possibleWin)) {
                        console.log ("column win condition met")
                        return true;
                    }
                }
            }
        }
    }

    const checkDiagonals = board => {
        // check diagonals for a winner hard coded
        let possibleWinDiagUp = []
        let possibleWinDiagDown = []
        possibleWinDiagUp.push(board.getBoard()[0][0].getValue())
        possibleWinDiagUp.push(board.getBoard()[1][1].getValue())
        possibleWinDiagUp.push(board.getBoard()[2][2].getValue())

        possibleWinDiagDown.push(board.getBoard()[0][2].getValue())
        possibleWinDiagDown.push(board.getBoard()[1][1].getValue())
        possibleWinDiagDown.push(board.getBoard()[2][0].getValue())


        if ((allEqual(possibleWinDiagUp)) && possibleWinDiagUp[0] != 0) {
            console.log ("diagonal up win condition met")
            return true;
            
        }
        
        if ((allEqual(possibleWinDiagDown)) && possibleWinDiagDown[0] != 0) {
            console.log ("diagonal down win condition met")
            return true;
        }
    }

    function checkTie (board) {
        return board.getBoard().every(row => row.every(cell => cell.getValue() > 0))
    }

    const checkWinner = () => {

        if (checkRows(board) || checkColumns(board) || checkDiagonals(board)){
            return true;
        } else {
            return false;
        }
    }


    //initial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        restartGame
    }; 
}

const game = GameController();

function DisplayController () {

    const gameBoardSquares = document.querySelectorAll('.game-cell');
    const playerTurnDiv = document.querySelector('.turn-icon');
    const restartButton = document.getElementById("restart-game");
    const scoreHeaders = document.querySelectorAll('.score');

    const activateBtn = (element) =>{
        function removeTransition(e){
            if(e.propertyName !== 'transform') return;
            e.target.classList.remove('clicked');     
        }
        element.classList.add('clicked');
        element.addEventListener('transitionend', removeTransition);
    }

    const showTokenOutline = (e) => {
        if (e.target.dataset.used > 0) return;
        if (!e.target.style.backgroundImage) {
            if (game.getActivePlayer().token == 1) {
                e.target.style.backgroundImage = "url('assets/icon-x-outline.svg')";
            } else {
                e.target.style.backgroundImage = "url('assets/icon-o-outline.svg')";
            }
        }
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

    restartButton.addEventListener('click', (e) => {
        
        game.restartGame();
        resetDisplayBoard();
        updateTurnDisplay();
        resetScoreBoard();
    })

    const resetDisplayBoard = () => {
        gameBoardSquares.forEach((cell) => {
            cell.dataset.used = 0;
            cell.style.backgroundImage = "";
        })
    }

    const resetScoreBoard = () => {
        scoreHeaders.forEach((score) => {
            score.textContent = "0";
        })
    }
   
    const updateTurnDisplay = () => {
        if (game.getActivePlayer().token == 1) {
            playerTurnDiv.style.backgroundImage = "url('assets/icon-x-gray.svg')";
        } else {
            playerTurnDiv.style.backgroundImage = "url('assets/icon-o-gray.svg')";
        }
    }

    return {updateTurnDisplay}
}

const screen = DisplayController();