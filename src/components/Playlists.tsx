import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Playlist } from '../interface/Palylist';

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  useEffect(() => {
    //setPlaylists([{ title: '1', artist: '1', id: 1 }]);
  }, []);

  const playlistClick = (e: React.FormEvent) => {
    //상세 페이지로 이동
  };

  return (
    <form>
      <Link to="/add">+ Add playlist</Link>
      <ul>
        {playlists.map((playlist, index) => (
          <li onClick={playlistClick} key={index}>
            {playlist.title}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default Playlists;
