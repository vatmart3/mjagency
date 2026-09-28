"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { forwardRef, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "quiet" | "danger" | "ink";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-40";
const variants: Record<Variant, string> = {
  primary: "bg-blue text-white shadow-[0_1px_2px_rgba(0,113,227,0.3),0_8px_20px_rgba(0,113,227,0.22)] hover:bg-blue-deep",
  secondary: "bg-mist text-ink hover:bg-fog",
  ghost: "bg-transparent text-blue hover:bg-blue-soft",
  quiet: "bg-transparent text-ink-2 hover:bg-mist",
  danger: "bg-signal/10 text-signal hover:bg-signal/15",
  ink: "bg-ink text-white hover:bg-black",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[14px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-[17px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

interface Props extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", className = "", children, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      className={buttonClass(variant, size, className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  external,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const cls = buttonClass(variant, size, `active:scale-[0.96] transition-transform ${className}`);
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
