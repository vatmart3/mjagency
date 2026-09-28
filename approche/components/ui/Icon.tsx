import type { SVGProps } from "react";

const paths: Record<string, string> = {
  brief: "M4 5h16M4 10h16M4 15h10M4 20h7",
  clients: "M5 4h9l5 5v11H5zM14 4v5h5M8 13h8M8 17h5",
  terrain: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z",
  phone: "M6.6 3.8 9 3.3l1.7 4.3-2.1 1.5a11 11 0 0 0 6.3 6.3l1.5-2.1 4.3 1.7-.5 2.4a2 2 0 0 1-2.1 1.6C10.8 18.7 5.3 13.2 5 5.9a2 2 0 0 1 1.6-2.1z",
  scripts: "M6 3h12v18l-6-4-6 4zM9 8h6M9 11.5h4",
  method: "M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3zM9.5 20.5h5",
  training: "M4 17l5-5 4 4 7-8M15 8h5v5",
  dashboard: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  settings: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM19 12l2-1.2-1.8-3.2-2.3.6a7 7 0 0 0-1.6-.9L14.6 5h-3.6l-.7 2.3a7 7 0 0 0-1.6.9L6.4 7.6 4.6 10.8 6.6 12l-2 1.2 1.8 3.2 2.3-.6c.5.4 1 .7 1.6.9l.7 2.3h3.6l.7-2.3c.6-.2 1.1-.5 1.6-.9l2.3.6 1.8-3.2z",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  plus: "M12 5v14M5 12h14",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z",
  copy: "M8 8h11v12H8zM5 16V4h11",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  play: "M7 4.5v15l12-7.5z",
  pause: "M7 4h3.5v16H7zM13.5 4H17v16h-3.5z",
  map: "M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14",
  check: "M4.5 12.5l5 5 10-11",
  arrow: "M5 12h14M13 6l6 6-6 6",
  back: "M19 12H5M11 6l-6 6 6 6",
  close: "M6 6l12 12M18 6L6 18",
  mic: "M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM6 11a6 6 0 0 0 12 0M12 17v4",
  edit: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  kanban: "M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  timer: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 2.5M9.5 2.5h5",
  flame: "M12 21c-3.9 0-6.5-2.7-6.5-6.2 0-3.9 3.3-5.6 4.1-9.8 2.7 1.7 4 3.9 4 6.1 1-.6 1.6-1.6 1.9-2.7 1.9 1.6 3 3.9 3 6.4 0 3.5-2.6 6.2-6.5 6.2z",
  shuffle: "M4 7h3c4 0 6 10 10 10h3M4 17h3c1.6 0 2.8-1.6 3.8-3.5M14 9.5C15 8 16 7 17 7h3M18 4l3 3-3 3M18 14l3 3-3 3",
  printer: "M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.8c1.9.8 3.1 2.6 3.5 5.2",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11",
  message: "M4 5h16v11H9l-5 4z",
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 22, strokeWidth = 1.7, ...rest }: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  const filled = name === "play" || name === "pause";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
