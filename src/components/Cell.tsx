import { CELL_SIZE } from "../constants";
import type { ICell } from "../types";
import { cn } from "../utils";

const cellBgColors: Record<number, string> = {
  2: "bg-[#EFE4DA]",
  4: "bg-[#EBD8B6]",
  8: "bg-[#F3B178]",
  16: "bg-[#F6925F]",
  32: "bg-[#F77F64]",
  64: "bg-[#F66543]",
  128: "bg-[#F1D26A]",
};

const cellTextColors: Record<number, string> = {
  2: "text-[#746452]",
  4: "text-[#746452]",
};

export default function Cell({ value }: { value: ICell }) {
  const getCellBgColor = (cellValue: number) =>
    cellBgColors[cellValue] || "bg-[#F1D26A]";

  const getCellTextColor = (cellValue: number) =>
    cellTextColors[cellValue] || "text-white";

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
