import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlaylistList } from '../interface/Palylist';
import { LocalStorage } from '../util/LocalStorage';

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<PlaylistList[]>([]);
  const local = LocalStorage.getInstance();

  useEffect(() => {
    const localStoragePlaylist = local.getLocalStorage('playlist_list');
    if (!localStoragePlaylist) {
      return;
    } else {
      setPlaylists(localStoragePlaylist);
    }
  }, []);

  useEffect(() => {
    local.saveLocalStorage('playlist_list', playlists);
  }, [playlists]);

  const deleteButtonClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setPlaylists((prev) => prev.filter((_, idx) => idx !== index));
      return alert('삭제되었습니다.');
    } else {
      return;
    }
  };

  return (
    <form>
      <Link to="/add">+ Add playlist</Link>
      <ul>
        {playlists.map((playlist, index) => (
          <li key={index}>
            <Link to={`/playlist/${index}`}>{playlist.title}</Link>
            <button onClick={(e) => deleteButtonClick(index, e)}>삭제</button>
          </li>
        ))}
      </ul>
    </form>
  );
};

export default Playlists;
