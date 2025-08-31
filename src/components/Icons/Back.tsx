import type { SVGProps } from "react";
const Back = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    className="aspect-square h-auto w-full min-w-0 max-w-8 shrink"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M10 25h6.5a8.5 8.5 0 0 0 8.5-8.5v0A8.5 8.5 0 0 0 16.5 8H8m0 0 3.5-4M8 8l3.5 4"
      style={{
        stroke: "currentColor",
        strokeOpacity: 1,
      }}
    />
  </svg>
);
export default Back;
