import React, { useEffect, useState } from 'react';
import './App.css';
import UserInfo from './components/UserInfo';
import { InitialData } from './types/InitialData';
import UserContext from './lib/UserContext';
import Board from './components/Board';
import { InitialSourceMap } from './types/SourceMap';
import getDelta from './lib/getDelta';

function App() {
  const [moves, setMoves] = useState<number>(0)
  const [lastMove, setLastMove] = useState<string>('')
  const [board, setBoard] = useState<any[]>([])
  const [closestColor, setClosestColor] = useState<string>('0,0,0')
  const [delta, setDelta] = useState<number>(1)
  const [sourceMap, setSourceMap] = useState<InitialSourceMap>({top:[], bottom:[], left:[], right:[]})
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
    fetch('http://localhost:9876/init',{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => response.json())
    .then((data:InitialData) => {
      setStats({...data, color: `rgb(${data.target.join()})` })
      const newDelta = getDelta(data.target.join(), closestColor)
      setDelta(newDelta)
    })
    .catch(error => {
      // Handle any errors
      console.log("something went wrong", error)
    });
  }, [])

  return (
    <UserContext.Provider value={{
      stats,
      moves,
      setMoves,
      board,
      setBoard,
      sourceMap,
      setSourceMap,
      lastMove,
      setLastMove,
      closestColor,
      setClosestColor,
      delta,
      setDelta
    }}>
      <div className='max-w-wrapper mx-auto p-12'>
        <UserInfo />
        <Board />
      </div>
    </UserContext.Provider>
  );
}

export default App;
