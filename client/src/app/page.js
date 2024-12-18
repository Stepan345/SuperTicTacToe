'use client'
import Image from "next/image";
import {useState,useEffect} from "react";
const URL = "http://localhost:8080"
async function getNewID(){
  try{ 
    const response = await fetch(URL+"/getnewid",{
      method:"POST"
    })
    if(!response.ok){
      throw new Error(`Response status: ${response.status}`)
    }
    console.log(response.json())
    return response.body.id;
  }catch (error){
    console.error(error)
  }
}


export default function Home() {
  const [userId,setUserId] = useState(-1)
  useEffect(()=>{
    setUserId(getNewID())
    console.log(userId)
  },[])
  return (
    innerBoard()
  );
}
function innerBoard(){
  return(
    <div>
      <div className="line">
        <button className="square"id="11"></button>
        <button className="square"id="12"></button>
        <button className="square"id="13"></button>
      </div>
      <div className="line">
        <button className="square"id="21"></button>
        <button className="square"id="22"></button>
        <button className="square"id="23"></button>
      </div>
      <div className="line">
        <button className="square"id="21"></button>
        <button className="square"id="22"></button>
        <button className="square"id="23"></button>
      </div>
    </div>
  )
}