"use client";

import { useEffect } from "react";

const revealSelector = [
  ".risk-context-meta", ".risk-context-head h2", ".risk-context-compare article",
  ".risk-analysis-meta", ".risk-analysis-head h2", ".risk-analysis-grid article", ".risk-analysis-example",
  ".priority-board-meta", ".priority-board-head h2", ".priority-lanes article",
  ".risk-reduction-meta", ".risk-reduction-copy", ".risk-reduction-actions", ".risk-reduction-cta"
].join(",");

export default function RiskScrollReveal() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".risk-page");
    if (!page) return;

    const elements = Array.from(page.querySelectorAll<HTMLElement>(revealSelector));
    page.classList.add("risk-scroll-enabled");
    elements.forEach((element, index) => {
      element.classList.add("risk-scroll-item");
      element.style.setProperty("--reveal-order", String(index % 4));
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -9%", threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
