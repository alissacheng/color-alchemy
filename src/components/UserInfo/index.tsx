import { useEffect, useState, useContext } from "react";
import UserContext from "../../lib/UserContext";
import Tile from "../Gameboard/Tile/index";
import getDelta from "../../lib/getDelta";
import { InitialData } from '../../types/InitialData';

interface userInfoContextData {
  moves: number,
  setMoves: (newMoves: number) => void,
  gameboard: any[],
  setGameboard: (newBoard: any[]) => void,
  stats: InitialData,
  setStats: (newStats: InitialData) => void,
  closestColor: string,
  setClosestColor: (newColor: string) => void
}

const UserInfo: React.FC<any> = () => {
  const {stats, setStats, moves, setMoves, setGameboard, gameboard, closestColor, setClosestColor}: userInfoContextData = useContext(UserContext);
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
    .then((data: InitialData) => {
      setStats({...data, color: `rgb(${data.target.join()})` })
      const newDelta = getDelta(data.target.join(), '0,0,0')
      setDelta(newDelta)
      setGameOver(false)
    })
    .catch(error => {
      setGameOver(true)
      console.log("something went wrong", error)
      const updateStats: InitialData = {...stats};
      updateStats.width = 0;
      updateStats.height = 0;
      setStats(updateStats);
      alert("Sorry, something went wrong. Please try again later.")
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
    if(gameOver) disableGame();
  }, [gameOver])

  const disableGame = () => {
    document.querySelectorAll(".tile").forEach((tile:any)=>{
      tile.setAttribute("draggable", false);
      tile.classList.remove("cursor-pointer");
    })
  }

  useEffect(()=>{
    if(moves > 0) updateClosestColor();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameboard])

  const updateClosestColor = () => {
    let smallestDelta: number = 1;
    let newClosestColor: string = '0,0,0'
    gameboard.forEach((row: any[])=>{
      row.forEach((color: string)=>{
        const newDelta: number = getDelta(stats.target.join(), color)
        if(newDelta < smallestDelta){
          smallestDelta = newDelta;
          newClosestColor = color;
        }
      })
    })
    setClosestColor(newClosestColor);
    setDelta(smallestDelta)
  }

  useEffect(()=> {
    let newPlayAgain: boolean = false;
    let confirm: boolean = false;
    //check if game is being played
    if(!gameOver && stats.maxMoves){
      //check if game is over and close game if it is
      if(((stats.maxMoves - moves === 0 && delta >= 0.1) || delta < 0.1) && !confirm){
        confirm = true;
        setTimeout(function(){
          const message: string = delta < 0.1 ? "Success! Do you want to try again?" : "Failed. Do you want to try again?";
          newPlayAgain = window.confirm(message)
          setPlayAgain(newPlayAgain)
          setGameOver(true);
        }, 300)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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