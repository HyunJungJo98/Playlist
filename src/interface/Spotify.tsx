export interface SpotifySearchTrack {
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface SpotifyTrack {
  album: Album;
  artists: Artist[];
  id: string;
  name: string;
}

export interface SpotifySearchAlbumName {
  albums: {
    items: Album[];
  };
}

export interface SpotifySearchAlbumTrack {
  items: SpotifyTrack[];
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
  artists: Artist[];
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
