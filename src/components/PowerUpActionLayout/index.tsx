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
    setValueOfTileToDelete,
    valueOfTileToDelete,
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

  function handleCancelDeleteTilesByNumber() {
    setValueOfTileToDelete(undefined);
    setPowerUpAction(undefined);
  }

  function handleDeleteTilesByNumber() {
    addHistory(cloneDeep(cells));
    const deletedCells = cells.filter(
      (cell) => cell.value === valueOfTileToDelete && !cell.isMergingTo
    );
    const cellsAfterDelete = cells.filter((cell) => {
      const shouldDelete = deletedCells.some(
        (deletedCell) =>
          deletedCell.position.row === cell.position.row &&
          deletedCell.position.column === cell.position.column
      );
      return !shouldDelete;
    });
    updateAllCells([...cellsAfterDelete]);
    handleCancelDeleteTilesByNumber();
    minuteRemainingTurnPowerUp("deleteTilesByNumber");
  }

  useEffect(() => {
    if (swapTwoTiles.length === 2) {
      handleSwapTwoTile();
    }
  }, [swapTwoTiles.length]);

  useEffect(() => {
    if (valueOfTileToDelete) {
      handleDeleteTilesByNumber();
    }
  }, [valueOfTileToDelete]);

  return (
    <div>
      {powerUpAction === "swapTwoTiles" && (
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
      {powerUpAction === "deleteTilesByNumber" && (
        <PowerUpAction
          title="Delete tiles by number"
          description="Choose a number"
          onCancel={handleCancelDeleteTilesByNumber}
        />
      )}
    </div>
  );
}
