import { useState, useContext } from "react";
import UserContext from "../../lib/UserContext";

const UserInfo = () => {
  const {stats}:any = useContext(UserContext);
  const [moves, setMoves] = useState<number>(0)

  return(
    <div className="text-left flex flex-col space-y-3">
      <h1 className="font-bold">RGB Alchemy</h1>
      <p>User ID: {stats?.userId}</p>
      <p>Moves left: {stats ? stats.maxMoves - moves : 0}</p>
      <p className="flex items-center space-x-2">
        <span>Target color </span>
        <span 
          className={`w-6 h-6 block rounded-[4px] border-gray-400 border-2`} 
          style={{background: stats?.color}}>
        </span>
      </p>
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