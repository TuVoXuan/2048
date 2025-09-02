import { useScreenWidth } from "@/hooks/useScreenWidth";
import useAppStore from "@/store/AppStore";
import { motion } from "motion/react";
import { useState } from "react";
import NavIcon from "../Navigation/NavIcon";
import Score from "../Score";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function Header() {
  const { score, bestScore, resetGame, powerUpAction } = useAppStore();
  const [showDialogNewGame, setShowDialogNewGame] = useState<boolean>(false);
  const screenWidth = useScreenWidth();

  return (
    <>
      <motion.header
        animate={{
          visibility:
            screenWidth <= 640 && powerUpAction ? "hidden" : "visible",
          opacity: screenWidth <= 640 && powerUpAction ? 0 : 1,
        }}
        className={"relative flex justify-between items-center w-full"}
      >
        <NavIcon />

        <motion.div
          animate={{
            opacity: screenWidth > 640 && powerUpAction ? 0 : 1,
          }}
          className={
            "hidden sm:flex items-center gap-x-4 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          }
        >
          <Score label="Score" score={score} isActive />
          <Score label="Best" score={bestScore} />
        </motion.div>

        <Button
          onClick={() => setShowDialogNewGame(true)}
          className="font-family-rubik bg-[#978876] text-white text-base hover:bg-[#978876] cursor-pointer"
        >
          New game
        </Button>
      </motion.header>

      <Dialog open={showDialogNewGame} onOpenChange={setShowDialogNewGame}>
        <DialogHeader className="hidden">
          <DialogTitle>New Game Dialog</DialogTitle>
          <DialogDescription>New Game Dialog Description</DialogDescription>
        </DialogHeader>
        <DialogContent
          className="bg-[#E9E7D9] w-[450px] p-4 sm:p-8 rounded-[22px] gap-y-8"
          showCloseButton={false}
        >
          <div className="font-family-rubik">
            <h1 className="text-[28px] sm:text-[36px] text-center text-[#756452] font-medium">
              New Game
            </h1>
            <div className="text-[#756452] text-center">
              <p className="text-sm">
                Are you sure you want to start a new game?
              </p>
              <p className="text-sm">All progress will be lost.</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <Button
              onClick={() => {
                resetGame();
                setShowDialogNewGame(false);
              }}
              className="h-10 sm:h-12 font-family-rubik w-full font-normal bg-[#978876] text-white text-sm sm:text-base hover:bg-[#978876] cursor-pointer"
            >
              Start New Game
            </Button>
            <DialogClose asChild>
              <Button className="h-10 sm:h-12 font-family-rubik w-full border border-[#978876] font-normal text-[#756452] bg-transparent text-sm sm:text-base hover:bg-transparent cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
