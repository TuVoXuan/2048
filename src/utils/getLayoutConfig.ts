// utils/getLayoutConfig.ts
import type { LayoutConfig } from './computeCellGridPositions';

export function getLayoutConfig(width: number): LayoutConfig {
  // Example breakpoints; adjust as needed
  if (width < 640) {
    return { cellSize: 70, layoutSpacing: 8, columns: 4 };
  }
  if (width < 1024) {
    return { cellSize: 90, layoutSpacing: 10, columns: 4 };
  }
  return { cellSize: 100, layoutSpacing: 12, columns: 4 };
}