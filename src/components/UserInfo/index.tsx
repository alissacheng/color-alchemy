import { useEffect, useState, useContext } from "react";
import UserContext from "../../lib/UserContext";
import Tile from "../Board/Tile/index";
import getDelta from "../../lib/getDelta";
import { InitialData } from '../../types/InitialData';

const UserInfo: React.FC<any> = () => {
  const {stats, setStats, moves, board, closestColor, setClosestColor}:any = useContext(UserContext);
  const [delta, setDelta] = useState<number>(1);

  useEffect(()=> {
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
    })
    .catch(error => {
      // Handle any errors
      console.log("something went wrong", error)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    //update closest color every time a move is made/board is updated
    if(moves > 0){
      let smallestDelta:number = 1;
      let newClosestColor:string = '0,0,0'
      board.forEach((row:any[])=>{
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
  }, [board])

  useEffect(()=> {
    if(stats.maxMoves && stats.maxMoves - moves === 0 && delta >= 0.1){
      alert("Failed. Do you want to try again?")
    }
    if(delta < 0.1){
      alert("Success! Do you want to try again?")
    }
  }, [delta, moves, stats.maxMoves])

  return(
    <div className="text-left flex flex-col space-y-3">
      <h1 className="font-bold">RGB Alchemy</h1>
      <p>User ID: {stats?.userId}</p>
      <p>Moves left: {stats ? stats.maxMoves - moves : 0}</p>
      <div className="flex items-center space-x-2">
        <p>Target color </p>
        <Tile color={stats?.target.join()} position={null} lastMove={null} />
      </div>
      <div className="flex items-center space-x-2">
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