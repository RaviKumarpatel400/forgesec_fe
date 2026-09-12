"use client";

import { useLayoutEffect } from "react";

const revealItemSelector = [
  ".trusted-heading",
  ".trusted-visual",
  ".trusted-card",
  ".coverage-heading",
  ".scanner-gallery",
  ".workflow-heading",
  ".workflow-figure",
  ".workflow-agent",
  ".surface-heading",
  ".surface-card",
  ".challenge-heading",
  ".challenge-card",
  ".solution-copy",
  ".solution-metric",
  ".solution-card",
  ".dashboard-copy",
  ".dashboard-video-card",
  ".dashboard-card",
  ".faq-heading",
  ".faq-item",
  ".cta-copy",
  ".cta-actions",
  ".footer-brand",
  ".footer-column",
  ".footer-bottom"
].join(", ");

export default function ScrollReveal() {
  useLayoutEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".site-shell > section:not(.hero-section), .site-shell > footer"
      )
    );
    const faqItems = Array.from(
      document.querySelectorAll<HTMLDetailsElement>(".faq-item")
    );
    const closeSiblingFaqs = (event: Event) => {
      const currentItem = event.currentTarget as HTMLDetailsElement;

      if (!currentItem.open) {
        return;
      }

      faqItems.forEach((item) => {
        if (item !== currentItem) {
          item.open = false;
        }
      });
    };

    sections.forEach((section) => {
      section.classList.add("scroll-reveal-section");

      Array.from(section.querySelectorAll<HTMLElement>(revealItemSelector)).forEach(
        (item, index) => {
          item.classList.add("scroll-reveal-item");
          item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
        }
      );
    });

    faqItems.forEach((item) => item.addEventListener("toggle", closeSiblingFaqs));

    const removeFaqListeners = () => {
      faqItems.forEach((item) => item.removeEventListener("toggle", closeSiblingFaqs));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return removeFaqListeners;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      removeFaqListeners();
    };
  }, []);

  return null;
}
