import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Cell from "./components/Cell";
import {
  CELL_SIZE,
  LAYOUT_SPACING,
  MoveKeyCodes,
  SQUARE_GRID_SIZE,
} from "./constants";
import { useCellGridPositions } from "./hooks/useCellGridPositions";
import type { Direction, ICell, IPosition } from "./types";
import {
  cn,
  findFrontCell,
  getCellPosition,
  isValidMoveKey,
  sortFollowDirection,
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

// Extract the movement logic to a pure function
function calculateMovedCells(
  cells: ICell[],
  direction: Direction,
  cellGridPositions: IPosition[]
): ICell[] {
  console.log("cells: ", cells);

  const sortedCells = sortFollowDirection(cells, direction);
  console.log("sortedCells: ", sortedCells);
  const movedCells: ICell[] = [];

  for (let i = 0; i < sortedCells.length; i++) {
    const cell = sortedCells[i];

    const frontCell = findFrontCell(
      [...movedCells, ...sortedCells.slice(i + 1)],
      cell.position,
      direction
    );

    if (!frontCell) {
      // Move to edge if possible
      let newPosition: IPosition | undefined;

      if (direction === "down" && cell.position.row !== SQUARE_GRID_SIZE - 1) {
        newPosition = cellGridPositions.find(
          (position) =>
            position.column === cell.position.column &&
            position.row === SQUARE_GRID_SIZE - 1
        );
      } else if (direction === "up" && cell.position.row !== 0) {
        newPosition = cellGridPositions.find(
          (position) =>
            position.column === cell.position.column && position.row === 0
        );
      } else if (direction === "left" && cell.position.column !== 0) {
        newPosition = cellGridPositions.find(
          (position) =>
            position.column === 0 && position.row === cell.position.row
        );
      } else if (
        direction === "right" &&
        cell.position.column !== SQUARE_GRID_SIZE - 1
      ) {
        newPosition = cellGridPositions.find(
          (position) =>
            position.column === SQUARE_GRID_SIZE - 1 &&
            position.row === cell.position.row
        );
      }

      if (newPosition) {
        movedCells.push({
          ...cell,
          position: { ...newPosition },
        });
      } else {
        // Cell can't move - keep in same position
        movedCells.push({
          ...cell,
          position: { ...cell.position },
        });
      }
    } else {
      // Move to position next to frontCell (no merging)
      let newPosition: IPosition | undefined;

      if (direction === "down") {
        newPosition = getCellPosition(
          {
            row: frontCell.position.row - 1,
            column: frontCell.position.column,
          },
          cellGridPositions
        );
      } else if (direction === "up") {
        newPosition = getCellPosition(
          {
            row: frontCell.position.row + 1,
            column: frontCell.position.column,
          },
          cellGridPositions
        );
      } else if (direction === "left") {
        newPosition = getCellPosition(
          {
            row: frontCell.position.row,
            column: frontCell.position.column + 1,
          },
          cellGridPositions
        );
      } else if (direction === "right") {
        newPosition = getCellPosition(
          {
            row: frontCell.position.row,
            column: frontCell.position.column - 1,
          },
          cellGridPositions
        );
      }

      if (newPosition) {
        movedCells.push({
          ...cell,
          position: { ...newPosition },
        });
      } else {
        // Fallback - keep current position
        movedCells.push({
          ...cell,
          position: { ...cell.position },
        });
      }
    }
  }

  console.log("movedCells result: ", movedCells);
  return movedCells;
}

function App() {
  // const { cells, setCells } = useAppStore();
  const [cells, setCells] = useState<ICell[]>(defaultCells);
  const cellsRef = useRef<ICell[]>(defaultCells);

  useEffect(() => {
    cellsRef.current = cells;
  }, [cells]);

  const cellGridPositions = useCellGridPositions({
    cellSize: CELL_SIZE,
    columns: SQUARE_GRID_SIZE,
    layoutSpacing: LAYOUT_SPACING,
  });

  const handleMoveCells = useCallback(
    (direction: Direction) => {
      // Use ref to get current cells, calculate new state, then set it
      const currentCells = cellsRef.current;
      const movedCells = calculateMovedCells(
        currentCells,
        direction,
        cellGridPositions
      );
      setCells(movedCells);
    },
    [cellGridPositions]
  );

  const onListenPressMoveBtn = useCallback(
    (event: KeyboardEvent) => {
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
    },
    [handleMoveCells]
  );

  useEffect(() => {
    // if (cellGridPositions.length > 0) {
    //   const initRandomPosition = getTwoRandomItems(cellGridPositions);
    //   if (initRandomPosition) {
    //     const initCells = initRandomPosition.map((position) => ({
    //       id: uuidv4(),
    //       position: position,
    //       value: getRandomTwoOrFour(),
    //     }));
    //     setCells(initCells);
    //   }
    // }

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

        {cells.map((cell) => (
          <Cell key={cell.id} value={cell} />
        ))}
      </section>
    </main>
  );
}

export default App;
