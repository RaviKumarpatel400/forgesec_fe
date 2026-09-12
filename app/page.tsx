import Image from "next/image";
import type { ReactNode } from "react";
import HeroCarousel from "../components/HeroCarousel";
import Navbar from "../components/Navbar";
import SecurityCoverage from "../components/SecurityCoverage";
import ScrollReveal from "../components/ScrollReveal";

const trustedItems = [
  {
    icon: "globe",
    title: "What Is Exposed?",
    copy:
      "Discover exposure across networks, infrastructure, web applications, APIs, and findings from your existing security tools."
  },
  {
    icon: "shield",
    title: "Which Findings Are Real?",
    copy:
      "Use CVE-specific methods, a repository of 10,000+ validation scripts, controlled execution, and evidence capture to confirm real risk."
  },
  {
    icon: "check",
    title: "What Should We Do About It?",
    copy:
      "Prioritize validated risk, guide remediation, retest completed fixes, and maintain recurring security assurance with evidence."
  }
];

const platformProblems = [
  {
    icon: "globe",
    number: "01",
    title: "Discovery and Scanning",
    problem: "Find exposure through Nmap, OpenVAS, OWASP ZAP, Nuclei, and existing customer scanners.",
    solution: "Bring findings from multiple sources into one structured workflow."
  },
  {
    icon: "shield",
    number: "02",
    title: "Validation Knowledge",
    problem: "Match CVEs and vulnerabilities to known validation methods from a maintained repository.",
    solution: "Use 10,000+ validation scripts before generating a new approach."
  },
  {
    icon: "brain",
    number: "03",
    title: "AI-Assisted Validation",
    problem: "When no known method exists, AI can assist in generating a validation approach.",
    solution: "Apply security controls before any controlled execution."
  },
  {
    icon: "check",
    number: "04",
    title: "Evidence and Assurance",
    problem: "A finding needs proof, context, remediation guidance, and verification after the fix.",
    solution: "Capture evidence, prioritize action, remediate, and retest."
  }
] as const;

const workflowAgents = [
  {
    number: "01",
    icon: "check",
    label: "Discover & Understand",
    title: "Find Exposure and Add Context",
    copy:
      "Discover exposure across applications, APIs, hosts, and hybrid environments, then connect each finding to the affected asset and service."
  },
  {
    number: "02",
    icon: "pulse",
    label: "Validate & Evidence",
    title: "Establish What Represents Real Risk",
    copy:
      "Use controlled validation methods to determine exploitability and preserve technical evidence that supports confident security decisions."
  },
  {
    number: "03",
    icon: "filter",
    label: "Prioritize",
    title: "Focus on What Matters Most",
    copy:
      "Rank validated findings using exploitability, exposure, confidence, and business impact so teams know what to address first."
  },
  {
    number: "04",
    icon: "wrench",
    label: "Remediate & Retest",
    title: "Fix, Verify, and Prove Closure",
    copy:
      "Deliver practical remediation guidance, coordinate the fix, and retest the affected asset to verify that the risk is resolved."
  }
];

const attackSurfaces = [
  {
    number: "01",
    icon: "globe",
    title: "Web Applications",
    lead: "Find weaknesses before they become entry points.",
    copy:
      "Continuously scan web applications for exploitable vulnerabilities and security misconfigurations."
  },
  {
    number: "02",
    icon: "code",
    title: "APIs",
    lead: "Protect the connections powering modern applications.",
    copy:
      "Identify API vulnerabilities, exposed endpoints, authentication weaknesses, and security risks."
  },
  {
    number: "03",
    icon: "server",
    title: "Operating Systems",
    lead: "Uncover risks across hosts and servers.",
    copy:
      "Detect open ports, vulnerable services, outdated software, OS weaknesses, and related CVEs."
  },
  {
    number: "04",
    icon: "boxes",
    title: "Hybrid Environments",
    lead: "Connect security findings across your infrastructure.",
    copy:
      "Combine web, API, OS, and infrastructure scanning to understand exposure as one connected system."
  }
];

