class Game{
    constructor(board){
        this.gameBoard = board
        this.turn = "X"
        this.nextBox = [-1,-1]
    }
    /**
     * 
     * @param {int} x1 
     * @param {int} y1 
     * @param {int} x2 
     * @param {int} y2 
     * @param {boolean} shout Should the function post to console or not
     * @returns {int} Returns if the game has ended, or if the move was illegal 
     * Key:
     * 1 = Game Ended
     * 0 = Game Didn't end
     * -1 = Illegal Move
     */

    makeMove(x1,y1,x2,y2,shout = true){
        if(this.gameBoard.board[y1][x1][y2][x2] != undefined || this.gameBoard.winningBoxes[y1][x1] != 0 || (this.nextBox[0] != -1 && (x1 != this.nextBox[0] || y1 != this.nextBox[1] ))){
            if(shout)console.log("Illegal Move. Reason(s):")
            if(this.gameBoard.board[y1][x1][y2][x2] != null && shout)console.log("-Not a free space")
            if(this.gameBoard.winningBoxes[y1][x1] != 0 && shout)console.log("-Box already won")
            if((this.nextBox[0] != -1 && x1 != this.nextBox[0] && y1 != this.nextBox[1]) && shout)console.log("-Play made in the wrong box")
            return -1
        }else{
            this.gameBoard.setBoard(x1,y1,x2,y2,this.turn)
            this.turn = this.turn == "X"? "O": "X"
            
        }
        this.gameBoard.drawBoard()
        this.nextBox = [x2,y2]
        if(this.gameBoard.winningBoxes[this.nextBox[1]][this.nextBox[0]] != 0)this.nextBox = [-1,-1]
        if(this.gameBoard.checkWinner() != 0){
            return 1
        }
        return 0
    }
}
class Board{
    /**
     * @param {Boolean} super3T Super Tick-Tac-Toe or not
     */

    constructor(super3T = false){
        this.superBoard = super3T
        if(super3T){
            this.board = this.createArray(3,3,3,3)
        }
        this.winningBoxes = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
    }
    drawBoard(){
        this.#updateWinningBoxes()
        const X =     "X "
        const O =     "O "
        const BLANK = "- "
        let field = this.board;
        if(this.superBoard){
            //field[y1][x1][y2][x2]
            for(let y1 = 0; y1 < 3; y1++){
                for(let y2 = 0;y2 < 3;y2++){
                    let line = "";
                    for(let x1 = 0; x1 < 3;x1++){
                        line += "| "
                        for(let x2 = 0;x2 < 3;x2++){
                            if(this.winningBoxes[y1][x1] == -1 || this.winningBoxes[y1][x1] == 1){
                                switch (this.winningBoxes[y1][x1]) {
                                    case 1:
                                        line += X
                                        break;
                                    case -1:
                                        line += O
                                        break;
                                }
                            }
                            else if(field[y1][x1][y2][x2] == 1){
                                line += X
                            }else if(field[y1][x1][y2][x2] == -1){
                                line += O
                            }else{
                                line += BLANK
                            }
                        }
                    }
                    
                    line += "|"
                    console.log(line)
                }
                console.log(" ------- ------- -------")
            }
        }

    }
    findLegalMoves
    createArray(length) {
        var arr = new Array(length || 0),
            i = length;
    
        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
        }
    
