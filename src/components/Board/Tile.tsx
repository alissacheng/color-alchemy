import { useEffect, useState, useContext } from "react";
import UserContext from "../../lib/UserContext";

interface TileData{
  tileColor: string,
  position: {
    row: number | null,
    column: number | null
  }
}

const Tile = ({tileColor, position}:TileData) => {
  const {board}:any = useContext(UserContext);
  const [color, setColor] = useState<string>('rgb(0,0,0)')
  const [mouseOver, setMouseOver] = useState<boolean>(false)

  useEffect(()=>{
    setColor('rgb('+tileColor+')')
  }, [tileColor])
  return(
    <div 
      className={`w-6 relative h-6 block rounded-[4px] border-gray-400 border-2 
        ${color !== 'rgb(0,0,0)' && position.row !== null ? 'cursor-pointer' : ''}`}
      style={{background: color}}
      onMouseOver={()=>setMouseOver(true)}
      onMouseLeave={()=>setMouseOver(false)}
    >
      {color !== 'rgb(0,0,0)' && mouseOver && (
        <div className="tooltip text-sm absolute bg-gray-400 text-black rounded-sm shadow-sm top-full left-1/2">
          <p>{tileColor}</p>
        </div>
      )}
    </div>
  )
}

export default Tile;