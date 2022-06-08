import React, { useState } from 'react';
import axios from 'axios';
import { SpotifySearchTrack, Track } from '../interface/Spotify';
import { LocalStorage } from '../util/LocalStorage';
import { Playlist } from '../interface/Palylist';

const CLIENT_ID = '2543d212fb8146d38d983f6543891b56';
const CLIENT_SECRET = '7e8183ba686840959829a2f82aefee6c';

interface SearchProps {
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

const Search: React.FC<SearchProps> = ({ setPlaylist }) => {
  const [token, setToken] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const [tracks, setTracks] = useState<Track[]>([]);
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

  // 노래 제목 검색
  const searchTracks = async (e: React.FormEvent) => {
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

    tracks.map((track, index) => {
      const newTrack: Track = {
        title: track.name,
        artists: track.artists,
        albumImages: track.album.images,
      };
      newTracks.push(newTrack);
    });
    setTracks(newTracks);
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
  return (
    <div>
      {!token ? (
        <button onClick={login}>login</button>
      ) : (
        <>
          <button onClick={logout}>logout</button>
          <div>
            <input
              type="text"
              onChange={(e) => setSearchKey(e.target.value)}
              value={searchKey}
            />
            <button onClick={searchTracks}>Search</button>
          </div>
        </>
      )}
      <ul style={{ height: '200px', overflow: 'auto' }}>
        {tracks.map((track, index) => (
          <li key={index} onClick={(e) => trackClick(index, e)}>
            <img src={track.albumImages[2].url}></img>
            <span>{track.title}</span> -
            {track.artists.map((artist, index) => (
              <span key={index}>{artist.name}</span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
