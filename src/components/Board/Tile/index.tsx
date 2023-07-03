import { useEffect, useState, useContext } from "react";
import UserContext from "../../../lib/UserContext";
import { LastMoveData } from "../../../types/LastMoveData";

interface TileData{
  color: string,
  position: {
    row: number,
    column: number
  } | null,
  lastMove: LastMoveData | null
}

const Tile: React.FC<TileData> = ({color, position, lastMove}:TileData) => {
  const {stats, moves, board, setBoard, closestColor}:any = useContext(UserContext);
  const [isDrag, setIsDrag] = useState<boolean>(false);

  const updateColor = (oldColor:string, sourceColor:string, numerator:number, denominator:number) => {
    //calculate percentage
    const percentage:number = numerator/denominator
    //calculate new color
    const newColor:string = (sourceColor.split(',')).map((number:string, index) => {
      //number cannot exceed 255
      return Math.min(Math.round(parseInt(number) * percentage) + parseInt(oldColor.split(',')[index]), 255)
    }).join();
    //update board with new color
    const newBoard:any[] = [...board]
    if(position)
      newBoard[position.row][position.column] = newColor;
      setBoard(newBoard);
  }  

  useEffect(()=> {
      if(lastMove && position){
        //top/bottom position is equal to column number OR right/left position is equal to row number
        const direction:string = lastMove.direction
        //check if tile is affected, if so update the tile's color
        if((direction === 'top' || direction === 'bottom') && lastMove.position === position.column ){
          const tilePosition:number = position.row ? position.row + 1 : 1
          const numerator:number = direction === 'bottom' ? tilePosition : (stats.height - tilePosition) + 1
          const denominator:number = stats.height + 1
          updateColor(color, lastMove.color, numerator, denominator)
        }
        if((direction === 'right' || direction === 'left') && lastMove.position === position.row){
          const tilePosition:number = position.column ? position.column + 1 : 1
          const numerator:number = direction === 'right' ? tilePosition : (stats.width - tilePosition) + 1
          const denominator:number = stats.width + 1
          updateColor(color, lastMove.color, numerator, denominator)
        }
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMove])

  const handleDragStart = (e:React.DragEvent<HTMLDivElement>) => {
    setIsDrag(true)
    e.dataTransfer.setData('text/plain', color);
  };

  const handleDragEnd = () => {
    setIsDrag(false)
  };

  return(
    <div
      draggable={moves > 2 && position ? true : false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`w-7 relative tile h-7 block rounded-[4px] border-[2px]
        ${(position && closestColor === color && moves > 0) || (moves === 0 && position?.row === 0 && position.column === 0) 
          ? ' border-red-600 ' : ' border-[#C0C0C0] '}
        ${position && moves > 2 ? 'cursor-pointer' : ''}`}
      style={{background: 'rgb('+color+')'}}
    >
      {!isDrag && (
        <div className="hidden tooltip z-10 text-xs absolute bg-gray-300 text-black rounded-[1px] opacity-90 shadow-md top-[26px] left-1/2 p-[3px]">
          <p>{color}</p>
        </div>
      )}
    </div>
  )
}

export default Tile;