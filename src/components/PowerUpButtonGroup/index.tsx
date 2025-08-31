import useAppStore from "@/store/AppStore";
import PowerUpsButton from "../PowerUpButton";
import Icons from "../Icons";

export default function PowerUpButtonGroup() {
  const {
    powerUps: { undo, swapTwoTiles, deleteTilesByNumber },
    updateAllCells,
    gameHistories,
    removeLastHistory,
    minusMove,
    cells,
  } = useAppStore();

  function handleUndo() {
    console.log("gameHistories: ", gameHistories);
    const lastMovedCells = gameHistories.at(-1);
    if (lastMovedCells) {
      console.log("cells: ", cells);
      console.log("lastMovedCells:", lastMovedCells);
      updateAllCells(lastMovedCells);
      removeLastHistory();
      minusMove();
      //minute score
    }
  }

  return (
    <div className="flex items-center gap-x-3 p-3 rounded-[22px] bg-[#eae7d9]">
      <PowerUpsButton
        title={undo.name}
        icon={<Icons.Back />}
        remainingUses={undo.remainingUse}
        tileValueToGetUse={undo.tileToGetUse}
        active
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
