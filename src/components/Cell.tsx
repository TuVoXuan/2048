import { CELL_SIZE } from "../constants";
import type { ICell } from "../types";
import { cn } from "../utils";

export default function Cell({ value }: { value: ICell }) {
  const getCellBgColor = (cellValue: number) => {
    switch (cellValue) {
      case 2:
        return "bg-[#EFE4DA]";
      case 4:
        return "bg-[#EBD8B6]";
      case 8:
        return "bg-[#F3B178]";
      case 16:
        return "bg-[#F6925F]";
      case 32:
        return "bg-[#F77F64]";
      case 64:
        return "bg-[#F66543]";
      case 128:
        return "bg-[#F1D26A]";
      default:
        return "bg-[#F1D26A]";
    }
  };

  const getCellTextColor = (cellValue: number) => {
    switch (cellValue) {
      case 2:
      case 4:
        return "text-[#746452]";
      default:
        return "text-white";
    }
  };

  return (
    <div
      style={{
        top: value.position.top + "px",
        left: value.position.left + "px",
        height: CELL_SIZE + "px",
        width: CELL_SIZE + "px",
      }}
      className={cn(
        "select-none absolute h-20 w-20 rounded-lg shadow-md flex items-center justify-center font-semibold text-[38px]",
        getCellBgColor(value.value),
        getCellTextColor(value.value)
      )}
    >
      {value.value}
    </div>
  );
}
