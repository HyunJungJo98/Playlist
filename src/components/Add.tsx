import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Playlist, PlaylistList } from '../interface/Palylist';
import { LocalStorage } from '../util/LocalStorage';

const Add: React.FC = () => {
  const { id } = useParams();
  const titleRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>();
  const local = LocalStorage.getInstance();

  useEffect(() => {
    if (id) {
      const initialPlaylist: PlaylistList[] =
        local.getLocalStorage('playlist_list');

      local.saveLocalStorage(
        'playlist_list',
        initialPlaylist.filter((_, index) => index !== parseInt(id))
      );
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
    setArtist('');
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
    const newPalylistList: PlaylistList = {
      title: playlistTitle,
      palylist: playlist,
    };
    if (!local.getLocalStorage('playlist_list')) {
      local.saveLocalStorage('playlist_list', [newPalylistList]);
    } else {
      const prevPlaylist = local.getLocalStorage('playlist_list');
      local.saveLocalStorage('playlist_list', [
        ...prevPlaylist,
        newPalylistList,
      ]);
    }
    navigation('/');
  };

  // 드래그 핸들러
  const dragOverHandler = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const dragStartHandler = (
    index: number,
    e: React.DragEvent<HTMLLIElement>
  ) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const dragEndHandler = (e: React.DragEvent<HTMLLIElement>) => {
    e.dataTransfer.dropEffect = 'move';
  };

  const dropHandler = (e: React.DragEvent<HTMLLIElement>) => {
    const dragItemIndex = +e.dataTransfer.getData('text/plain');
    let _playlist = [...playlist];
    const dragItem = _playlist[dragItemIndex];

    _playlist.splice(dragItemIndex, 1);
    _playlist.splice(draggedItemIndex!, 0, dragItem);

    setPlaylist(_playlist);
    setDraggedItemIndex(null);
  };

  const dragEnterHandler = (
    index: number,
    _: React.DragEvent<HTMLLIElement>
  ) => {
    setDraggedItemIndex(index);
  };

  return (
    <form>
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
        onChange={(e) => setArtist(e.target.value)}
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
            onDragOver={dragOverHandler}
            onDragStart={(e) => dragStartHandler(index, e)}
            onDragEnd={dragEndHandler}
            onDrop={dropHandler}
            onDragEnter={(e) => dragEnterHandler(index, e)}
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
