import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PlaylistList } from '../interface/Palylist';

const ShowPlaylist: React.FC = () => {
  const { id } = useParams();
  const localStoragePlaylist = localStorage.getItem('playlist_list')!;
  const parseLocalStoragePlaylist = JSON.parse(localStoragePlaylist);
  const thisPlaylist: PlaylistList = parseLocalStoragePlaylist[parseInt(id!)];

  return (
    <section>
      <h2>{thisPlaylist.title}</h2>
      <Link to={`/modify/${id}`} style={{ textDecoration: 'none' }}>
        수정
      </Link>
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
