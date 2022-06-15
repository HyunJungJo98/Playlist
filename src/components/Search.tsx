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
import style from '../css/Search.module.css';
import { AxiosError } from 'axios';

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
    if (result.status === 401) {
      local.removeLocalStorage('token');
    }

    setToken(result.data.access_token);
    local.saveLocalStorage('token', result.data.access_token);
  };

  const searchSpotify = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
    if (selectedOption === 'tracks') {
      searchTracks(e.target.value);
    } else {
      searchAlbum(e.target.value);
    }
  };

  // 검색 버튼 눌렀을 때
  const searchSpotifyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedOption === 'tracks' && searchKey) {
      searchTracks(searchKey);
    } else if (selectedOption === 'album' && searchKey) {
      searchAlbum(searchKey);
    }
  };

  // 노래 제목 검색
  const searchTracks = async (searchKey: string) => {
    // e.preventDefault();
    if (searchKey) {
      try {
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
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.response!.status === 401) {
            local.removeLocalStorage('token');
            setToken('');
          }
        }
      }
    }
  };

  // 앨범 제목 검색
  const searchAlbum = async (searchKey: string) => {
    //e.preventDefault();

    if (searchKey) {
      try {
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
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.response!.status === 401) {
            local.removeLocalStorage('token');
            setToken('');
          }
        }
      }
    }
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

  // 검색 창 닫기
  const searchCancelButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTracks([]);
    setAlbums([]);
  };

  // 로그아웃
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

  // 노래 제목 / 앨범 선택
  const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'tracks' || value === 'album') {
      setSeletedOption(value);
    }
  };

  return (
    <section className={style.section}>
      {!token ? (
        <section className={style.loginSection}>
          <span>Spotify에서 노래 찾기</span>
          <button onClick={login} className={style.loginButton}>
            login
          </button>
        </section>
      ) : (
        <section className={style.searchSection}>
          <select onChange={selectHandler} value={selectedOption}>
            <option value="tracks">노래 제목</option>
            <option value="album">앨범 전체 추가</option>
          </select>

          <input
            type="text"
            onChange={searchSpotify}
            placeholder={selectedOption == 'tracks' ? '노래 검색' : '앨범 검색'}
          />
          <button className={style.searchButton} onClick={searchSpotifyClick}>
            Search
          </button>

          <button onClick={logout} className={style.logoutButton}>
            logout
          </button>
        </section>
      )}
      <div
        style={{
          display:
            (tracks.length === 0 && albums.length === 0) || !token
              ? 'none'
              : 'block',
        }}
        className={style.closeButton}
      >
        <button onClick={searchCancelButtonClick}> X </button>
      </div>
      <ul
        className={style.resultList}
        style={{
          display:
            (tracks.length === 0 && albums.length === 0) || !token
              ? 'none'
              : 'block',
        }}
      >
        {selectedOption === 'tracks'
          ? tracks.map((track, index) => (
              <li key={index} onClick={(e) => trackClick(index, e)}>
                <img
                  src={track.albumImages[2].url}
                  className={style.albumImage}
                ></img>
                <div className={style.title}>{track.title}</div>
                {track.artists.map((artist, index) => (
                  <div key={index} className={style.artist}>
                    &nbsp;-&nbsp;{artist.name}
                  </div>
                ))}
              </li>
            ))
          : albums.map((album, index) => (
              <li key={index} onClick={(e) => AlbumClick(index, e)}>
                <img
                  src={album.images[2].url}
                  className={style.albumImage}
                ></img>
                <div className={style.title}>{album.name}</div>
                {album.artists.map((artist, index) => (
                  <div key={index} className={style.artist}>
                    &nbsp;-&nbsp;{artist.name}
                  </div>
                ))}
              </li>
            ))}
      </ul>
    </section>
  );
};

export default Search;
