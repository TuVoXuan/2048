import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ArrowLeft } from "lucide-react";

interface IntroductionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Introduction({ open, setOpen }: IntroductionProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#E9E7D9] w-[450px] p-8 rounded-[22px] font-family-rubik text-[#756452]">
        <DialogHeader>
          <DialogTitle>Welcome to 2048</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="font-family-rubik text-base">
          <p>Use the arrow keys to move the tiles.</p>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="size-6 flex items-center justify-center rounded-sm bg-[#978876] text-white">
            <ArrowLeft className="size-5" />
          </div>
          <div className="size-6 flex items-center justify-center rounded-sm bg-[#978876] text-white">
            <ArrowLeft className="size-5 rotate-[90deg]" />
          </div>
          <div className="size-6 flex items-center justify-center rounded-sm bg-[#978876] text-white">
            <ArrowLeft className="size-5 rotate-[180deg]" />
          </div>
          <div className="size-6 flex items-center justify-center rounded-sm bg-[#978876] text-white">
            <ArrowLeft className="size-5 -rotate-[90deg]" />
          </div>
        </div>
        <DialogClose asChild>
          <Button className="h-12 font-family-rubik w-full font-normal bg-[#978876] text-white text-base hover:bg-[#978876] cursor-pointer">
            Ok, got it!
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
