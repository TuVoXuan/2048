import { create } from 'zustand'
import type { ICell } from '../types'

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
  //State game over
  gameOver: boolean;
  setGameOver: (value: boolean) => void;
}

const useAppStore = create<IAppStore>((set) => ({
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
  gameOver: false,
  setGameOver: (gameOver) => set(() => {
    if(gameOver){
      return ({gameOver: true})
    }
    return ({gameOver: false, cells: []})
  })
}))

export default useAppStore;