import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CLIENT_ID = '2543d212fb8146d38d983f6543891b56';
const CLIENT_SECRET = '7e8183ba686840959829a2f82aefee6c';

const Search: React.FC = () => {
  const [token, setToken] = useState('');
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {}, []);

  const login = async () => {
    // const result = await axios.post(
    //   'https://accounts.spotify.com/api/token',
    //   'grant_type=client_credentials',
    //   {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
    //   }
    // );
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
      },
      body: 'grant_type=client_credentials',
    });

    //401일 때 재발급해야됨
    console.log(result.status);

    const data = await result.json();
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
  };

  const searchArtists = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await axios
      .get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: 'position',
          type: 'track',
          limit: 5,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });

    console.log(data);
  };

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };
  return (
    <div>
      {!token ? (
        <button onClick={login}>login</button>
      ) : (
        <button onClick={logout}>logout</button>
      )}

      {token ? (
        <form onSubmit={searchArtists}>
          <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
          <button type={'submit'}>Search</button>
        </form>
      ) : (
        <h2></h2>
      )}
    </div>
  );
};

export default Search;
