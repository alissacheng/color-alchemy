import { useState, useEffect } from "react";
import { InitialData } from "../../types/InitialData";

interface UserInfoProps{
  data: InitialData
}

const Board = ({data}:UserInfoProps) => {
  const [stats, setStats] = useState<InitialData>({
      userId: '',
      width: 0,
      height: 0,
      maxMoves: 0,
      target: [],
      color: ''
    }
  );

  useEffect(()=> {
    setStats(data)
  }, [data])

  return(
    <div>

    </div>
  )
}

export default Board;