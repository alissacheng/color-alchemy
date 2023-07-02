import { useEffect, useState, useContext } from "react";
import UserContext from "../../../lib/UserContext";
import { InitialSourceMap } from "../../../types/SourceMap";

interface SourceData{
  id:string
}

const Source: React.FC<SourceData> = ({id}:SourceData) => {
  const {moves, setMoves, setSourceMap, sourceMap, setLastMove}:any = useContext(UserContext);
  const [color, setColor] = useState<string>('0,0,0')

  useEffect(()=> {
    //update source map eveery time color changes
    if(moves > 0){
      const direction:string = id.split('-')[0]
      const position:number = parseInt(id.split('-')[1])
      const newSourceMap:InitialSourceMap = {...sourceMap}
      newSourceMap[direction as keyof typeof newSourceMap][position] = color
      setSourceMap(newSourceMap)
      setLastMove(id + '-' + color)
      // console.log(direction, position, newSourceMap)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color])

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
  return(
    <button 
      className="w-7 h-7 block rounded-[50%] border-[#C0C0C0] border-2"
      style={{background: 'rgb(' + color + ')'}}
      onClick={newMove}
      disabled={moves < 3 && color === '0,0,0' ? false : true}
    >
    </button>
  )
}
export default Source;