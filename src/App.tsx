import React from 'react';
import './css/App.css';
import Search from './components/Search';
import Playlist from './components/Playlist';

function App() {
  return (
    <div className="App">
      <main>playlist</main>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <Playlist />
    </div>
  );
}

export default App;
