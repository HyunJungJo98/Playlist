import React, { useEffect, useState } from 'react';

interface Playlist {
  title: string;
}

const Playlist: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  useEffect(() => {
    setPlaylists([{ title: '1' }, { title: '2' }, { title: '3' }]);
  }, []);

  const addClick = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const playlistClick = (e: React.FormEvent) => {
    //상세 페이지로 이동
  };

  return (
    <form>
      <button onClick={addClick}>+ Add playlist</button>
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

export default Playlist;
