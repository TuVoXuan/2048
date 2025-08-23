/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const timer = setTimeout(() => setHasMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (value.isMerging) {
      const timer = setTimeout(() => {
        setShowMergeEffect(true);
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
  }, [
    value.isMerging,
    value.id,
    mergeDelay,
    showPulseEffectMerge,
    updateMergeState,
  ]);

  const getCellBgColor = (cellValue: number) =>
    cellBgColors[cellValue] || "bg-[#F1D26A]";

  const getCellTextColor = (cellValue: number) =>
    cellTextColors[cellValue] || "text-white";

  const getFontSize = (cellValue: number) => {
    if (cellValue < 1000) return "text-[38px]";
    if (cellValue < 10000) return "text-[32px]";
    if (cellValue < 100000) return "text-[25px]";
    if (cellValue < 1000000) return "text-[20px]";
    if (cellValue < 10000000) return "text-[18px]";
    return "text-[16px]";
  };

  const onAnimationCompleteToRemove = () => {
    if (value.isMergingTo) {
      removeCell(value.id);
    }
  };

  // Animation configurations
  const getScaleAnimation = () => {
    if (showMergeEffect) {
      return showPulseEffectMerge ? [1, 1.3, 1.1, 1] : [1, 1.1, 1];
    }
    return hasMounted ? 1 : 0;
  };

  const getScaleTransition = () => {
    if (showMergeEffect) {
      return {
        duration: showPulseEffectMerge ? 0.6 : 0.3,
        times: [0, 0.4, 0.8, 1],
        ease: "easeInOut",
      };
    }
    return {
      type: "spring",
      damping: 15,
      stiffness: 300,
      duration: 0.3,
    };
  };

  const getAnimateProps = () => {
    const baseProps = {
      opacity: hasMounted ? 1 : 0,
      scale: getScaleAnimation(),
      top: value.position.top + "px",
      left: value.position.left + "px",
    };

    if (showPulseEffectMerge && showMergeEffect) {
      return {
        ...baseProps,
        rotateZ: [0, 5, -5, 0],
      };
    }

    return baseProps;
  };

  const getTransitionProps = () => {
    const baseTransition = {
      layout: {
        duration: 0.25,
        ease: "easeInOut",
      },
      scale: getScaleTransition(),
      default: {
        type: "spring",
        duration: 0.3,
      },
    };

    if (showMergeEffect) {
      return {
        ...baseTransition,
        rotateZ: {
          duration: 0.6,
          ease: "easeInOut",
        },
      };
    }

    return baseTransition;
  };

  const renderNumberContent = () => {
    const numberClassName = "relative z-10 font-bold";

    if (showPulseEffectMerge) {
      return (
        <motion.span
          animate={{
            scale: showMergeEffect ? [1, 1.4, 1.2, 1] : 1,
          }}
          transition={{
            duration: showMergeEffect ? 0.6 : 0,
            times: [0, 0.4, 0.8, 1],
            ease: "easeInOut",
          }}
          className={numberClassName}
        >
          {value.value}
        </motion.span>
      );
    }

    return <span className={numberClassName}>{value.value}</span>;
  };

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
        animate={getAnimateProps()}
        transition={getTransitionProps() as any}
        exit={{
          opacity: 0,
          scale: 0,
        }}
        onAnimationComplete={onAnimationCompleteToRemove}
        style={{
          height: CELL_SIZE + "px",
          width: CELL_SIZE + "px",
          zIndex: showMergeEffect ? 10 : 1,
        }}
        className={cn(
          "select-none absolute h-20 w-20 rounded-lg shadow-md flex items-center justify-center",
          getCellBgColor(value.value),
          getCellTextColor(value.value),
          getFontSize(value.value)
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

        {renderNumberContent()}
      </motion.div>
    </AnimatePresence>
  );
}
