/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import useAppStore from "@/store/AppStore";
import type { ICell } from "@/types";
import { AnimatePresence, motion } from "motion/react";
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

// Animation action types
type AnimationAction = "appear" | "move" | "merge" | "exit";

// Hook to determine current animation action
function useCurrentAction(value: ICell, mergeDelay: number) {
  const { updateMergeState, showPulseEffectMerge } = useAppStore();
  const [hasAppeared, setHasAppeared] = useState(false);
  const [isShowingMergeEffect, setIsShowingMergeEffect] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  // Handle appear
  useEffect(() => {
    const timer = setTimeout(() => setHasAppeared(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle merge
  useEffect(() => {
    if (value.isMerging) {
      const timer = setTimeout(() => {
        setIsShowingMergeEffect(true);
        setTimeout(
          () => {
            setIsShowingMergeEffect(false);
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

  const handleAnimationComplete = () => {
    setShouldHide(!!value.isMergingTo);
  };

  // Determine current action
  let currentAction: AnimationAction = "move"; // default

  if (!hasAppeared) {
    currentAction = "appear";
  } else if (isShowingMergeEffect) {
    currentAction = "merge";
  } else if (shouldHide) {
    currentAction = "exit";
  }

  return {
    currentAction,
    hasAppeared,
    isShowingMergeEffect,
    shouldHide,
    showPulseEffectMerge,
    handleAnimationComplete,
  };
}

// Shared cell styles and properties
function useCellProps(value: ICell) {
  const {
    layout: { cellSize },
  } = useAppStore();

  const getCellBgColor = (cellValue: number) =>
    cellBgColors[cellValue] || "bg-[#F1D26A]";

  const getCellTextColor = (cellValue: number) =>
    cellTextColors[cellValue] || "text-white";

  const getFontSize = (cellValue: number) => {
    if (cellValue < 1000) return "text-[42px]";
    if (cellValue < 10000) return "text-[36px]";
    if (cellValue < 100000) return "text-[29px]";
    if (cellValue < 1000000) return "text-[24px]";
    if (cellValue < 10000000) return "text-[22px]";
    return "text-[20px]";
  };

  const baseClassName = cn(
    "select-none absolute h-20 w-20 rounded-lg shadow-md flex items-center justify-center",
    getCellBgColor(value.value),
    getCellTextColor(value.value),
    getFontSize(value.value)
  );

  const baseStyle = {
    height: cellSize + "px",
    width: cellSize + "px",
    top: value.position.top + "px",
    left: value.position.left + "px",
  };

  return {
    cellSize,
    baseClassName,
    baseStyle,
    getCellBgColor,
  };
}

// Component for appear animation
function AppearCell({ value, onAnimationComplete, cellProps }: any) {
  return (
    <motion.div
      key={`cell-${value.id}`}
      layoutId={`cell-${value.id}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 300,
        duration: 0.3,
      }}
      onAnimationComplete={onAnimationComplete}
      style={{ ...cellProps.baseStyle, zIndex: 1 }}
      className={cellProps.baseClassName}
    >
      <span className="relative z-10 font-bold">{value.value}</span>
    </motion.div>
  );
}

// Component for move animation
function MoveCell({ value, onAnimationComplete, cellProps }: any) {
  return (
    <motion.div
      key={`cell-${value.id}`}
      layout
      layoutId={`cell-${value.id}`}
      animate={{
        top: value.position.top + "px",
        left: value.position.left + "px",
      }}
      transition={{
        layout: {
          duration: 0.25,
          ease: "easeInOut",
        },
      }}
      onAnimationComplete={onAnimationComplete}
      style={{ ...cellProps.baseStyle, zIndex: 1 }}
      className={cellProps.baseClassName}
    >
      <span className="relative z-10 font-bold">{value.value}</span>
    </motion.div>
  );
}

// Component for merge animation
function MergeCell({
  value,
  onAnimationComplete,
  cellProps,
  showPulseEffectMerge,
}: any) {
  const isPremium = showPulseEffectMerge;

  return (
    <motion.div
      key={`cell-${value.id}`}
      layout
      layoutId={`cell-${value.id}`}
      animate={{
        scale: isPremium ? [1, 1.3, 1.1, 1] : [1, 1.1, 1],
        rotateZ: isPremium ? [0, 5, -5, 0] : undefined,
        top: value.position.top + "px",
        left: value.position.left + "px",
      }}
      transition={{
        layout: {
          duration: 0.25,
          ease: "easeInOut",
        },
        scale: {
          duration: isPremium ? 0.6 : 0.3,
          times: isPremium ? [0, 0.4, 0.8, 1] : [0, 0.5, 1],
          ease: "easeInOut",
        },
        ...(isPremium && {
          rotateZ: {
            duration: 0.6,
            ease: "easeInOut",
          },
        }),
      }}
      onAnimationComplete={onAnimationComplete}
      style={{ ...cellProps.baseStyle, zIndex: 10 }}
      className={cellProps.baseClassName}
    >
      {/* Background pulse effect for premium */}
      {isPremium && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "absolute inset-0 rounded-lg z-[-1] opacity-30",
            cellProps.getCellBgColor(value.value)
          )}
        />
      )}

      {/* Text with premium animation */}
      {isPremium ? (
        <motion.span
          animate={{ scale: [1, 1.4, 1.2, 1] }}
          transition={{
            duration: 0.6,
            times: [0, 0.4, 0.8, 1],
            ease: "easeInOut",
          }}
          className="relative z-10 font-bold"
        >
          {value.value}
        </motion.span>
      ) : (
        <span className="relative z-10 font-bold">{value.value}</span>
      )}
    </motion.div>
  );
}

// Component for exit animation
function ExitCell({ value, onAnimationComplete, cellProps }: any) {
  return (
    <motion.div
      key={`cell-${value.id}`}
      layoutId={`cell-${value.id}`}
      animate={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.2 }}
      onAnimationComplete={onAnimationComplete}
      style={{ ...cellProps.baseStyle, zIndex: 1 }}
      className={cn(cellProps.baseClassName, "!opacity-0")}
    >
      <span className="relative z-10 font-bold">{value.value}</span>
    </motion.div>
  );
}

export default function CellV2({
  value,
  mergeDelay = 0,
}: {
  value: ICell;
  mergeDelay?: number;
}) {
  const animationState = useCurrentAction(value, mergeDelay);
  const cellProps = useCellProps(value);

  const renderCellByAction = () => {
    const commonProps = {
      value,
      onAnimationComplete: animationState.handleAnimationComplete,
      cellProps,
    };

    switch (animationState.currentAction) {
      case "appear":
        return <AppearCell {...commonProps} />;

      case "merge":
        return (
          <MergeCell
            {...commonProps}
            showPulseEffectMerge={animationState.showPulseEffectMerge}
          />
        );

      case "exit":
        return <ExitCell {...commonProps} />;

      case "move":
      default:
        return <MoveCell {...commonProps} />;
    }
  };

  return <AnimatePresence>{renderCellByAction()}</AnimatePresence>;
}
