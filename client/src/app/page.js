'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
const URL = "http://localhost:8080"
async function getNewID() {
  try {
    const response = await fetch(URL + "/getnewid", {
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


export default function Home() {
  const [board, setBoard] = useState([])
  const [userId, setUserId] = useState(-1)
  const [active, setActive] = useState([])
  useEffect(() => {
    const setID = async () => {
      let newID = await getNewID()
      console.log(newID)
      setUserId(newID)
    }
    setID()
  }, [])
  useEffect(() => {
    const resetBoard = async () => {
      let newBoard = await getNewBoard()
      setBoard(newBoard)
      setActive([
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ])
    }
    resetBoard()
  }, [userId])
  if(board.length){
    return (
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
  let lastActive = [[...active[0]],[...active[1]],[...active[2]]]
  let newBoard = JSON.parse(JSON.stringify(board))
  let boardWithMove = JSON.parse(JSON.stringify(board))
  boardWithMove[y1][x1][y2][x2] = "X"
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
    }else{
      newActive[newActiveCords[1]][newActiveCords[0]] = true
    }
    console.log({
      newActive:newActive
    })
    setActive(newActive)
    newBoard[opponentMove[1]][opponentMove[0]][opponentMove[3]][opponentMove[2]] = "O"
    newBoard[y1][x1][y2][x2] = "X"
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
        <button onClick = {()=>makeMove(x,y,0,0,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[0][0] != null || !thisActive}>{thisBoard[0][0] === null ? <span>&nbsp;</span> :<span>{thisBoard[0][0]}</span>}</button>
        <button onClick = {()=>makeMove(x,y,1,0,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[0][1] != null || !thisActive}>{thisBoard[0][1] === null ? <span>&nbsp;</span> :<span>{thisBoard[0][1]}</span>}</button>
        <button onClick = {()=>makeMove(x,y,2,0,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[0][2] != null || !thisActive}>{thisBoard[0][2] === null ? <span>&nbsp;</span> :<span>{thisBoard[0][2]}</span>}</button>
      </div>
      <div className="line">
        <button onClick = {()=>makeMove(x,y,0,1,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[1][0] != null || !thisActive}>{thisBoard[1][0] === null ? <span>&nbsp;</span> :<span>{thisBoard[1][0]}</span>}</button>
        <button onClick = {()=>makeMove(x,y,1,1,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[1][1] != null || !thisActive}>{thisBoard[1][1] === null ? <span>&nbsp;</span> :<span>{thisBoard[1][1]}</span>}</button>
        <button onClick = {()=>makeMove(x,y,2,1,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[1][2] != null || !thisActive}>{thisBoard[1][2] === null ? <span>&nbsp;</span> :<span>{thisBoard[1][2]}</span>}</button>
      </div>
      <div className="line">
        <button onClick = {()=>makeMove(x,y,0,2,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[2][0] != null || !thisActive}>{thisBoard[2][0] === null ? <span>&nbsp;</span> :<span>{thisBoard[2][0]}</span>}</button>
        <button onClick = {()=>makeMove(x,y,1,2,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[2][1] != null || !thisActive}>{thisBoard[2][1] === null ? <span>&nbsp;</span> :<span>{thisBoard[2][1]}</span>}</button>
        <button onClick = {()=>makeMove(x,y,2,2,active,setActive,setBoard,userId,board)} className="square" disabled={thisBoard[2][2] != null || !thisActive}>{thisBoard[2][2] === null ? <span>&nbsp;</span> :<span>{thisBoard[2][2]}</span>}</button>
      </div>
    </div>
  )
}