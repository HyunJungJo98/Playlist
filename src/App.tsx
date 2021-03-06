import './css/App.css';
import Playlists from './components/Playlists';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Add from './components/Add';
import ShowPlaylist from './components/ShowPlaylist';

function App() {
  return (
    <div className="App">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <Router basename={process.env.PUBLIC_URL}>
        <Link to={`/`} style={{ textDecoration: 'none' }}>
          <h1>playlist</h1>
        </Link>
        <Routes>
          <Route path="/" element={<Playlists />} />
          <Route path="/add" element={<Add />} />
          <Route path="/playlist/:id" element={<ShowPlaylist />} />
          <Route path="/modify/:id" element={<Add />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
