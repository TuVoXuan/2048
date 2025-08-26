import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Cell from "./components/Cell";
import Header from "./components/Header";
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
  calculateScore,
  cn,
  getRandomItem,
  getRandomTwoOrFour,
  getTwoRandomItems,
  isGameOver,
  isMoveAble,
  isValidMoveKey,
} from "./utils";
import GameOver from "./components/GameOver";

function handleCreateNewCell(
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
  const randomValue = getRandomTwoOrFour();
  if (!randomPosition) return null;
  return {
    id: uuidv4(),
    value: randomValue,
    position: randomPosition,
  };
}

function App() {
  const {
    cells,
    showPulseEffectMerge,
    updateAllCells,
    isActionInProgress,
    setActionInProgress,
    addScore,
    gameOver,
    setGameOver,
  } = useAppStore();
  const cellsRef = useRef<ICell[]>([]);

  useEffect(() => {
    cellsRef.current = cells;

    if (cellsRef.current) {
      const currentCells = cellsRef.current.filter((cell) => !cell.isMergingTo);
      if (isGameOver(currentCells)) {
        setGameOver(true);
      }
    }
  }, [cells]);

  const cellGridPositions = useCellGridPositions({
    cellSize: CELL_SIZE,
    columns: SQUARE_GRID_SIZE,
    layoutSpacing: LAYOUT_SPACING,
  });

  const handleMoveCells = useCallback(
    (direction: Direction) => {
      // Set action in progress to prevent new actions
      setActionInProgress(true);

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
        const newCell = handleCreateNewCell(
          movedCells.map((cell) => cell.position),
          cellGridPositions
        );
        if (newCell) {
          movedCells.push(newCell);
        }
      }

      //filtering isMerging cells to calculate score
      const score = calculateScore(movedCells.filter((cell) => cell.isMerging));
      addScore(score);
      updateAllCells(movedCells);

      // Reset action in progress after a short delay to allow animations to complete
      setTimeout(
        () => {
          setActionInProgress(false);
        },
        showPulseEffectMerge ? 600 : 300
      ); // 150ms delay to allow for cell animations
    },
    [cellGridPositions, setActionInProgress]
  );

  const onListenPressMoveBtn = (event: KeyboardEvent) => {
    if (!isValidMoveKey(event.code)) return;

    // Prevent new actions if one is already in progress
    if (isActionInProgress) return;

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
    <main className="bg-[#FAF8F0] h-screen w-full font-family-rubik">
      <div className="py-5 flex flex-col items-center gap-y-5 max-w-[1120px] mx-auto">
        <Header />
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
      </div>
      {gameOver && <GameOver />}
    </main>
  );
}

export default App;
