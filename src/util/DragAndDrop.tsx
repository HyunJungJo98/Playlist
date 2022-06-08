import { DragDropInterface } from '../interface/DragDropInterface';

export class DragAndDrop<T> implements DragDropInterface {
  playlist: T[];
  draggedItemIndex: number | null;
  setPlaylist: React.Dispatch<React.SetStateAction<T[]>>;

  constructor(
    playlist: T[],
    setPlaylist: React.Dispatch<React.SetStateAction<T[]>>
  ) {
    this.playlist = playlist;
    this.draggedItemIndex = null;
    this.setPlaylist = setPlaylist;
  }
  dragOverHandler = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };
  dragStartHandler = (index: number, e: React.DragEvent<HTMLLIElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };
  dragEndHandler = (e: React.DragEvent<HTMLLIElement>) => {
    e.dataTransfer.dropEffect = 'move';
  };
  dropHandler = (e: React.DragEvent<HTMLLIElement>) => {
    const dragItemIndex = +e.dataTransfer.getData('text/plain');
    let _playlist = [...this.playlist];
    const dragItem = _playlist[dragItemIndex];
    _playlist.splice(dragItemIndex, 1);
    _playlist.splice(this.draggedItemIndex!, 0, dragItem);

    this.setPlaylist(_playlist);
    this.draggedItemIndex = null;
  };

  dragEnterHandler = (index: number, _: React.DragEvent<HTMLLIElement>) => {
    this.draggedItemIndex = index;
  };
}
