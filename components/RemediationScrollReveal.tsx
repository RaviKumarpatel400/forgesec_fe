"use client";

import { useEffect } from "react";

const revealSelector = [
  ".remediation-process-head",
  ".remediation-process-grid article",
  ".finding-guidance-intro",
  ".finding-guidance-list article",
  ".team-guidance-head",
  ".team-guidance-grid article",
  ".remediation-includes",
  ".remediation-loop-head",
  ".remediation-loop-flow",
  ".remediation-resolution",
  ".remediation-loop-cta"
].join(",");

export default function RemediationScrollReveal() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".remediation-page");
    if (!page) return;

    const elements = Array.from(page.querySelectorAll<HTMLElement>(revealSelector));
    page.classList.add("remediation-scroll-enabled");

    elements.forEach((element, index) => {
      element.classList.add("remediation-scroll-item");
      element.style.setProperty("--remediation-reveal-order", String(index % 4));
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
