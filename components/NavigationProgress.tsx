"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ProgressState = "idle" | "loading" | "complete";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<ProgressState>("idle");
  const firstPath = useRef(true);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = () => {
    setState("complete");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 280);
  };

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (finishTimer.current) clearTimeout(finishTimer.current);
    finishTimer.current = setTimeout(finish, 420);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const control = target?.closest<HTMLElement>("a, button");
      if (!control || control.matches(":disabled") || event.defaultPrevented) return;

      setState("loading");
      if (finishTimer.current) clearTimeout(finishTimer.current);
      finishTimer.current = setTimeout(finish, 1100);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (finishTimer.current) clearTimeout(finishTimer.current);
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  return <span className={`navigation-progress is-${state}`} aria-hidden="true" />;
}
