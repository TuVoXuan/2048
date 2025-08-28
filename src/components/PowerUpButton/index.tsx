import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface PowerUpsButtonProps {
  title: string;
  icon: React.ReactNode;
  remainingUses: number;
  tileValueToGetUse: number;
  active?: boolean;
  onClick?: () => void;
}

export default function PowerUpsButton({
  title,
  icon,
  remainingUses,
  tileValueToGetUse,
  active,
  onClick,
}: PowerUpsButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col gap-y-2 items-center">
          <button
            onClick={onClick}
            disabled={!active}
            className={cn(
              "cursor-pointer disabled:cursor-default h-12 w-12 rounded-[10px] flex items-center justify-center text-white",
              active ? "bg-[#baac9a]" : "bg-[#baac9a]/30"
            )}
          >
            {icon}
          </button>
          <div className="px-[6px] flex items-center gap-x-1 w-full">
            {new Array(2).fill(0).map((_item, index) => (
              <div
                key={uuidv4()}
                className={cn(
                  "h-[3px] flex-1 rounded-full",
                  remainingUses >= index + 1
                    ? "bg-[#A79B8B]"
                    : "bg-[#A79B8B]/30"
                )}
              ></div>
            ))}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        showArrow={false}
        sideOffset={20}
        className="bg-[#534f48]"
      >
        <div className="text-white/80 text-xs font-light font-family-rubik">
          <span className="uppercase font-semibold inline-block mr-2">
            {title}
          </span>
          <span>{remainingUses} uses left</span>
        </div>
        <p className="text-white/80 text-xs font-light font-family-rubik">
          Make a {tileValueToGetUse} tile to get more uses
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
