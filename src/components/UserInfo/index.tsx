import { useEffect, useState, useContext } from "react";
import UserContext from "../../lib/UserContext";
import Tile from "../Board/Tile/index";
import getDelta from "../../lib/getDelta";
import { InitialData } from '../../types/InitialData';

const UserInfo: React.FC<any> = () => {
  const {stats, setStats, moves, board, closestColor, setClosestColor}:any = useContext(UserContext);
  const [delta, setDelta] = useState<number>(1)

  useEffect(()=> {
    fetch('http://localhost:9876/init',{
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
  }, [])

  useEffect(()=>{
    //update closest color every time a move is made/board is updated
    if(moves > 0){
      let smallestDelta:number = delta
      let newClosestColor:string = closestColor
      board.forEach((row:any[])=>{
        row.forEach((color:string)=>{
          const newDelta:number = getDelta(stats.target.join(), color)
          if(newDelta < delta && newDelta < smallestDelta){
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

  return(
    <div className="text-left flex flex-col space-y-3">
      <h1 className="font-bold">RGB Alchemy</h1>
      <p>User ID: {stats?.userId}</p>
      <p>Moves left: {stats ? stats.maxMoves - moves : 0}</p>
      <div className="flex items-center space-x-2">
        <p>Target color </p>
        <Tile tileColor={stats?.target.join()} position={{row:null, column:null}} />
      </div>
      <div className="flex items-center space-x-2">
        <p>Closest color </p>
        <Tile tileColor={closestColor} position={{row:null, column:null}} />
        <p>
          Δ = {(delta*100).toFixed(2) + "%"}
        </p>
      </div>
    </div>
  )
}

export default UserInfo;