import { AnimatePresence, motion } from "motion/react";
import Cell from "../Cell";
import { cn } from "@/lib/utils";
import useAppStore from "@/store/AppStore";
import { useEffect, useState } from "react";
import type { BombTilesAround, IPosition } from "@/types";
import { drawBombEffect } from "@/utils";
import { SQUARE_GRID_SIZE } from "@/constants";

//need to make border for bomb when hover -> show the border of cells will be affected by bomb

export default function CellLayout() {
  const {
    layout,
    cells,
    powerUpAction,
    cellGridPositions,
    tileToTeleport,
    setPositionToTeleport,
  } = useAppStore();
  const [teleportPositionState, setTeleportPositionState] = useState<
    { position: IPosition; show: boolean } | undefined
  >();
  const [bombPositionState, setBombPositionState] = useState<
    { position: IPosition; show: boolean } | undefined
  >();
  const [bombTileAround, setBombTileAround] = useState<BombTilesAround>({});
  const [bombPath, setBombPath] = useState<string>("");

  function handleMouseOverCellLayout(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.dataset?.type === "empty" || target.dataset.type === "cell") {
      const position = target.dataset?.position
        ? (JSON.parse(target.dataset?.position) as IPosition)
        : null;
      if (position) {
        if (powerUpAction === "teleportATile") {
          setTeleportPositionState({
            position,
            show: target.dataset?.type === "empty" ? true : false,
          });
        } else if (powerUpAction === "bomb") {
          setBombPositionState({
            position,
            show: target.dataset?.type === "cell" ? true : false,
          });
          const bombTiles: BombTilesAround = {};
          const topTile = cellGridPositions.find(
            (cell) =>
              cell.row === position.row - 1 && cell.column === position.column
          );
          const bottomTile = cellGridPositions.find(
            (cell) =>
              cell.row === position.row + 1 && cell.column === position.column
          );
          const leftTile = cellGridPositions.find(
            (cell) =>
              cell.row === position.row && cell.column === position.column - 1
          );
          const rightTile = cellGridPositions.find(
            (cell) =>
              cell.row === position.row && cell.column === position.column + 1
          );
          if (topTile) bombTiles.top = topTile;
          if (bottomTile) bombTiles.bottom = bottomTile;
          if (leftTile) bombTiles.left = leftTile;
          if (rightTile) bombTiles.right = rightTile;
          setBombTileAround(bombTiles);
        }
      }
    }
  }

  function handleClickEmptyCell() {
    if (powerUpAction === "teleportATile") {
      if (teleportPositionState?.position && teleportPositionState.show) {
        setPositionToTeleport(teleportPositionState.position);
      }
    }
  }

  function handleClickDirectlyEmptyCell(position: IPosition) {
    setPositionToTeleport(position);
  }

  useEffect(() => {
    const cellLayout = document.getElementById("cell-layout");

    if (
      (powerUpAction === "teleportATile" && tileToTeleport) ||
      powerUpAction === "bomb"
    ) {
      if (cellLayout) {
        cellLayout.addEventListener("mouseover", handleMouseOverCellLayout);
      }
    }

    return () => {
      if (cellLayout) {
        cellLayout.removeEventListener("mouseover", handleMouseOverCellLayout);
        setTeleportPositionState(undefined);
      }
    };
  }, [powerUpAction, tileToTeleport]);

  useEffect(() => {
    if (bombPositionState) {
      const path = drawBombEffect(
        bombPositionState.position,
        bombTileAround,
        layout
      );
      setBombPath(path);
    }
  }, [bombTileAround, bombPositionState]);
  console.log("bombPositionState: ", bombPositionState);
  console.log("bombPath: ", bombPath);

  return (
    <section
      id="cell-layout"
      style={{
        gap: layout.layoutSpacing + "px",
        padding: layout.layoutSpacing + "px",
      }}
      className={cn("relative bg-[#9C8B7C] grid grid-cols-4 rounded-xl")}
    >
      {cellGridPositions.map((position) => (
        <div
          key={`row-${position.row}-column-${position.column}`}
          data-type="empty"
          data-position={JSON.stringify(position)}
          style={{
            height: layout.cellSize + "px",
            width: layout.cellSize + "px",
          }}
          className={cn("bg-[#BDAC97] rounded-lg shadow-2xs")}
          onClick={() => handleClickDirectlyEmptyCell(position)}
        ></div>
      ))}

      <AnimatePresence>
        {teleportPositionState?.position && (
          <motion.div
            key={"teleportTarget"}
            layout
            initial={{
              opacity: 1,
            }}
            animate={{
              x: teleportPositionState.position.left,
              y: teleportPositionState.position.top,
              opacity: teleportPositionState.show ? 1 : 0,
            }}
            transition={{
              type: "spring",
              duration: 0.3,
            }}
            exit={{
              opacity: 0,
            }}
            style={{
              height: layout.cellSize + "px",
              width: layout.cellSize + "px",
              scale: 1.12,
            }}
            className="hidden lg:block absolute bg-transparent rounded-xl border-[2.5px] border-white"
            onClick={handleClickEmptyCell}
          ></motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bombPositionState?.position && (
          <motion.svg
            key={"bombEffect"}
            layout
            transition={{
              type: "spring",
              duration: 0.3,
            }}
            style={{
              height:
                layout.cellSize * SQUARE_GRID_SIZE +
                layout.layoutSpacing * (SQUARE_GRID_SIZE + 1) +
                "px",
              width:
                layout.cellSize * SQUARE_GRID_SIZE +
                layout.layoutSpacing * (SQUARE_GRID_SIZE + 1) +
                "px",
            }}
            className="pointer-events-none absolute top-0 left-0"
          >
            <path
              d={bombPath}
              stroke="white"
              strokeWidth="2"
              fill="transparent"
            />
          </motion.svg>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {cells.map((cell) => (
          <Cell key={cell.id} value={cell} />
        ))}
      </AnimatePresence>
    </section>
  );
}
