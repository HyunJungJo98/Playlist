import React, { useState } from 'react';
import { Playlist } from '../interface/Palylist';

const Add: React.FC = () => {
  const [palylist, setPalylist] = useState<Playlist[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');

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
  };

  // 삭제
  const deleteButtonClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(index);
    setPalylist((prev) => prev.filter((p, idx) => idx !== index));
  };

  // 현재 플레이리스트 상태 저장
  const saveButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
