import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import WebScannerHero from "../../../components/WebScannerHero";
import WebScannerScrollReveal from "../../../components/WebScannerScrollReveal";

export const metadata: Metadata = {
  title: "Web Vulnerability Scanner | Forge-Sec",
  description:
    "Continuously discover, validate, and prioritize vulnerabilities across modern web applications with Forge-Sec."
};

const capabilities = [
  {
    icon: "code",
    title: "Pages, Forms & Parameters",
    copy: "Analyze application pages, forms, and parameters to reveal weaknesses hidden across your web application."
  },
  {
    icon: "target",
    title: "Deep Web Crawling",
    copy: "Discover public and hidden pages, forms, parameters, JavaScript routes, directories, and connected endpoints across your application."
  },
  {
    icon: "pulse",
    title: "Vulnerability Detection",
    copy: "Identify common and critical weaknesses, including injection flaws, cross-site scripting, insecure configurations, exposed files, and outdated components."
  },
  {
    icon: "check",
    title: "Authentication Testing",
    copy: "Scan protected application areas using authorized login credentials and inspect session handling, access controls, and authenticated workflows."
  },
  {
    icon: "code",
    title: "Technology Discovery",
    copy: "Detect frameworks, servers, libraries, content management systems, security headers, TLS configuration, and third-party components."
  },
  {
    icon: "pulse",
    title: "APIs, Scripts & Headers",
    copy: "Analyze APIs, scripts, and headers across connected application endpoints and underlying technologies."
  }
];

const workflow = [
  { number: "01", title: "Configure Your Target", copy: "Enter a website URL, choose the scanning profile, define scope rules, and optionally provide authentication details." },
  { number: "02", title: "Discover the Application", copy: "The scanner maps pages, endpoints, parameters, forms, technologies, directories, and other accessible application assets." },
  { number: "03", title: "Test for Vulnerabilities", copy: "Forge-Sec performs controlled security checks to identify weaknesses, misconfigurations, exposed resources, and known vulnerabilities." },
  { number: "04", title: "Review and Remediate", copy: "Receive prioritized findings with severity, affected URLs, technical evidence, risk descriptions, and recommended remediation steps." }
];

const findingDetails = [
  "Screenshots of the detected issue",
  "Executed payload results",
  "Highlighted HTTP requests and responses",
  "Affected URLs, parameters, and endpoints",
  "Technical evidence and reproduction details",
  "CVE, CWE, and OWASP references where applicable"
];

const continuousSecurity = [
  {
    title: "Scheduled Security Scans",
    copy: "Run scans automatically on a daily, weekly, monthly, or custom schedule without repeatedly configuring the same target."
  },
  {
    title: "Detect New and Recurring Risks",
    copy: "Compare scan results over time to identify newly discovered vulnerabilities, unresolved findings, and security issues that have returned after deployment."
  },
  {
    title: "Verify Remediation",
    copy: "Retest fixed vulnerabilities and confirm whether remediation was successful using updated evidence and scan results."
  },
  {
    title: "Maintain Complete Scan History",
    copy: "Track every scan, finding, status change, and remediation attempt from one centralized dashboard for better visibility and accountability."
  }
];

const finalCtaBenefits = [
  "Controlled and automated web scanning",
  "Prioritized vulnerability findings",
  "Evidence-backed security reports",
  "Clear remediation guidance",
  "Remediation verification and retesting"
];

function ScannerIcon({ name }: { name: string }) {
  const paths = {
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
    pulse: <path d="M3 13h4l2-6 4 11 3-7 2 2h3" />,
    code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></>,
    check: <><path d="M12 3 19 6v5c0 4.5-2.8 7.6-7 9-4.2-1.4-7-4.5-7-9V6l7-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[name as keyof typeof paths] ?? paths.check}
    </svg>
  );
}

