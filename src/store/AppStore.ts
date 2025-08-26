import { create } from 'zustand'
import type { ICell } from '../types'

interface IAppStore {
  //state cells
  cells: ICell[],
  updateAllCells: (cells: ICell[]) => void,
  updateMergeState: (cellId: string, isMerging: boolean) => void,
  //state effect merge
  showPulseEffectMerge: boolean,
  setShowPulseEffectMerge: (value: boolean) => void,
  //state action in progress
  isActionInProgress: boolean,
  setActionInProgress: (value: boolean) => void
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
  showPulseEffectMerge: true,
  setShowPulseEffectMerge: (value) => set(() => ({showPulseEffectMerge: value})),
  isActionInProgress: false,
  setActionInProgress: (value) => set(() => ({isActionInProgress: value}))
}))

export default useAppStore;