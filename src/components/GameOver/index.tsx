import { cn } from "@/lib/utils";
import useAppStore from "@/store/AppStore";
import { AnimatePresence, motion } from "motion/react";
import Cell from "../Cell";
import { Button } from "../ui/button";

export default function GameOver() {
  const {
    cells,
    resetGame,
    score,
    bestScore,
    setBestScore,
    moves,
    layout: { layoutSpacing, cellSize },
  } = useAppStore();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        duration: 0.8,
      }}
      className="fixed z-10 inset-0 bg-[#FAF8F0]"
    >
      <div className="max-w-[1120px] mx-auto flex flex-col gap-y-5 items-center">
        <div className="px-4 pt-8 flex flex-col gap-y-2 items-center">
          <h1 className="text-[48px] text-[#978876] font-semibold">
            Game Over
          </h1>
          <p className="text-[#978876] text-center">
            {score} points scored in {moves} moves. <br className="lg:hidden" />
            <span className="font-medium">No powerups used!</span>
          </p>
        </div>

        <section
          style={{
            gap: layoutSpacing + "px",
            padding: layoutSpacing + "px",
          }}
          className={cn("relative bg-[#9C8B7C] grid grid-cols-4 rounded-xl")}
        >
          {new Array(16).fill(0).map((_, index) => (
            <div
              key={index}
              style={{
                height: cellSize + "px",
                width: cellSize + "px",
              }}
              className={cn("bg-[#BDAC97] rounded-lg shadow-2xs")}
            ></div>
          ))}

          <AnimatePresence mode="popLayout">
            {cells.map((cell) => (
              <Cell key={cell.id} value={cell} />
            ))}
          </AnimatePresence>
        </section>

        <div className="flex flex-col gap-y-3">
          <Button
            className="w-[320px] sm:w-[400px] bg-transparent border-[#9C8B7C] text-[#9C8B7C] font-normal hover:bg-transparent cursor-pointer"
            variant={"outline"}
            onClick={() => {
              resetGame();
              if (score > bestScore) setBestScore(score);
            }}
          >
            Play Again
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