export default function WebScannerPage() {
  return (
    <main className="site-shell webscan-page">
      <Navbar />
      <WebScannerScrollReveal />

      <WebScannerHero />

      <section className="webscan-capabilities" id="webscan-capabilities">
        <div className="webscan-section-heading">
          <div>
            <span className="webscan-kicker"><i /> Complete Attack-Surface Visibility</span>
            <h2>Understand Your Web Application’s Exposure</h2>
          </div>
          <p>
            Forge-Sec analyzes pages, forms, parameters, APIs, scripts, headers,
            authentication flows, and underlying technologies to reveal weaknesses
            hidden across your web application.
          </p>
        </div>

        <div className="webscan-capability-grid">
          {capabilities.map((item, index) => (
            <article className={index === 1 ? "is-featured" : undefined} key={item.title}>
              <span className="webscan-card-number">0{index + 1}</span>
              <span className="webscan-card-icon"><ScannerIcon name={item.icon} /></span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="webscan-card-action" aria-hidden="true">
                Explore coverage <b>→</b>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="webscan-workflow">
        <div className="webscan-workflow-inner">
          <header>
            <span className="webscan-section-index">03</span>
            <span className="webscan-kicker"><i /> Automated Security Workflow</span>
            <h2>From Web Findings to Evidence-Backed Risk</h2>
            <p>Forge-Sec combines reconnaissance, intelligent crawling, vulnerability testing, and risk analysis in one controlled scanning workflow.</p>
          </header>

          <div className="webscan-how-flow" aria-label="Web scanner workflow">
            {workflow.map((step, index) => (
              <div className="webscan-how-flow-item" key={step.number}>
                <article>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
                {index < workflow.length - 1 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="webscan-results" id="webscan-results">
        <div className="webscan-results-inner">
          <header className="webscan-results-heading">
            <span className="webscan-kicker"><i /> Actionable Security Reports</span>
            <h2>Evidence-Backed Reports. Actionable Remediation.</h2>
            <p>
              Forge-Sec transforms raw scanner findings into structured, actionable
              reports that developers, security teams, IT administrators, and
              decision-makers can understand and act on immediately.
            </p>
            <p>
              Every finding includes a clear <strong>severity level</strong>, risk
              description, affected asset, technical impact, and step-by-step
              <strong> remediation guidance</strong> to help teams move from detection
              to resolution.
            </p>
          </header>

          <div className="webscan-results-visual">
            <div className="webscan-results-art">
              <Image
                alt="Automated security findings and proof-backed reporting"
                height={1200}
                src="/images/report-forgesec-theme.png"
                width={1200}
              />
            </div>
          </div>

          <div className="webscan-results-details">
            <div className="webscan-results-details-head">
              <span>Evidence Behind Every Finding</span>
              <small>Supporting proof included</small>
            </div>
            <div className="webscan-results-grid">
              {findingDetails.map((item, index) => (
                <div key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                  <ScannerIcon name="check" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="webscan-continuous" id="webscan-continuous">
        <div className="webscan-continuous-inner">
          <div className="webscan-continuous-visual">
            <Image
              alt="Continuous vulnerability monitoring and scheduled security scans"
              height={1200}
              src="/images/report2.png"
              width={1200}
            />
          </div>

          <header>
            <span className="webscan-kicker"><i /> Continuous Vulnerability Monitoring</span>
            <h2>Track Changing Risks. Verify Your Fixes.</h2>
            <p>
              Web applications change constantly. New deployments, updated dependencies,
              configuration changes, and newly discovered vulnerabilities can introduce
              risks at any time. Forge-Sec continuously monitors your application and helps
              your team detect security issues before they reach attackers.
            </p>
            <p className="webscan-continuous-note">
              Maintain continuous visibility across releases, catch security regressions
              early, and give teams an audit-ready record of how application risk changes
              over time.
            </p>
          </header>

          <div className="webscan-continuous-grid">
            {continuousSecurity.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="webscan-final-cta" id="webscan-final-cta">
        <div className="webscan-final-cta-inner">
          <div className="webscan-final-cta-copy">
            <span className="webscan-kicker"><i /> Start Your Security Assessment</span>
            <h2>See Web Security Validation in Action</h2>
            <p>
              Launch the Forge-Sec Website Vulnerability Scanner to discover exposed
              attack paths, validate real security risks, and receive proof-backed
              remediation guidance—all from one centralized platform.
            </p>
            <div className="webscan-final-cta-actions">
              <Link href="/signup">
                Start a Web Scan
                <span className="webscan-click-cursor" aria-hidden="true">
                  <svg viewBox="0 0 20 20"><path d="M4 2.5 15.5 11l-5 .8 2.7 4.4-2.2 1.3-2.6-4.4-3.2 4.1L4 2.5Z" /></svg>
                </span>
              </Link>
              <a href="#webscan-results">View Sample Report</a>
            </div>
          </div>

          <div className="webscan-final-cta-details">
            <h3>Scan. Prioritize. Remediate. Retest.</h3>
            <p>Get continuous visibility into your website’s security posture and help your development and security teams resolve the vulnerabilities that matter most.</p>
            <ul>
              {finalCtaBenefits.map((item) => (
                <li key={item}><ScannerIcon name="check" /><span>{item}</span></li>
              ))}
            </ul>
            <small>Only scan websites and applications that you own or have explicit permission to assess.</small>
          </div>
        </div>
      </section>

    </main>
  );
}
