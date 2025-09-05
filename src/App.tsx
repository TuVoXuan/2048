import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import CellLayout from "./components/CellLayout";
import Introduction from "./components/Dialog/Introduction";
import Footer from "./components/Footer";
import GameOver from "./components/GameOver";
import Header from "./components/Header";
import PowerUpActionLayout from "./components/PowerUpActionLayout";
import PowerUpButtonGroup from "./components/PowerUpButtonGroup";
import Score from "./components/Score";
import { MoveKeyCodes } from "./constants";
import { useScreenWidth } from "./hooks/useScreenWidth";
import useAppStore from "./store/AppStore";
import type { Direction, ICell, IPosition } from "./types";
import {
  calculateMovedCells,
  calculateScore,
  checkTilesToGetPowerUp,
  getRandomItem,
  getRandomTwoOrFour,
  isGameOver,
  isMoveAble,
  isValidMoveKey,
  updateLastPositionOfMergedCell,
} from "./utils";

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
    updateAllCells,
    isActionInProgress,
    setActionInProgress,
    addScore,
    gameOver,
    setGameOver,
    setLayoutByWidth,
    initGame,
    cellGridPositions,
    addMove,
    addHistory,
    powerUps,
    addRemainingTurnPowerUp,
    score,
    bestScore,
    powerUpAction,
  } = useAppStore();
  const cellsRef = useRef<ICell[]>([]);
  const screenWidth = useScreenWidth();
  const [firstLoad, setFirstLoad] = useState(
    localStorage.getItem("firstLoad") !== "false"
  );
  const touchStartPointRef = useRef<{ x: number; y: number } | null>(null);

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
          // Check tiles to get power up
          const {
            hasTileToGetDeleteTilesByNumber,
            hasTileToGetSwapTwoTiles,
            hasTileToGetUndo,
            hasTileToGetTeleportATile,
          } = checkTilesToGetPowerUp(movedCells, powerUps);

          if (hasTileToGetDeleteTilesByNumber) {
            addRemainingTurnPowerUp("deleteTilesByNumber");
          }
          if (hasTileToGetSwapTwoTiles) {
            addRemainingTurnPowerUp("swapTwoTiles");
          }
          if (hasTileToGetUndo) {
            addRemainingTurnPowerUp("undo");
          }
          if (hasTileToGetTeleportATile) {
            addRemainingTurnPowerUp("teleportATile");
          }
        }
      }

      //filtering isMerging cells to calculate score
      const score = calculateScore(movedCells.filter((cell) => cell.isMerging));
      addScore(score);
      updateAllCells(movedCells);

      // Reset action in progress after a short delay to allow animations to complete
      setTimeout(() => {
        setActionInProgress(false);
      }, 300); // 300ms delay to allow for cell animations
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

  const onListernTouchEnd = (e: TouchEvent) => {
    // Ignore if touch ends on a button or link
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    if (!touchStartPointRef.current) return;
    const deltaX = touchEndX - touchStartPointRef.current.x;
    const deltaY = touchEndY - touchStartPointRef.current.y;
    const distance = Math.hypot(deltaX, deltaY);

    // Ignore small swipes
    if (distance < 30) return;

    // Calculate angle in degrees
    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = angleRad * (180 / Math.PI);
    const angle360 = (angleDeg + 360) % 360;
    if (!isActionInProgress) {
      if (angle360 <= 45 || angle360 >= 315) {
        handleMoveCells("right");
      } else if (angle360 > 45 && angle360 < 135) {
        handleMoveCells("down");
      } else if (angle360 >= 135 && angle360 <= 225) {
        handleMoveCells("left");
      } else if (angle360 > 225 && angle360 < 315) {
        handleMoveCells("up");
      }
    }
  };

  const onListenTouchStart = (e: TouchEvent) => {
    // Ignore if touch starts on a button or link
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) return;

    const touchStartX = e.touches[0].clientX;
    const touchStartY = e.touches[0].clientY;
    touchStartPointRef.current = { x: touchStartX, y: touchStartY };
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    const container = document.getElementById("container");

    if (!powerUpAction) {
      // Attach keydown event listener
      document.addEventListener("keydown", onListenPressMoveBtn);
      if (container) {
        container.addEventListener("touchstart", onListenTouchStart);
        container.addEventListener("touchend", onListernTouchEnd);
      }
    }
    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", onListenPressMoveBtn);
      if (container) {
        container.removeEventListener("touchstart", onListenTouchStart);
        container.removeEventListener("touchend", onListernTouchEnd);
      }
    };
  }, [powerUpAction]);

  useEffect(() => {
    setLayoutByWidth(screenWidth);
  }, [screenWidth]);

  return (
    <main
      id="container"
      className="bg-[#FAF8F0] px-4 h-svh lg:h-screen w-full font-family-rubik"
    >
      <div className="pt-5 flex flex-col items-center gap-y-4 sm:gap-y-5 max-w-[1120px] mx-auto">
        <Header />
        {/* Score section */}
        <div className="flex sm:hidden w-full gap-x-4">
          <Score label="Score" score={score} isActive />
          <Score label="Best" score={bestScore} />
        </div>
        {/* Cells section */}
        <CellLayout />
        <PowerUpButtonGroup />
        <Footer />
      </div>
      {gameOver && <GameOver />}

      <Introduction
        open={firstLoad}
        setOpen={() => {
          setFirstLoad(false);
          localStorage.setItem("firstLoad", "false");
        }}
      />
      <PowerUpActionLayout />
    </main>
  );
}

export default App;
