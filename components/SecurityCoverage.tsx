"use client";

import { KeyboardEvent, useEffect, useState } from "react";

const AUTO_SLIDE_DELAY = 5000;

const scanners = [
  {
    number: "01",
    title: "Web Scanner",
    shortTitle: "Web",
    image: "/images/scanner-website-realistic.png",
    description: "Continuously test public and authenticated web applications for exploitable weaknesses across pages, sessions, forms, and business-critical workflows.",
    features: ["Authenticated application testing", "OWASP vulnerability coverage", "Evidence-backed findings"],
    href: "/products/web-scanner"
  },
  {
    number: "02",
    title: "API Scanner",
    shortTitle: "API",
    image: "/images/scanner-api-realistic.png",
    description: "Discover exposed endpoints and validate security risks across REST, GraphQL, and modern API environments without disrupting development workflows.",
    features: ["Endpoint and schema discovery", "Authentication and authorization testing", "Request and response evidence"],
    href: "/products/api-scanner"
  },
  {
    number: "03",
    title: "OS Scanner",
    shortTitle: "OS",
    image: "/images/scanner-os-realistic.png",
    description: "Assess hosts, operating systems, open ports, services, and installed software to identify vulnerable assets and high-impact infrastructure exposure.",
    features: ["Host and service discovery", "CVE and software detection", "Credentialed security assessment"],
    href: "/products/os-scanner"
  },
  {
    number: "04",
    title: "Hybrid Scanner",
    shortTitle: "Hybrid",
    image: "/images/scanner-hybrid-realistic.png",
    description: "Connect web, API, operating system, and infrastructure testing in one coordinated view for complete attack-surface visibility.",
    features: ["Unified cross-layer coverage", "Correlated findings and asset context", "Centralized risk prioritization"],
    href: "/products/hybrid-scanner"
  },
  {
    number: "05",
    title: "Network Scanner",
    shortTitle: "Network",
    image: "/images/scanner-network-realistic-v2.png",
    description: "Discover connected assets, exposed services, segmentation gaps, and reachable infrastructure across authorized internal and external networks.",
    features: ["Network and asset discovery", "Port and service visibility", "Segmentation and exposure mapping"],
    href: "/products/network-scanner"
  },
] as const;

export default function SecurityCoverage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % scanners.length);
    }, AUTO_SLIDE_DELAY);

    return () => window.clearInterval(timer);
  }, [activeIndex, isPaused]);

  const showSlide = (index: number) => {
    setActiveIndex((index + scanners.length) % scanners.length);
  };

  const activateFromKeyboard = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <section aria-labelledby="coverage-title" className="coverage-section" id="scanner-coverage">
      <div
        className={`coverage-inner${isPaused ? " is-paused" : ""}`}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
        }}
        onFocusCapture={() => setIsPaused(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <header className="coverage-heading">
          <span>Discover What Is Exposed</span>
          <h2 id="coverage-title">Security Discovery Across <span className="landing-title-accent">Your Environment</span></h2>
          <p>Bring together findings from network, infrastructure, web application, API, and connected-environment scanning as the starting point for validation.</p>
        </header>

        <div className="scanner-gallery" aria-label="ForgeSec scanner coverage">
          {scanners.map((scanner, index) => {
            const isActive = activeIndex === index;

            return (
              <article
                aria-label={`${scanner.number}: ${scanner.title}`}
                aria-pressed={isActive}
                className={`scanner-gallery-card${isActive ? " is-active" : ""}`}
                key={scanner.number}
                onClick={() => showSlide(index)}
                onFocus={() => showSlide(index)}
                onKeyDown={(event) => activateFromKeyboard(event, index)}
                role="button"
                tabIndex={0}
              >
                <img alt="" className="scanner-gallery-image" src={scanner.image} />
                <div className="scanner-gallery-shade" />
                <span className="scanner-gallery-number">{scanner.number} / 05</span>
                <span aria-hidden="true" className="scanner-gallery-rail-title">{scanner.shortTitle}</span>

                <div className="scanner-gallery-content">
                  <h3>{scanner.title}</h3>
                  <p>{scanner.description}</p>
                  <ul>
                    {scanner.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <a href={scanner.href} onClick={(event) => event.stopPropagation()}>
                    Explore scanner <span aria-hidden="true">-&gt;</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="scanner-gallery-controls" aria-label="Scanner slider controls">
          <button aria-label="Show previous scanner" onClick={() => showSlide(activeIndex - 1)} type="button">
            <span aria-hidden="true">←</span>
          </button>

          <div className="scanner-gallery-tabs" role="tablist" aria-label="Choose a scanner">
            {scanners.map((scanner, index) => (
              <button
                aria-label={`Show ${scanner.title}`}
                aria-selected={activeIndex === index}
                className={activeIndex === index ? "is-active" : ""}
                key={scanner.number}
                onClick={() => showSlide(index)}
                role="tab"
                type="button"
              >
                <span>{scanner.number}</span>
                <span>{scanner.shortTitle}</span>
                {activeIndex === index && <i aria-hidden="true" key={activeIndex} />}
              </button>
            ))}
          </div>

          <button aria-label="Show next scanner" onClick={() => showSlide(activeIndex + 1)} type="button">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
