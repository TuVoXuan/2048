import type { SVGProps } from "react";
const DeleteTile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    className="aspect-square h-auto w-full min-w-0 max-w-8 shrink"
    {...props}
  >
    <rect
      width={12}
      height={12}
      x={15}
      y={15}
      fill="currentColor"
      rx={4}
      style={{
        fill: "currentColor",
        fillOpacity: 1,
      }}
      transform="rotate(180 15 15)"
    />
    <rect
      width={9.5}
      height={9.5}
      x={13.75}
      y={27.75}
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2.5}
      rx={2.75}
      style={{
        stroke: "currentColor",
        strokeOpacity: 1,
      }}
      transform="rotate(180 13.75 27.75)"
    />
    <rect
      width={9.5}
      height={9.5}
      x={27.75}
      y={13.75}
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2.5}
      rx={2.75}
      style={{
        stroke: "currentColor",
        strokeOpacity: 1,
      }}
      transform="rotate(180 27.75 13.75)"
    />
    <rect
      width={12}
      height={12}
      x={29}
      y={29}
      fill="currentColor"
      rx={4}
      style={{
        fill: "currentColor",
        fillOpacity: 1,
      }}
      transform="rotate(180 29 29)"
    />
  </svg>
);
export default DeleteTile;
