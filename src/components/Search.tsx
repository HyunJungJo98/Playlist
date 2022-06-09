import React, { useState } from 'react';
import axios from 'axios';
import {
  SpotifySearchTrack,
  Track,
  SpotifySearchAlbumName,
  Album,
  SpotifySearchAlbumTrack,
} from '../interface/Spotify';
import { LocalStorage } from '../util/LocalStorage';
import { Playlist } from '../interface/Palylist';

const CLIENT_ID = '2543d212fb8146d38d983f6543891b56';
const CLIENT_SECRET = '7e8183ba686840959829a2f82aefee6c';

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

  const login = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
        },
      }
    );

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
    const data = await axios.get<SpotifySearchTrack>(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: 'track',
        },
      }
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
    const data = await axios.get<SpotifySearchAlbumName>(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: 'album',
        },
      }
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

  // 클릭한 앨범의 모든 트랙들 추가
  const AlbumClick = async (index: number, _: React.MouseEvent) => {
    if (window.confirm('앨범 전체 트랙을 추가하시겠습니까?')) {
      const id = albums[index].id;

      const data = await axios.get<SpotifySearchAlbumTrack>(
        `https://api.spotify.com/v1/albums/${id}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: id,
          },
        }
      );

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
    } else {
      return;
    }
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
      <ul style={{ height: '200px', overflow: 'auto' }}>
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
