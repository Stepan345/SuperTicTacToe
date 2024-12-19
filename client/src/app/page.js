'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { CookiesProvider, useCookies } from 'react-cookie'

async function getNewID() {
  const URL = "http://"+location.hostname + ":8080"
  console.log(URL)
  try {
    const response = await fetch(URL+"/getnewid", {
      method: "POST"
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    let body = await response.json()
    return body.id
  } catch (error) {
    console.error(error)
  }
}
async function getNewBoard() {
  const URL = "http://"+location.hostname + ":8080"
  try {
    const response = await fetch(URL + "/getnewboard", { method: "GET" })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    let body = await response.json()
    return body.board
  } catch (error) {
    console.error(error)
  }
}
async function getUserBoard(userId){
  const URL = "http://"+location.hostname + ":8080"
  try{
    const response = await fetch(URL + "/getuserboard?" + new URLSearchParams({userId:userId}), {method:"GET"})
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    let body = await response.json()
    return [body.board,body.active,body.winningBoxes]
  }catch(error){
    console.error(error)
  }
}


export default function Home() {
  const [cookies,setCookie,removeCookie] = useCookies(['userId'])
  const [board, setBoard] = useState([])
  const [userId, setUserId] = useState(-1)
  const [active, setActive] = useState([])

  const setID = async () => {
    let newID = await getNewID()
    setUserId(newID)
    console.log({
      userId:userId,
      newID:newID
    })
    setCookie('userId',newID,{path:"/"})
    setUserBoard()
  }

  const setUserBoard = async () =>{
    let newActive = [
      [true, true, true],
      [true, true, true],
      [true, true, true]
    ]
    let newBoard = await getUserBoard(userId)
    if(newBoard[0] !== -1){
      console.log({
        newBoard: newBoard
      })
      setBoard(newBoard[0])
      if(newBoard[1][0] !== -1){
        newActive = [
          [false, false, false],
          [false, false, false],
          [false, false, false]
        ]
        newActive[newBoard[1][1]][newBoard[1][0]] = true
        
      }else{
        newBoard[2].forEach((row,y) => {
          row.forEach((square,x) => {
            if(square != 0)newActive[y][x] = false
          });
        });
      }
      setActive(newActive)
    }else{
      console.log("User not found")
      removeCookie("userId")
      setID()
    }
  }


  useEffect(() => {
    if(cookies.userId){
      console.log("Cookie found: "+cookies.userId)
      setUserId(cookies.userId)
    }else{
      console.log("No cookie found")
      setID()
    }
  }, [])

  useEffect(()=>{
    console.log({
      userId:userId
    })
    if(userId != -1)console.log({
      board:board,
      userId:userId
    })
  },[board])
  
  useEffect(() => {
    if(userId != -1)setUserBoard()
  }, [userId])

  if(board.length){
    return (
      //<div>Good</div>
      <div>
        <div className = "outerLine">
          {innerBoard(2, 0, board, active, setActive,setBoard,userId)}
          {innerBoard(1, 0, board, active, setActive,setBoard,userId)}
          {innerBoard(0, 0, board, active, setActive,setBoard,userId)}
        </div>
        <div className = "outerLine">
          {innerBoard(2, 1, board, active, setActive,setBoard,userId)}
          {innerBoard(1, 1, board, active, setActive,setBoard,userId)}
          {innerBoard(0, 1, board, active, setActive,setBoard,userId)}
        </div>
        <div className = "outerLine">
          {innerBoard(2, 2, board, active, setActive,setBoard,userId)}
          {innerBoard(1, 2, board, active, setActive,setBoard,userId)}
          {innerBoard(0, 2, board, active, setActive,setBoard,userId)}
        </div>
      </div>
    );
  }
  return (
    <div>Loading...</div>
  )
}
async function makeMove(x1,y1,x2,y2,active,setActive,setBoard,userId,board){
  const URL = "http://"+location.hostname + ":8080"
  let lastActive = [[...active[0]],[...active[1]],[...active[2]]]
  let newBoard = JSON.parse(JSON.stringify(board))
  let boardWithMove = JSON.parse(JSON.stringify(board))
  boardWithMove[y1][x1][y2][x2] = 1
  setBoard(boardWithMove)
  try {
    setActive([
      [false,false,false],
      [false,false,false],
      [false,false,false]
    ])
    const response = await fetch(URL+"/broadcastmove?" + new URLSearchParams({
      x1:x1,
      y1:y1,
      x2:x2,
      y2:y2,
      user:userId
    }).toString(),{
      method:"POST"
    })
    if(!response.ok){
      throw new Error(`Response status: ${response.status}`)
    }
    let body = await response.json()
    let opponentMove = body.move
    let newActiveCords = body.active
    let winningBoxes = body.winningBoxes
    console.log({
      opponentMove:opponentMove,
      newActiveCords:newActiveCords
    })
    let newActive = [
      [false,false,false],
      [false,false,false],
      [false,false,false]
    ]
    if(newActiveCords[0] === -1){
      newActive = [
        [true,true,true],
        [true,true,true],
        [true,true,true]
      ]
      if(winningBoxes){      
        winningBoxes.forEach((row,y) => {
          row.forEach((square,x) => {
            if(square != 0)newActive[y][x] = false
          });
        });
      }
    }else{
      newActive[newActiveCords[1]][newActiveCords[0]] = true
    }
    console.log({
      newActive:newActive
    })
    setActive(newActive)
    newBoard[opponentMove[1]][opponentMove[0]][opponentMove[3]][opponentMove[2]] = -1
    newBoard[y1][x1][y2][x2] = 1
    console.log({
      newBoard:newBoard
    })
    setBoard(newBoard)

  } catch (error) {
    setActive(lastActive)
    console.error(error)
  }

}
function printCords(x,y){
  console.log({
    x:x,
    y:y
  })
}
function innerBoard(x, y, board, active,setActive,setBoard,userId ) {
  //console.log(board)
  let thisBoard = board[y][x]
  let thisActive = active[y][x]
  // console.log({
  //   thisActive:thisActive,
  //   x:x,
  //   y:y
  // })
  return (
    <div className = "outerSquare">
      <div className="line">
        <button onClick = {()=>makeMove(x,y,0,0,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[0][0] != null || !thisActive}>{thisBoard[0][0] === null ? <span>&nbsp;</span> :<span>{thisBoard[0][0] == 1?"X":"O"}</span>}</button>
        <button onClick = {()=>makeMove(x,y,1,0,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[0][1] != null || !thisActive}>{thisBoard[0][1] === null ? <span>&nbsp;</span> :<span>{thisBoard[0][1] == 1?"X":"O"}</span>}</button>
        <button onClick = {()=>makeMove(x,y,2,0,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[0][2] != null || !thisActive}>{thisBoard[0][2] === null ? <span>&nbsp;</span> :<span>{thisBoard[0][2] == 1?"X":"O"}</span>}</button>
      </div>
      <div className="line">
        <button onClick = {()=>makeMove(x,y,0,1,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[1][0] != null || !thisActive}>{thisBoard[1][0] === null ? <span>&nbsp;</span> :<span>{thisBoard[1][0] == 1?"X":"O"}</span>}</button>
        <button onClick = {()=>makeMove(x,y,1,1,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[1][1] != null || !thisActive}>{thisBoard[1][1] === null ? <span>&nbsp;</span> :<span>{thisBoard[1][1] == 1?"X":"O"}</span>}</button>
        <button onClick = {()=>makeMove(x,y,2,1,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[1][2] != null || !thisActive}>{thisBoard[1][2] === null ? <span>&nbsp;</span> :<span>{thisBoard[1][2] == 1?"X":"O"}</span>}</button>
      </div>
      <div className="line">
        <button onClick = {()=>makeMove(x,y,0,2,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[2][0] != null || !thisActive}>{thisBoard[2][0] === null ? <span>&nbsp;</span> :<span>{thisBoard[2][0] == 1?"X":"O"}</span>}</button>
        <button onClick = {()=>makeMove(x,y,1,2,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[2][1] != null || !thisActive}>{thisBoard[2][1] === null ? <span>&nbsp;</span> :<span>{thisBoard[2][1] == 1?"X":"O"}</span>}</button>
        <button onClick = {()=>makeMove(x,y,2,2,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[2][2] != null || !thisActive}>{thisBoard[2][2] === null ? <span>&nbsp;</span> :<span>{thisBoard[2][2] == 1?"X":"O"}</span>}</button>
      </div>
    </div>
  )
}