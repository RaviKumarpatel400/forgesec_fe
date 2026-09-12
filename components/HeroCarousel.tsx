"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
  { title: "Unified scanner dashboard", image: "/images/landing-scanner-overview-hero-v5.png", alt: "Forge-Sec unified scanner overview displayed on a structured dashboard", tone: "cyan", eyebrow: "Security Assurance Platform", heading: "From Vulnerability Findings", accent: "to Validated Security Risk", copy: "Discover security exposure, validate which vulnerabilities represent real risk, and drive remediation with evidence.", primary: "Request a Demo", primaryHref: "/request-demo", secondary: "Start Scan Now", secondaryHref: "/signup" },
  { title: "Security analytics overview", image: "/images/dashbaord1.png", alt: "Forge-Sec attack-surface and vulnerability analytics dashboard", tone: "violet", eyebrow: "Evidence-Backed Risk", heading: "Know Which Findings", accent: "Represent Real Risk", copy: "Validate exploitability, connect technical evidence with asset context, and focus your teams on the vulnerabilities that matter most.", primary: "See Risk Prioritization", primaryHref: "/products/ai-risk-prioritization", secondary: "Request a Demo", secondaryHref: "/request-demo" },
  { title: "Remediation and reporting", image: "/images/landing-remediation-workflow-hero-v5.png", alt: "Forge-Sec remediation, verification, and audit-report workflow", tone: "blue", eyebrow: "Verified Remediation", heading: "Turn Security Findings", accent: "Into Proven Closure", copy: "Give teams actionable guidance, preserve evidence throughout remediation, and retest every fix to confirm that exposure is resolved.", primary: "Explore Remediation", primaryHref: "/products/remediation-guidance", secondary: "Talk to Our Team", secondaryHref: "/request-demo" }
] as const;

const INTERVAL = 8000;

function Arrow({ direction }: { direction: "left" | "right" }) {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d={direction === "left" ? "M15 18l-6-6 6-6" : "m9 18 6-6-6-6"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function ActionArrow() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
    </svg>
  );
}

function HeroAction({ href, label, variant }: { href: string; label: string; variant: "primary" | "secondary" }) {
  return (
    <Link className={`hero-action hero-action--${variant} ${variant === "primary" ? "button hero-demo" : "hero-secondary"}`} href={href}>
      <span className="hero-action__label">{label}</span>
      <span className="hero-action__icon"><ActionArrow /></span>
    </Link>
  );
}

