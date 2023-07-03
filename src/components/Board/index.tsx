import { useState, useContext, useEffect } from "react";
import UserContext from "../../lib/UserContext";
import Tile from "./Tile/index";
import Source from "./Source";
import { LastMoveData } from "../../types/LastMoveData";

const Board: React.FC = () => {
  const { stats, board, setBoard }:any = useContext(UserContext);
  const [lastMove, setLastMove] = useState<LastMoveData | null>({direction:'', position:0, color: ''});

  const initBoard = () => {
     //Create board, height = row, width = columns
    const newBoard:any[] = [];
    ([...Array(stats.height)]).forEach((row:any, index)=>{
      //create rows
      const newRow:any[] = []
      for (var i = 0; i < stats.width; i++) {
        newRow.push('0,0,0');
      }
      //combine all rows
      newBoard.push(newRow)
    }) 
    setBoard(newBoard)
  }

  useEffect(()=> {
    if(stats.width > 0 && stats.height > 0){
      initBoard()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats])

  return(
    <div className="my-12">
      <div className="flex mb-[2px] space-x-[2px]">
        <div className="w-7 h-7 block rounded-[4px]">
        </div>
        {([...Array(stats.width)]).map((emty:any, index:number)=>{
          return (
            <Source 
              key={`top source,${index}`} 
              id={'top-'+index}
              setLastMove={setLastMove}
            />
          )
        })}
      </div>
      {board.map((row:any[], rowNum:number)=>{
        return(
          <div className="flex mb-[2px] space-x-[2px]" key={rowNum}>
            {row.map((tileColor:string, colNum)=>{
              return(
                <>
                  {colNum === 0 && (
                    <Source 
                      key={`left source,${rowNum}`} 
                      id={'left-'+rowNum}
                      setLastMove={setLastMove}
                    />
                  )}
                  <Tile color={tileColor} position={{row: rowNum, column: colNum}} key={`${rowNum},${colNum}`} lastMove={lastMove} />
                  {colNum === stats.width -1 && (
                    <Source 
                      key={`right source,${rowNum}`} 
                      id={'right-'+rowNum}
                      setLastMove={setLastMove}
                    />
                  )}
                </>
              )
            })}
          </div>
          )
        })
      }
      <div className="flex mb-[2px] space-x-[2px]">
        <div className="w-7 h-7 block rounded-[4px]">
        </div>
        {([...Array(stats.width)]).map((emty:any, index:number)=>{
          return (
            <Source 
              key={`bottom source,${index}`} 
              id={'bottom-'+index}
              setLastMove={setLastMove}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Board;