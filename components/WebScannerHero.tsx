"use client";

import Link from "next/link";
import { useRef } from "react";
import QuantumNodesBackground from "./QuantumNodesBackground";
import TimelineAnimation from "./TimelineAnimation";

const outcomes = [
  ["Authenticated", "Deep application testing"],
  ["Evidence-backed", "Validated findings"],
  ["Continuous", "Always-on visibility"],
  ["Actionable", "Developer-ready fixes"]
];

export default function WebScannerHero() {
  const timelineRef = useRef<HTMLElement>(null);

  return (
    <section className="webscan-hero" aria-labelledby="webscan-hero-title" ref={timelineRef}>
      <div className="webscan-shader" aria-hidden="true">
        <QuantumNodesBackground />
        <div className="webscan-shader-vignette" />
      </div>

      <div className="webscan-hero-inner">
        <TimelineAnimation animationNum={1} className="webscan-hero-kicker-wrap" timelineRef={timelineRef}>
          <span className="webscan-kicker"><i /> Web Application Security</span>
        </TimelineAnimation>

        <div className="webscan-hero-main">
          <TimelineAnimation animationNum={2} className="webscan-hero-title-wrap" timelineRef={timelineRef}>
            <h1 id="webscan-hero-title">
              Discover Web Vulnerabilities.
              <span> Validate Real Risk.</span>
            </h1>
          </TimelineAnimation>

          <TimelineAnimation animationNum={3} className="webscan-hero-aside" timelineRef={timelineRef}>
            <p>
              Continuously scan modern web applications, validate exploitable
              weaknesses, and help your team fix real risk with confidence.
            </p>
            <div className="webscan-actions">
              <Link className="webscan-primary" href="/signup">
                <span>Start scanning</span>
                <span className="webscan-click-cursor" aria-hidden="true">
                  <svg viewBox="0 0 20 20"><path d="M4 2.5 15.5 11l-5 .8 2.7 4.4-2.2 1.3-2.6-4.4-3.2 4.1L4 2.5Z" /></svg>
                </span>
              </Link>
              <a className="webscan-secondary" href="#webscan-capabilities">
                <span>Explore capabilities</span>
              </a>
            </div>
          </TimelineAnimation>
        </div>

        <TimelineAnimation animationNum={4} timelineRef={timelineRef}>
          <div className="webscan-hero-outcomes">
            {outcomes.map(([title, copy], index) => (
              <div key={title}>
                <span>0{index + 1}</span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </div>
            ))}
          </div>
        </TimelineAnimation>
      </div>
    </section>
  );
}
