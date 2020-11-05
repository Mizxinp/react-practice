import React from 'react';
// import LikeButton from './components/LikeButton'
import useMousePosition from './hooks/useMousePosition'
import ReduxPage from './redux/ReduxPage'
import './App.css';

function App() {
  const position = useMousePosition()
  return (
    <div className="App">
      {/* <div>{position.x}</div> */}
      {/* <LikeButton /> */}
      <ReduxPage />
    </div>
  );
}

export default App;