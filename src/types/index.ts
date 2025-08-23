export interface ICell {
  id: string;
  value: number;
  position: IPosition;
  isMerging?: boolean;
  isMergingTo?: boolean
}

export interface IPosition {
  top: number;
  left: number;
  column: number;
  row: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
