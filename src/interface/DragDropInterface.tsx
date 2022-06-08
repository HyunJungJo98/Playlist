export interface DragDropInterface {
  dragOverHandler(e: React.DragEvent<HTMLLIElement>): void;
  dragStartHandler(index: number, e: React.DragEvent<HTMLLIElement>): void;
  dragEndHandler(e: React.DragEvent<HTMLLIElement>): void;
  dropHandler(e: React.DragEvent<HTMLLIElement>): void;
  dragEnterHandler(index: number, _: React.DragEvent<HTMLLIElement>): void;
}
