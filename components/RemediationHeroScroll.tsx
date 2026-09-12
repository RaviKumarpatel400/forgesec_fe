"use client";

import { useEffect } from "react";

export default function RemediationHeroScroll() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".remediation-hero");
    if (!hero) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const distance = Math.max(1, hero.offsetHeight * 0.9);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      hero.style.setProperty("--remediation-scroll", progress.toFixed(4));
      hero.style.setProperty("--remediation-glow-hue", String(253 - progress * 70));
      hero.style.setProperty("--remediation-top-hue", String(239 - progress * 38));
      hero.style.setProperty("--remediation-mid-hue", String(241 - progress * 54));
      hero.style.setProperty("--remediation-bottom-hue", String(235 - progress * 70));
      hero.style.setProperty("--remediation-glow-x", `${50 + progress * 18}%`);
      hero.style.setProperty("--remediation-glow-y", `${55 + progress * 20}%`);
      hero.style.setProperty("--remediation-grid-x", `${progress * 46}px`);
      hero.style.setProperty("--remediation-grid-y", `${progress * -32}px`);
      hero.style.setProperty("--remediation-grid-x-alt", `${progress * -38}px`);
      hero.style.setProperty("--remediation-grid-y-alt", `${progress * 24}px`);
      hero.style.setProperty("--remediation-grid-opacity", String(.36 + progress * .34));
      hero.style.setProperty("--remediation-dots-opacity", String(.46 + progress * .42));
      hero.style.setProperty("--remediation-dots-y", `${14 - progress * 34}px`);
      hero.style.setProperty("--remediation-dots-scale", String(.97 + progress * .07));
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
