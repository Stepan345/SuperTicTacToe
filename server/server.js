const fn = require("./functions.js")
const express = require("express")
const app = express()
const logger = require("./logger.js")
const port = 8080
let users = {
    

}
app.post("/getnewid",(req,res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    logger.info("New User request")
    res.send({
        id:createNewUser()
    })    
})
app.delete("/deleteinactive",(req,res)=>{
    
    deleteInactiveUsers()
    res.sendStatus(200)
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
        if(Date.now()-users[user]["time"] > 60000){
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
    logger.info(keys)
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
