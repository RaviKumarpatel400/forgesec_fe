"use client";

import { useEffect, useId, useRef, useState } from "react";

type PolicyIndexItem = {
  id: string;
  navTitle: string;
};

export default function PrivacyPolicyIndex({
  sections
}: {
  sections: PolicyIndexItem[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [markerTop, setMarkerTop] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const activeTitle =
    sections.find((section) => section.id === activeId)?.navTitle ??
    sections[0]?.navTitle ??
    "";

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const activationLine = Math.min(window.innerHeight * 0.3, 260);
      let nextId = sections[0]?.id ?? "";

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= activationLine) {
          nextId = section.id;
        } else {
          break;
        }
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        nextId = sections.at(-1)?.id ?? nextId;
      }

      setActiveId(nextId);
    };

    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  useEffect(() => {
    const updateMarker = () => {
      const activeLink = linkRefs.current.get(activeId);
      if (!activeLink) return;
      setMarkerTop(activeLink.offsetTop + (activeLink.offsetHeight - 12) / 2);
    };

    updateMarker();
    const observer = new ResizeObserver(updateMarker);
    if (navRef.current) observer.observe(navRef.current);
    window.addEventListener("resize", updateMarker);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMarker);
    };
  }, [activeId]);

  return (
    <aside className="policy-notice-index" aria-label="On this page">
      <span
        className="policy-notice-active-marker"
        style={{ transform: `translateY(${markerTop}px)` }}
        aria-hidden="true"
      />
      <button
        className="policy-notice-mobile-toggle"
        type="button"
        aria-controls={menuId}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span>
          <small>On this page</small>
          <strong>{activeTitle}</strong>
        </span>
        <i aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
          </svg>
        </i>
      </button>
      <nav
        className={mobileOpen ? "is-mobile-open" : undefined}
        id={menuId}
        ref={navRef}
        aria-label="Document sections"
      >
        {sections.map((section) => (
          <a
            className={activeId === section.id ? "is-active" : undefined}
            href={`#${section.id}`}
            key={section.id}
            aria-current={activeId === section.id ? "location" : undefined}
            ref={(node) => {
              if (node) linkRefs.current.set(section.id, node);
              else linkRefs.current.delete(section.id);
            }}
            onClick={() => {
              setActiveId(section.id);
              setMobileOpen(false);
            }}
          >
            {section.navTitle}
          </a>
        ))}
      </nav>
    </aside>
  );
}
