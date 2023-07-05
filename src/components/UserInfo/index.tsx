import { useEffect, useState, useContext } from "react";
import UserContext from "../../lib/UserContext";
import Tile from "../Gameboard/Tile/index";
import getDelta from "../../lib/getDelta";
import { InitialData } from '../../types/InitialData';

const UserInfo: React.FC<any> = () => {
  const {stats, setStats, moves, setMoves, setGameboard, gameboard, closestColor, setClosestColor}:any = useContext(UserContext);
  const [delta, setDelta] = useState<number>(1);
  const [playAgain, setPlayAgain] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(true);

  const initGame = () => {
    const url:string = stats.userId ? `http://localhost:9876/init/user/${stats.userId}` : 'http://localhost:9876/init'
    fetch(url,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => response.json())
    .then((data:InitialData) => {
      setStats({...data, color: `rgb(${data.target.join()})` })
      const newDelta = getDelta(data.target.join(), '0,0,0')
      setDelta(newDelta)
      setGameOver(false)
    })
    .catch(error => {
      // Handle any errors
      console.log("something went wrong", error)
    });
  }

  useEffect(()=> {
    initGame()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    if(playAgain){
      setMoves(0)
      setGameboard([])
      setClosestColor('0,0,0');
      initGame();
      setPlayAgain(false);
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playAgain])

  useEffect(()=>{
    if(gameOver){
      document.querySelectorAll(".tile").forEach((tile:any)=>{
        tile.setAttribute("draggable", false);
        tile.classList.remove("cursor-pointer");
      })
    }
  }, [gameOver])

  useEffect(()=>{
    //update closest color every time a move is made/board is updated
    if(moves > 0){
      let smallestDelta:number = 1;
      let newClosestColor:string = '0,0,0'
      gameboard.forEach((row:any[])=>{
        row.forEach((color:string)=>{
          const newDelta:number = getDelta(stats.target.join(), color)
          if(newDelta < smallestDelta){
            smallestDelta = newDelta
            newClosestColor = color
          }
        })
      })
      setClosestColor(newClosestColor);
      setDelta(smallestDelta)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameboard])

  useEffect(()=> {
    let newPlayAgain:boolean = false;
    let confirm:boolean = false;
    //check if ui is updated
    if(!gameOver){
      document.querySelectorAll(".tile").forEach((tile:any)=>{
        //check if frontend is updated for user before closing the game
        if(tile.style.background.split(' ').join('') === 'rgb(' + closestColor + ')'){
          if(stats.maxMoves && stats.maxMoves - moves === 0 && delta >= 0.1 && !confirm){
            confirm = true;
            setTimeout(function(){
              newPlayAgain = window.confirm("Failed. Do you want to try again?")
              setPlayAgain(newPlayAgain)
              setGameOver(true);
            }, 300)
          }
          if(stats.maxMoves && gameboard.length && delta < 0.1 && !confirm){
            confirm = true;
            setTimeout(function(){
              newPlayAgain = window.confirm("Success! Do you want to try again?");
              setPlayAgain(newPlayAgain);
              setGameOver(true);
            }, 300)
          }
        }
      })
    }
  }, [moves, delta])

  return(
    <div className="text-left flex flex-col space-y-3">
      <h1 className="font-bold">RGB Alchemy</h1>
      <p>User ID: {stats?.userId}</p>
      <p>Moves left: {stats ? stats.maxMoves - moves : 0}</p>
      <div className="flex items-center space-x-2">
        <p>Target color </p>
        <Tile color={stats?.target.join()} position={null} lastMove={null} />
      </div>
      <div className="flex items-center space-x-2 c">
        <p>Closest color </p>
        <Tile color={closestColor} position={null} lastMove={null} />
        <p>
          Δ={(delta*100).toFixed(2) + "%"}
        </p>
      </div>
    </div>
  )
}

export default UserInfo;