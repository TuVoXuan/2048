import type { SVGProps } from "react";
const Teleport = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="none"
    className="aspect-square h-auto w-full min-w-0 max-w-8 shrink"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m19 13-6 6m6-6 .5 5m-.5-5-5-.5"
      style={{
        stroke: "currentColor",
        strokeOpacity: 1,
      }}
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M20 5.5h5A1.5 1.5 0 0 1 26.5 7v5a1.5 1.5 0 0 1-1.5 1.5h-2.935l.25 2.5H25a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4h-5a4 4 0 0 0-4 4v2.685l2.5.25V7A1.5 1.5 0 0 1 20 5.5M11.757 16H6.6A3.6 3.6 0 0 0 3 19.6v5.8A3.6 3.6 0 0 0 6.6 29h5.8a3.6 3.6 0 0 0 3.6-3.6v-5.157l-.879.878a3 3 0 1 1-4.242-4.242z"
      clipRule="evenodd"
      style={{
        fill: "currentColor",
        fillOpacity: 1,
      }}
    />
  </svg>
);
export default Teleport;
