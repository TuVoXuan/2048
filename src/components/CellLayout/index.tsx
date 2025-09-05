import { AnimatePresence, motion } from "motion/react";
import Cell from "../Cell";
import { cn } from "@/lib/utils";
import useAppStore from "@/store/AppStore";
import { useEffect, useState } from "react";
import type { IPosition } from "@/types";

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

  function handleMouseOverCellLayout(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.dataset?.type === "empty" || target.dataset.type === "cell") {
      const position = target.dataset?.position
        ? (JSON.parse(target.dataset?.position) as IPosition)
        : null;
      if (position) {
        setTeleportPositionState({
          position,
          show: target.dataset?.type === "empty" ? true : false,
        });
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

  useEffect(() => {
    const cellLayout = document.getElementById("cell-layout");

    if (powerUpAction === "teleportATile" && tileToTeleport) {
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
            className="absolute bg-transparent rounded-xl border-[2.5px] border-white"
            onClick={handleClickEmptyCell}
          ></motion.div>
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
