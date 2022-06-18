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
    // 현재 드래그 하고 있는 아이템
    const dragItem = _playlist[dragItemIndex];
    _playlist.splice(dragItemIndex, 1);
    _playlist.splice(this.draggedItemIndex!, 0, dragItem);

    this.setPlaylist(_playlist);

    const imgEl = document.querySelector(
      `#playlist${dragItemIndex}`
    ) as HTMLElement;
    imgEl.style.backgroundImage = `none`;

    this.draggedItemIndex = null;
  };

  dragEnterHandler = (index: number, _: React.DragEvent<HTMLLIElement>) => {
    this.draggedItemIndex = index;
  };
}
