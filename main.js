import {Board,Game} from "./functions.js"

var globalBoard = new Board(true)
var game = new Game(globalBoard)
globalBoard.drawBoard(globalBoard)
let gameEnd = false
console.log("Make moves in x1y1x2y2")
game.makeMove(0,0,0,0)
game.makeMove(0,0,1,1)
// while(!gameEnd){
//     let answer = prompt("Make a move as "+ game.turn)

// }