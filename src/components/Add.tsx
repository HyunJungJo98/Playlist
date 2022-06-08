import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Playlist, PlaylistList } from '../interface/Palylist';
import { DragAndDrop } from '../util/DragAndDrop';
import { LocalStorage } from '../util/LocalStorage';
import Search from './Search';

const Add: React.FC = () => {
  const { id } = useParams();
  const titleRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string[]>([]);
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
    const newPalylistList: PlaylistList = {
      title: playlistTitle,
      palylist: playlist,
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

  return (
    <form>
      <Search setPlaylist={setPlaylist} />
      <input
        type="text"
        placeholder="플레이리스트 제목"
        onChange={(e) => setPlaylistTitle(e.target.value)}
        value={playlistTitle}
      />
      <input
        type="text"
        placeholder="노래 제목"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        ref={titleRef}
      />
      <input
        type="text"
        placeholder="가수"
        onChange={(e) => setArtist([e.target.value])}
        value={artist}
      />
      <button onClick={addButtonClick}>+</button>
      <button type="submit" onClick={saveButtonClick}>
        저장
      </button>
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
