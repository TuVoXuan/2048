import useAppStore from "@/store/AppStore";
import Icons from "../Icons";
import PowerUpsButton from "../PowerUpButton";
import { useEffect } from "react";

export default function PowerUpButtonGroup() {
  const {
    powerUps: { undo, swapTwoTiles, deleteTilesByNumber },
    updateAllCells,
    gameHistories,
    removeLastHistory,
    minusMove,
    scoreHistory,
    removeLastScoreHistory,
    setScore,
    minuteRemainingTurnPowerUp,
    addReminingTurnPowerUp,
    cells,
  } = useAppStore();

  useEffect(() => {
    if (undo.tileToGetUse) {
      const hasTileToGetUse = cells.some(
        (cell) => cell.value === undo.tileToGetUse
      );
      if (hasTileToGetUse) {
        addReminingTurnPowerUp("undo");
      }
    }
    if (swapTwoTiles.tileToGetUse) {
      const hasTileToGetUse = cells.some(
        (cell) => cell.value === swapTwoTiles.tileToGetUse
      );
      if (hasTileToGetUse) {
        addReminingTurnPowerUp("swapTwoTiles");
      }
    }
    if (deleteTilesByNumber.tileToGetUse) {
      const hasTileToGetUse = cells.some(
        (cell) => cell.value === deleteTilesByNumber.tileToGetUse
      );
      if (hasTileToGetUse) {
        addReminingTurnPowerUp("deleteTilesByNumber");
      }
    }
  }, [
    cells,
    undo.tileToGetUse,
    swapTwoTiles.tileToGetUse,
    deleteTilesByNumber.tileToGetUse,
    addReminingTurnPowerUp,
  ]);

  function handleUndo() {
    const lastMovedCells = gameHistories.at(-1);
    const lastScore = scoreHistory.at(-1);
    if (lastMovedCells && lastScore !== undefined) {
      updateAllCells(lastMovedCells);
      removeLastHistory();
      minusMove();
      setScore(lastScore);
      removeLastScoreHistory();
      minuteRemainingTurnPowerUp("undo");
    }
  }

  return (
    <div className="flex items-center gap-x-3 p-3 rounded-[22px] bg-[#eae7d9]">
      <PowerUpsButton
        title={undo.name}
        icon={<Icons.Back />}
        remainingUses={undo.remainingUse}
        tileValueToGetUse={undo.tileToGetUse}
        active={undo.remainingUse > 0 && gameHistories.length > 0}
        onClick={handleUndo}
      />
      <PowerUpsButton
        title={swapTwoTiles.name}
        icon={<Icons.Swap />}
        remainingUses={swapTwoTiles.remainingUse}
        tileValueToGetUse={swapTwoTiles.tileToGetUse}
      />
      <PowerUpsButton
        title={deleteTilesByNumber.name}
        icon={<Icons.DeleteTile />}
        remainingUses={deleteTilesByNumber.remainingUse}
        tileValueToGetUse={deleteTilesByNumber.tileToGetUse}
      />
    </div>
  );
}
