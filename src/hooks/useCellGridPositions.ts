import type { IPosition } from "../types";
interface Props {
  cellSize: number;
  layoutSpacing: number;
  columns: number;
}
/**
 * Custom hook to calculate the grid positions for each cell in a square grid layout.
 *
 * Given the cell size, number of columns, and spacing between cells, this hook returns
 * an array of positions (top and left coordinates) for each cell in the grid.
 *
 * @param cellSize - The size (width and height) of each cell in pixels.
 * @param columns - The number of columns (and rows) in the square grid.
 * @param layoutSpacing - The spacing in pixels between each cell and the grid edges.
 * @returns An array of `IPosition` objects representing the top and left coordinates for each cell.
 */
export function useCellGridPositions({
  cellSize,
  columns,
  layoutSpacing,
}: Props) {
  let curRow = 0;
  let currCol = 0;
  const cellPositions: IPosition[] = [];
  const distanceBetweenCell = cellSize + layoutSpacing;
  for (let index = 0; index < columns * columns; index++) {
    if (index < columns * (curRow + 1)) {
      const position: IPosition = {
        top: layoutSpacing + distanceBetweenCell * curRow,
        left: layoutSpacing + distanceBetweenCell * currCol,
        column: currCol,
        row: curRow,
      };
      cellPositions.push(position);
      currCol++;
    }
    if (index === columns * (curRow + 1) - 1) {
      curRow++;
      currCol = 0;
    }
  }
  return cellPositions;
}
