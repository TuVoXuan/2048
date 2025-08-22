import { AnimatePresence, motion } from "motion/react";
import { CELL_SIZE } from "../constants";
import type { ICell } from "../types";
import { cn } from "../utils";
import { useEffect, useState } from "react";
import useAppStore from "../store/AppStore";

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

export default function Cell({
  value,
  mergeDelay = 0,
}: {
  value: ICell;
  mergeDelay?: number;
}) {
  const { updateMergeState } = useAppStore();
  const [hasMounted, setHasMounted] = useState(false);
  // need to to find a way to tracking value of cell then when it is merged then trigger change
  // value -> trigger animation
  const [showMergeEffect, setShowMergeEffect] = useState(false);

  useEffect(() => {
    // Small delay to ensure animation plays
    const timer = setTimeout(() => setHasMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (value.isMerging) {
      // Delay the merge effect if specified
      const timer = setTimeout(() => {
        setShowMergeEffect(true);
        // Reset after animation
        setTimeout(() => {
          setShowMergeEffect(false);
          updateMergeState(value.id, false);
        }, 600);
      }, mergeDelay);
      return () => clearTimeout(timer);
    }
  }, [value.isMerging, mergeDelay]);

  const getCellBgColor = (cellValue: number) =>
    cellBgColors[cellValue] || "bg-[#F1D26A]";

  const getCellTextColor = (cellValue: number) =>
    cellTextColors[cellValue] || "text-white";

  return (
    <AnimatePresence>
      <motion.div
        key={`cell-${value.id}`}
        layout
        layoutId={`cell-${value.id}`}
        initial={{
          opacity: 0,
          scale: 0,
          top: value.position.top + "px",
          left: value.position.left + "px",
        }}
        animate={{
          opacity: hasMounted ? 1 : 0,
          scale: showMergeEffect ? [1, 1.3, 1.1, 1] : hasMounted ? 1 : 0,
          top: value.position.top + "px",
          left: value.position.left + "px",
          rotateZ: showMergeEffect ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          layout: {
            duration: 0.25,
            ease: "easeInOut",
          },
          scale: showMergeEffect
            ? {
                duration: 0.6,
                times: [0, 0.4, 0.8, 1],
                ease: "easeInOut",
              }
            : {
                type: "spring",
                damping: 15,
                stiffness: 300,
                duration: 0.3,
              },
          rotateZ: {
            duration: 0.6,
            ease: "easeInOut",
          },
          default: {
            type: "spring",
            duration: 0.3,
          },
        }}
        style={{
          height: CELL_SIZE + "px",
          width: CELL_SIZE + "px",
          zIndex: showMergeEffect ? 10 : 1,
        }}
        className={cn(
          "select-none absolute h-20 w-20 rounded-lg shadow-md flex items-center justify-center font-semibold text-[38px]",
          getCellBgColor(value.value),
          getCellTextColor(value.value)
        )}
      >
        {/* Background pulse effect during merge */}
        {showMergeEffect && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
              "absolute inset-0 rounded-lg",
              getCellBgColor(value.value),
              "opacity-30"
            )}
          />
        )}
        {/* Sparkle effects */}
        {/* <>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              scale: 0,
              opacity: 1,
              x: 0,
              y: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              x: [0, Math.cos((i * 60 * Math.PI) / 180) * 30],
              y: [0, Math.sin((i * 60 * Math.PI) / 180) * 30],
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              times: [0, 0.5, 1],
            }}
            className="absolute w-2 h-2 bg-red-400 rounded-full"
          />
        ))}
      </> */}
        {/* Number with bounce effect */}
        <motion.span
          animate={{
            scale: showMergeEffect ? [1, 1.4, 1.2, 1] : 1,
          }}
          transition={{
            duration: showMergeEffect ? 0.6 : 0,
            times: [0, 0.4, 0.8, 1],
            ease: "easeInOut",
          }}
          className="relative z-10 font-extrabold"
        >
          {value.value}
        </motion.span>

        {/* Score popup effect */}
        {showMergeEffect && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: -40, scale: 1 }}
            transition={{
              duration: 1.2,
              times: [0, 0.2, 0.8, 1],
              ease: "easeOut",
            }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-500 font-bold text-lg pointer-events-none z-20"
          >
            +{value.value}
          </motion.div>
        )}
        <span className="absolute top-2 left-2 text-black text-[10px]">
          {value.id}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
