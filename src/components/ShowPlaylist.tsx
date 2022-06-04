import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistList } from '../interface/Palylist';

const ShowPlaylist: React.FC = () => {
  const { id } = useParams();
  const localStoragePlaylist = localStorage.getItem('playlist_list')!;
  const parseLocalStoragePlaylist = JSON.parse(localStoragePlaylist);
  const thisPlaylist: PlaylistList = parseLocalStoragePlaylist[parseInt(id!)];

  useEffect(() => {
    console.log(thisPlaylist);
  }, []);

  return (
    <section>
      <h2>{thisPlaylist.title}</h2>
      <ul>
        {thisPlaylist.palylist.map((playlist, index) => (
          <li key={index}>
            {playlist.title} - {playlist.artist}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ShowPlaylist;
