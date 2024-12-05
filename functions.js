class Game{
    constructor(board){
        this.gameBoard = board
        this.turn = "X"
    }
    makeMove(x1,y1,x2,y2){
        if(this.gameBoard.board[y1][x1][y2][x2] == null && this.gameBoard.winningBoxes[y1][x1] == 0){
            this.gameBoard.setBoard(x1,y1,x2,y2,this.turn)
            this.turn = this.turn == "X"? "O": "X"
        }else{
            console.log("Illegal Move. Reason(s):")
            if(this.gameBoard.board[y1][x1][y2][x2] != null)console.log("Not a free box")
            if(this.gameBoard.winningBoxes[y1][x1] != 0)console.log("Box already won")
        }
        this.gameBoard.drawBoard()
    }
}
class Board{
    /**
     * @param {Boolean} super3T Super Tick-Tac-Toe or not
     */

    constructor(super3T = false){
        this.superBoard = super3T
        if(super3T){
            this.board = this.#createArray(3,3,3,3)
        }
        this.xTurn = true
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
                            if(this.winningBoxes[y1][x1] != 0){
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
    #createArray(length) {
        var arr = new Array(length || 0),
            i = length;
    
        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = this.#createArray.apply(this, args);
        }
    
        return arr;
    }
    /**
     * 
     * @param {int} x1 Collumns on the big board 
     * @param {int} y1 Rows on the big board
     * @param {int} x2 Collumns on the inner board
     * @param {int} y2 Rows on the inner board
     * @param {any} value {X,O,-,1,0,-1} What the square is set to
     */
    setBoard(x1,y1,x2,y2,value){
        let translatedValue = 0;
        if(value == "X" || value == 1)translatedValue = 1
        else if(value == "O" || value == -1)translatedValue = -1
        this.board[y1][x1][y2][x2] = translatedValue
    }
    checkWinner(x = -1,y = -1){
        this.#updateWinningBoxes()
        if(x == -1){
            for(let j = -1 ; j <= 1; j+=2){
                if(this.winningBoxes[0][0] == j && this.winningBoxes[0][1] == j && this.winningBoxes[0][2] == j)return j
                else if(this.winningBoxes[1][0]  == j && this.winningBoxes[1][1] == j && this.winningBoxes[1][2] == j)return j
                else if(this.winningBoxes[2][0]  == j && this.winningBoxes[2][1] == j && this.winningBoxes[2][2] == j)return j
                else if(this.winningBoxes[0][0]  == j && this.winningBoxes[1][0] == j && this.winningBoxes[2][0] == j)return j
                else if(this.winningBoxes[0][1]  == j && this.winningBoxes[1][1] == j && this.winningBoxes[2][1] == j)return j
                else if(this.winningBoxes[0][2]  == j && this.winningBoxes[1][2] == j && this.winningBoxes[2][2] == j)return j
                else if(this.winningBoxes[0][0]  == j && this.winningBoxes[1][1] == j && this.winningBoxes[2][2] == j)return j
                else if(this.winningBoxes[2][0]  == j && this.winningBoxes[1][1] == j && this.winningBoxes[0][2] == j)return j
            }
        }else{
            return this.winningBoxes[y][x]
        }
        return winner
    }

    #updateWinningBoxes(){
        for(let i = 0;i < 9; i++){
            let x = i%3
            let y = Math.floor(i/3)
            if(this.winningBoxes[y][x] != 0){
                continue
            }
            let targetBoard = this.board[y][x]
            for(let j = -1 ; j <= 1; j+=2){
                if(targetBoard[0][0] == j && targetBoard[0][1] == j && targetBoard[0][2] == j){
                    this.winningBoxes[y][x] = j
                    continue
                }else if(targetBoard[1][0]  == j && targetBoard[1][1] == j && targetBoard[1][2] == j){
                    this.winningBoxes[y][x] = j
                    continue
                }else if(targetBoard[2][0]  == j && targetBoard[2][1] == j && targetBoard[2][2] == j){
                    this.winningBoxes[y][x] = j
                    continue
                }else if(targetBoard[0][0]  == j && targetBoard[1][0] == j && targetBoard[2][0] == j){
                    this.winningBoxes[y][x] = j
                    continue
                }else if(targetBoard[0][1]  == j && targetBoard[1][1] == j && targetBoard[2][1] == j){
                    this.winningBoxes[y][x] = j
                    continue
                }else if(targetBoard[0][2]  == j && targetBoard[1][2] == j && targetBoard[2][2] == j){
                    this.winningBoxes[y][x] = j
                    continue
                }else if(targetBoard[0][0]  == j && targetBoard[1][1] == j && targetBoard[2][2] == j){
                    this.winningBoxes[y][x] = j
                    continue
                }else if(targetBoard[2][0]  == j && targetBoard[1][1] == j && targetBoard[0][2] == j){
                    this.winningBoxes[y][x] = j
                    continue
                }
            }
        }
    }
}
export {Board,Game}