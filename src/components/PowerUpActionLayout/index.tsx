import useAppStore from "@/store/AppStore";
import PowerUpAction from "../Dialog/PowerUpAction";
import { useEffect } from "react";
import { cloneDeep } from "lodash";

export default function PowerUpActionLayout() {
  const {
    powerUpAction,
    swapTwoTiles,
    clearSwapTwoTiles,
    setPowerUpAction,
    cells,
    updateAllCells,
    addHistory,
    minuteRemainingTurnPowerUp,
  } = useAppStore();

  function handleCancelSwapTwoTiles() {
    clearSwapTwoTiles();
    setPowerUpAction(undefined);
  }

  function handleSwapTwoTile() {
    addHistory(cloneDeep(cells));
    const firstCell = cells.find((cell) => cell.id === swapTwoTiles[0].id);
    const secondCell = cells.find((cell) => cell.id === swapTwoTiles[1].id);
    if (firstCell && secondCell) {
      const tempPosition = firstCell.position;
      firstCell.position = secondCell.position;
      secondCell.position = tempPosition;
      updateAllCells([...cells]);
      handleCancelSwapTwoTiles();
      minuteRemainingTurnPowerUp("swapTwoTiles");
    }
  }

  useEffect(() => {
    if (swapTwoTiles.length === 2) {
      handleSwapTwoTile();
    }
  }, [swapTwoTiles.length]);

  return (
    <div>
      {powerUpAction === "swap two tiles" && (
        <PowerUpAction
          title="Swap two tiles"
          description={`Choose the ${
            swapTwoTiles.length === 0
              ? "first"
              : swapTwoTiles.length === 1
              ? "second"
              : ""
          } tiles`}
          onCancel={handleCancelSwapTwoTiles}
        />
      )}
    </div>
  );
}
