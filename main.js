const fn = require("./functions.js")
const prompt = require("prompt-sync")({ sigint: true });

var globalBoard = new fn.Board(true)
var game = new fn.Game(globalBoard)
globalBoard.drawBoard(globalBoard)

startTwoPlayerTest()
function startTwoPlayerTest(){
    let gameEnd = false
    while(!gameEnd){
        let answer = prompt("Make a move as "+game.turn+" > ")
        if(answer == 'end'){
            console.log("Force End")
            gameEnd = true
            continue
        }
        let move = answer.split("")
        let i = 0
        move.forEach(element => {
            move[i] = parseInt(element)-1
            if(move[i] > 2)move[5] = -1
            i++
        });
        if(move.length != 4){
            console.log("Your move should be 4 chars long and consist of only numbers 3, 2, and 1")
            continue
        }
        if(game.makeMove(move[0],move[1],move[2],move[3])){
            console.log("Game Ended By Victory")
        }
    }
}