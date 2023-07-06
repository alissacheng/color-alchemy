import React, { useState } from 'react';
import './App.css';
import UserInfo from './components/UserInfo';
import UserContext from './lib/UserContext';
import { InitialData } from './types/InitialData';
import Gameboard from './components/Gameboard';
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './components/ErrorFallback';

const App: React.FC = () => {
  const [moves, setMoves] = useState<number>(0);
  const [gameboard, setGameboard] = useState<any[]>([]);
  const [closestColor, setClosestColor] = useState<string>('0,0,0');
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
        gameboard,
        setGameboard,
        closestColor,
        setClosestColor,
      }}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className='max-w-wrapper mx-auto p-6'>
            <UserInfo />
            <Gameboard />
          </div>
        </ErrorBoundary>
      </UserContext.Provider>
  );
}

export default App;
