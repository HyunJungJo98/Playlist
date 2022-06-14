import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PlaylistList } from '../interface/Palylist';
import style from '../css/ShowPlaylist.module.css';
import { LocalStorage } from '../util/LocalStorage';

const ShowPlaylist: React.FC = () => {
  const { id } = useParams();
  const local = LocalStorage.getInstance();
  const localStoragePlaylist = local.getLocalStorage('playlist_list')!;
  const thisPlaylist: PlaylistList = localStoragePlaylist[parseInt(id!)];

  return (
    <section className={style.section}>
      <div className={style.playlistTitleArea}>
        <div
          className={style.titleBackground}
          style={{
            backgroundImage: thisPlaylist.image
              ? `url(${thisPlaylist.image})`
              : 'none',
          }}
        ></div>
        <h2>{thisPlaylist.title}</h2>
      </div>

      <div className={style.ModifyButton}>
        <Link to={`/modify/${id}`} style={{ textDecoration: 'none' }}>
          수정
        </Link>
      </div>

      <ul className={style.playlists}>
        {thisPlaylist.palylist.map((playlist, index) => (
          <li key={index} className={style.playlist}>
            <div className={style.title}>{playlist.title} </div>
            <div className={style.artist}>&nbsp;-&nbsp;{playlist.artist}</div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ShowPlaylist;
