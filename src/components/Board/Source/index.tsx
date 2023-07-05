import { useEffect, useState, useContext } from "react";
import UserContext from "../../../lib/UserContext";
import { LastMoveData } from "../../../types/LastMoveData";

interface SourceData{
  id:string,
  setLastMove:(newLastMove:LastMoveData) => void
}

const Source: React.FC<SourceData> = ({id, setLastMove}:SourceData) => {
  const {moves, setMoves }:any = useContext(UserContext);
  const [color, setColor] = useState<string>('0,0,0');
  // const [dragHover, setDragHover] = useState<boolean>(false);

  useEffect(()=> {
    //update last move
    if(moves > 0){
      const direction:string = id.split('-')[0]
      const position:number = parseInt(id.split('-')[1])
      setLastMove({
        direction,
        position,
        color
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color])

  useEffect(()=> {
    if(!moves) setColor("0,0,0");
  }, [moves])

  const newMove = () => {
    if(moves < 3 && color === '0,0,0'){
      if(moves === 0){
        setColor('255,0,0')
      }
      if(moves === 1){
        setColor('0,255,0')
      }
      if(moves === 2){
        setColor('0,0,255')
      }
      setMoves(moves+1)
    }
  }

  const handleDragOver = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // setDragHover(true);
  };

  // const handleDragLeave = () => {
  //   setDragHover(false)
  // };

  const handleDrop = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const color = e.dataTransfer.getData('text/plain');
    setColor(color)
    setMoves(moves+1)
  };

  return(
    <div
      onDragOver={handleDragOver}
      // onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      tabIndex={moves < 3 ? 0 : -1}
      className={`${moves < 3 ? 'cursor-pointer' : ''} w-7 h-7 block rounded-[50%] border-[#C0C0C0] border-2`}
      style={{background: 'rgb(' + color + ')'}}
      onClick={newMove}
      id={id}
    >
    </div>
  )
}
export default Source;