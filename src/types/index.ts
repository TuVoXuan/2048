export interface ICell {
  id: string;
  value: number;
  position: IPosition;
  //store old position for the history move
  lastPosition?: IPosition;
  isMerging?: boolean;
  isMergingTo?: boolean;
  isHistory?: boolean;
  isUsedToPowerUp?: boolean;
}

export interface IPosition {
  top: number;
  left: number;
  column: number;
  row: number;
}

export interface IPowerUp {
  name: string;
  maxUses: number;
  remainingUse: number;
  tileToGetUse: number;
}

export type Direction = "up" | "down" | "left" | "right";
export type PowerUpActionType =
  | "undo"
  | "swapTwoTiles"
  | "deleteTilesByNumber";
