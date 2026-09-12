"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

const navItems = [
  {
    label: "Products",
    href: "#platform",
    menuTitle: "Forge-Sec Platform",
    menuCopy: "Choose the scanner workflow your team needs, then connect every finding to proof and action.",
    overviewMeta: "7 connected capabilities",
    overviewIcon: "boxes",
    featuredCount: 4,
    items: [
      { icon: "globe", title: "Web Scanner", desc: "Continuously test web applications for exploitable weaknesses.", href: "/products/web-scanner" },
      { icon: "code", title: "API Scanner", desc: "Find exposed endpoints, auth flaws, and API security risks.", href: "/products/api-scanner" },
      { icon: "server", title: "OS Scanner", desc: "Detect vulnerable services, software, ports, and related CVEs.", href: "/products/os-scanner" },
      { icon: "radar", title: "Network Scanner", desc: "Discover exposed hosts, services, ports, and network security weaknesses.", href: "/products/network-scanner" },
      { icon: "boxes", title: "Hybrid Scanner", desc: "Connect findings across web, API, OS, and infrastructure.", href: "/products/hybrid-scanner" },
      { icon: "brain", title: "AI Risk Prioritization", desc: "Focus teams on validated vulnerabilities with real impact.", href: "/products/ai-risk-prioritization" },
      { icon: "wrench", title: "Remediation Guidance", desc: "Turn security findings into clear, actionable fixes.", href: "/products/remediation-guidance" },
    ],
  },
  {
    label: "Solutions",
    href: "#solutions",
    menuTitle: "Security Solutions",
    menuCopy: "Connect discovery, validation, prioritization, and remediation around the outcomes your team needs.",
    overviewMeta: "5 focused solutions",
    overviewIcon: "shield",
    featuredCount: 3,
    items: [
      { icon: "shield", title: "Attack Surface Security", desc: "Discover and validate exposure across your environment.", href: "/solutions/attack-surface-security" },
      { icon: "radar", title: "Continuous Security Validation", desc: "Test applications and infrastructure continuously instead of waiting for a point-in-time audit.", href: "/solutions/continuous-pentesting" },
      { icon: "chart", title: "Automated Pentesting", desc: "Automate security testing to continuously uncover and validate exploitable weaknesses.", href: "/solutions/automated-pentesting" },
      { icon: "check", title: "Vulnerability Validation", desc: "Separate exploitable weaknesses from noisy scan findings.", href: "/solutions/vulnerability-validation" },
      { icon: "cloud", title: "Hybrid Environments", desc: "Connect application, API, host, and infrastructure findings.", href: "/solutions/hybrid-environments" },
    ],
  },
  {
    label: "Resources",
    href: "#resources",
    menuTitle: "Resources",
    menuCopy: "Explore product guidance, security research, and expert perspectives for every stage of your program.",
    overviewMeta: "6 expert resources",
    overviewIcon: "book",
    featuredCount: 3,
    items: [
      { icon: "book", title: "Resource Center", desc: "Explore practical security guidance and product insights.", href: "/resources/resource-center" },
      { icon: "file", title: "Documentation", desc: "Learn how to configure and operate the Forge-Sec platform.", href: "/resources/documentation" },
      { icon: "news", title: "Blog", desc: "Read research, product updates, and security perspectives.", href: "/resources/blog" },
      { icon: "play", title: "Webinars", desc: "Hear from practitioners on modern security testing.", href: "/resources/webinars" },
      { icon: "help", title: "Help Center", desc: "Find answers and support for common workflows.", href: "/resources/help-center" },
      { icon: "news", title: "Insights", desc: "Explore security research, practical guidance, and platform perspectives.", href: "/resources/insights" },
    ],
  },
  {
    label: "Company",
    href: "#company",
    menuTitle: "Company",
    menuCopy: "Learn about our mission, people, customers, and commitment to responsible security operations.",
    overviewMeta: "6 company links",
    overviewIcon: "building",
    featuredCount: 3,
    items: [
      { icon: "building", title: "About", desc: "Learn about our mission, platform, and approach to security.", href: "/company/about" },
      { icon: "users", title: "Team", desc: "Meet the people building and supporting Forge-Sec.", href: "/company/team" },
      { icon: "users", title: "Careers", desc: "Join the team helping security programs move faster.", href: "/company/careers" },
      { icon: "shield", title: "Trust", desc: "Review our security, privacy, and compliance practices.", href: "/company/trust" },
      { icon: "partners", title: "Customers", desc: "See how security teams use Forge-Sec to reduce risk.", href: "/company/customers" },
      { icon: "mail", title: "Contact", desc: "Talk with our team about your security program.", href: "/company/contact" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
] as const;

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg className={open ? "chevron is-open" : "chevron"} viewBox="0 0 20 20" aria-hidden="true">
      <path d="m5.5 7.5 4.5 4.5 4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className={open ? "menu-glyph is-open" : "menu-glyph"} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function MegaIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let paths: ReactNode;

  switch (name) {
    case "code": paths = <><path d="m8 4-3 2v4l-2 2 2 2v4l3 2" /><path d="m16 4 3 2v4l2 2-2 2v4l-3 2" /></>; break;
    case "server": paths = <><rect x="3" y="5" width="18" height="6" rx="2" /><rect x="3" y="13" width="18" height="6" rx="2" /><path d="M7 8h.01M7 16h.01M11 8h6M11 16h6" /></>; break;
    case "boxes": paths = <><path d="m12 2 5 3v6l-5 3-5-3V5z" /><path d="m7 11-4 2.5v5L8 22l4-2.5V14M17 11l4 2.5v5L16 22l-4-2.5" /></>; break;
    case "brain": paths = <><path d="M9 4a3 3 0 0 0-5 2.2A3 3 0 0 0 4 12a3 3 0 0 0 2 5.7A3 3 0 0 0 12 17V7a3 3 0 0 0-3-3Z" /><path d="M15 4a3 3 0 0 1 5 2.2A3 3 0 0 1 20 12a3 3 0 0 1-2 5.7A3 3 0 0 1 12 17M8 9h4M15 8v3h4M7 15h3" /></>; break;
    case "wrench": paths = <><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-3-3z" /></>; break;
    case "shield": paths = <><path d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>; break;
    case "radar": paths = <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 9V4M15 9l4-4" /></>; break;
    case "chart": paths = <><path d="M4 19V9M10 19V5M16 19v-7M22 19V3" /><path d="m4 10 6-5 6 7 6-9" /></>; break;
    case "check": paths = <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>; break;
    case "users": paths = <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1" /></>; break;
    case "cloud": paths = <><path d="M6 18a4 4 0 0 1-.5-8A7 7 0 0 1 19 9a4.5 4.5 0 0 1-1 9z" /><path d="M9 14h6M12 11v6" /></>; break;
    case "book": paths = <><path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z" /><path d="M20 4h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4z" /></>; break;
    case "file": paths = <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M9 12h6M9 16h6" /></>; break;
    case "news": paths = <><path d="M4 5h16v15H5a3 3 0 0 1-3-3V7" /><path d="M7 9h7M7 13h10M7 17h6" /></>; break;
    case "play": paths = <><circle cx="12" cy="12" r="9" /><path d="m10 8 6 4-6 4z" /></>; break;
    case "help": paths = <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.7 2.7 0 1 1 4.2 2.3c-1.2.8-1.7 1.2-1.7 2.7M12 18h.01" /></>; break;
    case "status": paths = <><path d="M3 12h4l2-6 4 12 2-6h6" /></>; break;
    case "building": paths = <><path d="M4 22V5l8-3 8 3v17M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 22v-3h4v3" /></>; break;
    case "partners": paths = <><path d="m8 12 3 3a3 3 0 0 0 4-4l-2-2" /><path d="m16 12-3-3a3 3 0 0 0-4 4l2 2M7 7l-3 3 3 3M17 7l3 3-3 3" /></>; break;
    case "mail": paths = <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>; break;
    default: paths = <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>;
  }

  return <svg className="mega-icon-svg" viewBox="0 0 24 24" aria-hidden="true" {...common}>{paths}</svg>;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isOverHero, setIsOverHero] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const syncAuthentication = () => {
      setIsAuthenticated(window.localStorage.getItem("forgesec_authenticated") === "true");
    };

    syncAuthentication();
    window.addEventListener("storage", syncAuthentication);
    window.addEventListener("forgesec-auth-change", syncAuthentication);
    return () => {
      window.removeEventListener("storage", syncAuthentication);
      window.removeEventListener("forgesec-auth-change", syncAuthentication);
    };
  }, []);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero-section, .request-demo-hero, .attack-hero");
    if (!hero) return;

    const updateNavbarTheme = () => {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      setIsOverHero(window.scrollY + 88 < heroBottom);
    };

    updateNavbarTheme();
    window.addEventListener("scroll", updateNavbarTheme, { passive: true });
    window.addEventListener("resize", updateNavbarTheme);
    return () => {
      window.removeEventListener("scroll", updateNavbarTheme);
      window.removeEventListener("resize", updateNavbarTheme);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.body.classList.add("nav-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("nav-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setExpandedSection(null);
  };

  return (
    <>
      <nav className={isOverHero ? "navbar is-over-hero" : "navbar"} aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="Forge-Sec home" onClick={closeMobileMenu}>
          <Image
            alt="ForgeSec"
            className="brand-logo"
            height={181}
            priority
            src="/images/logo1.png"
            style={{ height: "auto" }}
            width={188}
          />
        </a>

        <div className="nav-links">
          {navItems.map((item) => {
            if (!("items" in item)) return <a className="nav-link" href={item.href} key={item.label}>{item.label}</a>;

            const featuredItems = item.items.slice(0, item.featuredCount);
            const exploreItems = item.items.slice(item.featuredCount);

            return (
              <div className="nav-item" key={item.label}>
                <button className="nav-trigger" type="button" aria-haspopup="true">
                  {item.label}<Chevron />
                </button>
                <div className={`mega-menu mega-menu-${item.label.toLowerCase()}`}>
                  <div className="mega-content">
                    <aside className="mega-heading mega-overview-card">
                      <div className="mega-overview-top">
                        <span className="mega-overview-icon">
                          <MegaIcon name={item.overviewIcon} />
                        </span>
                        <span className="mega-overview-eyebrow">{item.menuTitle}</span>
                      </div>
                      <p>{item.menuCopy}</p>
                      <div className="mega-overview-meta">
                        <span aria-hidden="true" />
                        <strong>{item.overviewMeta}</strong>
                      </div>
                    </aside>

                    <div className="mega-links-panel">
                      <section className="mega-group" aria-label={`${item.label} featured links`}>
                        <h3>Featured</h3>
                        <div className="mega-grid">
                          {featuredItems.map((entry) => (
                            <a className="mega-link" href={entry.href} key={entry.title}>
                              <span className="mega-icon"><MegaIcon name={entry.icon} /></span>
                              <span><strong>{entry.title}</strong><small>{entry.desc}</small></span>
                            </a>
                          ))}
                        </div>
                      </section>

                      <section className="mega-group" aria-label={`${item.label} additional links`}>
                        <h3>Explore more</h3>
                        <div className="mega-grid">
                          {exploreItems.map((entry) => (
                            <a className="mega-link" href={entry.href} key={entry.title}>
                              <span className="mega-icon"><MegaIcon name={entry.icon} /></span>
                              <span><strong>{entry.title}</strong><small>{entry.desc}</small></span>
                            </a>
                          ))}
                        </div>
                      </section>

                    </div>

                  </div>
                  <a className="mega-footer" href="/request-demo">
                    <span>
                      <strong>Explore {item.menuTitle}</strong>
                      <small>See how ForgeSec helps teams move from findings to action.</small>
                    </span>
                    <ArrowRight />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="nav-actions">
          <a className="nav-login" href={isAuthenticated ? "/dashboard" : "/login"}>
            {isAuthenticated ? "Dashboard" : "Login"}
          </a>
          <a className="nav-start" href="/signup">Get Started <ArrowRight /></a>
          <button
            className="mobile-toggle"
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <MenuGlyph open={mobileOpen} />
          </button>
        </div>
      </nav>

      <div id="mobile-navigation" className={mobileOpen ? "mobile-menu is-open" : "mobile-menu"} aria-hidden={!mobileOpen}>
        <div className="mobile-menu-inner">
          {navItems.map((item) => "items" in item ? (
            <div className="mobile-nav-group" key={item.label}>
              <button
                className="mobile-nav-trigger"
                type="button"
                aria-expanded={expandedSection === item.label}
                onClick={() => setExpandedSection((current) => current === item.label ? null : item.label)}
              >
                <span>{item.label}</span><Chevron open={expandedSection === item.label} />
              </button>
              <div className={expandedSection === item.label ? "mobile-accordion is-open" : "mobile-accordion"}>
                <div className="mobile-accordion-inner">
                  {item.items.map((entry) => (
                    <a href={"href" in entry ? entry.href : item.href} className="mobile-menu-link" key={entry.title} onClick={closeMobileMenu}>
                      <span className="mega-icon"><MegaIcon name={entry.icon} /></span>
                      <span><strong>{entry.title}</strong><small>{entry.desc}</small></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <a className="mobile-nav-single" href={item.href} key={item.label} onClick={closeMobileMenu}>{item.label}</a>
          ))}
          <div className="mobile-menu-actions">
            <a href={isAuthenticated ? "/dashboard" : "/login"} onClick={closeMobileMenu}>
              {isAuthenticated ? "Dashboard" : "Login"}
            </a>
            <a className="nav-start" href="/signup" onClick={closeMobileMenu}>Get Started <ArrowRight /></a>
          </div>
        </div>
      </div>
    </>
  );
}