function SecurityScanTerminal() {
  return (
    <figure
      aria-label="ForgeSec terminal demonstrating an automated vulnerability scan and validation workflow"
      className="hero-scan-visual"
      role="img"
    >
      <div aria-hidden="true" className="hero-scan-terminal">
        <div className="hero-scan-chrome">
          <span className="hero-scan-window-controls">
            <i />
            <i />
            <i />
          </span>
          <strong>forgesec · security audit</strong>
          <span className="hero-scan-live"><i /> live scan</span>
        </div>

        <div className="hero-scan-body">
          <p className="hero-scan-command">
            <span>$</span> forgesec scan --project ./customer-portal
            <i className="hero-scan-cursor" />
          </p>

          <div className="hero-scan-phases">
            <p className="hero-scan-step"><span>→</span> Mapping attack surface...</p>
            <p className="hero-scan-step"><span>→</span> Testing exposed services...</p>
            <p className="hero-scan-step"><span>→</span> Validating detected findings...</p>
          </div>

          <div className="hero-scan-progress"><span /></div>

          <div className="hero-scan-findings">
            <p className="hero-scan-finding is-critical"><span>[CRITICAL]</span><b>Object-level authorization bypass</b></p>
            <p className="hero-scan-finding is-critical"><span>[CRITICAL]</span><b>Pre-authentication service exposure</b></p>
            <p className="hero-scan-finding is-high"><span>[HIGH]</span><b>Outdated OpenSSL package detected</b></p>
            <p className="hero-scan-finding is-high"><span>[HIGH]</span><b>Exposed administrative service :8443</b></p>
            <p className="hero-scan-finding is-moderate"><span>[MODERATE]</span><b>Weak SSH configuration</b></p>
          </div>

          <p className="hero-scan-summary">2 critical · 2 high · 1 moderate · 17 total</p>
          <p className="hero-scan-priority"><span>Sentinel:</span> authorization bypass is your top priority</p>
          <p className="hero-scan-evidence">Evidence captured · remediation guidance ready</p>
          <p className="hero-scan-complete"><span>✓</span> Scan complete in 8.3s</p>
        </div>

        <span className="hero-scan-sweep" />
      </div>
    </figure>
  );
}

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [mobileStatic, setMobileStatic] = useState(false);
  const touchStart = useRef<number | null>(null);
  const showSlide = useCallback((next: number) => {
    if (active === next) return;
    setPrevious(active);
    setActive(next);
  }, [active]);
  const move = useCallback((step: number) => {
    setPrevious(active);
    setActive((active + step + slides.length) % slides.length);
  }, [active]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const syncMobileMode = () => {
      setMobileStatic(query.matches);
      if (query.matches) {
        setActive(0);
        setPrevious(null);
      }
    };

    syncMobileMode();
    query.addEventListener("change", syncMobileMode);
    return () => query.removeEventListener("change", syncMobileMode);
  }, []);

  useEffect(() => {
    if (mobileStatic) return;
    const timer = window.setInterval(() => move(1), INTERVAL);
    return () => window.clearInterval(timer);
  }, [active, mobileStatic, move]);

  return (
    <section aria-label="ForgeSec platform capabilities" aria-roledescription="carousel" className="hero-section landing-start-hero phonepe-hero"
      onTouchStart={(event) => { if (!mobileStatic) touchStart.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => { if (mobileStatic || touchStart.current === null) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1); touchStart.current = null; }}>
      <div className="hero-carousel">
        <div className="hero-carousel-stage" aria-live="polite">
          {slides.map((slide, index) => (
            <article aria-hidden={index !== active} className={`hero-slide phonepe-slide phonepe-slide-${slide.tone}${index === active ? " active" : ""}${index === previous ? " previous" : ""}`} key={slide.title}>
              {index !== 0 && (
                <Image alt={slide.alt} className="phonepe-slide-image" fill loading={index === 1 ? "eager" : "lazy"} sizes="(max-width: 1439px) 180vw, 150vw" src={slide.image} unoptimized />
              )}
              <div className="phonepe-slide-shade" />
            </article>
          ))}
        </div>
        {active === 0 && <SecurityScanTerminal />}
        <div className="hero-fixed-content">
          <span className="hero-eyebrow hero-copy-swap" key={`eyebrow-${active}`}>{slides[active].eyebrow}</span>
          <h1 className="hero-copy-swap" key={`heading-${active}`}>{slides[active].heading}<span>{slides[active].accent}</span></h1>
          <p className="hero-copy-swap" key={`copy-${active}`}>{slides[active].copy}</p>
          <div className="hero-actions hero-copy-swap" key={`actions-${active}`}>
            <HeroAction href={slides[active].primaryHref} label={slides[active].primary} variant="primary" />
            <HeroAction href={slides[active].secondaryHref} label={slides[active].secondary} variant="secondary" />
          </div>
        </div>
        <button aria-label="Previous slide" className="phonepe-arrow phonepe-arrow-left" onClick={() => move(-1)} type="button"><Arrow direction="left" /></button>
        <button aria-label="Next slide" className="phonepe-arrow phonepe-arrow-right" onClick={() => move(1)} type="button"><Arrow direction="right" /></button>
        <div aria-label="Choose a slide" className="phonepe-pagination" role="group">
          {slides.map((slide, index) => <button aria-label={`Show slide ${index + 1}: ${slide.title}`} aria-current={index === active ? "true" : undefined} key={slide.title} onClick={() => showSlide(index)} type="button"><span className={index === active ? "running" : ""} /></button>)}
        </div>
      </div>
    </section>
  );
}
