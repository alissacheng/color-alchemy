import { useEffect, useState, useContext } from "react";
import UserContext from "../../../lib/UserContext";

interface TileData{
  tileColor: string,
  position: {
    row: number | null,
    column: number | null
  }
}

const Tile: React.FC<TileData> = ({tileColor, position}:TileData) => {
  const {lastMove, stats, moves, board, setBoard, closestColor}:any = useContext(UserContext);
  const [color, setColor] = useState<string>('0,0,0')
  const [mouseOver, setMouseOver] = useState<boolean>(false)
  const [affected, setAffected] = useState<boolean>(false)

  useEffect(()=>{
    setColor(tileColor)
  }, [tileColor])

  const updateColor = (oldColor:string, srcColor:string, numerator:number, denominator:number) => {
    console.log(numerator, denominator)
    const percentage:number = numerator/denominator
    const newColor:string = (srcColor.split(',')).map((number:string, index) => {
      //number cannot exceed 225
      return Math.min(Math.round(parseInt(number) * percentage) + parseInt(oldColor.split(',')[index]), 225)
    }).join();
    //update tile color visually, update board in state
    setColor(newColor)
    const newBoard:any[] = [...board]
    if(position.row !==null && position.column !== null){
      newBoard[position.row][position.column] = newColor
      setBoard(newBoard)
    }
  }  

  useEffect(()=> {
      //top/bottom position is equal to column number OR right/left position is equal to row number
      const srcPosition:number = parseInt(lastMove.split('-')[1])
      const direction:string = lastMove.split('-')[0]
      const srcColor:string = lastMove.split('-')[2]
      if((direction === 'top' || direction === 'bottom') && srcPosition === position.column ){
        const tilePosition:number = position.row ? position.row + 1 : 1
        const numerator:number = direction === 'bottom' ? tilePosition : (stats.height - tilePosition) + 1
        const denominator:number = stats.height + 1
        updateColor(color, srcColor, numerator, denominator)
        setAffected(true)
      }
      if((direction === 'right' || direction === 'left') && srcPosition === position.row){
        const tilePosition:number = position.column ? position.column + 1 : 1
        const numerator:number = direction === 'right' ? tilePosition : (stats.width - tilePosition) + 1
        const denominator:number = stats.width + 1
        updateColor(color, srcColor, numerator, denominator)
        setAffected(true)
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMove])

  return(
    <div 
      className={`w-7 relative h-7 block rounded-[4px] border-[2px]
        ${(position.row !== null && closestColor === color && moves > 0) || (moves === 0 && position.row === 0 && position.column === 0) ? ' border-red-600 ' : ' border-[#C0C0C0] '}
        ${position.row !== null && moves > 2 ? 'cursor-pointer' : ''}`}
      style={{background: 'rgb('+color+')'}}
      onMouseOver={()=>setMouseOver(true)}
      onMouseLeave={()=>setMouseOver(false)}
    >
      {mouseOver && (
        <div className="tooltip z-10 text-xs absolute bg-gray-300 text-black rounded-[1px] opacity-90 shadow-md top-[26px] left-1/2 p-[3px]">
          <p>{tileColor}</p>
        </div>
      )}
    </div>
  )
}

export default Tile;