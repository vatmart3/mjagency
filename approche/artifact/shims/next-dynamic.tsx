"use client";
import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

type Loader<P> = () => Promise<{ default: ComponentType<P> } | ComponentType<P>>;

export default function dynamic<P extends object>(loader: Loader<P>, opts: { ssr?: boolean; loading?: () => ReactNode } = {}) {
  const Lazy = lazy(async () => {
    const m = await loader();
    return { default: ("default" in m ? m.default : m) as ComponentType<P> };
  });
  return function Dynamic(props: P) {
    return (
      <Suspense fallback={opts.loading ? opts.loading() : null}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}
