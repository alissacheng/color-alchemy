import { useState, useContext, useEffect } from "react";
import UserContext from "../../lib/UserContext";
import Tile from "./Tile/index";
import Source from "./Source";
import { InitialSourceMap } from "../../types/SourceMap";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Board: React.FC<any> = () => {
  const { stats, board, setBoard, setSourceMap, sourceMap }:any = useContext(UserContext);

  const initBoard = () => {
    //empty source column
    const sourceColumn:any[]=[];
    const newSource:InitialSourceMap = {top:[], bottom:[], right: [], left:[]}

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
      //add empty new column for source map
      sourceColumn.push('0,0,0')
    }) 
    setBoard(newBoard)
    //create source map
    newSource.top = [...newBoard[0]];
    newSource.bottom = [...newBoard[0]];
    newSource.right=[...sourceColumn]
    newSource.left=[...sourceColumn]
    setSourceMap(newSource)
  }

  useEffect(()=> {
    if(stats.width > 0 && stats.height > 0){
      initBoard()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats])

  return(
    <DndProvider backend={HTML5Backend}>
      <div className="my-12">
        <div className="flex mb-[2px] space-x-[2px]">
          <div className="w-7 h-7 block rounded-[4px]">
          </div>
          {sourceMap.top.map((tileColor:string, index:number)=>{
            return <Source  key={`top source,${index}`} id={'top-'+index}/>
          })}
        </div>
        {board.map((row:any[], rowNum:number)=>{
          return(
            <div className="flex mb-[2px] space-x-[2px]" key={rowNum}>
              {row.map((tileColor:string, colNum)=>{
                return(
                  <>
                    {colNum === 0 && <Source key={`left source,${rowNum}`} id={'left-'+rowNum} />}
                    <Tile tileColor={tileColor} position={{row: rowNum, column: colNum}} key={`${rowNum},${colNum}`} />
                    {colNum === stats.width -1 && <Source key={`right source,${rowNum}`} id={'right-'+rowNum} />}
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
          {sourceMap.bottom.map((tileColor:string, index:number)=>{
            return <Source key={`bottom source,${index}`} id={'bottom-'+index} />
          })}
        </div>
      </div>
    </DndProvider>
  )
}

export default Board;