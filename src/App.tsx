import React from 'react';
import './css/App.css';
import Search from './components/Search';
import Playlists from './components/Playlists';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Add from './components/Add';

function App() {
  return (
    <div className="App">
      <main>playlist</main>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <Router>
        <Routes>
          <Route path="/" element={<Playlists />} />
          <Route path="/add" element={<Add />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
