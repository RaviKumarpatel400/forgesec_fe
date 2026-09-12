"use client";

import { useLayoutEffect } from "react";

const revealSelector = [
  ".webscan-section-heading",
  ".webscan-capability-grid article",
  ".webscan-workflow header",
  ".webscan-how-flow-item",
  ".webscan-results-heading",
  ".webscan-results-visual",
  ".webscan-results-details",
  ".webscan-continuous header",
  ".webscan-continuous-visual",
  ".webscan-continuous-grid article",
  ".webscan-final-cta-copy",
  ".webscan-final-cta-details"
].join(", ");

export default function WebScannerScrollReveal() {
  useLayoutEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    elements.forEach((element, index) => {
      element.classList.add("webscan-reveal");
      element.style.setProperty("--webscan-reveal-delay", `${(index % 4) * 70}ms`);
    });

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
