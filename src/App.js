import React from 'react';
// import LikeButton from './components/LikeButton'
import useMousePosition from './hooks/useMousePosition'
import ReduxTestPage from './redux/ReduxTestPage'
import ReactReduxTestPage from './redux/ReactReduxTestPage'
import RouterTestPage from './react-router'
import './App.css';

function App() {
  // const position = useMousePosition()
  return (
    <div className="App">
      {/* <div>{position.x}</div> */}
      {/* <LikeButton /> */}
      {/* <RouterTestPage /> */}
      {/* <ReduxTestPage /> */}
      <ReactReduxTestPage />
    </div>
  );
}

export default App;
