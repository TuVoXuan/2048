import { create } from 'zustand'
import type { ICell, IPosition } from '../types'
import { computeCellGridPositions, type LayoutConfig } from '@/utils/computeCellGridPositions';
import { getLayoutConfig } from '@/utils/getLayoutConfig';
import { getRandomTwoOrFour, getTwoRandomItems } from '@/utils';
import { v4 as uuidv4 } from 'uuid';

interface IAppStore {
  //State cells
  cells: ICell[],
  updateAllCells: (cells: ICell[]) => void,
  updateMergeState: (cellId: string, isMerging: boolean) => void,
  //State effect merge
  showPulseEffectMerge: boolean,
  setShowPulseEffectMerge: (value: boolean) => void,
  //State action in progress
  isActionInProgress: boolean,
  setActionInProgress: (value: boolean) => void
  //State game Score
  score: number;
  addScore: (value: number) => void;
  bestScore: number;
  setBestScore: (value: number) => void;
  //State game over
  gameOver: boolean;
  setGameOver: (value: boolean) => void;
  //State game config
  layout: LayoutConfig;
  cellGridPositions: IPosition[];
  setLayoutByWidth: (width: number) => void;
  initGame: () => void;
  resetGame: () => void;
}

const useAppStore = create<IAppStore>((set, get) => ({
  cells: [],
  updateAllCells: (cells) => set(() => ({cells: cells})),
  updateMergeState: (cellId, isMerging) => set((state) => {
    const foundCell = state.cells.find((item) => item.id === cellId);
    if(foundCell){
      foundCell.isMerging = isMerging
    }
    
    return state;
  }),
  showPulseEffectMerge: false,
  setShowPulseEffectMerge: (value) => set(() => ({showPulseEffectMerge: value})),
  isActionInProgress: false,
  setActionInProgress: (value) => set(() => ({isActionInProgress: value})),
  score: 0,
  addScore: (value) => set((state) => ({score: state.score + value})),
  bestScore: parseInt(localStorage.getItem('bestScore') || '0'),
  setBestScore: (value: number) => {
    set({bestScore: value})
    localStorage.setItem('bestScore', value.toString());
  },
  gameOver: false,
  setGameOver: (gameOver) => set(() => {
    if(gameOver){
      return ({gameOver: true})
    }
    return ({gameOver: false, cells: []})
  }),
  layout: getLayoutConfig(window.innerWidth),
  cellGridPositions: computeCellGridPositions(getLayoutConfig(window.innerWidth)),

  setLayoutByWidth: (width) => {
    const layout = getLayoutConfig(width);
    const positions = computeCellGridPositions(layout);
    const { cells } = get();

    // Remap existing cells to new absolute positions by row/column
    const remapped = cells.map((cell) => {
      const pos = positions.find(p => p.row === cell.position.row && p.column === cell.position.column);
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
    set({ gameOver: false, cells: [], score: 0 });
    get().initGame();
  },
}))

export default useAppStore;