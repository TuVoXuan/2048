import { getRandomTwoOrFour, getTwoRandomItems } from "@/utils";
import {
  computeCellGridPositions,
  type LayoutConfig,
} from "@/utils/computeCellGridPositions";
import { getLayoutConfig } from "@/utils/getLayoutConfig";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import type { ICell, IPosition, IPowerUp } from "../types";

const testDefaultCell = [
  {
    id: "563e3a27-bc1d-444f-9d45-d65ded8e00e0",
    position: {
      top: 310,
      left: 110,
      column: 1,
      row: 3,
    },
    value: 4,
    ismerging: true,
  },
  {
    id: "c69fbcc0-c8f5-4360-97dc-c12a78f08522",
    position: {
      top: 310,
      left: 110,
      column: 1,
      row: 3,
    },
    value: 2,
    isMergingTo: true,
  },
];

const initPowerUps = {
  undo: {
    name: "undo",
    maxUses: 2,
    remainingUse: 2,
    tileToGetUse: 128,
  },
  swapTwoTiles: {
    name: "swap two tiles",
    maxUses: 2,
    remainingUse: 1,
    tileToGetUse: 256,
  },
  deleteTilesByNumber: {
    name: "delete tiles by number",
    maxUses: 2,
    remainingUse: 0,
    tileToGetUse: 512,
  },
};

interface IAppStore {
  //State cells
  cells: ICell[];
  updateAllCells: (cells: ICell[]) => void;
  updateMergeState: (cellId: string, isMerging: boolean) => void;
  removeOldPosition: (cellId: string) => void;
  //State action in progress
  isActionInProgress: boolean;
  setActionInProgress: (value: boolean) => void;
  //State game Score
  score: number;
  addScore: (value: number) => void;
  bestScore: number;
  setBestScore: (value: number) => void;
  //State the number of moving
  moves: number;
  addMove: () => void;
  minusMove: () => void;
  //State game over
  gameOver: boolean;
  setGameOver: (value: boolean) => void;
  //State game config
  layout: LayoutConfig;
  cellGridPositions: IPosition[];
  setLayoutByWidth: (width: number) => void;
  initGame: () => void;
  resetGame: () => void;
  //State game power up
  gameHistories: ICell[][];
  addHistory: (cells: ICell[]) => void;
  removeLastHistory: () => void;
  powerUps: {
    undo: IPowerUp;
    swapTwoTiles: IPowerUp;
    deleteTilesByNumber: IPowerUp;
  };
}

const useAppStore = create<IAppStore>((set, get) => ({
  cells: testDefaultCell,
  updateAllCells: (nCells) => set({ cells: nCells }),
  updateMergeState: (cellId, isMerging) =>
    set((state) => {
      const foundCell = state.cells.find((item) => item.id === cellId);
      if (foundCell) {
        foundCell.isMerging = isMerging;
      }

      return state;
    }),
  removeOldPosition: (cellId) => {
    const { cells } = get();
    const foundCell = cells.find((item) => item.id === cellId);
    if (foundCell && foundCell.lastPosition) {
      foundCell.position = foundCell.lastPosition;
      foundCell.lastPosition = undefined;
    }
    set({ cells: cells });
  },
  isActionInProgress: false,
  setActionInProgress: (value) => set(() => ({ isActionInProgress: value })),
  score: 0,
  addScore: (value) => set((state) => ({ score: state.score + value })),
  bestScore: parseInt(localStorage.getItem("bestScore") || "0"),
  setBestScore: (value: number) => {
    set({ bestScore: value });
    localStorage.setItem("bestScore", value.toString());
  },
  moves: 0,
  addMove: () => set((state) => ({ moves: state.moves++ })),
  minusMove: () => set((state) => ({ moves: state.moves-- })),
  gameOver: false,
  setGameOver: (gameOver) =>
    set(() => {
      if (gameOver) {
        return { gameOver: true };
      }
      return { gameOver: false, cells: [] };
    }),
  layout: getLayoutConfig(window.innerWidth),
  cellGridPositions: computeCellGridPositions(
    getLayoutConfig(window.innerWidth)
  ),

  setLayoutByWidth: (width) => {
    const layout = getLayoutConfig(width);
    const positions = computeCellGridPositions(layout);
    const { cells } = get();

    // Remap existing cells to new absolute positions by row/column
    const remapped = cells.map((cell) => {
      const pos = positions.find(
        (p) => p.row === cell.position.row && p.column === cell.position.column
      );
      return pos ? { ...cell, position: pos } : cell;
    });

    set({ layout, cellGridPositions: positions, cells: remapped });
  },

  initGame: () => {
    const { cellGridPositions } = get();
    if (cellGridPositions.length === 0) return;

    const [p1, p2] = getTwoRandomItems(cellGridPositions) ?? [];
    if (!p1 || !p2) return;

    const initCells = [p1, p2].map((position) => ({
      id: uuidv4(),
      position,
      value: getRandomTwoOrFour(),
    }));

    set({ gameOver: false, score: 0, cells: initCells });
  },

  resetGame: () => {
    // If you want `setGameOver(false)` to also start a new game,
    // you can either call initGame() from here, or make setGameOver do it when false.
    set({ gameOver: false, cells: [], score: 0, moves: 0 });
    get().initGame();
  },
  gameHistories: [],
  addHistory: (cells) => {
    const { gameHistories } = get();
    if (gameHistories.length >= 2) {
      gameHistories.shift();
    }
    gameHistories.push(cells);
    set({ gameHistories: gameHistories });
  },
  removeLastHistory: () => {
    const { gameHistories } = get();
    gameHistories.pop();
    set({ gameHistories: gameHistories });
  },
  powerUps: initPowerUps,
}));

export default useAppStore;
