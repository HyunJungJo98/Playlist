import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Playlist, PlaylistList } from '../interface/Palylist';
import { LocalStorage } from '../util/LocalStorage';

const Add: React.FC = () => {
  const titleRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigate();
  const [palylist, setPalylist] = useState<Playlist[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const local = LocalStorage.getInstance();

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
    setPalylist((prev) => [...prev, newPlaylist]);
    setTitle('');
    setArtist('');
    titleRef.current!.focus();
  };

  // 삭제
  const deleteButtonClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setPalylist((prev) => prev.filter((p, idx) => idx !== index));
  };

  // 현재 플레이리스트 상태 저장
  const saveButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!playlistTitle) {
      return alert('플레이리스트의 이름을 입력해주세요');
    }
    if (!palylist) {
      return alert('노래를 추가해주세요');
    }
    const newPalylistList: PlaylistList = {
      title: playlistTitle,
      palylist: palylist,
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
        {palylist.map((item, index) => (
          <li key={index}>
            {item.title} {item.artist}
            <button onClick={(e) => deleteButtonClick(index, e)}>삭제</button>
          </li>
        ))}
      </ul>
    </form>
  );
};

export default Add;
