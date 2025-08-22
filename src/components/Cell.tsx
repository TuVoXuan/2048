import { motion } from "motion/react";
import { CELL_SIZE } from "../constants";
import type { ICell } from "../types";
import { cn } from "../utils";
import { useEffect, useState } from "react";

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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Small delay to ensure animation plays
    const timer = setTimeout(() => setHasMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getCellBgColor = (cellValue: number) =>
    cellBgColors[cellValue] || "bg-[#F1D26A]";

  const getCellTextColor = (cellValue: number) =>
    cellTextColors[cellValue] || "text-white";

  return (
    <motion.div
      key={value.id}
      initial={{
        opacity: 0,
        scale: 0,
        top: value.position.top + "px",
        left: value.position.left + "px",
      }}
      animate={{
        opacity: hasMounted ? 1 : 0,
        scale: hasMounted ? 1 : 0,
        top: value.position.top + "px",
        left: value.position.left + "px",
      }}
      transition={{
        type: "spring",
        duration: 0.3,
      }}
      exit={{
        opacity: 0,
        scale: 0,
      }}
      style={{
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
      <span className="absolute top-2 left-2 text-black text-[10px]">
        {value.id}
      </span>
    </motion.div>
  );
}
