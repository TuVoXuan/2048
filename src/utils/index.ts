import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MoveKeyCodes } from "../constants";
import type { Direction, ICell, IPosition } from "../types";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export function getTwoRandomItems<T>(arr: T[]): [T, T] | null {
  if (arr.length < 2) return null;

  const firstIndex = Math.floor(Math.random() * arr.length);
  let secondIndex = Math.floor(Math.random() * arr.length);

  // ensure distinct
  while (secondIndex === firstIndex) {
    secondIndex = Math.floor(Math.random() * arr.length);
  }

  return [arr[firstIndex], arr[secondIndex]];
}

export function getRandomTwoOrFour(): 2 | 4 {
  return Math.random() < 0.1 ? 4 : 2;
}

export function isValidMoveKey(code: string) {
  return (
    code === MoveKeyCodes.ArrowDown ||
    code === MoveKeyCodes.ArrowLeft ||
    code === MoveKeyCodes.ArrowRight ||
    code === MoveKeyCodes.ArrowUp
  );
}

export function findFrontCell(
  cells: ICell[],
  position: IPosition,
  direction: Direction
) {
  const frontCell = cells.findLast((cell) => {
    if (
      direction === "up" &&
      cell.position.column === position.column &&
      cell.position.row < position.row
    )
      return true;

    if (
      direction === "down" &&
      cell.position.column === position.column &&
      cell.position.row > position.row 
    )
      return true;

    if (
      direction === "left" &&
      cell.position.row === position.row &&
      cell.position.column < position.column
    )
      return true;

    if (
      direction === "right" &&
      cell.position.row === position.row &&
      cell.position.column > position.column
    )
      return true;
    
    return false;
  });
  return frontCell;
}

export function sortFollowDirection(cells: ICell[], direction: Direction) {
  let sortedCells: ICell[] = [];
  if (direction === 'down') {
    sortedCells = [...cells].sort((cellA, cellB) => cellB.position.row - cellA.position.row);
  } else if (direction === 'up') {
    sortedCells = [...cells].sort((cellA, cellB) => cellA.position.row - cellB.position.row);
  } else if (direction === 'left') {
    sortedCells = [...cells].sort((cellA, cellB) => cellA.position.column - cellB.position.column);
  } else if (direction === 'right') {
    sortedCells = [...cells].sort((cellA, cellB) => cellB.position.column - cellA.position.column);
  } else {
    sortedCells = [...cells];
  }
  return sortedCells;
}

export function getCellPosition({row, column}:{row: number, column: number}, cellGridPositions: IPosition[]) {
  return cellGridPositions.find((cellItem) => cellItem.column === column && cellItem.row === row);
}
