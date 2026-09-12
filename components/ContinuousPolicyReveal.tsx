"use client";

import { useEffect } from "react";

const revealSelector = [
  ".control-framework-head > *",
  ".control-framework-flow > div",
  ".control-framework-grid > article",
].join(",");

export default function ContinuousPolicyReveal() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".continuous-page");
    if (!page) return;

    const elements = Array.from(page.querySelectorAll<HTMLElement>(revealSelector));
    page.classList.add("policy-scroll-enabled");

    elements.forEach((element, index) => {
      element.classList.add("policy-scroll-item");
      element.style.setProperty("--policy-reveal-order", String(index % 4));
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
