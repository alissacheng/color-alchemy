import { useState, useContext } from "react";
import UserContext from "../../lib/UserContext";
import Tile from "../Board/Tile";

const UserInfo = () => {
  const {stats, moves}:any = useContext(UserContext);

  return(
    <div className="text-left flex flex-col space-y-3">
      <h1 className="font-bold">RGB Alchemy</h1>
      <p>User ID: {stats?.userId}</p>
      <p>Moves left: {stats ? stats.maxMoves - moves : 0}</p>
      <div className="flex items-center space-x-2">
        <p>Target color </p>
        <Tile tileColor={stats?.target.join()} position={{row:null, column:null}} />
      </div>
      <p className="flex items-center space-x-2">
        <span>Closest color </span>
        <span 
          className={`w-6 h-6 block rounded-[4px] border-gray-400 border-2`} 
          style={{background: stats?.color}}>
        </span>
        <span>
          Δ =
        </span>
      </p>
    </div>
  )
}

export default UserInfo;