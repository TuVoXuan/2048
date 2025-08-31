import type { SVGProps } from "react";
const Swap = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="none"
    viewBox="0 0 32 32"
    className="aspect-square h-auto w-full min-w-0 max-w-8 shrink"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 9h.53a4 4 0 0 1 3.96 3.434L23 16m0 0 3.5-3.5M23 16l-4-2"
      style={{
        stroke: "currentColor",
        strokeOpacity: 1,
      }}
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.006 25.23A4 4 0 0 0 20 29h5a4 4 0 0 0 4-4v-5a4 4 0 0 0-2.19-3.568l-1.689 1.69a3 3 0 0 1-3.463.561l-3.939-1.97A4 4 0 0 0 16 20v.764c.614.55 1 1.347 1 2.236 0 .885-.384 1.681-.994 2.23"
      clipRule="evenodd"
      style={{
        fill: "currentColor",
        fillOpacity: 1,
      }}
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 23h-.53a4 4 0 0 1-3.96-3.434L9 16m0 0-3.5 3.5M9 16l4 2"
      style={{
        stroke: "currentColor",
        strokeOpacity: 1,
      }}
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3 7a4 4 0 0 1 4-4h5a4 4 0 0 1 3.993 3.77A3 3 0 0 0 15 9a3 3 0 0 0 1 2.236V12c0 1.361-.68 2.564-1.72 3.286l-3.938-1.97a3 3 0 0 0-3.463.563l-1.69 1.689A4 4 0 0 1 3 12z"
      clipRule="evenodd"
      style={{
        fill: "currentColor",
        fillOpacity: 1,
      }}
    />
  </svg>
);
export default Swap;
