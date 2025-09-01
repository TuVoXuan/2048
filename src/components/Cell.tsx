/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import useAppStore from "../store/AppStore";
import type { ICell } from "../types";

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
  const {
    updateMergeState,
    layout: { cellSize },
  } = useAppStore();
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
        setTimeout(() => {
          setShowMergeEffect(false);
          updateMergeState(value.id, false);
        }, 300);
      }, mergeDelay);
      return () => clearTimeout(timer);
    }
  }, [value.isMerging, value.id, mergeDelay, updateMergeState]);

  const getCellBgColor = (cellValue: number) =>
    cellBgColors[cellValue] || "bg-[#F1D26A]";

  const getCellTextColor = (cellValue: number) =>
    cellTextColors[cellValue] || "text-white";

  const getFontSize = (cellValue: number) => {
    if (cellValue < 1000) return "text-[30px] md:text-[42px]";
    if (cellValue < 10000) return "text-[26px] md:text-[36px]";
    if (cellValue < 100000) return "text-[24px] md:text-[29px]";
    if (cellValue < 1000000) return "text-[20px] md:text-[24px]";
    if (cellValue < 10000000) return "text-[18px] md:text-[22px]";
    return "text-[20px]";
  };

  // Animation configurations
  const getScaleAnimation = () => {
    if (showMergeEffect) {
      return [1, 1.1, 1];
    }
    return hasMounted ? 1 : 0;
  };

  const getScaleTransition = () => {
    if (showMergeEffect) {
      return {
        duration: 0.3,
        times: [0, 0.4, 0.8, 1],
        ease: "easeInOut",
      };
    }
    if (!value.isHistory) {
      return {
        type: "spring",
        damping: 15,
        stiffness: 300,
        duration: 0.3,
      };
    }
  };

  const getAnimateProps = () => {
    const baseProps: any = {
      top: value.position.top + "px",
      left: value.position.left + "px",
    };

    if (value.lastPosition) {
      baseProps.opacity = 1;
      baseProps.scale = 1;
    } else {
      baseProps.opacity = hasMounted ? 1 : 0;
      baseProps.scale = getScaleAnimation();
    }

    return baseProps;
  };

  const getTransitionProps = () => {
    const baseTransition: any = {
      layout: {
        duration: 0.25,
        ease: "easeInOut",
      },
      default: {
        type: "spring",
        duration: 0.3,
      },
    };

    if (!value.lastPosition) {
      baseTransition.scale = getScaleTransition();
    }

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

  const getInitialProps = () => {
    if (value.lastPosition) {
      return {
        opacity: 1,
        scale: 1,
        top: value.lastPosition.top + "px",
        left: value.lastPosition.left + "px",
      };
    }
    return {
      opacity: 0,
      scale: 0,
      top: value.position.top + "px",
      left: value.position.left + "px",
    };
  };

  return (
    <AnimatePresence>
      <motion.div
        key={`cell-${value.id}`}
        layout
        layoutId={`cell-${value.id}`}
        initial={getInitialProps()}
        animate={getAnimateProps()}
        transition={getTransitionProps() as any}
        exit={{
          opacity: 0,
          scale: 0,
        }}
        style={{
          height: cellSize + "px",
          width: cellSize + "px",
          zIndex: value.isMergingTo ? 1 : showMergeEffect ? 10 : 2,
        }}
        className={cn(
          "select-none absolute h-20 w-20 rounded-lg shadow-md flex items-center justify-center",
          getCellBgColor(value.value),
          getCellTextColor(value.value),
          getFontSize(value.value)
        )}
      >
        <span className="font-bold">{value.value}</span>
      </motion.div>
    </AnimatePresence>
  );
}
