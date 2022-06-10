import axios from 'axios';

const CLIENT_ID = '2543d212fb8146d38d983f6543891b56';
const CLIENT_SECRET = '7e8183ba686840959829a2f82aefee6c';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SEARCH_ENDPOINT = 'https://api.spotify.com/v1/search';

const tokenRequest = async (url: string) => {
  const result = await axios.post(url, 'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
    },
  });
  return result;
};

async function searchRequest<T>(
  searchKey: string,
  token: string,
  type: string
) {
  const data = await axios.get<T>(SEARCH_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: searchKey,
      type: type,
    },
  });
  return data;
}

async function searchAlbumRequest<T>(id: string, token: string) {
  const data = await axios.get<T>(
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
  return data;
}

export const api = {
  getToken: () => {
    return tokenRequest(TOKEN_ENDPOINT);
  },
  searchTrack<T>(searchKey: string, token: string, type: string) {
    return searchRequest<T>(searchKey, token, type);
  },
  searchAlbumTrack<T>(id: string, token: string) {
    return searchAlbumRequest<T>(id, token);
  },
};
