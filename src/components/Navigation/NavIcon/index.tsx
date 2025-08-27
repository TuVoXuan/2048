import Icons from "../../Icons";

export default function NavIcon() {
  return (
    <div className="flex items-center gap-x-3 cursor-pointer py-1 px-2 rounded-xl hover:bg-[#746452]/30">
      <Icons.Menu className="text-[#746452] size-7 stroke-2" />
      <span className="text-[48px] text-[#746452] font-family-rubik font-bold leading-[1]">
        2048
      </span>
    </div>
  );
}
