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

const Tile: React.FC<TileData> = ({color, position, lastMove}: TileData) => {
  const {stats, moves, gameboard, setGameboard, closestColor}: any = useContext(UserContext);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [colorMix, setColorMix] = useState<any[]>([])

  const updateGameboard = (
    newColor: string
  ) => {
    const newGameboard: any[] = [...gameboard]
    if(position) {
      newGameboard[position.row][position.column] = newColor;
    }
    setGameboard(newGameboard);
  }

  const addNewColor = (
    oldColor: string,
    sourceColor: string, 
    numerator: number, 
    denominator: number
  ) => {
    const percentage: number = numerator/denominator
    const newColor = (sourceColor.split(',')).map((number: string, index) => {
      //number cannot exceed 255
      return Math.min(Math.round(parseInt(number) * percentage) + parseInt(oldColor.split(',')[index]), 255)
    }).join();
    return newColor;
  }

  const erasePastColor = (oldColor: string): { color: string; index: number } | any => {
    colorMix.forEach((mix: any, index)=>{
      if(mix.position === lastMove?.position && mix.direction === lastMove?.direction){
        const newColor = (oldColor.split(',')).map((number:string, index) => {
          //get the added value from the old source and remove it
          const oldSourceAddition:number = (parseInt(mix.newColor.split(',')[index]) - parseInt(mix.oldColor.split(',')[index]))
          return parseInt(number) - oldSourceAddition
        }).join();
        return {newColor, index}
      }
    })
  }

  const updateColor = (
    oldColor: string, 
    sourceColor: string, 
    numerator: number, 
    denominator: number
  ) => {
    let newColor: string = '0,0,0'
    const newColorMix: any[] = [...colorMix]
    if(sourceColor === '0,0,0'){
      //remove affects of old color source if new color source is black
      const pastColorData: {color: string, index: number} = erasePastColor(oldColor);
      newColor = pastColorData.color
      newColorMix.splice(pastColorData.index, 1)
    } else {
      //add new color from new color source
      newColor = addNewColor(oldColor, sourceColor, numerator, denominator);
      const colorMixData: {} = {...lastMove, oldColor, newColor}
      newColorMix.push(colorMixData)
    }
    //update state with color mix that was created or removed
    setColorMix(newColorMix);
    //update gameboard with new color
    updateGameboard(newColor);
  } 

  const updateTile = (
    direction: string,
    dimension: string,
    position: number,
    color: string,
    stats: { width: number; height: number }
  ) => {
    const tilePosition: number = position + 1;
    const numerator: number =
      (direction === 'bottom' || direction === 'right')
        ? tilePosition
        : (stats[dimension as keyof typeof stats] - tilePosition) + 1;
    const denominator: number = stats[dimension as keyof typeof stats] + 1;
    if(lastMove) updateColor(color, lastMove.color, numerator, denominator);
  }

  useEffect(() => {
    if (lastMove && position) {
      //check if tile is affected by latest move from user, if so, update the tile
      if (
        (lastMove.direction === 'top' || lastMove.direction === 'bottom') &&
        lastMove.position === position.column
      ) {
        updateTile(lastMove.direction, 'height', position.row, color, stats);
      }
      if (
        (lastMove.direction === 'right' || lastMove.direction === 'left') &&
        lastMove.position === position.row
      ) {
        updateTile(lastMove.direction, 'width', position.column, color, stats);
      }
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMove])

  const handleDragStart = (e:React.DragEvent<HTMLDivElement>) => {
    setIsDrag(true)
    e.dataTransfer.setData('text/plain', color);
  }

  const handleDragEnd = () => {
    setIsDrag(false)
  }

  return(
    <div
      draggable={moves > 2 && position ? true : false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`w-7 relative tile h-7 block rounded-[4px] border-[2px]
        ${(position && closestColor === color && closestColor !== '0,0,0' && moves > 0) || 
          (moves === 0 && position?.row === 0 && position.column === 0) 
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