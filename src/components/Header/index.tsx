import useAppStore from "@/store/AppStore";
import NavIcon from "../Navigation/NavIcon";
import Score from "../Score";
import { Button } from "../ui/button";

export default function Header() {
  const { score } = useAppStore();
  return (
    <header className="relative flex justify-between items-center w-full">
      <NavIcon />

      <div className="flex items-center gap-x-4 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        <Score label="Score" score={score} isActive />
        <Score label="Best" score={1234} />
      </div>

      <Button className="bg-[#978876] text-white text-base hover:bg-[#978876] cursor-pointer">
        New game
      </Button>
    </header>
  );
}
