import useAppStore from "@/store/AppStore";
import Icons from "../Icons";
import PowerUpsButton from "../PowerUpButton";

export default function PowerUpButtonGroup() {
  const {
    powerUps,
    updateAllCells,
    gameHistories,
    removeLastHistory,
    minusMove,
    scoreHistory,
    removeLastScoreHistory,
    setScore,
    minuteRemainingTurnPowerUp,
    powerUpAction,
    setPowerUpAction,
  } = useAppStore();

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
        title={powerUps.undo.name}
        icon={<Icons.Back />}
        remainingUses={powerUps.undo.remainingUse}
        tileValueToGetUse={powerUps.undo.tileToGetUse}
        active={powerUps.undo.remainingUse > 0 && gameHistories.length > 0}
        onClick={handleUndo}
      />
      <PowerUpsButton
        active={
          powerUps.swapTwoTiles.remainingUse > 0 && gameHistories.length > 0
        }
        title={powerUps.swapTwoTiles.name}
        icon={<Icons.Swap />}
        remainingUses={powerUps.swapTwoTiles.remainingUse}
        tileValueToGetUse={powerUps.swapTwoTiles.tileToGetUse}
        powerUpActionToToggle="swapTwoTiles"
        powerUpAction={powerUpAction}
        onClick={() => setPowerUpAction("swapTwoTiles")}
      />
      <PowerUpsButton
        active={
          powerUps.deleteTilesByNumber.remainingUse > 0 &&
          gameHistories.length > 0
        }
        title={powerUps.deleteTilesByNumber.name}
        icon={<Icons.DeleteTile />}
        remainingUses={powerUps.deleteTilesByNumber.remainingUse}
        tileValueToGetUse={powerUps.deleteTilesByNumber.tileToGetUse}
        powerUpActionToToggle="deleteTilesByNumber"
        powerUpAction={powerUpAction}
        onClick={() => setPowerUpAction("deleteTilesByNumber")}
      />
    </div>
  );
}