        return arr;
    }
    /**
     * 
     * @param {int} x1 Columns on the big board 
     * @param {int} y1 Rows on the big board
     * @param {int} x2 Columns on the inner board
     * @param {int} y2 Rows on the inner board
     * @param {any} value {X,O,-,1,0,-1} What the square is set to
     */
    setBoard(x1,y1,x2,y2,value){
        let translatedValue = 0;
        if(value == "X" || value == 1)translatedValue = 1
        else if(value == "O" || value == -1)translatedValue = -1
        this.board[y1][x1][y2][x2] = translatedValue
    }
    
    /**
     * 
     * @param {int} x 
     * @param {int} y 
     * @returns {int} Who is winning that board {-1: O, 0: No One, 1: X, 2: Draw}
     */
    checkWinner(x = -1,y = -1){
        this.#updateWinningBoxes()
        if(x == -1){
            for(let j = -1 ; j <= 1; j+=2){
                let findLines = this.testForLineOnBoard(this.winningBoxes,j)
                if(findLines != 0)return findLines
            }
            let draw = true
            this.winningBoxes.forEach(element => {
                if(!draw)return
                if(element.includes(0))draw = false
            });
            if(draw)return 2
            return 0
        }else{
            return this.winningBoxes[y][x]
        }
        
    }
    testForLineOnBoard(board,j){
        let total = 0
        if(board[0][0] == j && board[0][1] == j && board[0][2] == j)total ++
        if(board[1][0]  == j && board[1][1] == j && board[1][2] == j)total ++
        if(board[2][0]  == j && board[2][1] == j && board[2][2] == j)total ++
        if(board[0][0]  == j && board[1][0] == j && board[2][0] == j)total ++
        if(board[0][1]  == j && board[1][1] == j && board[2][1] == j)total ++
        if(board[0][2]  == j && board[1][2] == j && board[2][2] == j)total ++
        if(board[0][0]  == j && board[1][1] == j && board[2][2] == j)total ++
        if(board[2][0]  == j && board[1][1] == j && board[0][2] == j)total ++
        return total
    }
    #updateWinningBoxes(){
        for(let i = 0;i < 9; i++){
            let x = i%3
            let y = Math.floor(i/3)
            if(this.winningBoxes[y][x] != 0){
                continue
            }
            //Check for Winner
            let targetBoard = this.board[y][x]
            for(let j = -1 ; j <= 1; j+=2){
                if(this.testForLineOnBoard(targetBoard,j))this.winningBoxes[y][x] = j
            }
            //Check for Stalemate
            let notFull = false;
            this.board[y][x].forEach(element => {
                if(element.includes(undefined))notFull = true
            });
            if(!notFull)this.winningBoxes[y][x] = 2

        }
    }
}
var TESTBranch = []
class Computer{
    constructor(game) {
        this.game = game
        this.boardObject = game.gameBoard
        this.gameBoard = game.gameBoard.board
    }
    findLegalMoves(board,x1,y1){
        let moves = []
        for(let y = 0;y < 3;y++){
            for(let x = 0;x < 3;x++){
                if(board[y][x] == undefined || board[y][x] == 0){
                    moves.push([x1,y1,x,y])
                }
            
            }
        }
        return moves
    }
    /**
     * 
     * @returns {float}The evaluation of the board state
     */
    evaluate(board = this.gameBoard,winningBoxes = this.boardObject.winningBoxes,shout = true){
        const weights = [
            [20,10,20],
            [10,40,10],
            [20,10,20],
        ]
        const oneAway = 50;
        const winningBox = 300
        const oneAwayWinning = 500
        const WIN = 100000
        let evaluation = 0
        let pieceCountEvalX = 0
        let pieceCountEvalO = 0
        let countX = 0
        let countO = 0 
        board.forEach((ROW,y1) => {
            ROW.forEach((inner,x1) => {
                if(winningBoxes[y1][x1] != 0){
                    if(winningBoxes[y1][x1] != 2){
                        evaluation += winningBox*winningBoxes[y1][x1]
                        if(shout)console.log("Winning Box: ",winningBox*winningBoxes[y1][x1])
                    }
                    return
                }
                inner.forEach((row,y) =>{
                    for(let x = 0;x<3;x++){
                        let square = row[x]
                        //Piece count eval
                        if(square != undefined){
                            if(square == 1){
                                pieceCountEvalX += weights[y][x]
                                countX++
                            }else{
                                pieceCountEvalO += weights[y][x]
                                countO++
                            }

                        }else{
                            //One away eval
                            let hyp = [Array.from(inner[0]),Array.from(inner[1]),Array.from(inner[2])]
                            for(let i = -1 ; i <= 1; i+=2){
                                hyp[y][x] = i
                                let numberOfLines = this.boardObject.testForLineOnBoard(hyp,i)
                                evaluation += numberOfLines*i*oneAway
                                if(shout)if(numberOfLines > 0)console.log("One Away: ",numberOfLines*i*oneAway)
                            }
                        }
                    }

                })
            })
        })
        if(countX != 0)pieceCountEvalX /= countX
        if(countO != 0)pieceCountEvalO /= countO
        let pieceCountEval = (pieceCountEvalX-pieceCountEvalO)
        evaluation += pieceCountEval
        if(shout)console.log("Piece Count: ",pieceCountEvalX)
        if(shout)console.log("Piece Count: ",-pieceCountEvalO)
        if (!evaluation)evaluation = 0
        winningBoxes.forEach((row,y) =>{
            for(let x = 0;x<3;x++){
                let square = row[x]
                if(square == undefined){
                    let hyp = [Array.from(winningBoxes[0]),Array.from(winningBoxes[1]),Array.from(winningBoxes[2])]
                    for(let i = -1 ; i <= 1; i+=2){
                        hyp[y][x] = i
                        let numberOfLines = this.boardObject.testForLineOnBoard(hyp,i)
                        evaluation += numberOfLines*i*oneAwayWinning
                        if(shout)if(numberOfLines > 0)console.log("One Away From Winning: ",numberOfLines*i*oneAwayWinning)
                    }
                }
                

            }
        })
        for(let i = -1 ; i <= 1; i+=2){
            let numberOfLines = this.boardObject.testForLineOnBoard(winningBoxes,i)
            evaluation += numberOfLines*i*WIN
            if(shout)if(numberOfLines > 0)console.log("Winner: ",numberOfLines*i*WIN)
        }
        if(shout)console.log("Final Position Evaluation: ",evaluation)
        return evaluation
    }
    
