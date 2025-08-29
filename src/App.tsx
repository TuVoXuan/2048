import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Cell from "./components/Cell";
import Footer from "./components/Footer";
import GameOver from "./components/GameOver";
import Header from "./components/Header";
import PowerUpButtonGroup from "./components/PowerUpButtonGroup";
import { MoveKeyCodes } from "./constants";
import { useScreenWidth } from "./hooks/useScreenWidth";
import { cn } from "./lib/utils";
import useAppStore from "./store/AppStore";
import type { Direction, ICell, IPosition } from "./types";
import {
  calculateMovedCells,
  calculateScore,
  getRandomItem,
  getRandomTwoOrFour,
  isGameOver,
  isMoveAble,
  isValidMoveKey,
  updateLastPositionOfMergedCell,
} from "./utils";
import CellV2 from "./components/CellV2";

const testDefaultCell = [
  {
    id: "563e3a27-bc1d-444f-9d45-d65ded8e00e0",
    position: {
      top: 310,
      left: 110,
      column: 1,
      row: 3,
    },
    value: 2,
  },
  {
    id: "c69fbcc0-c8f5-4360-97dc-c12a78f08522",
    position: {
      top: 10,
      left: 110,
      column: 1,
      row: 0,
    },
    value: 2,
    lastPosition: {
      top: 310,
      left: 110,
      column: 1,
      row: 3,
    },
  },
];

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
    layout,
    setLayoutByWidth,
    initGame,
    cellGridPositions,
    addMove,
    addHistory,
  } = useAppStore();
  const cellsRef = useRef<ICell[]>([]);
  const screenWidth = useScreenWidth();

  useEffect(() => {
    cellsRef.current = cells;

    if (cellsRef.current) {
      const currentCells = cellsRef.current.filter((cell) => !cell.isMergingTo);
      if (isGameOver(currentCells)) {
        setGameOver(true);
      }
    }
  }, [cells]);

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
          addMove();
          const updatedLastCell = updateLastPositionOfMergedCell(
            movedCells,
            cellsRef.current
          );
          addHistory(updatedLastCell);
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
    // initGame();

    document.addEventListener("keydown", onListenPressMoveBtn);

    return () => {
      document.removeEventListener("keydown", onListenPressMoveBtn);
    };
  }, []);

  useEffect(() => {
    setLayoutByWidth(screenWidth);
  }, [screenWidth]);

  return (
    <main className="bg-[#FAF8F0] h-screen w-full font-family-rubik">
      <div className="py-5 flex flex-col items-center gap-y-5 max-w-[1120px] mx-auto">
        <Header />
        <section
          style={{
            gap: layout.layoutSpacing + "px",
            padding: layout.layoutSpacing + "px",
          }}
          className={cn("relative bg-[#9C8B7C] grid grid-cols-4 rounded-xl")}
        >
          {new Array(16).fill(0).map((_, index) => (
            <div
              key={index}
              style={{
                height: layout.cellSize + "px",
                width: layout.cellSize + "px",
              }}
              className={cn("bg-[#BDAC97] rounded-lg shadow-2xs")}
            ></div>
          ))}

          <AnimatePresence mode="popLayout">
            {cells.map((cell) => (
              <Cell key={cell.id} value={cell} />
              // <CellV2 key={cell.id} value={cell} />
            ))}
          </AnimatePresence>
        </section>
        <button
          className="p-3 bg-blue-100"
          onClick={() => updateAllCells(testDefaultCell)}
        >
          add last position
        </button>
        <PowerUpButtonGroup />
        <Footer />
      </div>
      {gameOver && <GameOver />}
    </main>
  );
}

export default App;
