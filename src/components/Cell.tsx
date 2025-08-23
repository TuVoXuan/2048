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
  const { updateMergeState, removeCell, showPulseEffectMerge } = useAppStore();
  const [hasMounted, setHasMounted] = useState(false);
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
        setTimeout(
          () => {
            setShowMergeEffect(false);
            updateMergeState(value.id, false);
          },
          showPulseEffectMerge ? 600 : 300
        );
      }, mergeDelay);
      return () => clearTimeout(timer);
    }
  }, [value.isMerging, value.id, mergeDelay]);

  const getCellBgColor = (cellValue: number) =>
    cellBgColors[cellValue] || "bg-[#F1D26A]";

  const getCellTextColor = (cellValue: number) =>
    cellTextColors[cellValue] || "text-white";

  const getFontsize = (cellValue: number) => {
    if (cellValue < 1000) {
      return "text-[38px]";
    } else if (cellValue > 1000 && cellValue < 10000) {
      return "text-[32px]";
    } else if (cellValue > 10000 && cellValue < 100000) {
      return "text-[25px]";
    } else if (cellValue > 100000 && cellValue < 1000000) {
      return "text-[20px]";
    } else if (cellValue > 1000000 && cellValue < 10000000) {
      return "text-[18px]";
    } else {
      return "text-[16px]";
    }
  };

  //handle remove cell when isMergingTo === true when complete animation
  function onAnimatedCompleteToRemove() {
    if (value.isMergingTo) {
      removeCell(value.id);
    }
  }

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
        animate={
          showPulseEffectMerge
            ? {
                opacity: hasMounted ? 1 : 0,
                scale: showMergeEffect ? [1, 1.3, 1.1, 1] : hasMounted ? 1 : 0,
                top: value.position.top + "px",
                left: value.position.left + "px",
                rotateZ: showMergeEffect ? [0, 5, -5, 0] : 0,
              }
            : {
                opacity: hasMounted ? 1 : 0,
                scale: showMergeEffect ? [1, 1.1, 1] : hasMounted ? 1 : 0,
                top: value.position.top + "px",
                left: value.position.left + "px",
              }
        }
        transition={{
          layout: {
            duration: 0.25,
            ease: "easeInOut",
          },
          scale: showMergeEffect
            ? showPulseEffectMerge
              ? {
                  duration: 0.6,
                  times: [0, 0.4, 0.8, 1],
                  ease: "easeInOut",
                }
              : {
                  duration: 0.3,
                  times: [0, 0.4, 0.8, 1],
                  ease: "easeInOut",
                }
            : {
                type: "spring",
                damping: 15,
                stiffness: 300,
                duration: 0.3,
              },
          ...(showMergeEffect && {
            rotateZ: {
              duration: 0.6,
              ease: "easeInOut",
            },
          }),
          default: {
            type: "spring",
            duration: 0.3,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0,
        }}
        onAnimationComplete={onAnimatedCompleteToRemove}
        style={{
          height: CELL_SIZE + "px",
          width: CELL_SIZE + "px",
          zIndex: showMergeEffect ? 10 : 1,
        }}
        className={cn(
          "select-none absolute h-20 w-20 rounded-lg shadow-md flex items-center justify-center",
          getCellBgColor(value.value),
          getCellTextColor(value.value),
          getFontsize(value.value)
        )}
      >
        {/* Background pulse effect during merge - for premium feature */}
        {showPulseEffectMerge && showMergeEffect && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
              "absolute inset-0 rounded-lg z-[-1]",
              getCellBgColor(value.value),
              "opacity-30"
            )}
          />
        )}

        {/* Number with bounce effect */}
        {showPulseEffectMerge ? (
          <motion.span
            animate={{
              scale: showMergeEffect ? [1, 1.4, 1.2, 1] : 1,
            }}
            transition={{
              duration: showMergeEffect ? 0.6 : 0,
              times: [0, 0.4, 0.8, 1],
              ease: "easeInOut",
            }}
            className={"relative z-10 font-bold"}
          >
            {value.value}
          </motion.span>
        ) : (
          <span className={"relative z-10 font-bold"}>{value.value}</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
