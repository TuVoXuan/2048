import useAppStore from "@/store/AppStore";
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
  const { score, bestScore, resetGame } = useAppStore();
  const [showDialogNewGame, setShowDialogNewGame] = useState<boolean>(false);

  return (
    <>
      <header className="relative flex justify-between items-center w-full">
        <NavIcon />

        <div className="flex items-center gap-x-4 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <Score label="Score" score={score} isActive />
          <Score label="Best" score={bestScore} />
        </div>

        <Button
          onClick={() => setShowDialogNewGame(true)}
          className="font-family-rubik bg-[#978876] text-white text-base hover:bg-[#978876] cursor-pointer"
        >
          New game
        </Button>
      </header>

      <Dialog open={showDialogNewGame} onOpenChange={setShowDialogNewGame}>
        <DialogHeader className="hidden">
          <DialogTitle>New Game Dialog</DialogTitle>
          <DialogDescription>New Game Dialog Description</DialogDescription>
        </DialogHeader>
        <DialogContent
          className="bg-[#E9E7D9] w-[450px] p-8 rounded-[22px] gap-y-8"
          showCloseButton={false}
        >
          <div className="font-family-rubik">
            <h1 className="text-[36px] text-center text-[#756452] font-medium">
              New Game
            </h1>
            <div className="text-[#756452] text-sm text-center">
              <p>Are you sure you want to start a new game?</p>
              <p>All progress will be lost.</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <Button
              onClick={() => {
                resetGame();
                setShowDialogNewGame(false);
              }}
              className="h-12 font-family-rubik w-full font-normal bg-[#978876] text-white text-base hover:bg-[#978876] cursor-pointer"
            >
              Start New Game
            </Button>
            <DialogClose asChild>
              <Button className="h-12 font-family-rubik w-full border border-[#978876] font-normal text-[#756452] bg-transparent text-base hover:bg-transparent cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
