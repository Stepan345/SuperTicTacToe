const fn = require("./functions.js")
const express = require("express")
const app = express()
const logger = require("./logger.js")
const port = 8080
const helperBoard = new fn.Board(true)
let users = {
    
}
app.post("/getnewid",(req,res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    logger.info("New User request")
    res.send({
        id:createNewUser()
    })    
})
app.get("/getnewboard",(req,res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    let board = helperBoard.createArray(3,3,3,3)
    res.send({
        board:board
    })
})
app.get("/getuserboard",(req,res) =>{
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    let userKeys = Object.keys(users)
    logger.info(`Re-login request from user ${req.query.userId}`)
    if(userKeys.length && userKeys.includes(req.query.userId)){
        res.send({
            board:users[req.query.userId]["board"].board,
            active:users[req.query.userId]["game"].nextBox,
            winningBoxes:users[req.query.userId]["board"].winningBoxes
        })
    }else{
        logger.info("Invalid User")
        res.send({
            board:-1,
            active:-1
        })
    }
    
})
app.delete("/deleteinactive",(req,res)=>{
    
    deleteInactiveUsers()
    res.sendStatus(200)
})
app.post("/broadcastmove",(req,res)=>{
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    logger.info(req.query)
    let move = [req.query.x1,req.query.y1,req.query.x2,req.query.y2]
    let userId = (req.query.user).toString()
    logger.info(`New move recieved from user ${userId} with the move ${move}`)
    users[userId]["game"].makeMove(move[0],move[1],move[2],move[3])
    let cpuMove = users[userId]["cpu"].takeTurn()
    cpuMove[4] = users[userId]["game"].turn 
    logger.info(`CPU Move: ${cpuMove}`)
    res.send({
        move:cpuMove,
        active:users[userId]["game"].nextBox,
        winningBoxes:users[userId]["board"].winningBoxes
    })
})
app.listen(port,()=>{
    logger.info(`Server started on port ${port}`)
})


/**
 * 
 * @returns {int} The id of the new user
 */
function deleteInactiveUsers(){
    for(user in users){
        if(Date.now()-users[user]["time"] > 1800000){
            logger.info(`Deleted user ${users[user]["id"]}`)
            delete users[user]
        }
    }
}
function createNewUser(){
    let keys = Object.keys(users)
    let newBoard = new fn.Board(true)
    let newGame = new fn.Game(newBoard)
    let newCPU = new fn.Computer(newGame) 
    let newUserID
    if(keys.length < 1){
        newUserID = 1
    }else keys.sort((a,b)=>{
        return parseInt(a)-parseInt(b)
    })
    if(keys[0] !== "1"){
        newUserID = 1
    }else{
        keys.forEach((key,i)=>{
            if(newUserID)return
            if(parseInt(key)+1 !== parseInt(keys[i+1])){
                newUserID = parseInt(key)+1
            }
        })
    }

    
    users[newUserID] = {
        id: newUserID,  
        board: newBoard,
        game: newGame,
        cpu: newCPU,
        time: Date.now()
    }
    logger.info(`Created new user with the id ${newUserID}`)
    return parseInt(newUserID)
}
