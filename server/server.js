const fn = require("./functions.js")
const express = require("express")
const app = express()
const logger = require("./logger.js")
const port = 4000
let users = {
    

}
app.get("/",(req,res) => {
    logger.info("New get request. RequestID = "+ req.headers.requestid)
    switch(req.headers.requestid){
        case "getNewID":
            res.send({
                id:createNewUser()
            })    
            break
        default:
            logger.warn("Request ID invalid: "+req.headers.requestid)
            res.sendStatus(418)
    }
})
app.listen(port,()=>{
    logger.info(`Server started on port ${port}`)
})
function createNewUser(){
    let keys = Object.keys(users)
    let newBoard = new fn.Board(true)
    let newGame = new fn.Game(newBoard)
    let newCPU = new fn.Computer(newGame) 
    let newUserID
    if(keys.length < 1){
        newUserID = 1
    }else keys.sort()
    
    keys.forEach((key,i)=>{
        if(newUserID)return
        if(users[key]["id"]-1 > 0 && users[key]["id"]-1 !== users[keys[i-1]]["id"]){
            newUserID = users[keys[i]]["id"]-1
        }
    })
    if(!newUserID){
        newUserID = users[keys[keys.length-1]]["id"]+1
    }
    
    users[newUserID] = {
        id: newUserID,  
        board: newBoard,
        game: newGame,
        cpu: newCPU,
        time: Date.now()
    }
    logger.info(`Created new user with the id ${newUserID}`)
}