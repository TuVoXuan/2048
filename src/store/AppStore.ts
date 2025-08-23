import { create } from 'zustand'
import type { ICell } from '../types'

// const defaultCells = [
//   {
//     id: "a1",
//     position: {
//       top: 10,
//       left: 10,
//       column: 0,
//       row: 0,
//     },
//     value: 2,
//   },
//   {
//     id: "a2",
//     position: {
//       top: 10,
//       left: 100,
//       column: 1,
//       row: 0,
//     },
//     value: 4,
//   },
//   {
//     id: "a3",
//     position: {
//       top: 190,
//       left: 190,
//       column: 2,
//       row: 2,
//     },
//     value: 2,
//   },
//   {
//     id: "a4",
//     position: {
//       top: 280,
//       left: 280,
//       column: 3,
//       row: 3,
//     },
//     value: 4,
//   },
//   {
//     id: "a5",
//     position: {
//       top: 190,
//       left: 10,
//       column: 0,
//       row: 2,
//     },
//     value: 2,
//   },
// ];

interface IAppStore {
  //state cells
  cells: ICell[],
  updateAllCells: (cells: ICell[]) => void,
  updateMergeState: (cellId: string, isMerging: boolean) => void,
  removeCell: (cellId: string) => void,
  //state effect merge
  showPulseEffectMerge: boolean,
  setShowPulseEffectMerge: (value: boolean) => void
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
  removeCell: (cellId: string) => set((state) => ({cells: state.cells.filter((item) => item.id !== cellId)})),
  showPulseEffectMerge: false,
  setShowPulseEffectMerge: (value) => set(() => ({showPulseEffectMerge: value}))
}))

export default useAppStore;