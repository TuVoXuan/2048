import Icons from "../Icons";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-y-2 items-center">
      <a
        href="https://github.com/TuVoXuan/2048"
        target="blank"
        className="flex items-center gap-2 text-[#756452] text-sm font-me px-2 py-1 rounded-md bg-[#9C8B7C]/20 hover:bg-[#9C8B7C]/25"
      >
        <Icons.Code className="size-5 stroke-2" />
        Github
      </a>
      <div className="text-[#9C8B7C] text-xs text-center">
        <p>
          This game is just a clone of the{" "}
          <a
            href="https://play2048.co/"
            target="blank"
            className="font-semibold underline underline-offset-2"
          >
            2048
          </a>{" "}
          game for practice purposes.
        </p>
        <p className="font-semibold">Not for commercial use.</p>
      </div>
    </footer>
  );
}
