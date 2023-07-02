import { useState, useContext } from "react";
import UserContext from "../../lib/UserContext";
import Tile from "../Board/Tile";

const UserInfo = () => {
  const {stats, moves, closestColor, delta}:any = useContext(UserContext);

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