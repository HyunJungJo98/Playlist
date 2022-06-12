import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlaylistList } from '../interface/Palylist';
import { DragAndDrop } from '../util/DragAndDrop';
import { LocalStorage } from '../util/LocalStorage';
import { confirm } from '../util/confirm';
import style from '../css/Playlists.module.css';

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<PlaylistList[]>([]);
  const playlistRef = useRef<HTMLLIElement>(null);
  const local = LocalStorage.getInstance();
  const navgation = useNavigate();

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

    confirm(() => onConfirm(index), onCancel, '정말 삭제하시겠습니까?');
  };

  const onConfirm = (index: number) => {
    setPlaylists((prev) => prev.filter((_, idx) => idx !== index));
    return alert('삭제되었습니다.');
  };

  const onCancel = () => {
    return;
  };

  const dragAndDropHandler = new DragAndDrop<PlaylistList>(
    playlists,
    setPlaylists
  );

  const titleClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    navgation(`/playlist/${index}`);
  };

  const playlistHover = (
    file: string | null,
    _: React.MouseEvent<HTMLLIElement>
  ) => {
    const className = playlistRef.current!.className;
    const imgEl = document.querySelector(`.${className}`) as HTMLInputElement;
    if (file) {
      imgEl.style.backgroundImage = `url(${file})`;
      imgEl.style.opacity = '0.5';
    }
  };

  const playlistMouseLeave = (e: React.MouseEvent) => {
    const className = playlistRef.current!.className;
    const imgEl = document.querySelector(`.${className}`) as HTMLInputElement;

    imgEl.style.backgroundImage = `none`;
  };
  return (
    <form className={style.form}>
      <div className={style.AddButton}>
        <Link to="/add">+ Add playlist</Link>
      </div>
      <ul className={style.playlists}>
        {playlists.map((playlist, index) => (
          <li
            draggable
            key={index}
            onDragOver={dragAndDropHandler.dragOverHandler}
            onDragStart={(e) => dragAndDropHandler.dragStartHandler(index, e)}
            onDragEnd={dragAndDropHandler.dragEndHandler}
            onDrop={dragAndDropHandler.dropHandler}
            onDragEnter={(e) => dragAndDropHandler.dragEnterHandler(index, e)}
            className={style.playlist}
            ref={playlistRef}
            onMouseOver={(e) => playlistHover(playlist.image, e)}
            onMouseLeave={playlistMouseLeave}
          >
            <div onClick={(e) => titleClick(index, e)} className={style.title}>
              {playlist.title}
            </div>
            <button
              onClick={(e) => deleteButtonClick(index, e)}
              className={style.deleteButton}
            ></button>
          </li>
        ))}
      </ul>
    </form>
  );
};

export default Playlists;
