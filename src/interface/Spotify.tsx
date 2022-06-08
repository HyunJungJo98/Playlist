export interface SpotifySearchTrack {
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface SpotifyTrack {
  album: {
    id: string;
    images: { height: number; width: number; url: string }[];
    name: string;
  };
  artists: {
    id: string;
    name: string;
  }[];
  id: string;
  name: string;
}

export interface Track {
  title: string;
  artists: Artist[];
  albumImages: { height: number; width: number; url: string }[];
}

export interface Album {
  id: string;
  images: AlbumImages[];
  name: string;
}

export interface AlbumImages {
  height: number;
  width: number;
  url: string;
}

export interface Artist {
  id: string;
  name: string;
}
