import React, { useEffect, useState } from 'react';
import './App.css';
import UserInfo from './components/UserInfo';
import UserContext from './lib/UserContext';
import Board from './components/Board';
// import { InitialSourceMap } from './types/SourceMap';
import { InitialData } from './types/InitialData';

const App: React.FC = () => {
  const [moves, setMoves] = useState<number>(0)
  const [lastMove, setLastMove] = useState<string>('')
  const [board, setBoard] = useState<any[]>([])
  const [closestColor, setClosestColor] = useState<string>('0,0,0')
  // const [sourceMap, setSourceMap] = useState<InitialSourceMap>({top:[], bottom:[], left:[], right:[]})
  const [stats, setStats] = useState<InitialData>({
    userId: '',
    width: 0,
    height: 0,
    maxMoves: 0,
    target: [],
    color: ''
  }
);

  return (
    <UserContext.Provider value={{
      stats,
      setStats,
      moves,
      setMoves,
      board,
      setBoard,
      lastMove,
      setLastMove,
      closestColor,
      setClosestColor,
    }}>
      <div className='max-w-wrapper mx-auto p-12'>
        <UserInfo />
        <Board />
      </div>
    </UserContext.Provider>
  );
}

export default App;
