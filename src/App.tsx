import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Cell from "./components/Cell";
import { CELL_SIZE, LAYOUT_SPACING } from "./constants";
import { useCellGridPositions } from "./hooks/useCellGridPositions";
import type { ICell } from "./types";
import { cn, getRandomTwoOrFour, getTwoRandomItems } from "./utils";

const COLUMNS = 4;

function App() {
  const [cells, setCells] = useState<ICell[]>([]);
  const cellGridPositions = useCellGridPositions({
    cellSize: CELL_SIZE,
    columns: COLUMNS,
    layoutSpacing: LAYOUT_SPACING,
  });

  useEffect(() => {
    if (cellGridPositions.length > 0) {
      const initRandomPosition = getTwoRandomItems(cellGridPositions);
      if (initRandomPosition) {
        const initCells = initRandomPosition.map((position) => ({
          id: uuidv4(),
          position: position,
          value: getRandomTwoOrFour(),
        }));
        setCells(initCells);
      }
    }
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
