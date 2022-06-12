export interface Playlist {
  title: string;
  artist: string[];
}

export interface PlaylistList {
  title: string;
  palylist: Playlist[];
  image: string | null;
}
