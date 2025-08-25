/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MoveKeyCodes, SQUARE_GRID_SIZE } from "../constants";
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

export function getRandomItem<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  const radomIndex = Math.floor(Math.random() * arr.length);
  return arr[radomIndex];
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
  if (direction === "down") {
    sortedCells = [...cells].sort(
      (cellA, cellB) => cellB.position.row - cellA.position.row
    );
  } else if (direction === "up") {
    sortedCells = [...cells].sort(
      (cellA, cellB) => cellA.position.row - cellB.position.row
    );
  } else if (direction === "left") {
    sortedCells = [...cells].sort(
      (cellA, cellB) => cellA.position.column - cellB.position.column
    );
  } else if (direction === "right") {
    sortedCells = [...cells].sort(
      (cellA, cellB) => cellB.position.column - cellA.position.column
    );
  } else {
    sortedCells = [...cells];
  }
  return sortedCells;
}

export function getCellPosition(
  { row, column }: { row: number; column: number },
  cellGridPositions: IPosition[]
) {
  return cellGridPositions.find(
    (cellItem) => cellItem.column === column && cellItem.row === row
  );
}

// Extract the movement logic to a pure function
export function calculateMovedCells(
  cells: ICell[],
  direction: Direction,
  cellGridPositions: IPosition[]
): ICell[] {
  const sortedCells = sortFollowDirection(cells, direction);
  const movedCells: ICell[] = [];

  for (let i = 0; i < sortedCells.length; i++) {
    const cell = sortedCells[i];

    const frontCell = findFrontCell(
      [...movedCells, ...sortedCells.slice(i + 1)],
      cell.position,
      direction
    );

    const ableToMerge =
      frontCell?.value === cell.value && !frontCell.isMergingTo;

    if (!frontCell) {
      // Move to edge if possible
      let newPosition: IPosition | undefined;

      if (direction === "down" && cell.position.row !== SQUARE_GRID_SIZE - 1) {
        newPosition = cellGridPositions.find(
          (position) =>
            position.column === cell.position.column &&
            position.row === SQUARE_GRID_SIZE - 1
        );
      } else if (direction === "up" && cell.position.row !== 0) {
        newPosition = cellGridPositions.find(
          (position) =>
            position.column === cell.position.column && position.row === 0
        );
      } else if (direction === "left" && cell.position.column !== 0) {
        newPosition = cellGridPositions.find(
          (position) =>
            position.column === 0 && position.row === cell.position.row
        );
      } else if (
        direction === "right" &&
        cell.position.column !== SQUARE_GRID_SIZE - 1
      ) {
        newPosition = cellGridPositions.find(
          (position) =>
            position.column === SQUARE_GRID_SIZE - 1 &&
            position.row === cell.position.row
        );
      }

      if (newPosition) {
        movedCells.push({
          ...cell,
          position: { ...newPosition },
        });
      } else {
        // Cell can't move - keep in same position
        movedCells.push({
          ...cell,
          position: { ...cell.position },
        });
      }
    } else {
      if (ableToMerge) {
        // Merge with the frontCell
        //có thể thêm 1 biến nữa cho cho ô được merge, lưu dữ id của thằng frontCell xong khi update
        //lại biến isMerging thì xoá cell đó đi.
        const foundedCell = movedCells.find((cell) => cell.id === frontCell.id);
        if (foundedCell) {
          foundedCell.value = foundedCell.value * 2;
          frontCell.isMerging = true;
        }
        movedCells.push({
          ...cell,
          position: frontCell.position,
          isMergingTo: true,
        });
      } else {
        // Move to position next to frontCell
        let newPosition: IPosition | undefined;

        if (direction === "down") {
          newPosition = getCellPosition(
            {
              row: frontCell.position.row - 1,
              column: frontCell.position.column,
            },
            cellGridPositions
          );
        } else if (direction === "up") {
          newPosition = getCellPosition(
            {
              row: frontCell.position.row + 1,
              column: frontCell.position.column,
            },
            cellGridPositions
          );
        } else if (direction === "left") {
          newPosition = getCellPosition(
            {
              row: frontCell.position.row,
              column: frontCell.position.column + 1,
            },
            cellGridPositions
          );
        } else if (direction === "right") {
          newPosition = getCellPosition(
            {
              row: frontCell.position.row,
              column: frontCell.position.column - 1,
            },
            cellGridPositions
          );
        }

        if (newPosition) {
          movedCells.push({
            ...cell,
            position: { ...newPosition },
          });
        } else {
          // Fallback - keep current position
          movedCells.push({
            ...cell,
            position: { ...cell.position },
          });
        }
      }
    }
  }

  return movedCells;
}

export function isMoveAble(curCells: ICell[], movedCells: ICell[]) {
  return curCells.some((curCell) => {
    const foundedMovedCell = movedCells.find((cell) => cell.id === curCell.id);
    if (foundedMovedCell) {
      // Return true if position has changed (different row or column)
      return (
        curCell.position.column !== foundedMovedCell.position.column ||
        curCell.position.row !== foundedMovedCell.position.row
      );
    }
    return false;
  });
}

/**
 * Converts a flat array of ICell objects to a nested grid structure
 * @param cells - Array of ICell objects
 * @returns 2D array representing the grid
 */
function cellArrayToGrid(cells: ICell[]): ICell[][] {
  if (cells.length === 0) {
    return [];
  }

  // Find the maximum row and column to determine grid size
  const maxRow = Math.max(...cells.map((cell) => cell.position.row));
  const maxCol = Math.max(...cells.map((cell) => cell.position.column));

  // Initialize the grid with the correct dimensions
  const grid: ICell[][] = Array(maxRow + 1)
    .fill(null)
    .map(() => Array(maxCol + 1).fill(null));

  // Place each cell in its correct position
  cells.forEach((cell) => {
    const { row, column } = cell.position;
    grid[row][column] = cell;
  });

  return grid;
}

//Check is game over
export function isGameOver(currCells: ICell[]) {
  console.log('currCells: ', currCells);
  console.log('gridCells: ', cellArrayToGrid(currCells));
  console.log('--------')

  if (currCells.length < SQUARE_GRID_SIZE * SQUARE_GRID_SIZE) {
    return false;
  }
  const cellGrid = cellArrayToGrid(currCells);
  
  // Grid is full, now check for possible merges
  for (let i = 0; i < cellGrid.length; i++) {
    for (let j = 0; j < cellGrid.length; j++) {
      const currentValue = cellGrid[i][j];
      // Check right neighbor (horizontal merge)
      if (j < cellGrid.length - 1 && cellGrid[i][j + 1]?.value === currentValue?.value) {
        return false;
      }

      // Check bottom neighbor (vertical merge)
      if (i < cellGrid.length - 1 && cellGrid[i + 1][j]?.value === currentValue?.value) {
        return false;
      }
    }
  }
  return true;
}
