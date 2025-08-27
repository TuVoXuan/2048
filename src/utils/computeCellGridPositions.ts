// utils/computeCellGridPositions.ts
export type LayoutConfig = {
  cellSize: number;
  layoutSpacing: number;
  columns: number;
};

export function computeCellGridPositions(cfg: LayoutConfig) {
  const { cellSize, layoutSpacing, columns } = cfg;
  let curRow = 0;
  let currCol = 0;
  const positions = [];
  const distance = cellSize + layoutSpacing;
  for (let index = 0; index < columns * columns; index++) {
    if (index < columns * (curRow + 1)) {
      positions.push({
        top: layoutSpacing + distance * curRow,
        left: layoutSpacing + distance * currCol,
        column: currCol,
        row: curRow,
      });
      currCol++;
    }
    if (index === columns * (curRow + 1) - 1) {
      curRow++;
      currCol = 0;
    }
  }
  return positions;
}