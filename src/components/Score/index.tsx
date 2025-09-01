import { cn } from "@/lib/utils";

interface ScoreProps {
  label: string;
  score: number;
  isActive?: boolean;
}

export default function Score({ label, score, isActive }: ScoreProps) {
  return (
    <div
      className={cn(
        "px-4 py-1 text-[#978876] rounded-[12px] flex justify-between items-center w-full",
        "sm:flex-col sm:w-[100px] sm:justtify-center",
        isActive
          ? "bg-[#E9E7D8] "
          : "bg-transparent border-[2px] border-[#E9E7D8]"
      )}
    >
      <span className="text-xs uppercase font-medium">{label}</span>
      <span className="text-[20px] font-bold leading-[1]">{score}</span>
    </div>
  );
}
