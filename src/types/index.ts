export interface ICell {
  id: string;
  value: number;
  position: IPosition;
}

export interface IPosition {
  top: number;
  left: number;
  column: number;
  row: number;
}
