import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Cell from "./components/Cell";
import {
  CELL_SIZE,
  LAYOUT_SPACING,
  MoveKeyCodes,
  SQUARE_GRID_SIZE,
} from "./constants";
import { useCellGridPositions } from "./hooks/useCellGridPositions";
import useAppStore from "./store/AppStore";
import type { Direction, ICell, IPosition } from "./types";
import {
  calculateMovedCells,
  cn,
  getRandomItem,
  getRandomTwoOrFour,
  getTwoRandomItems,
  isGameOver,
  isMoveAble,
  isValidMoveKey,
} from "./utils";

const defaultCells = [
  {
    id: "a1",
    position: {
      top: 10,
      left: 10,
      column: 0,
      row: 0,
    },
    value: 2,
  },
  {
    id: "a2",
    position: {
      top: 10,
      left: 100,
      column: 1,
      row: 0,
    },
    value: 4,
  },
  {
    id: "a3",
    position: {
      top: 190,
      left: 190,
      column: 2,
      row: 2,
    },
    value: 2,
  },
  {
    id: "a4",
    position: {
      top: 280,
      left: 280,
      column: 3,
      row: 3,
    },
    value: 4,
  },
  {
    id: "a5",
    position: {
      top: 190,
      left: 10,
      column: 0,
      row: 2,
    },
    value: 2,
  },
];

function handleCreateAddNewCell(
  usedPositions: IPosition[],
  cellGridPositions: IPosition[]
): ICell | null {
  const unusedPositions = cellGridPositions.filter(
    (position) =>
      !usedPositions.find(
        (usedPosition) =>
          usedPosition.column === position.column &&
          usedPosition.row === position.row
      )
  );

  const randomPosition = getRandomItem(unusedPositions);
  const ramdomValue = getRandomTwoOrFour();
  if (!randomPosition) return null;
  return {
    id: uuidv4(),
    value: ramdomValue,
    position: randomPosition,
  };
}

function App() {
  const { cells, updateAllCells } = useAppStore();
  const cellsRef = useRef<ICell[]>(defaultCells);

  useEffect(() => {
    cellsRef.current = cells;

    // if (cellsRef.current && isGameOver(cellsRef.current)) {
    //   alert("Game over");
    // }
  }, [cells]);

  const cellGridPositions = useCellGridPositions({
    cellSize: CELL_SIZE,
    columns: SQUARE_GRID_SIZE,
    layoutSpacing: LAYOUT_SPACING,
  });

  const handleMoveCells = useCallback(
    (direction: Direction) => {
      // Use ref to get current cells, calculate new state, then set it
      // filtering cell is merged from the previous step
      const currentCells = cellsRef.current.filter((cell) => !cell.isMergingTo);

      const movedCells = calculateMovedCells(
        currentCells,
        direction,
        cellGridPositions
      );

      if (isMoveAble(currentCells, movedCells)) {
        //Check if cells is moved then add new cell
        const newCell = handleCreateAddNewCell(
          movedCells.map((cell) => cell.position),
          cellGridPositions
        );
        if (newCell) {
          movedCells.push(newCell);
        }
      }

      updateAllCells(movedCells);
    },
    [cellGridPositions]
  );

  const onListenPressMoveBtn = (event: KeyboardEvent) => {
    if (!isValidMoveKey(event.code)) return;
    if (event.code === MoveKeyCodes.ArrowDown) {
      handleMoveCells("down");
    }
    if (event.code === MoveKeyCodes.ArrowUp) {
      handleMoveCells("up");
    }
    if (event.code === MoveKeyCodes.ArrowLeft) {
      handleMoveCells("left");
    }
    if (event.code === MoveKeyCodes.ArrowRight) {
      handleMoveCells("right");
    }
  };

  useEffect(() => {
    if (cellGridPositions.length > 0) {
      const initRandomPosition = getTwoRandomItems(cellGridPositions);
      if (initRandomPosition) {
        const initCells = initRandomPosition.map((position) => ({
          id: uuidv4(),
          position: position,
          value: getRandomTwoOrFour(),
        }));
        updateAllCells(initCells);
      }
    }

    document.addEventListener("keydown", onListenPressMoveBtn);

    return () => {
      document.removeEventListener("keydown", onListenPressMoveBtn);
    };
  }, []);

  return (
    <main className="bg-[#FAF8F0] h-screen w-full flex items-center justify-center font-family-rubik">
      <section
        style={{
          gap: LAYOUT_SPACING + "px",
          padding: LAYOUT_SPACING + "px",
        }}
        className={cn("relative bg-[#9C8B7C] grid grid-cols-4 rounded-xl")}
      >
        {new Array(16).fill(0).map((_, index) => (
          <div
            key={index}
            style={{
              height: CELL_SIZE + "px",
              width: CELL_SIZE + "px",
            }}
            className={cn("bg-[#BDAC97] rounded-lg shadow-2xs")}
          ></div>
        ))}

        <AnimatePresence mode="popLayout">
          {cells.map((cell) => (
            <Cell key={cell.id} value={cell} />
          ))}
        </AnimatePresence>
      </section>
    </main>
  );
}

export default App;
