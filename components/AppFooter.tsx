"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Web Scanner", href: "/products/web-scanner" },
      { label: "API Scanner", href: "/products/api-scanner" },
      { label: "OS Scanner", href: "/products/os-scanner" },
      { label: "Network Scanner", href: "/products/network-scanner" },
      { label: "Hybrid Scanner", href: "/products/hybrid-scanner" },
      { label: "AI Risk Prioritization", href: "/products/ai-risk-prioritization" },
      { label: "Remediation Guidance", href: "/products/remediation-guidance" }
    ]
  },
  {
    title: "Solutions",
    links: [
      { label: "Attack Surface Security", href: "/solutions/attack-surface-security" },
      { label: "Continuous Security Validation", href: "/solutions/continuous-pentesting" },
      { label: "Automated Pentesting", href: "/solutions/automated-pentesting" },
      { label: "Vulnerability Validation", href: "/solutions/vulnerability-validation" },
      { label: "Hybrid Environments", href: "/solutions/hybrid-environments" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Resource Center", href: "/resources/resource-center" },
      { label: "Documentation", href: "/resources/documentation" },
      { label: "Blog", href: "/resources/blog" },
      { label: "Webinars", href: "/resources/webinars" },
      { label: "Help Center", href: "/resources/help-center" },
      { label: "Insights", href: "/resources/insights" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company/about" },
      { label: "Team", href: "/company/team" },
      { label: "Careers", href: "/company/careers" },
      { label: "Trust", href: "/company/trust" },
      { label: "Customers", href: "/company/customers" },
      { label: "Contact", href: "/company/contact" }
    ]
  }
];

export default function AppFooter() {
  const pathname = usePathname();
  const workspaceRoutes = ["/dashboard", "/subscription", "/configuration", "/scan", "/os-scanner", "/api-scanner", "/hybrid-scanner", "/network-scanner", "/ai-scanner", "/reports"];

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/request-demo" ||
    workspaceRoutes.some((route) => pathname.startsWith(route))
  ) return null;

  return (
    <footer className="footer-section" id="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="footer-logo" href="/" aria-label="Forge-Sec home">
            <Image alt="ForgeSec" className="footer-logo-image" height={80} src="/images/final-logo.png" style={{ height: "auto" }} width={240} />
          </Link>
          <h2>Security Forged Through Testing.</h2>
          <p>Continuous security testing, validated risk, and actionable remediation in one platform.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          {footerColumns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}
              </ul>
            </div>
          ))}
        </nav>

        <aside className="footer-details" aria-label="Contact information">
          <h2>Contact</h2>
          <a href="mailto:hello@forgesec.com">hello@forgesec.com</a>
          <p>Talk with our team about security testing, risk validation, or product support.</p>
          <a className="footer-details-action" href="/request-demo">Request a Demo</a>
        </aside>

        <div className="footer-bottom">
          <p>© 2026 Forge-Sec. All rights reserved.</p>
          <div><a href="/privacy-policy">Privacy Policy</a><a href="/terms-of-service">Terms of Service</a><a href="/security">Security</a></div>
        </div>
      </div>
    </footer>
  );
}
