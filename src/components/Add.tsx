import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Playlist, PlaylistList } from '../interface/Palylist';
import { DragAndDrop } from '../util/DragAndDrop';
import { LocalStorage } from '../util/LocalStorage';
import Search from './Search';
import style from '../css/Add.module.css';

const Add: React.FC = () => {
  const { id } = useParams();
  const titleRef = useRef<HTMLInputElement>(null);
  const playlistTitleRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string[]>([]);
  const [file, setFile] = useState<FileList | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const local = LocalStorage.getInstance();

  useEffect(() => {
    if (id) {
      const initialPlaylist: PlaylistList[] =
        local.getLocalStorage('playlist_list');

      setPlaylistTitle(initialPlaylist[parseInt(id)].title);
      setPlaylist(initialPlaylist[parseInt(id)].palylist);
    }
  }, []);

  // 노래 추가
  const addButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!title || !artist) {
      return alert('노래 제목과 가수를 입력해주세요');
    }
    const newPlaylist: Playlist = {
      title: title,
      artist: artist,
    };
    setPlaylist((prev) => [...prev, newPlaylist]);
    setTitle('');
    setArtist([]);
    titleRef.current!.focus();
  };

  // 삭제
  const deleteButtonClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setPlaylist((prev) => prev.filter((_, idx) => idx !== index));
  };

  // 현재 플레이리스트 상태 저장
  const saveButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!playlistTitle) {
      return alert('플레이리스트의 이름을 입력해주세요');
    }
    if (playlist.length === 0) {
      return alert('노래를 추가해주세요');
    }
    const initialPlaylist: PlaylistList[] =
      local.getLocalStorage('playlist_list');
    local.saveLocalStorage(
      'playlist_list',
      initialPlaylist.filter((_, index) => index !== parseInt(id!))
    );
    let newPalylistList: PlaylistList = {
      title: playlistTitle,
      palylist: playlist,
      image: imageUrl,
    };

    if (!local.getLocalStorage('playlist_list')) {
      local.saveLocalStorage('playlist_list', [newPalylistList]);
    } else {
      const prevPlaylist = local.getLocalStorage('playlist_list');
      local.saveLocalStorage('playlist_list', [
        newPalylistList,
        ...prevPlaylist,
      ]);
    }
    navigation('/');
  };

  const dragAndDropHandler = new DragAndDrop<Playlist>(playlist, setPlaylist);

  const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    setFile(file);
  };

  const fileDeleteButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFile(null);
    setImageUrl(null);
  };

  useEffect(() => {
    const className = playlistTitleRef.current!.className;
    const imgEl = document.querySelector(`.${className}`) as HTMLInputElement;

    if (file) {
      const formdata_ = new FormData();
      formdata_.append('image', file[0]);
      const reader = new FileReader();
      reader.onload = () => {
        imgEl.style.backgroundImage = `url(${reader.result})`;
        setImageUrl(reader.result!.toString());
      };
      reader.readAsDataURL(file[0]);
    } else {
      imgEl.style.backgroundImage = `none`;
    }
  }, [file]);

  return (
    <form className={style.form}>
      <Search setPlaylist={setPlaylist} />
      <input type="file" id="image" onChange={fileUpload} />
      <label htmlFor="image"></label>
      <button onClick={fileDeleteButtonClick}>삭제</button>
      <input
        type="text"
        placeholder="플레이리스트 제목"
        onChange={(e) => setPlaylistTitle(e.target.value)}
        value={playlistTitle}
        className={style.playlistTitle}
        ref={playlistTitleRef}
      />
      <div className={style.inputArea}>
        <input
          type="text"
          placeholder="노래 제목"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          ref={titleRef}
          className={style.title}
        />

        <input
          type="text"
          placeholder="가수"
          onChange={(e) => setArtist([e.target.value])}
          value={artist}
          className={style.artist}
        />
        <button onClick={addButtonClick} className={style.addButton}>
          +
        </button>
      </div>
      <div>
        <button
          type="submit"
          onClick={saveButtonClick}
          className={style.saveButton}
        >
          저장
        </button>
      </div>
      <ul>
        {playlist.map((item, index) => (
          <li
            draggable
            key={index}
            onDragOver={dragAndDropHandler.dragOverHandler}
            onDragStart={(e) => dragAndDropHandler.dragStartHandler(index, e)}
            onDragEnd={dragAndDropHandler.dragEndHandler}
            onDrop={dragAndDropHandler.dropHandler}
            onDragEnter={(e) => dragAndDropHandler.dragEnterHandler(index, e)}
          >
            {item.title} {item.artist}
            <button onClick={(e) => deleteButtonClick(index, e)}>삭제</button>
          </li>
        ))}
      </ul>
    </form>
  );
};

export default Add;
