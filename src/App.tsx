import React, { useEffect, useState } from 'react';
import './App.css';
import UserInfo from './components/UserInfo';
import { InitialData } from './types/InitialData';
import UserContext from './lib/UserContext';

function App() {
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
    })
    .catch(error => {
      // Handle any errors
      console.log("something went wrong", error)
    });
  }, [])

  return (
    <UserContext.Provider value={{stats}}>
      <UserInfo />
    </UserContext.Provider>
  );
}

export default App;
