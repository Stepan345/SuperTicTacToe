const fn = require("./functions.js")
const prompt = require("prompt-sync")({ sigint: true })
const logger = require("./logger.js")

var globalBoard = new fn.Board(true)
var game = new fn.Game(globalBoard)
var computer = new fn.Computer(game)
globalBoard.drawBoard(globalBoard)

//startTwoPlayerTest()
//startOnePlayerTest()
startNoPlayerTest()
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
        if(checkMove(move) && game.makeMove(move[0],move[1],move[2],move[3]) == 1){
            console.log("Game Ended By Victory")
            gameEnd = true
        }
    }
}
function startOnePlayerTest(){
    console.log("You are playing X")
    let gameEnd = false
    while(!gameEnd){
        let answer
        if(game.turn == "X"){
            answer = prompt("Make a move as "+game.turn+" > ")
            if(answer == 'end'){
                console.log("Force End")
                gameEnd = true
                continue
            }
            
            let move = answer.split("")
            if(game.nextBox[0] != -1) move.unshift(game.nextBox[0]+1,game.nextBox[1]+1)
            if(checkMove(move) && game.makeMove(move[0],move[1],move[2],move[3]) == 1){
                console.log("Game Ended By Victory")
                gameEnd = true
            }
        }else{
            computer.takeTurn()
        }

    }
}
function startNoPlayerTest(){
    let gameEnd = false
    while(!gameEnd){
        let gameState = computer.takeTurn()
        if(gameState == 1||gameState == -1)gameEnd = true
    }
}
function checkMove(move){
    let i = 0
    move.forEach(element => {
        move[i] = parseInt(element)-1
        if(move[i] > 2)move[5] = -1
        i++
    });
    if(move.length != 4){
        console.log("Your move should be 4 chars long and consist of only numbers 3, 2, and 1")
        return false
    }
    else return true

}