const challengeRisks = [
  {
    title: "Which Findings Are Real?",
    copy:
      "Scanners can produce large volumes of findings, including duplicates, low-confidence results, and issues that do not represent meaningful exposure."
  },
  {
    title: "Which Are Actually Exploitable?",
    copy:
      "A severity score alone cannot show whether a weakness is reachable, exploitable in your environment, or supported by reliable technical evidence."
  },
  {
    title: "What Should We Fix First?",
    copy:
      "Teams need validated risk, clear priorities, practical remediation guidance, and proof that completed fixes have actually reduced exposure."
  }
];

const solutionMetrics = [
  {
    label: "A scanner tells you:",
    value: "A possible vulnerability exists"
  },
  {
    label: "Forgesec establishes:",
    value: "Whether the finding represents real, exploitable risk"
  },
  {
    label: "The outcome:",
    value: "Evidence-backed remediation and assurance"
  }
];

const solutionPillars = [
  {
    icon: "globe",
    title: "Discover",
    copy:
      "ForgeSec continuously maps web applications, APIs, operating systems, hosts, services, and connected infrastructure so security teams can see exposure as the environment changes."
  },
  {
    icon: "check",
    title: "Validate and Prove",
    copy:
      "Use known validation methods first. When none exists, AI can assist under security controls before controlled execution and evidence capture."
  },
  {
    icon: "filter",
    title: "Act and Assure",
    copy:
      "Verified risks are ranked by impact and paired with actionable remediation guidance, helping security, development, and operations teams fix what matters first."
  }
];

const dashboardHighlights = [
  {
    icon: "pulse",
    title: "Live Exposure Overview",
    copy:
      "Track changing attack surface coverage, active scans, verified vulnerabilities, and risk movement from one command view."
  },
  {
    icon: "shield",
    title: "Validated Findings",
    copy:
      "Review evidence-backed vulnerabilities with severity, exploitability, affected assets, and confidence signals in one place."
  },
  {
    icon: "filter",
    title: "Priority-First Workflow",
    copy:
      "Focus teams on the risks that matter most with clear ranking across impact, exposure, asset context, and remediation urgency."
  },
  {
    icon: "wrench",
    title: "Remediation Tracking",
    copy:
      "Move from discovery to resolution with fix guidance, ownership visibility, status tracking, and verification after changes."
  }
];

const faqItems = [
  {
    question: "What is Forgesec designed to do?",
    answer:
      "Forgesec moves organizations from vulnerability findings to validated, evidence-backed risk. It helps teams discover exposure, validate what is real, prioritize action, remediate, and verify closure."
  },
  {
    question: "How does Forgesec receive security findings?",
    answer:
      "Findings can come from Forgesec discovery capabilities across networks, infrastructure, web applications, and APIs, as well as from a customer's existing scanning tools."
  },
  {
    question: "How does Forgesec validate a finding?",
    answer:
      "Forgesec matches CVE or vulnerability information to known validation methods, applies security controls, uses controlled execution, and captures evidence that helps establish exploitability."
  },
  {
    question: "What happens when no validation method exists?",
    answer:
      "The validated knowledge base remains the first option. When no known method is available, AI can assist in generating a validation approach before security controls and controlled execution are applied."
  },
  {
    question: "What happens after a vulnerability is validated?",
    answer:
      "Validated findings can be prioritized, supported with remediation guidance and reporting, and retested after remediation to provide recurring assurance with evidence."
  },
  {
    question: "Where does human security expertise still matter?",
    answer:
      "Human expertise remains important for complex or novel vulnerabilities, ambiguous results, manual exploitation scenarios, business-risk interpretation, expert validation, and sign-off."
  }
];

function MegaIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2
  };

  const paths: Record<string, ReactNode> = {
    globe: (
      <>
        <circle cx="12" cy="12" r="8" {...common} />
        <path d="M4.5 12h15M12 4c2.2 2.4 3.2 5.1 3.2 8S14.2 17.6 12 20c-2.2-2.4-3.2-5.1-3.2-8S9.8 6.4 12 4Z" {...common} />
      </>
    ),
    code: <path d="M8 8 4 12l4 4m8-8 4 4-4 4M14 5l-4 14" {...common} />,
    server: (
      <>
        <rect x="5" y="5" width="14" height="6" rx="1.5" {...common} />
        <rect x="5" y="13" width="14" height="6" rx="1.5" {...common} />
        <path d="M8 8h.01M8 16h.01M12 8h4M12 16h4" {...common} />
      </>
    ),
    boxes: (
      <>
        <path d="m12 3 7 4-7 4-7-4 7-4Z" {...common} />
        <path d="m5 12 7 4 7-4M5 17l7 4 7-4" {...common} />
      </>
    ),
    brain: (
      <path d="M9 5a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 5 2.2V5.8A3 3 0 0 0 9 5Zm6 0a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-5 2.2V5.8A3 3 0 0 1 15 5Z" {...common} />
    ),
    wrench: <path d="M15.5 5.5a4 4 0 0 0 3 5.8L10.3 19.5a2.4 2.4 0 0 1-3.4-3.4l8.2-8.2a4 4 0 0 0 .4-2.4Z" {...common} />,
    shield: <path d="M12 3 19 6v5c0 4.5-2.8 7.6-7 9-4.2-1.4-7-4.5-7-9V6l7-3Z" {...common} />,
    pulse: <path d="M4 13h4l2-6 4 10 2-4h4" {...common} />,
    filter: <path d="M5 7h14M8 12h8M10.5 17h3" {...common} />,
    check: <path d="M5 12.5 10 17l9-10" {...common} />,
    doc: <path d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 12h6M10 16h6" {...common} />,
    book: <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H20v17H8.5A3.5 3.5 0 0 0 5 22V5.5Z" {...common} />,
    news: <path d="M4 6h16v12H4V6Zm3 3h5M7 13h10M7 16h10M15 9h2" {...common} />,
    file: <path d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 13h5M10 17h5" {...common} />,
    help: (
      <>
        <circle cx="12" cy="12" r="8" {...common} />
        <path d="M9.8 9a2.4 2.4 0 1 1 3.2 2.3c-.7.3-1 .8-1 1.7M12 16h.01" {...common} />
      </>
    ),
    building: <path d="M5 21V5h8v16M13 9h6v12M8 8h2M8 12h2M8 16h2M16 13h1M16 17h1" {...common} />,
    mail: <path d="M4 6h16v12H4V6Zm0 1 8 6 8-6" {...common} />,
    calendar: <path d="M6 4v3m12-3v3M4 9h16M5 6h14v14H5V6Zm5 8 2 2 4-5" {...common} />,
    users: <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6.5-1a2.5 2.5 0 1 0 0-5M4 20a5 5 0 0 1 10 0m2-7c2.4.5 4 2.4 4 5" {...common} />,
    lock: <path d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10Zm6 4v2" {...common} />,
    scale: <path d="M12 4v17M5 7h14M7 7l-3 6h6L7 7Zm10 0-3 6h6l-3-6Z" {...common} />
  };

  return (
    <svg aria-hidden="true" className="mega-icon-svg" viewBox="0 0 24 24">
      {paths[name] ?? paths.shield}
    </svg>
  );
}
export default function Home() {
  return (
    <main className="site-shell landing-page">
      <ScrollReveal />
      <Navbar />

      <HeroCarousel />

      <section
        aria-labelledby="challenge-title"
        className="challenge-section"
        id="the-challenge"
      >
        <div className="challenge-inner">
          <header className="challenge-heading">
            <span className="challenge-kicker">Discovery Is Not Validation</span>
            <h2 id="challenge-title">
              <span className="challenge-title-teal">Finding Vulnerabilities</span>{" "}
              <span className="challenge-title-violet">Is Only the Beginning</span>
            </h2>
            <p className="challenge-lead">
              Security tools are good at finding vulnerabilities. The harder
              and more valuable challenge is determining which findings are
              real, exploitable, and worth acting on.
            </p>
          </header>

          <div className="challenge-grid">
            {challengeRisks.map((risk) => (
              <article className="challenge-card" key={risk.title}>
                <h3>{risk.title}</h3>
                <p>{risk.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="ai-workflow-title"
        className="workflow-section"
        id="ai-workflow"
      >
        <div className="workflow-inner">
          <header className="workflow-heading">
            <span className="workflow-kicker">
              <MegaIcon name="brain" />
              The Forgesec Mental Model
            </span>
            <h2 id="ai-workflow-title">
              Discover. Understand. <span className="landing-title-accent">Validate. Prove. Act.</span>
            </h2>
            <p>
              Every capability maps to a structured workflow that turns a
              scanner finding into validated risk, supporting evidence, and a
              clear action for the security team.
            </p>
          </header>

          <div className="workflow-layout">
            <div className="workflow-side workflow-side-left">
              {[workflowAgents[0], workflowAgents[2]].map((agent) => (
                <article className="workflow-agent" key={agent.number}>
                  <span className="workflow-agent-icon">
                    <MegaIcon name={agent.icon} />
                  </span>
                  <div>
                    <p className="workflow-agent-label">
                      {agent.number} <span aria-hidden="true">&mdash;</span>{" "}
                      {agent.label}
                    </p>
                    <h3>{agent.title}</h3>
                    <p className="workflow-agent-copy">{agent.copy}</p>
                  </div>
                </article>
              ))}
            </div>

            <figure className="workflow-figure">
              <Image
                alt="Forgesec workflow from discovery through validation, evidence, prioritization, and remediation"
                fill
                priority={false}
                sizes="(min-width: 1024px) 40vw, (min-width: 600px) 70vw, 94vw"
                src="/images/image-12.webp"
              />
            </figure>

            <div className="workflow-side workflow-side-right">
              {[workflowAgents[1], workflowAgents[3]].map((agent) => (
                <article className="workflow-agent" key={agent.number}>
                  <span className="workflow-agent-icon">
                    <MegaIcon name={agent.icon} />
                  </span>
                  <div>
                    <p className="workflow-agent-label">
                      {agent.number} <span aria-hidden="true">&mdash;</span>{" "}
                      {agent.label}
                    </p>
                    <h3>{agent.title}</h3>
                    <p className="workflow-agent-copy">{agent.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trusted-section" id="trusted-platform">
        <div className="trusted-inner">
          <div className="trusted-intro">
            <div className="trusted-heading">
              <span className="section-kicker">Three Questions, One Workflow</span>
              <h2>
                Know the Risk Behind{" "}
                <span className="landing-title-accent">Every Finding</span>
              </h2>
              <p>
                ForgeSec connects security findings with affected assets,
                exposure, exploitability, validation evidence, and business
                context. This helps teams separate scanner noise from meaningful
                risk, prioritize remediation with confidence, and verify that
                completed fixes have reduced exposure. From initial discovery
                through retesting, decisions remain connected to clear evidence,
                accountable ownership, and practical next-step guidance—giving
                security and engineering teams a shared path from finding to
                closure.
              </p>
            </div>

            <figure className="trusted-visual">
              <Image
                alt="ForgeSec scanners protecting a connected global attack surface"
                fill
                sizes="(min-width: 900px) 48vw, 92vw"
                src="/images/image-15.webp"
              />
            </figure>
          </div>

          <div className="trusted-grid">
            {trustedItems.map((item, index) => (
              <article className="trusted-card" key={item.title}>
                <span className="trusted-icon">
                  <MegaIcon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <span className="trusted-index">0{index + 1}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SecurityCoverage />

      <section
        aria-labelledby="attack-surface-title"
        className="surface-section"
        id="attack-surface"
      >
        <div className="surface-inner">
          <header className="surface-heading">
            <div className="surface-title-block">
              <span className="surface-kicker">
                Unified Attack Surface Security
              </span>
              <h2 id="attack-surface-title">
                See Your Security Exposure <span className="landing-title-accent">in One Place</span>
              </h2>
            </div>

            <div className="surface-intro">
              <p>
                Modern attack surfaces extend across applications, APIs,
                operating systems, hosts, and connected infrastructure.
              </p>
              <p>
                Forgesec brings discovery, controlled vulnerability validation,
                evidence-backed prioritization, and remediation into one
                unified workflow.
              </p>
            </div>
          </header>

          <div className="surface-grid">
            {attackSurfaces.map((surface) => (
              <article className="surface-card" key={surface.number}>
                <span className="surface-number">{surface.number}</span>
                <span className="surface-icon">
                  <MegaIcon name={surface.icon} />
                </span>
                <h3>{surface.title}</h3>
                <span className="surface-divider" aria-hidden="true" />
                <p className="surface-lead">{surface.lead}</p>
                <p className="surface-copy">{surface.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="why-forgesec-title" className="why-forgesec-section">
        <div className="why-forgesec-inner">
          <header className="why-forgesec-heading">
            <h2 id="why-forgesec-title">Discovery, Validation, and <span className="landing-title-accent">Evidence in One Product</span></h2>
            <p>Forgesec brings together proven discovery tools, a maintained validation repository, AI assistance when no known method exists, controlled execution, and evidence capture.</p>
          </header>

          <div className="why-forgesec-grid">
            {platformProblems.map((item) => (
              <article className="why-forgesec-card" key={item.number}>
                <div className="why-forgesec-card-top">
                  <span><MegaIcon name={item.icon} /></span>
                  <small>{item.number}</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.problem}</p>
                <div className="why-forgesec-solution">
                  <b aria-hidden="true">â†’</b>
                  <span>{item.solution}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="solution-title"
        className="solution-section"
        id="solution"
      >
        <div className="solution-inner">
          <div className="solution-copy">
            <header className="solution-heading">
              <span className="solution-kicker">From Finding to Validated Risk</span>
              <h2 id="solution-title">
                The Scanner Finds It. <span className="landing-title-accent">Forgesec Establishes What It Means.</span>
              </h2>
              <p>
                ForgeSec sits downstream of discovery, transforming raw scanner
                findings into evidence-backed, prioritized security risk. It
                connects exploitability, affected assets, exposure, and business
                context so teams can distinguish scanner noise from issues that
                require action. Security, development, and operations teams gain
                a shared view of the evidence, remediation priority, and
                verification status from discovery through closure.
              </p>
            </header>

            <div className="solution-metrics">
              {solutionMetrics.map((metric) => (
                <article className="solution-metric" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className="solution-stack">
            {solutionPillars.map((pillar) => (
              <article className="solution-card" key={pillar.title}>
                <span className="solution-icon">
                  <MegaIcon name={pillar.icon} />
                </span>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="dashboard-title"
        className="dashboard-section"
        id="dashboard"
      >
        <div className="dashboard-inner">
          <div className="dashboard-copy">
            <span className="dashboard-kicker">Validated Security Risk</span>
            <h2 id="dashboard-title">
              One View From <span className="landing-title-accent">Exposure to Resolution</span>
            </h2>
            <p>
              Distinguish validated and unvalidated findings, review captured
              evidence, prioritize what matters, track remediation, and verify
              fixes from one operational view.
            </p>

            <div className="dashboard-stats" aria-label="ForgeSec dashboard outcomes">
              <article>
                <strong>5</strong>
                <span>Structured workflow stages</span>
              </article>
              <article>
                <strong>Proof</strong>
                <span>Evidence-backed validation</span>
              </article>
              <article>
                <strong>1</strong>
                <span>Unified risk view</span>
              </article>
            </div>
          </div>

          <div className="dashboard-video-card">
            <div className="dashboard-video-topbar" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <video
              aria-label="ForgeSec dashboard product walkthrough"
              autoPlay
              className="dashboard-video"
              controls
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/images/video.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="dashboard-grid">
            {dashboardHighlights.map((item) => (
              <article className="dashboard-card" key={item.title}>
                <span className="dashboard-card-icon">
                  <MegaIcon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="faq-section" id="faq">
        <div className="faq-inner">
          <header className="faq-heading">
            <span className="faq-kicker">Product Questions</span>
            <h2 id="faq-title">How Forgesec Turns <span className="landing-title-accent">Findings Into Action</span></h2>
            <p>
              Understand how discovery, validation knowledge, controlled
              execution, evidence, remediation, and human expertise work
              together.
            </p>
          </header>

          <div className="faq-list">
            {faqItems.map((item, index) => (
              <details className="faq-item" key={item.question} name="forgesec-faq">
                <summary>
                  <span>0{index + 1}</span>
                  <strong>{item.question}</strong>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-title" className="cta-section" id="contact">
        <div className="cta-inner">
          <div className="cta-copy">
            <span className="cta-kicker">See the Workflow</span>
            <h2 id="cta-title">
              See What <span className="landing-title-accent">Forgesec Can Validate</span>
            </h2>
            <p>
              See how existing discovery and validation capabilities come
              together to help answer: what is real, what matters, what should
              we fix, and can we prove it?
            </p>
          </div>

          <div className="cta-actions">
            <a className="cta-primary" href="/request-demo">
              Request a Demo
              <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