    findBestMove(board,turn,winningBoxes,moves,depth,alpha = 0,beta = 0 ){
        let evaluation = this.evaluate(board,winningBoxes,false)
        if(depth == 0){
            //console.log(TESTBranch)
            TESTBranch = []
            return [evaluation,[-1,-1,-1,-1]]
        }
        let allEvals = []
        for(let m = 0;m < moves.length;m++){
            let move = moves[m]
            let newBoard = this.boardObject.createArray(3,3,3,3)
            let newWinningBoxes = []
            board.forEach((ROW,r) => {
                ROW.forEach((inner, i) =>{
                    inner.forEach((row,x) => {
                        newBoard[r][i][x] = Array.from(row)
                    });
                })
            })
            newBoard[move[1]][move[0]][move[3]][move[2]] = turn == "X" ? 1 : -1
            winningBoxes.forEach((row,i)=> {
                newWinningBoxes[i] = Array.from(row)
            });
            let checkForWin = this.boardObject.testForLineOnBoard(newBoard[move[1]][move[0]],turn == "X" ? 1 : -1)
            newWinningBoxes[move[1]][move[0]] = checkForWin > 0? (turn == "X" ? 1 : -1):0
            let finEval = this.evaluate(newBoard,newWinningBoxes,false)
            let newMoves = []

            if(newWinningBoxes[move[3]][move[2]] != 0){
                let avalableBoxes = this.findLegalMoves(newWinningBoxes,0,0)
                for(let i = 0;i<avalableBoxes.length;i++){
                    let element = avalableBoxes[i]
                    let movesInBox = this.findLegalMoves(newBoard[element[3]][element[2]],element[2],element[3])
                    for(let j = 0;j<movesInBox.length;j++){
                        newMoves.push(movesInBox[j])
                    }
                }
            }else{
                newMoves = this.findLegalMoves(newBoard[move[3]][move[2]],move[2],move[3])
            }
            //TESTBranch.push([finEval,move,turn])
            let node = this.findBestMove(newBoard,turn == "X" ? "O" : "X",newWinningBoxes,newMoves,depth-1)
            //put alpha/beta here
            if(node == undefined)node = [0,move]
            allEvals.push([node[0],move])
            //if(depth == 2)console.log(node)
        }

        
        
        
        if(turn == "X"){
            allEvals.sort((a,b)=>{
                return b[0]-a[0]
            })
        }else{
            allEvals.sort((a,b)=>{
                return a[0]-b[0]
            })
        }
        if(depth == 4)console.log(allEvals)
        return allEvals[0]
    }
    takeTurn(){
        let x1
        let y1
        let x2
        let y2
        let listOfMoves = []
        if(this.game.nextBox[0] != -1){
            listOfMoves = this.findLegalMoves(this.gameBoard[this.game.nextBox[1]][this.game.nextBox[0]],this.game.nextBox[0],this.game.nextBox[1])
        }else{
            let avalableBoxes = this.findLegalMoves(this.boardObject.winningBoxes,0,0)
            for(let i = 0;i<avalableBoxes.length;i++){
                let element = avalableBoxes[i]
                let movesInBox = this.findLegalMoves(this.gameBoard[element[3]][element[2]],element[2],element[3])
                for(let j = 0;j<movesInBox.length;j++){
                    listOfMoves.push(movesInBox[j])
                }
            }
        }
        let bestMove = this.findBestMove(this.gameBoard,this.game.turn,this.boardObject.winningBoxes,listOfMoves,4)
        x1 = bestMove[1][0]
        y1 = bestMove[1][1]
        x2 = bestMove[1][2]
        y2 = bestMove[1][3]
        console.log(x1,y1,x2,y2)
        console.log(bestMove[0])
        let gameState = this.game.makeMove(x1,y1,x2,y2,true)
        this.evaluate()
        return gameState
    }
}
exports.Computer = Computer
exports.Board = Board
exports.Game = Game