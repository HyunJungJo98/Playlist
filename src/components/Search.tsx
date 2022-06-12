import React, { useEffect, useState } from 'react';
import {
  SpotifySearchTrack,
  Track,
  SpotifySearchAlbumName,
  Album,
  SpotifySearchAlbumTrack,
} from '../interface/Spotify';
import { LocalStorage } from '../util/LocalStorage';
import { Playlist } from '../interface/Palylist';
import { api } from '../api/api';
import { confirm } from '../util/confirm';

interface SearchProps {
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

type Search = 'tracks' | 'album';

const Search: React.FC<SearchProps> = ({ setPlaylist }) => {
  const [token, setToken] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedOption, setSeletedOption] = useState<Search>('tracks');
  const local = LocalStorage.getInstance();

  useEffect(() => {
    if (local.getLocalStorage('token')) {
      setToken(local.getLocalStorage('token'));
    }
  }, []);

  const login = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await api.getToken();

    //401일 때 재발급하기
    console.log(result.status);

    setToken(result.data.access_token);
    local.saveLocalStorage('token', result.data.access_token);
  };

  const searchSpotify = (e: React.MouseEvent) => {
    if (selectedOption === 'tracks') {
      searchTracks(e);
    } else {
      searchAlbum(e);
    }
  };

  // 노래 제목 검색
  const searchTracks = async (e: React.MouseEvent) => {
    e.preventDefault();
    const data = await api.searchTrack<SpotifySearchTrack>(
      searchKey,
      token,
      'track'
    );

    const tracks = data.data.tracks.items;

    let newTracks: Track[] = [];

    tracks.map((track) => {
      const newTrack: Track = {
        title: track.name,
        artists: track.artists,
        albumImages: track.album.images,
      };
      newTracks.push(newTrack);
    });
    setTracks(newTracks);
  };

  // 앨범 제목 검색
  const searchAlbum = async (e: React.MouseEvent) => {
    e.preventDefault();
    const data = await api.searchTrack<SpotifySearchAlbumName>(
      searchKey,
      token,
      'album'
    );

    const albums = data.data.albums.items;

    let newAlbums: Album[] = [];

    albums.map((album) => {
      const newAlbum: Album = {
        id: album.id,
        images: album.images,
        artists: album.artists,
        name: album.name,
      };
      newAlbums.push(newAlbum);
    });
    setAlbums(newAlbums);
  };

  // 클릭한 트랙 플레이리스트에 추가
  const trackClick = (index: number, _: React.MouseEvent) => {
    let artist: string[] = [];
    tracks[index].artists.map((arti) => artist.push(arti.name));

    const newPlaylist: Playlist = {
      title: tracks[index].title,
      artist: artist,
    };
    setPlaylist((prev) => [...prev, newPlaylist]);
  };

  const logout = () => {
    setToken('');
    local.removeLocalStorage('token');
  };

  // 클릭한 앨범에 들어있는 트랙 검색
  const AlbumClick = (index: number, _: React.MouseEvent) => {
    confirm(
      () => onConfirm(index),
      onCancel,
      '앨범 전체 트랙을 추가하시겠습니까?'
    );
  };

  const onConfirm = async (index: number) => {
    const id = albums[index].id;

    const data = await api.searchAlbumTrack<SpotifySearchAlbumTrack>(id, token);

    const tracks = data.data.items;

    // 앨범 전체 트랙 추가
    let newTracks: Playlist[] = [];

    tracks.map((track) => {
      let artist: string[] = [];
      track.artists.map((arti) => artist.push(arti.name));
      const newPlaylist: Playlist = {
        title: track.name,
        artist: artist,
      };
      newTracks.push(newPlaylist);
    });

    console.log(newTracks);

    setPlaylist((prev) => prev.concat(newTracks));
  };

  const onCancel = () => {
    return;
  };

  const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'tracks' || value === 'album') {
      setSeletedOption(value);
    }
  };

  return (
    <div>
      {!token ? (
        <button onClick={login}>login</button>
      ) : (
        <>
          <button onClick={logout}>logout</button>
          <select onChange={selectHandler} value={selectedOption}>
            <option value="tracks">노래 제목</option>
            <option value="album">앨범 전체 추가</option>
          </select>
          <div>
            <input
              type="text"
              onChange={(e) => setSearchKey(e.target.value)}
              value={searchKey}
            />
            <button onClick={searchSpotify}>Search</button>
          </div>
        </>
      )}
      <ul style={{ height: '10px', overflow: 'auto' }}>
        {selectedOption === 'tracks'
          ? tracks.map((track, index) => (
              <li key={index} onClick={(e) => trackClick(index, e)}>
                <img src={track.albumImages[2].url}></img>
                <span>{track.title}</span> -
                {track.artists.map((artist, index) => (
                  <span key={index}>{artist.name}</span>
                ))}
              </li>
            ))
          : albums.map((album, index) => (
              <li key={index} onClick={(e) => AlbumClick(index, e)}>
                <img src={album.images[2].url}></img>
                <span>{album.name}</span> -
                {album.artists.map((artist, index) => (
                  <span key={index}>{artist.name}</span>
                ))}
              </li>
            ))}
      </ul>
    </div>
  );
};

export default Search;
