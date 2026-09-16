import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import HelpCenterContent from "../../../components/HelpCenterContent";
import TrustAuroraHero from "../../../components/TrustAuroraHero";
import TrustStickyPrinciples from "../../../components/TrustStickyPrinciples";
import TrustEvidenceSection from "../../../components/TrustEvidenceSection";
import TrustClosingSection from "../../../components/TrustClosingSection";
import CustomersWorkflowSection from "../../../components/CustomersWorkflowSection";
import ContactPageContent from "../../../components/ContactPageContent";
import CareersOpportunities from "../../../components/CareersOpportunities";

const pageNames: Record<string, string> = {
  "hybrid-scanner": "Hybrid Scanner", "network-scanner": "Network Scanner", "remediation-guidance": "Remediation Guidance",
  "attack-surface-security": "Attack Surface Security", "continuous-pentesting": "Continuous Pentesting",
  "automated-pentesting": "Automated Pentesting", "risk-prioritization": "Risk Prioritization", "vulnerability-validation": "Vulnerability Validation",
  "security-teams": "Security Teams", "hybrid-environments": "Hybrid Environments",
  "resource-center": "Resource Center", documentation: "Documentation", blog: "Blog", webinars: "Webinars",
  "help-center": "Help Center", insights: "Insights", pricing: "Pricing",
  about: "About", "about-forge-sec": "About Forge-Sec", team: "Team", careers: "Careers", trust: "Trust", "trust-center": "Trust Center",
  customers: "Customers", reviews: "Reviews", contact: "Contact", newsroom: "Newsroom", partners: "Partners"
};

const companyPageSlugs = new Set([
  "about",
  "about-forge-sec",
  "team",
  "careers",
  "trust",
  "trust-center",
  "customers",
  "reviews",
  "contact",
  "newsroom",
  "partners"
]);

const resourcePageSlugs = new Set([
  "resource-center",
  "documentation",
  "blog",
  "webinars",
  "help-center",
  "insights"
]);

function TrustPrinciplesSection() {
  const principles = [
    { number: "01", label: "Testing governance", title: "Defined authorization", copy: "Targets, boundaries, and assessment intent are established before testing begins." },
    { number: "02", label: "Evidence handling", title: "Connected context", copy: "Technical evidence and affected assets stay attached to each security finding." },
    { number: "03", label: "Remediation workflow", title: "Visible ownership", copy: "Decisions, responsibility, and verification progress remain clear through resolution." }
  ];

  return <section className="trust-principles" aria-labelledby="trust-principles-title">
    <div className="trust-principles-inner">
      <header className="trust-register-heading">
        <div><span><i /> Operating commitments</span><h2 id="trust-principles-title">What your team can expect from Forge-Sec.</h2></div>
        <p>Our approach is straightforward: define what is authorized, preserve the context behind every finding, and keep responsibility visible until remediation is verified.</p>
      </header>
      <div className="trust-register" role="list">
        <div className="trust-register-labels" aria-hidden="true"><span>Area</span><span>Commitment</span><span>What it means</span></div>
        {principles.map((principle) => <article key={principle.number} role="listitem">
          <div className="trust-register-area"><b>{principle.number}</b><span>{principle.label}</span></div>
          <h3>{principle.title}</h3>
          <p>{principle.copy}</p>
        </article>)}
      </div>
    </div>
  </section>;
}

function CustomersHero() {
  return <section className="customers-hero" aria-labelledby="customers-hero-title">
    <div className="customers-hero-copy">
      <span className="customers-light-kicker">Built for modern security teams</span>
      <h1 id="customers-hero-title">Turn complex exposure into<span>confident security action.</span></h1>
      <p>Forge-Sec helps teams continuously test websites, APIs, operating systems, networks, and hybrid environments—then connect validated findings to accountable remediation.</p>
      <div className="customers-hero-actions"><Link href="/company/contact">Talk to Our Team <span>→</span></Link><Link href="/request-demo">Request a Demo</Link></div>
    </div>
    <div className="customers-hero-audiences" aria-label="Teams supported by Forge-Sec">
      <article><span>01</span><div><h2>Security leaders</h2><p>See exposure, priorities, ownership, and remediation progress in one connected view.</p></div></article>
      <article><span>02</span><div><h2>Application security</h2><p>Validate meaningful risk across web applications and APIs with evidence attached.</p></div></article>
      <article><span>03</span><div><h2>Engineering teams</h2><p>Receive clear remediation context and verify that fixes address the original finding.</p></div></article>
    </div>
  </section>;
}

function CustomersOutcomesSection() {
  const outcomes = [
    { number: "01", title: "A shared view of exposure", copy: "Security and engineering teams work from the same asset context, evidence, and finding status." },
    { number: "02", title: "Priorities teams can explain", copy: "Validated findings help teams focus discussion and effort on risk that is relevant and actionable." },
    { number: "03", title: "Remediation progress that stays visible", copy: "Ownership, resolution work, and verification remain connected through the full lifecycle." }
  ];

  return <section className="customers-outcomes" id="customer-outcomes" aria-labelledby="customers-outcomes-title">
    <header className="customers-outcomes-heading">
      <div><span><i /> Built around the work</span><h2 id="customers-outcomes-title">One workflow.<br /><em>Better alignment.</em></h2></div>
      <p>Forge-Sec gives the people finding risk and the people fixing it a consistent way to understand exposure, agree on priorities, and track what has changed.</p>
    </header>
    <div className="customers-outcomes-list">
      {outcomes.map((outcome) => <article key={outcome.number}>
        <span>{outcome.number}</span>
        <div><h3>{outcome.title}</h3><p>{outcome.copy}</p></div>
        <i aria-hidden="true">→</i>
      </article>)}
    </div>
  </section>;
}

function CustomersClosingSection() {
  return <section className="customers-closing" aria-labelledby="customers-closing-title">
    <div className="customers-closing-copy">
      <span><i /> Build your security workflow</span>
      <h2 id="customers-closing-title">Start with the exposure that matters to your team.</h2>
      <p>See how Forge-Sec can support your applications, APIs, operating systems, networks, and hybrid environments—from continuous discovery to verified remediation.</p>
      <div><Link href="/request-demo">Request a Demo <span>→</span></Link><Link href="/company/contact">Talk to Our Team</Link></div>
    </div>
    <aside className="customers-closing-path" aria-label="Ways to start with Forge-Sec">
      <header><span>Where to begin</span><small>Choose your priority</small></header>
      <article><b>01</b><div><h3>Understand external exposure</h3><p>Establish visibility across approved internet-facing assets.</p></div></article>
      <article><b>02</b><div><h3>Strengthen application testing</h3><p>Connect web and API findings with evidence and ownership.</p></div></article>
      <article><b>03</b><div><h3>Improve remediation confidence</h3><p>Track fixes and verify that the original risk is addressed.</p></div></article>
    </aside>
  </section>;
}

function CustomersUseCasesSection() {
  const useCases = [
    { number: "01", label: "Continuous visibility", title: "Maintain Visibility as Environments Change", copy: "Continuously assess approved web, API, host, and network assets as environments and services change." },
    { number: "02", label: "Risk validation", title: "Separate meaningful risk from noise", copy: "Use technical evidence and reachability context to focus attention on findings that require action." },
    { number: "03", label: "Team coordination", title: "Connect security with engineering", copy: "Give remediation owners clear finding context while keeping responsibility and progress visible." },
    { number: "04", label: "Remediation assurance", title: "Retest and Confirm Remediation", copy: "Retest the original exposure and retain the evidence needed to confirm that risk has been addressed." }
  ];

  return <section className="customers-use" aria-labelledby="customers-use-title">
    <header className="customers-use-heading">
      <span><i /> Platform in practice</span>
      <div><h2 id="customers-use-title">How Teams Use <em>ForgeSec.</em></h2><p>Organizations bring ForgeSec into different parts of their security program. These are the core workflows the platform is designed to support.</p></div>
    </header>
    <div className="customers-use-grid">{useCases.map((useCase) => <article key={useCase.number}>
      <div><span>{useCase.number}</span><small>{useCase.label}</small></div>
      <h3>{useCase.title}</h3>
      <p>{useCase.copy}</p>
    </article>)}</div>
  </section>;
}

function AboutHero() {
  return <section className="about-hero" aria-labelledby="about-hero-title">
    <div className="about-hero-copy">
      <span className="about-hero-kicker"><i /> About Forge-Sec</span>
      <h1 id="about-hero-title">Security Assurance<br />Built Around<br /><span>Clearer Decisions.</span></h1>
      <p>Forge-Sec helps security and engineering teams continuously discover exposure, validate meaningful risk, and move from technical findings to verified remediation with confidence.</p>
      <div className="about-hero-actions">
        <Link href="/request-demo">Meet Forge-Sec</Link>
        <Link href="/#platform">Explore the Platform</Link>
      </div>
      <div className="about-hero-principles" aria-label="Forge-Sec principles">
        <span><b>01</b> Continuous testing</span><i /><span><b>02</b> Evidence-led risk</span><i /><span><b>03</b> Verified remediation</span>
      </div>
    </div>
    <figure className="about-hero-visual">
      <Image alt="Forge-Sec security team collaborating around continuous security testing" fill priority sizes="(min-width: 900px) 52vw, 100vw" src="/images/security-teams-culture.png" />
    </figure>
  </section>;
}

function AboutFactsSection() {
  const facts = [
    { number: "01", value: "One", title: "Connected Security Platform", copy: "Discovery, validation, prioritization, remediation, and retesting stay connected in one workflow." },
    { number: "02", value: "Four", title: "Security Across Key Layers", copy: "Web applications, APIs, operating systems, and networks are assessed with shared risk context." },
    { number: "03", value: "Always", title: "Designed for Ongoing Assurance", copy: "Testing can follow changing applications, infrastructure, services, and newly introduced exposure." },
    { number: "04", value: "Every", title: "Findings Backed by Context", copy: "Technical evidence and remediation direction help teams understand what matters and what to do next." }
  ];

  return <section className="about-facts" aria-labelledby="about-facts-title">
    <header className="about-facts-heading">
      <div><span><i /> Company facts</span><h2 id="about-facts-title">What Defines ForgeSec.</h2></div>
      <p>Forge-Sec is built around a simple principle: security information becomes valuable when teams can understand it, prioritize it, and verify the outcome.</p>
    </header>
    <div className="about-facts-grid">
      {facts.map((fact) => <article key={fact.number}>
        <header><span>{fact.number}</span><small>Forge-Sec fact</small></header>
        <strong>{fact.value}</strong><h3>{fact.title}</h3><p>{fact.copy}</p>
      </article>)}
    </div>
  </section>;
}

function AboutApproachSection() {
  const steps = [
    { number: "01", title: "See Connected Exposure", copy: "Bring application, API, host, and network findings into one connected view of exposure." },
    { number: "02", title: "Prioritize with evidence", copy: "Use reachability, validation, technical proof, and asset context to focus on meaningful risk." },
    { number: "03", title: "Close the loop", copy: "Deliver clear remediation guidance, coordinate ownership, and retest changes to verify resolution." }
  ];

  return <section className="about-approach" aria-labelledby="about-approach-title">
    <figure className="about-approach-visual">
      <Image alt="Security specialists reviewing findings and coordinating remediation" fill sizes="(min-width: 900px) 48vw, 100vw" src="/images/security-teams-remediation-review.png" />
      <figcaption><span>How we work</span><strong>Visibility · Evidence · Verified action</strong></figcaption>
    </figure>
    <div className="about-approach-copy">
      <span className="about-approach-kicker"><i /> Our approach</span>
      <h2 id="about-approach-title">Security built around the decisions teams need to make.</h2>
      <p>Forge-Sec connects testing, risk context, and remediation so security and engineering teams can work from the same evidence and move forward with confidence.</p>
      <div className="about-approach-steps">{steps.map((step) => <article key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></article>)}</div>
      <Link className="about-approach-link" href="/request-demo">See Forge-Sec in Action</Link>
    </div>
  </section>;
}

function AboutClosingSection() {
  return <section className="about-closing" aria-labelledby="about-closing-title">
    <div>
      <span>Build security with confidence</span>
      <h2 id="about-closing-title">Turn Security Findings Into Evidence-Backed Progress.</h2>
      <p>See how Forge-Sec can help your teams understand exposure, focus remediation, and prove that meaningful risk is resolved.</p>
    </div>
    <div className="about-closing-actions">
      <Link href="/request-demo">Request a Demo</Link>
      <Link href="/signup">Get Started</Link>
    </div>
  </section>;
}

function CareersHero() {
  return <section className="careers-hero" aria-labelledby="careers-hero-title">
    <div className="careers-hero-copy">
      <span className="careers-hero-kicker"><i /> Careers at Forge-Sec</span>
      <h1 id="careers-hero-title">Build the Future of<span>Evidence-Backed Security.</span></h1>
      <p>Join a team focused on helping security and engineering organizations understand real exposure, make better risk decisions, and verify meaningful progress.</p>
      <div className="careers-hero-actions">
        <Link href="#open-opportunities">Explore Opportunities</Link>
        <Link href="/company/about">Learn About Forge-Sec</Link>
      </div>
      <div className="careers-hero-paths" aria-label="Career areas">
        <span>Security Research</span><i /><span>Product Engineering</span><i /><span>Customer Impact</span>
      </div>
    </div>
  </section>;
}

function CareersValuesSection() {
  const values = [
    { number: "01", label: "Meaningful Work", title: "Solve security problems that matter", copy: "Build products that help teams distinguish real exposure from noise and move critical remediation forward." },
    { number: "02", label: "Shared Ownership", title: "Work across disciplines", copy: "Partner with security researchers, engineers, product thinkers, and customer teams around one clear outcome." },
    { number: "03", label: "Continuous Growth", title: "Learn while building", copy: "Take on complex technical challenges, share what you discover, and strengthen your craft through practical work." }
  ];

  return <section className="careers-values" aria-labelledby="careers-values-title">
    <header className="careers-values-heading">
      <div><span><i /> Why Forge-Sec</span><h2 id="careers-values-title">Do work with purpose, ownership, and room to grow.</h2></div>
      <p>We are building a team for people who care about strong ideas, thoughtful execution, and security outcomes customers can understand and verify.</p>
    </header>
    <div className="careers-values-grid">{values.map((value) => <article key={value.number}>
      <header><span>{value.number}</span><small>{value.label}</small></header>
      <h3>{value.title}</h3><p>{value.copy}</p><footer><i /><b>Build with impact</b></footer>
    </article>)}</div>
  </section>;
}

function CareersAreasSection() {
  const areas = [
    { number: "01", area: "Security Research", title: "Advance Evidence-Backed Security Validation", copy: "Research attack paths, validation methods, and evidence that helps teams understand meaningful exposure." },
    { number: "02", area: "Engineering", title: "Build reliable security systems", copy: "Create scalable scanning, data, automation, and platform experiences for modern security programs." },
    { number: "03", area: "Product & Design", title: "Make complex risk understandable", copy: "Turn technical security workflows into clear decisions and focused experiences for every user." },
    { number: "04", area: "Customer Security", title: "Help Customers Act on Meaningful Risk", copy: "Connect product capability with real security programs, operational needs, and verified improvement." }
  ];

  return <section className="careers-areas" aria-labelledby="careers-areas-title">
    <div className="careers-areas-intro">
      <span><i /> Where you can contribute</span>
      <h2 id="careers-areas-title">Bring your craft to a shared security mission.</h2>
      <p>Different disciplines, one objective: help organizations find real exposure and act on it with confidence.</p>
      <Link href="/company/contact">Start a Conversation</Link>
    </div>
    <div className="careers-areas-list">{areas.map((area) => <article key={area.number}>
      <span>{area.number}</span><div><small>{area.area}</small><h3>{area.title}</h3><p>{area.copy}</p></div>
    </article>)}</div>
  </section>;
}

function HybridEnvironmentsHero() {
  return <section className="hybrid-wip-hero">
    <Image alt="Infrastructure security engineer working across cloud and on-premises systems" className="hybrid-wip-image" fill priority sizes="100vw" src="/images/hybrid-environments-hero-v3.png" />
    <div className="hybrid-wip-shade" />
    <div className="hybrid-wip-content">
      <span className="hybrid-wip-kicker"><i /> Unified Hybrid Security</span>
      <h1>One Connected View<span>Across Hybrid Environments.</span></h1>
      <p>Connect security findings across cloud workloads, on-premises systems, applications, APIs, hosts, and infrastructure—without losing context between environments.</p>
      <div className="hybrid-wip-proof" aria-label="Hybrid environment coverage">
        <span>Cloud</span><i /><span>On-Prem</span><i /><span>Applications</span><i /><span>Infrastructure</span>
      </div>
      <div className="hybrid-wip-actions">
        <Link href="/signup">Start Hybrid Scan <span aria-hidden="true">→</span></Link>
        <Link href="/request-demo">See How It Works <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </section>;
}

function HybridScannerHero() {
  return <section className="hybrid-scanner-hero" aria-labelledby="hybrid-scanner-title">
    <div className="hybrid-scanner-hero-inner">
      <svg className="hybrid-scanner-lines" viewBox="0 0 1280 250" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 22H76Q104 22 104 50V118Q104 146 132 146H262" />
        <circle cx="262" cy="146" r="8" />
        <path d="M1018 146H1104Q1132 146 1132 118V78Q1132 50 1160 50H1207Q1235 50 1235 78V202Q1235 230 1263 230H1280" />
        <circle cx="1018" cy="146" r="8" />
      </svg>

      <header className="hybrid-scanner-heading">
        <span>Forge-Sec Hybrid Scanner</span>
        <h1 id="hybrid-scanner-title">Connect Findings Across<br />Your Environment.<br />See One Clear Risk Story.</h1>
        <p>Unified security testing for applications, APIs, cloud workloads, hosts, and networks.</p>
      </header>

      <span className="hybrid-scanner-chip is-left"><i /> For security teams</span>
      <span className="hybrid-scanner-chip is-right"><i /> Across every environment</span>

      <article className="hybrid-scanner-feature">
        <div className="hybrid-scanner-feature-copy">
          <span>Unified attack-surface coverage</span>
          <h2>One Connected View Across Your Security Environment.</h2>
          <p>Connect web, API, cloud, operating-system, and network findings in one evidence-backed workflow—then prioritize the risks that matter most.</p>
          <div className="hybrid-scanner-actions">
            <Link href="/signup">Start a Hybrid Scan <span aria-hidden="true">→</span></Link>
            <Link href="/request-demo">Request a Demo</Link>
          </div>
          <div className="hybrid-scanner-coverage" aria-label="Hybrid scanner coverage">
            <span>Web &amp; API</span><i /><span>Cloud</span><i /><span>Hosts &amp; networks</span>
          </div>
        </div>
        <figure className="hybrid-scanner-feature-visual">
          <Image
            alt="Unified security operations workspace monitoring applications, cloud services, and infrastructure"
            fill
            priority
            sizes="(min-width: 900px) 55vw, 100vw"
            src="/images/scanner-hybrid-realistic.png"
          />
        </figure>
      </article>
    </div>
  </section>;
}

function HybridScannerLayersSection() {
  const capabilities = [
    { number: "01", title: "System Hardening", copy: "Review Linux, Windows, and WSL security controls." },
    { number: "02", title: "Network Exposure", copy: "Find listening ports and exposed services." },
    { number: "03", title: "Patch Assessment", copy: "Identify outdated software and missing updates." },
    { number: "04", title: "Extended Security", copy: "Assess hardware, containers, and security logs." }
  ];

  const scanCards = [
    { label: "System", title: "OS security posture", copy: "Linux · Windows · WSL", tone: "mint" },
    { label: "Software", title: "Patch intelligence", copy: "Versions · Updates · CVEs", tone: "violet" },
    { label: "Network", title: "Exposure discovery", copy: "Ports · Services · Firewall", tone: "blue" },
    { label: "Platform", title: "Container checks", copy: "Docker · Kubernetes · Runtime", tone: "amber" },
    { label: "Detection", title: "Security log review", copy: "Access · Events · Activity", tone: "rose" }
  ];

  return <section className="hybrid-scanner-layers" aria-labelledby="hybrid-scanner-layers-title">
    <div className="hybrid-scanner-features-inner">
      <div className="hybrid-scanner-features-copy">
        <span className="hybrid-scanner-features-kicker"><i /> Hybrid scanner features</span>
        <h2 id="hybrid-scanner-layers-title">Connected Security Assessment, <em>Simplified.</em></h2>
        <p>Detect vulnerabilities, exposed services, outdated software, and hardening gaps across systems and networks from one unified scanner.</p>

        <div className="hybrid-scanner-feature-points">
          {capabilities.map((item) => <article key={item.number}>
            <span>{item.number}</span>
            <div><h3>{item.title}</h3><p>{item.copy}</p></div>
          </article>)}
        </div>

        <Link className="hybrid-scanner-features-cta" href="/signup">Start Hybrid Scan <span aria-hidden="true">→</span></Link>
      </div>

      <div className="hybrid-scanner-card-stage" aria-label="Hybrid scanner coverage overview">
        <div className="hybrid-scanner-card-column is-left">
          {scanCards.slice(0, 3).map((card) => <article className={`is-${card.tone}`} key={card.title}>
            <header><span>{card.label}</span><i /></header>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
            <footer><span><i /> Included in scan</span><b>→</b></footer>
          </article>)}
        </div>
        <div className="hybrid-scanner-card-column is-right">
          {scanCards.slice(3).map((card) => <article className={`is-${card.tone}`} key={card.title}>
            <header><span>{card.label}</span><i /></header>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
            <footer><span><i /> Included in scan</span><b>→</b></footer>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}

function HybridScannerWorkflowSection() {
  const workflow = [
    { number: "01", label: "Scope", title: "Define the assessment", copy: "Select the local system or authorized network environment to review.", outcome: "Scope ready" },
    { number: "02", label: "Scan", title: "Run Coordinated Security Checks", copy: "Run coordinated checks across systems, services, software, hardware, containers, and logs.", outcome: "Coverage complete" },
    { number: "03", label: "Prioritize", title: "Organize the findings", copy: "Group vulnerabilities, misconfigurations, outdated software, and exposed services by risk.", outcome: "Risk view prepared" },
    { number: "04", label: "Report", title: "Guide remediation", copy: "Deliver evidence and practical guidance through clear HTML and JSON reports.", outcome: "Reports generated" }
  ];

  return <section className="hybrid-scanner-workflow" aria-labelledby="hybrid-scanner-workflow-title">
    <div className="hybrid-scanner-workflow-inner">
      <header className="hybrid-scanner-workflow-heading">
        <span><i /> How the scanner works</span>
        <h2 id="hybrid-scanner-workflow-title">From assessment to <em>clear security action.</em></h2>
        <p>One guided workflow transforms broad technical checks into prioritized findings and remediation-ready reports.</p>
      </header>

      <ol className="hybrid-scanner-process-track">
        {workflow.map((step) => <li key={step.number}>
          <header><span>{step.number}</span><small>{step.label}</small></header>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
          <footer><i /><span>{step.outcome}</span></footer>
        </li>)}
      </ol>

      <div className="hybrid-scanner-report-delivery">
        <div className="hybrid-scanner-report-copy">
          <span><i /> Assessment output</span>
          <h3>Findings Organized for Clearer Remediation.</h3>
          <p>Every completed assessment brings vulnerabilities, evidence, risk context, and recommended actions into one structured result.</p>
          <div><span>Prioritized findings</span><span>Technical evidence</span><span>Remediation guidance</span></div>
        </div>
        <div className="hybrid-scanner-report-formats" aria-label="Available Hybrid System Scanner report formats">
          <article>
            <span>HTML</span>
            <div><small>Human-readable report</small><strong>Review and share findings</strong></div>
            <i aria-hidden="true">↗</i>
          </article>
          <article>
            <span>JSON</span>
            <div><small>Structured scan data</small><strong>Integrate and automate</strong></div>
            <i aria-hidden="true">↗</i>
          </article>
        </div>
      </div>

      <div className="hybrid-scanner-workflow-legacy">
        <ol className="hybrid-scanner-workflow-steps">
          {workflow.map((step, index) => <li key={step.number}>
            <div className="hybrid-scanner-workflow-index"><span>{step.number}</span>{index < workflow.length - 1 && <i />}</div>
            <div>
              <small>{step.label}</small>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          </li>)}
        </ol>

        <aside className="hybrid-scanner-terminal" aria-label="Example Hybrid System Scanner terminal output">
          <header>
            <div><i /><i /><i /></div>
            <span>hybrid-system-scanner</span>
            <small>Assessment running</small>
          </header>
          <div className="hybrid-scanner-terminal-body">
            <p><b>$</b> python hybrid_system_scanner.py</p>
            <span>Initializing authorized assessment...</span>
            <ul>
              <li><i>01</i><span>System and hardening checks</span><b>Complete</b></li>
              <li><i>02</i><span>Network and service exposure</span><b>Mapped</b></li>
              <li><i>03</i><span>Software and patch posture</span><b>Reviewed</b></li>
              <li><i>04</i><span>Containers and security logs</span><b>Analyzed</b></li>
            </ul>
            <div className="hybrid-scanner-terminal-output">
              <span><i /> HTML report</span>
              <span><i /> JSON report</span>
              <strong>Ready for review</strong>
            </div>
          </div>
        </aside>
      </div>

      <div className="hybrid-scanner-workflow-legacy-summary">
        <div><small>Input</small><strong>Authorized system or network scope</strong></div>
        <i aria-hidden="true">→</i>
        <div><small>Assessment</small><strong>Connected security checks</strong></div>
        <i aria-hidden="true">→</i>
        <div><small>Output</small><strong>HTML and JSON reports</strong></div>
      </div>
    </div>
  </section>;
}

function HybridScannerReportingSection() {
  const reportBenefits = [
    { number: "01", title: "Evidence attached", copy: "Keep the affected system, detected weakness, and technical context connected to every finding." },
    { number: "02", title: "Risk made clear", copy: "Organize vulnerabilities, exposed services, missing updates, and hardening gaps by priority." },
    { number: "03", title: "Guidance teams can use", copy: "Give technical teams practical remediation direction for each identified security issue." }
  ];

  return <section className="hybrid-scanner-reporting" id="hybrid-scanner-reporting" aria-labelledby="hybrid-scanner-reporting-title">
    <div className="hybrid-scanner-reporting-inner">
      <figure className="hybrid-scanner-reporting-visual">
        <Image
          alt="Security analyst reviewing connected system, network, and infrastructure findings"
          fill
          sizes="(min-width: 900px) 54vw, 100vw"
          src="/images/hybrid-unified-visibility-v2.png"
        />
        <span className="hybrid-scanner-reporting-index">04</span>
        <figcaption>
          <span><i /> Unified assessment view</span>
          <strong>Systems · Networks · Security controls</strong>
        </figcaption>
      </figure>

      <div className="hybrid-scanner-reporting-copy">
        <span className="hybrid-scanner-reporting-kicker"><i /> Actionable scan results</span>
        <h2 id="hybrid-scanner-reporting-title">Turn Connected Findings Into <em>Clear Remediation Priorities.</em></h2>
        <p>Move beyond raw terminal output. Forge-Sec organizes technical findings into a structured view that helps teams understand exposure, focus on meaningful risk, and take the next action.</p>

        <div className="hybrid-scanner-reporting-benefits">
          {reportBenefits.map((benefit) => <article key={benefit.number}>
            <span>{benefit.number}</span>
            <div><h3>{benefit.title}</h3><p>{benefit.copy}</p></div>
          </article>)}
        </div>

        <div className="hybrid-scanner-reporting-footer">
          <div><small>Available outputs</small><span>HTML</span><span>JSON</span></div>
          <Link href="/signup">Start Hybrid Scan <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  </section>;
}

function HybridScannerFinalSection() {
  return <section className="hybrid-scanner-final" aria-labelledby="hybrid-scanner-final-title">
    <div className="hybrid-scanner-final-inner">
      <div className="hybrid-scanner-final-copy">
        <span><i /> Hybrid System Scanner</span>
        <h2 id="hybrid-scanner-final-title">Bring Cross-Environment Findings Into <em>One Unified View.</em></h2>
        <p>Check OS settings, exposed services, outdated software, hardware security, containers, and logs. Export the findings as HTML or JSON.</p>
      </div>

      <div className="hybrid-scanner-final-action-panel">
        <small>Start an authorized assessment</small>
        <div className="hybrid-scanner-final-actions">
          <Link href="/signup">Start Hybrid Scan <span aria-hidden="true">&rarr;</span></Link>
          <a href="#hybrid-scanner-reporting">View Report Output <span aria-hidden="true">&nearr;</span></a>
        </div>
        <p>Only scan systems and networks you own or have explicit permission to assess.</p>
      </div>
    </div>
  </section>;
}

function ResourceCenterHero() {
  return <section className="resource-center-hero" aria-labelledby="resource-center-hero-title">
    <div className="resource-center-hero-content">
      <span className="resource-center-kicker"><i /> Forge-Sec Resource Center</span>
      <h1 id="resource-center-hero-title">Security Knowledge<span>for Evidence-Backed Decisions.</span></h1>
      <p>Explore practical research, expert guidance, reports, and product insights designed to help security teams understand exposure, prioritize real risk, and remediate with confidence.</p>
      <div className="resource-center-actions">
        <Link href="/resources/blog">Explore Insights <span aria-hidden="true">→</span></Link>
        <a href="https://1drv.ms/b/c/7b8f40e24e768561/IQD96J9seqhuTJATP33UhiGGAYGylBzttP2tLz6YoD8VUBQ" rel="noreferrer" target="_blank">Read Featured Report <span aria-hidden="true">↗</span></a>
      </div>
      <div className="resource-center-topics" aria-label="Resource topics">
        <span>Research</span><i /><span>Security Guides</span><i /><span>Reports</span><i /><span>Product Insights</span>
      </div>
    </div>
  </section>;
}

function InsightsHero() {
  return <section className="insights-showcase-hero" aria-labelledby="insights-hero-title">
    <div className="insights-showcase-inner">
      <header className="insights-showcase-intro">
        <span className="insights-showcase-kicker"><i /> Forge-Sec Insights</span>
        <h1 id="insights-hero-title">Security Insights for <span>Evidence-Backed Decisions.</span></h1>
        <p>Research, practical guidance, and expert perspectives that help security teams validate exposure, prioritize real risk, and move confidently from finding to fix.</p>
        <div className="insights-showcase-actions">
          <Link href="/resources/blog">Explore Latest Insights <span aria-hidden="true">→</span></Link>
          <Link href="/resources/resource-center">Browse Resource Center</Link>
        </div>
        <div className="insights-showcase-topics" aria-label="Insights topics">
          <span><b>01</b> Validation</span>
          <span><b>02</b> Risk Strategy</span>
          <span><b>03</b> Continuous Testing</span>
          <span><b>04</b> Remediation</span>
        </div>
      </header>
    </div>
  </section>;
}

function InsightsFeaturedSection() {
  const topics = [
    { number: "01", label: "Validation", title: "Prove which findings create real exposure.", copy: "Move beyond scanner severity with evidence that shows whether a weakness is reachable, exploitable, and meaningful in its environment." },
    { number: "02", label: "Prioritization", title: "Focus remediation where risk is concentrated.", copy: "Connect exploitability, exposure, asset importance, and business context to create a priority order teams can trust." },
    { number: "03", label: "Remediation", title: "Turn Technical Evidence Into Confirmed Remediation.", copy: "Give owners clear fix guidance, preserve finding context, and retest changes to confirm the original exposure is resolved." }
  ];

  return <section className="insights-featured-section" aria-labelledby="insights-featured-title">
    <div className="insights-featured-inner">
      <header className="insights-featured-heading">
        <div><span><i /> Featured Thinking</span><h2 id="insights-featured-title">Insights Built Around Real Security Decisions.</h2></div>
        <p>Explore practical guidance for separating meaningful exposure from noise, directing limited remediation capacity, and verifying that risk is actually closed.</p>
      </header>

      <div className="insights-featured-layout">
        <article className="insights-featured-lead">
          <header><span>Featured Insight</span><small>Security Strategy · 8 min read</small></header>
          <div>
            <h3>From Vulnerability Volume to Validated Risk.</h3>
            <p>More findings do not automatically create better security outcomes. Strong programs connect continuous discovery with validation, context-aware prioritization, actionable remediation, and evidence of closure.</p>
          </div>
          <footer><div><span>01</span><small>Discover</small></div><i /><div><span>02</span><small>Validate</small></div><i /><div><span>03</span><small>Prioritize</small></div><i /><div><span>04</span><small>Remediate</small></div></footer>
          <a href="/solutions/continuous-pentesting">Read the Perspective <span aria-hidden="true">→</span></a>
        </article>

        <div className="insights-featured-topics">
          {topics.map((topic) => <article key={topic.number}>
            <header><span>{topic.number}</span><small>{topic.label}</small></header>
            <h3>{topic.title}</h3><p>{topic.copy}</p>
            <a href="/resources/resource-center" aria-label={`Explore ${topic.label} resources`}>Explore Topic <span aria-hidden="true">→</span></a>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}

function InsightsPerspectivesSection() {
  const perspectives = [
    { number: "01", category: "Continuous Testing", readTime: "6 min read", title: "Why point-in-time testing leaves important exposure unseen.", copy: "Point-in-time assessments capture one moment while applications, APIs, hosts, and infrastructure keep changing. Continuous testing helps teams keep new exposure visible as environments evolve.", href: "/solutions/continuous-pentesting" },
    { number: "02", category: "Risk Intelligence", readTime: "7 min read", title: "A better way to prioritize beyond severity scores.", copy: "Severity becomes more useful when it is combined with reachability, exploitability, asset context, and the consequences of a successful attack.", href: "/products/ai-risk-prioritization" },
    { number: "03", category: "Security Operations", readTime: "5 min read", title: "How evidence improves collaboration with engineering.", copy: "Clear proof, reproducible steps, and focused remediation guidance help security and engineering teams resolve issues with less back-and-forth.", href: "/solutions/security-teams" }
  ];

  return <section className="insights-perspectives-section" aria-labelledby="insights-perspectives-title">
    <div className="insights-perspectives-inner">
      <header className="insights-perspectives-heading">
        <span><i /> Insight Briefs</span>
        <div><h2 id="insights-perspectives-title">Three ideas. Clear next steps.</h2><p>Short, practical guidance for improving coverage, prioritization, and collaboration.</p></div>
      </header>

      <div className="insights-perspectives-list">
        {perspectives.map((item) => <article key={item.number}>
          <span className="insights-perspective-number">{item.number}</span>
          <div className="insights-perspective-copy">
            <header><span>{item.category}</span><i /><small>{item.readTime}</small></header>
            <h3>{item.title}</h3><p>{item.copy}</p>
          </div>
          <a href={item.href} aria-label={`Read: ${item.title}`}><span>Read Insight</span><b aria-hidden="true">→</b></a>
        </article>)}
      </div>

      <footer className="insights-perspectives-footer"><p>Looking for more practical security guidance?</p><a href="/resources/resource-center">View All Resources <span aria-hidden="true">→</span></a></footer>
    </div>
  </section>;
}

function InsightsFrameworkSection() {
  const steps = [
    { number: "01", title: "Observe", copy: "See exposure across applications, APIs, hosts, and infrastructure." },
    { number: "02", title: "Validate", copy: "Confirm which weaknesses create a credible path to impact." },
    { number: "03", title: "Decide", copy: "Prioritize work using risk, asset, and business context." },
    { number: "04", title: "Improve", copy: "Remediate, retest, and use the evidence to strengthen coverage." }
  ];

  return <section className="insights-framework-section" aria-labelledby="insights-framework-title">
    <div className="insights-framework-inner">
      <header className="insights-framework-heading">
        <div><span>Decision Framework</span><h2 id="insights-framework-title">A clearer way to turn insight into action.</h2></div>
        <p>Use one repeatable path to understand exposure, validate risk, set priorities, and verify improvement.</p>
      </header>

      <div className="insights-framework-grid">
        {steps.map((step) => <article key={step.number}>
          <header><span>{step.number}</span><i /></header><h3>{step.title}</h3><p>{step.copy}</p>
        </article>)}
      </div>

      <footer className="insights-framework-outcome">
        <div><span>One connected outcome</span><strong>Less Noise. Clearer Priorities. Evidence-Backed Progress.</strong></div>
        <a href="/request-demo">See the Forge-Sec Workflow <span aria-hidden="true">→</span></a>
      </footer>
    </div>
  </section>;
}

function DocumentationHero() {
  return <section className="docs-background-hero" aria-labelledby="documentation-hero-title">
    <div className="docs-background-copy">
      <span className="docs-image-kicker"><i /> Forge-Sec Documentation</span>
      <h1 id="documentation-hero-title">Configure, Test, and Operate<span>ForgeSec With Confidence.</span></h1>
      <p>Find clear technical guidance for configuring Forge-Sec, running security scans, reviewing validated findings, and integrating remediation into your workflow.</p>
      <div className="docs-image-actions"><Link href="/signup">Browse Documentation <span aria-hidden="true">→</span></Link><Link href="/resources/help-center">Visit Help Center</Link></div>
      <div className="docs-image-topics"><span>Quick Start</span><i /><span>Scanner Setup</span><i /><span>API Reference</span><i /><span>Integrations</span></div>
    </div>
  </section>;
}

function BlogHero() {
  return <section className="blog-background-hero" aria-labelledby="blog-hero-title">
    <div className="blog-background-copy">
      <span className="blog-wip-kicker"><i /> Forge-Sec Blog</span>
      <h1 id="blog-hero-title">Security Insights<span>for Better Decisions.</span></h1>
      <p>Explore practical perspectives on continuous security testing, vulnerability validation, intelligent risk prioritization, and modern remediation workflows.</p>
      <div className="blog-wip-actions">
        <Link href="/solutions/continuous-pentesting">Read Featured Story <span aria-hidden="true">→</span></Link>
        <Link href="/resources/resource-center">Visit Resource Center</Link>
      </div>
      <div className="blog-wip-topics" aria-label="Blog topics"><span>Research</span><i /><span>Product</span><i /><span>Engineering</span><i /><span>Security Strategy</span></div>
    </div>
  </section>;
}

function WebinarsHero() {
  return <section className="webinars-hero webinars-split-hero" aria-labelledby="webinars-hero-title">
    <div className="webinars-hero-content">
      <span className="webinars-hero-kicker"><i /> Forgesec Webinars</span>
      <h1 id="webinars-hero-title">Security Insights From Practitioners<span>Who Know the Work.</span></h1>
      <p>Join expert-led sessions on vulnerability validation, evidence-backed risk, remediation, and the security-assurance practices that help teams make better decisions.</p>
      <div className="webinars-hero-actions">
        <Link href="/resources/resource-center">Explore Security Resources <span aria-hidden="true">→</span></Link>
        <Link href="/request-demo">Request a Demo</Link>
      </div>
      <div className="webinars-hero-topics" aria-label="Webinar formats">
        <span>Expert Sessions</span><i /><span>Technical Walkthroughs</span><i /><span>On-Demand Learning</span>
      </div>
    </div>
  </section>;
}

function HelpCenterHero() {
  return <section className="help-center-hero">
    <div className="help-center-hero-content">
      <div className="help-center-badge"><span>FORGESEC</span><strong>HELP CENTER</strong></div>
      <h1>How can we help?</h1>
      <p>Search practical guidance for configuring ForgeSec, running scans, understanding validated findings, managing reports, and resolving account or integration questions.</p>
      <form className="help-center-search" action="/resources/documentation">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
        <input aria-label="Search ForgeSec help" name="q" placeholder="Search the Help Center" type="search" />
        <button type="submit">Search <span aria-hidden="true">→</span></button>
      </form>
      <div className="help-center-popular" aria-label="Popular help topics">
        <small>Popular:</small><button type="button">Getting started</button><button type="button">Configure a scanner</button><button type="button">Understand findings</button><button type="button">Export reports</button>
      </div>
      <div className="help-center-actions">
        <button type="button">Browse Documentation <span aria-hidden="true">→</span></button>
        <button type="button">Contact Support</button>
      </div>
    </div>
  </section>;
}

function HelpCenterCategoriesSection() {
  const categories = [
    { number: "01", title: "Getting Started", copy: "Set up your workspace, add approved targets, understand core concepts, and prepare your first ForgeSec scan.", links: ["Create your workspace", "Add and verify targets", "Run your first scan"] },
    { number: "02", title: "Scanners & Testing", copy: "Configure web, API, OS, network, and hybrid assessments with the right coverage, policies, and guardrails.", links: ["Choose a scanner", "Configure scan policies", "Troubleshoot scan runs"] },
    { number: "03", title: "Findings & Validation", copy: "Review technical evidence, understand severity and exploitability, and separate meaningful exposure from noise.", links: ["Review a finding", "Understand risk context", "Validate remediation"] },
    { number: "04", title: "Reports & Evidence", copy: "Generate audit-ready reports, export security data, and share clear evidence with engineering and leadership.", links: ["Create a report", "Export findings", "Share remediation evidence"] },
    { number: "05", title: "Integrations & API", copy: "Connect ForgeSec with delivery pipelines, ticketing workflows, authentication systems, and security operations tools.", links: ["Integration setup", "API authentication", "Pipeline troubleshooting"] },
    { number: "06", title: "Account & Billing", copy: "Manage your profile, workspace access, team permissions, plan usage, billing details, and account security.", links: ["Manage team access", "Review plan usage", "Update account settings"] }
  ];

  return <section className="help-categories-section" aria-labelledby="help-categories-title">
    <div className="help-categories-inner">
      <header className="help-categories-heading">
        <div><span><i /> Browse Help Topics</span><h2 id="help-categories-title">Find Guidance Across ForgeSec Workflows.</h2></div>
        <p>Start with a category to find practical instructions, troubleshooting steps, and answers organized around the work you need to complete.</p>
      </header>
      <div className="help-categories-grid">
        {categories.map((category) => <article key={category.number}>
          <header><span>{category.number}</span><small>Help Topic</small></header>
          <h3>{category.title}</h3>
          <p>{category.copy}</p>
          <ul>{category.links.map((link) => <li key={link}><button type="button">{link}<span aria-hidden="true">→</span></button></li>)}</ul>
        </article>)}
      </div>
    </div>
  </section>;
}

function WebinarsVideoSection() {
  return <section className="webinars-video-section" aria-labelledby="webinars-video-title">
    <div className="webinars-video-inner">
      <header className="webinars-video-heading">
        <div><span><i /> Featured Session</span><h2 id="webinars-video-title">Watch security validation in practice.</h2></div>
        <p>See how security teams move from broad scanner findings to validated exposure, clear priorities, and evidence-backed remediation.</p>
      </header>
      <div className="webinars-video-layout">
        <figure className="webinars-video-player">
          <video controls playsInline poster="/images/webinars-hero-v5.png" preload="metadata">
            <source src="/images/video.mp4" type="video/mp4" />
            Your browser does not support embedded video.
          </video>
          <figcaption><span>On-demand webinar</span><strong>From Vulnerability Findings to Validated Risk</strong></figcaption>
        </figure>
        <aside className="webinars-video-details">
          <span className="webinars-video-label">Session Overview</span>
          <h3>Turn security findings into decisions your team can defend.</h3>
          <p>Follow a practical workflow for validating real exposure, preserving technical evidence, prioritizing meaningful risk, and confirming remediation.</p>
          <ul>
            <li><b>01</b><span>Separate exploitable weaknesses from scanner noise</span></li>
            <li><b>02</b><span>Connect evidence with asset and business context</span></li>
            <li><b>03</b><span>Retest fixes and prove verified closure</span></li>
          </ul>
          <Link href="/request-demo">Explore the workflow <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
    </div>
  </section>;
}

function WebinarsSessionsSection() {
  const sessions = [
    {
      number: "01",
      category: "Security Validation",
      title: "From vulnerability findings to validated risk",
      copy: "Learn how evidence, exploitability, exposure, and asset context help teams distinguish meaningful security risk from repetitive scanner noise.",
      topics: ["Evidence", "Exploitability", "Risk context"],
      href: "/solutions/vulnerability-validation"
    },
    {
      number: "02",
      category: "Continuous Coverage",
      title: "Maintain Visibility as Your Environment Changes",
      copy: "See how connected web, API, host, network, and hybrid scanning creates one continuously updated view of the systems your organization must protect.",
      topics: ["Discovery", "Attack surface", "Continuous testing"],
      href: "/solutions/continuous-pentesting"
    },
    {
      number: "03",
      category: "Verified Remediation",
      title: "Move From Evidence to Action and Confirm Closure",
      copy: "Build a clear remediation workflow with technical evidence, accountable ownership, practical guidance, targeted retesting, and audit-ready proof.",
      topics: ["Remediation", "Retesting", "Reporting"],
      href: "/products/remediation-guidance"
    }
  ];

  return <section className="webinars-sessions-section" aria-labelledby="webinars-sessions-title">
    <div className="webinars-sessions-inner">
      <header className="webinars-sessions-heading">
        <span><i /> Webinar Library</span>
        <div>
          <h2 id="webinars-sessions-title">Practical Sessions Across the Security Assurance Lifecycle.</h2>
          <p>Explore expert-led guidance for finding exposure, validating what is real, prioritizing what matters, and proving that critical risk has been resolved.</p>
        </div>
      </header>
      <div className="webinars-sessions-grid">
        {sessions.map((session) => <article key={session.number}>
          <header><span>{session.number}</span><small>{session.category}</small></header>
          <h3>{session.title}</h3>
          <p>{session.copy}</p>
          <ul>{session.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          <Link href={session.href}>View session <span aria-hidden="true">→</span></Link>
        </article>)}
      </div>
      <footer className="webinars-sessions-outcome">
        <span>One connected learning path</span>
        <div><strong>Discover</strong><i /><strong>Validate</strong><i /><strong>Prioritize</strong><i /><strong>Remediate</strong><i /><strong>Verify</strong></div>
      </footer>
    </div>
  </section>;
}

function WebinarsLearningTracksSection() {
  const tracks = [
    { image: "/images/webinar-validation-session-v1.png", label: "Validation Masterclass", title: "Know what is real before your team responds", copy: "Use technical evidence, exploitability, and affected-asset context to turn noisy findings into defensible security decisions.", meta: "Evidence · Risk context · Prioritization" },
    { image: "/images/webinar-visibility-session-v1.png", label: "Exposure Workshop", title: "See Security Exposure in One Connected View", copy: "Bring applications, APIs, hosts, networks, and hybrid infrastructure into a shared view that stays current as systems change.", meta: "Discovery · Coverage · Correlation" },
    { image: "/images/webinar-remediation-session-v1.png", label: "Remediation Session", title: "Move Critical Findings Toward Confirmed Closure", copy: "Coordinate ownership, deliver practical guidance, retest completed work, and preserve evidence that each important risk was resolved.", meta: "Action · Retesting · Assurance" }
  ];

  return <section className="webinars-tracks-section" aria-labelledby="webinars-tracks-title">
    <div className="webinars-tracks-inner">
      <header className="webinars-tracks-heading">
        <div><span><i /> Learning Tracks</span><h2 id="webinars-tracks-title">Go deeper with practitioner-led security sessions.</h2></div>
        <p>Choose a focused learning path for the part of your security program you need to strengthen next.</p>
      </header>
      <div className="webinars-tracks-grid">
        {tracks.map((track, index) => <article key={track.label}>
          <figure><Image alt={track.title} fill sizes="(min-width: 1000px) 33vw, (min-width: 620px) 50vw, 100vw" src={track.image} /></figure>
          <div className="webinars-track-body">
            <header><span>0{index + 1}</span><small>{track.label}</small></header>
            <h3>{track.title}</h3>
            <p>{track.copy}</p>
            <footer><small>{track.meta}</small><Link href="/resources/resource-center" aria-label={`Explore ${track.label}`}>→</Link></footer>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}

function WebinarsClosingSection() {
  return <section className="webinars-closing-section" aria-labelledby="webinars-closing-title">
    <div className="webinars-closing-inner">
      <div className="webinars-closing-copy">
        <span>Continue the conversation</span>
        <h2 id="webinars-closing-title">See Security Validation in Action.</h2>
        <p>Connect continuous discovery, evidence-backed validation, prioritized risk, and verified remediation in one security workflow.</p>
      </div>
      <div className="webinars-closing-actions">
        <Link href="/request-demo">Request a Demo <span aria-hidden="true">→</span></Link>
        <Link href="/signup">Start Your First Scan</Link>
      </div>
    </div>
  </section>;
}

function BlogFeaturedSection() {
  return <section className="blog-insights-section" aria-labelledby="blog-insights-title">
    <div className="blog-insights-inner">
      <header className="blog-insights-heading">
        <div><span>Latest Insights</span><h2 id="blog-insights-title">Practical Security Insights for Modern Teams.</h2></div>
        <p>Practical perspectives from the Forge-Sec team on reducing security noise, validating meaningful exposure, and moving from findings to verified fixes.</p>
      </header>

      <div className="blog-insights-grid">
        <article className="blog-featured-story">
          <figure><Image alt="Security engineer reviewing continuous testing and release activity" fill sizes="(min-width: 1050px) 66vw, 100vw" src="/images/blog-continuous-testing-featured-v1.png" /></figure>
          <div className="blog-story-body">
            <div className="blog-story-meta"><span>Continuous Testing</span><time>8 min read</time></div>
            <h3>Move Beyond Point-in-Time Security Testing</h3>
            <p>Modern applications, APIs, and infrastructure change constantly. Learn how continuous validation helps teams find new exposure without slowing delivery.</p>
            <Link href="/solutions/continuous-pentesting">Read the insight <span aria-hidden="true">→</span></Link>
          </div>
        </article>

        <div className="blog-supporting-stories">
          <article>
            <figure><Image alt="Security researcher validating vulnerability evidence" fill sizes="(min-width: 1050px) 32vw, 50vw" src="/images/blog-vulnerability-validation-v1.png" /></figure>
            <div><span>Risk Validation</span><h3>From Scanner Noise to Evidence-Backed Risk</h3><p>Separate exploitable weaknesses from low-value findings before remediation begins.</p><Link href="/solutions/vulnerability-validation">Explore article <b aria-hidden="true">→</b></Link></div>
          </article>
          <article>
            <figure><Image alt="Security and engineering professionals coordinating remediation" fill sizes="(min-width: 1050px) 32vw, 50vw" src="/images/blog-remediation-collaboration-v1.png" /></figure>
            <div><span>Remediation</span><h3>Build a Clearer Path From Finding to Confirmed Remediation</h3><p>Give security and engineering teams shared context, ownership, and proof of closure.</p><Link href="/products/remediation-guidance">Explore article <b aria-hidden="true">→</b></Link></div>
          </article>
        </div>
      </div>
    </div>
  </section>;
}

function BlogTopicsSection() {
  const topics = [
    { number: "01", label: "Security Research", title: "Understand the threats shaping modern attack surfaces", copy: "Evidence-led analysis of emerging exposure patterns, vulnerability behavior, and the techniques defenders need to understand.", href: "/solutions/vulnerability-validation", meta: "Threats · Evidence · Exposure" },
    { number: "02", label: "Product & Engineering", title: "Build Security Into Modern Delivery Workflows", copy: "Practical lessons for integrating continuous testing across applications, APIs, infrastructure, and delivery pipelines.", href: "/solutions/continuous-pentesting", meta: "Testing · APIs · Delivery" },
    { number: "03", label: "Security Strategy", title: "Focus teams on the risks that matter most", copy: "Guidance for improving prioritization, reducing scanner noise, and making defensible security decisions with better context.", href: "/products/ai-risk-prioritization", meta: "Priority · Context · Decisions" },
    { number: "04", label: "Remediation", title: "Move From Validated Findings to Confirmed Remediation", copy: "Methods for coordinating ownership, applying actionable guidance, retesting corrections, and preserving evidence of closure.", href: "/products/remediation-guidance", meta: "Ownership · Fixes · Verification" }
  ];

  return <section className="blog-topics-section" aria-labelledby="blog-topics-title">
    <div className="blog-topics-inner">
      <header className="blog-topics-heading">
        <div><span>Explore by Topic</span><h2 id="blog-topics-title">Ideas organized around the work security teams do every day.</h2></div>
        <p>Browse focused perspectives across research, engineering, security strategy, and remediation—built to turn complex exposure into clear action.</p>
      </header>

      <div className="blog-topics-grid">
        {topics.map((topic) => <article key={topic.number}>
          <header><span>{topic.number}</span><small>{topic.label}</small></header>
          <h3>{topic.title}</h3>
          <p>{topic.copy}</p>
          <footer><small>{topic.meta}</small><Link href={topic.href} aria-label={`Explore ${topic.label}`}>→</Link></footer>
        </article>)}
      </div>
    </div>
  </section>;
}

function BlogPlaybooksSection() {
  const playbooks = [
    { number: "01", category: "Continuous Coverage", title: "Build one testing program across web, API, OS, and hybrid environments", copy: "Create consistent visibility across applications and infrastructure, coordinate recurring assessments, and keep coverage aligned as assets and configurations change.", outcome: "Complete attack-surface visibility", href: "/solutions/hybrid-environments" },
    { number: "02", category: "Evidence & Priority", title: "Validate exploitability before findings enter the remediation queue", copy: "Use technical evidence, affected-asset context, confidence, exposure, and potential impact to distinguish meaningful risk from repetitive scanner noise.", outcome: "Fewer false priorities", href: "/solutions/vulnerability-validation" },
    { number: "03", category: "Remediation & Assurance", title: "Move every critical finding toward a verified, reportable outcome", copy: "Give the right owner clear remediation guidance, preserve evidence throughout the workflow, retest completed fixes, and maintain defensible records of closure.", outcome: "Faster verified remediation", href: "/products/remediation-guidance" }
  ];

  return <section className="blog-playbooks-section" aria-labelledby="blog-playbooks-title">
    <div className="blog-playbooks-inner">
      <header className="blog-playbooks-heading">
        <span>Practical Playbooks</span>
        <div><h2 id="blog-playbooks-title">Turn security insight into a repeatable operating model.</h2><p>Focused guidance for building continuous coverage, validating real exposure, and coordinating remediation with evidence from beginning to end.</p></div>
      </header>

      <div className="blog-playbooks-layout">
        <div className="blog-playbooks-list">
          {playbooks.map((playbook) => <article key={playbook.number}>
            <span>{playbook.number}</span>
            <div><small>{playbook.category}</small><h3>{playbook.title}</h3><p>{playbook.copy}</p><footer><b>{playbook.outcome}</b><Link href={playbook.href}>Read playbook <i aria-hidden="true">→</i></Link></footer></div>
          </article>)}
        </div>

        <aside className="blog-playbooks-feature">
          <figure><Image alt="Security and engineering teams applying remediation guidance" fill sizes="(min-width: 1050px) 34vw, 100vw" src="/images/blog-remediation-collaboration-v1.png" /></figure>
          <div><span>Featured Framework</span><h3>From Discovery to Confirmed Resolution</h3><p>A connected workflow for finding exposure, validating risk, assigning ownership, applying corrections, and confirming closure.</p><Link href="/products/remediation-guidance">Explore the framework <b aria-hidden="true">→</b></Link></div>
        </aside>
      </div>
    </div>
  </section>;
}

function BlogClosingSection() {
  return <section className="blog-closing-section" aria-labelledby="blog-closing-title">
    <div className="blog-closing-inner">
      <div className="blog-closing-copy"><span>Keep Learning</span><h2 id="blog-closing-title">Turn security insight into confident action.</h2><p>Explore practical resources or see how Forge-Sec brings continuous testing, validation, and remediation into one connected workflow.</p></div>
      <div className="blog-closing-actions"><Link href="/resources/resource-center">Explore Resources <span aria-hidden="true">→</span></Link><Link href="/request-demo">Request a Demo</Link></div>
    </div>
  </section>;
}

function DocumentationGettingStarted() {
  const steps = [
    { number: "01", title: "Create your workspace", copy: "Set up your organization, invite the right team members, and define how security work is managed." },
    { number: "02", title: "Connect a target", copy: "Add a website, API, host, or hybrid environment with clear, guided configuration steps." },
    { number: "03", title: "Launch your first scan", copy: "Run controlled testing and review validated findings, evidence, priority, and remediation guidance." }
  ];

  return <section className="docs-start-section" aria-labelledby="docs-start-title">
    <div className="docs-start-inner">
      <figure className="docs-start-visual">
        <Image alt="Security engineer configuring a Forge-Sec scanning workspace" fill sizes="(min-width: 900px) 50vw, 100vw" src="/images/documentation-get-started.png" />
        <figcaption><span>Quick Start</span><strong>Workspace · Target · Scan</strong></figcaption>
      </figure>
      <div className="docs-start-copy">
        <span className="docs-start-kicker">Get Started</span>
        <h2 id="docs-start-title">From Setup to Your First Assessment in Three Clear Steps.</h2>
        <p>Follow a practical onboarding path that helps your team configure Forge-Sec correctly and begin testing without unnecessary complexity.</p>
        <div className="docs-start-steps">
          {steps.map((step) => <article key={step.number}><b>{step.number}</b><div><h3>{step.title}</h3><p>{step.copy}</p></div></article>)}
        </div>
        <div className="docs-start-actions"><Link href="/signup">Start Quick Setup <span aria-hidden="true">→</span></Link><Link href="/resources/help-center">Get Support</Link></div>
      </div>
    </div>
  </section>;
}

function DocumentationTopicsSection() {
  const topics = [
    { number: "01", label: "Scanner Setup", title: "Configure Your Security Testing Workflows", copy: "Set up Web, API, OS, and Hybrid scanners with safe, repeatable configuration guidance." },
    { number: "02", label: "Findings", title: "Review Findings, Evidence, and Risk", copy: "Understand severity, exploitability, asset context, validation evidence, and recommended next steps." },
    { number: "03", label: "Integrations", title: "Connect ForgeSec to Your Security Workflow", copy: "Route findings and remediation context into the tools your security and engineering teams already use." },
    { number: "04", label: "API Reference", title: "Build With ForgeSec APIs", copy: "Use clear endpoint guidance, authentication patterns, request examples, and response references." },
    { number: "05", label: "Administration", title: "Manage teams and access", copy: "Configure workspaces, members, roles, permissions, notifications, and account-level controls." },
    { number: "06", label: "Remediation", title: "Remediate and Retest Findings", copy: "Follow actionable fix guidance, coordinate ownership, and confirm that remediation is complete." }
  ];

  return <section className="docs-topics-section" aria-labelledby="docs-topics-title">
    <div className="docs-topics-inner">
      <header className="docs-topics-heading">
        <span>Browse Documentation</span>
        <div><h2 id="docs-topics-title">Documentation Organized Around Your Workflow.</h2><p>Move directly to the technical guidance that supports your current task.</p></div>
      </header>
      <div className="docs-topics-grid">
        {topics.map((topic) => <article key={topic.number}>
          <div><span>{topic.number}</span><small>{topic.label}</small></div>
          <h3>{topic.title}</h3>
          <p>{topic.copy}</p>
          <Link href="/resources/help-center">Open Guide <span aria-hidden="true">→</span></Link>
        </article>)}
      </div>
    </div>
  </section>;
}

function DocumentationIntegrationsSection() {
  const capabilities = [
    { label: "REST API", copy: "Authenticate securely and automate scans, assets, findings, and remediation workflows." },
    { label: "CI/CD Workflows", copy: "Add security testing to delivery pipelines with clear configuration and response handling." },
    { label: "Security Tooling", copy: "Connect findings to ticketing, collaboration, and security operations systems." }
  ];

  return <section className="docs-integrations-section" aria-labelledby="docs-integrations-title">
    <div className="docs-integrations-inner">
      <div className="docs-integrations-copy">
        <span className="docs-integrations-kicker">APIs & Integrations</span>
        <h2 id="docs-integrations-title">Connect Forge-Sec to the way your team already works.</h2>
        <p>Use practical API references and integration guides to bring continuous security testing into engineering, security, and remediation workflows.</p>
        <div className="docs-integrations-list">
          {capabilities.map((item, index) => <article key={item.label}><b>0{index + 1}</b><div><h3>{item.label}</h3><p>{item.copy}</p></div></article>)}
        </div>
        <div className="docs-integrations-actions"><Link href="/resources/help-center">View API Reference <span aria-hidden="true">→</span></Link><Link href="/request-demo">Discuss an Integration</Link></div>
      </div>
      <figure className="docs-integrations-visual">
        <Image alt="Software and security engineers integrating Forge-Sec APIs into a development workflow" fill sizes="(min-width: 900px) 50vw, 100vw" src="/images/documentation-api-integrations.png" />
        <figcaption><span>Developer Experience</span><strong>API · Pipeline · Security Tools</strong></figcaption>
      </figure>
    </div>
  </section>;
}

function DocumentationClosingSection() {
  return <section className="docs-closing-section" aria-labelledby="docs-closing-title">
    <div className="docs-closing-inner">
      <div className="docs-closing-copy">
        <span>Need More Guidance?</span>
        <h2 id="docs-closing-title">Get Clear Guidance When You Need It.</h2>
        <p>Explore technical guidance or connect with Forge-Sec support when you need a clear next step.</p>
      </div>
      <div className="docs-closing-actions">
        <Link href="/resources/help-center">Visit Help Center <span aria-hidden="true">→</span></Link>
        <Link href="/request-demo">Talk to an Expert</Link>
      </div>
    </div>
  </section>;
}

function ResourceFeaturedSection() {
  const resources = [
    {
      type: "Security Research",
      title: "Understand the threats shaping modern attack surfaces",
      copy: "Evidence-led research that turns emerging security patterns into practical context for your team.",
      image: "/images/resource-research.png",
      alt: "Security analyst reviewing cybersecurity research and threat data",
      href: "https://1drv.ms/b/c/7b8f40e24e768561/IQD96J9seqhuTJATP33UhiGGAYGylBzttP2tLz6YoD8VUBQ"
    },
    {
      type: "Practical Guides",
      title: "Move from security findings to confident remediation",
      copy: "Clear frameworks and actionable guidance for prioritizing exposure and coordinating the right response.",
      image: "/images/resource-guides.png",
      alt: "Cybersecurity professionals collaborating on a remediation guide",
      href: "/resources/documentation"
    },
    {
      type: "Product Insights",
      title: "Build a continuous and connected security program",
      copy: "Explore platform workflows and proven approaches for improving visibility, validation, and decision-making.",
      image: "/images/resource-insights.png",
      alt: "Security professional reviewing risk analytics on a workstation",
      href: "/resources/blog"
    }
  ];

  return <section className="resource-featured-section" aria-labelledby="resource-featured-title">
    <div className="resource-featured-inner">
      <header className="resource-featured-heading">
        <div>
          <span className="resource-featured-kicker">Featured Resources</span>
          <h2 id="resource-featured-title">Insights built for<span>real security decisions.</span></h2>
        </div>
        <p>Stay informed with practical content for understanding exposure, validating risk, and strengthening the way your team responds.</p>
      </header>
      <div className="resource-featured-grid">
        {resources.map((resource, index) => <article className={index === 0 ? "resource-card resource-card-featured" : "resource-card"} key={resource.type}>
          <Link className="resource-card-image" href={resource.href} target={index === 0 ? "_blank" : undefined}>
            <Image alt={resource.alt} fill sizes="(min-width: 900px) 33vw, 100vw" src={resource.image} />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </Link>
          <div className="resource-card-body">
            <small>{resource.type}</small>
            <h3>{resource.title}</h3>
            <p>{resource.copy}</p>
            <Link href={resource.href} target={index === 0 ? "_blank" : undefined}>Explore Resource <span aria-hidden="true">→</span></Link>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}

function ResourceTopicsSection() {
  const topics = [
    { number: "01", title: "Continuous Security Testing", copy: "Guidance for testing applications and infrastructure as quickly as your environment changes.", href: "/solutions/continuous-pentesting" },
    { number: "02", title: "Vulnerability Validation", copy: "Research and methods for separating exploitable weaknesses from noisy scanner findings.", href: "/solutions/vulnerability-validation" },
    { number: "03", title: "Risk-Led Remediation", copy: "Practical approaches for prioritizing fixes, coordinating ownership, and verifying resolution.", href: "/products/remediation-guidance" }
  ];

  return <section className="resource-library-section" aria-labelledby="resource-topics-title">
    <div className="resource-library-inner">
      <header className="resource-library-heading">
        <span>Resource Library</span>
        <div>
          <h2 id="resource-topics-title">Learn. Apply. Turn Insight Into Action.</h2>
        </div>
      </header>
      <div className="resource-library-layout">
        <Link className="resource-library-feature" href="https://1drv.ms/b/c/7b8f40e24e768561/IQD96J9seqhuTJATP33UhiGGAYGylBzttP2tLz6YoD8VUBQ" target="_blank">
          <Image alt="Security analyst reviewing a cybersecurity research report" fill sizes="(min-width: 900px) 54vw, 100vw" src="/images/resource-research.png" />
          <div><small>Featured Report</small><strong>Research that turns complex exposure into clear security action.</strong><span>Read the report →</span></div>
        </Link>
        <div className="resource-library-list">
          {topics.map((topic) => <Link href={topic.href} key={topic.number}>
            <span>{topic.number}</span>
            <div><h3>{topic.title}</h3><p>{topic.copy}</p></div>
            <b aria-hidden="true">→</b>
          </Link>)}
          <Link className="resource-library-docs" href="/resources/documentation">
            <span>Docs</span><div><h3>Technical Documentation</h3><p>Find platform setup, workflows, and implementation guidance.</p></div><b aria-hidden="true">→</b>
          </Link>
        </div>
      </div>
    </div>
  </section>;
}

function ResourceAudienceSection() {
  const audiences = [
    { number: "01", role: "Security Leaders", title: "Turn technical exposure into clear business priorities.", copy: "Use strategic research and risk guidance to communicate impact, focus investment, and strengthen program decisions.", href: "/solutions/security-teams" },
    { number: "02", role: "Security Practitioners", title: "Investigate findings with evidence and context.", copy: "Explore practical testing, validation, and remediation guidance designed for day-to-day security operations.", href: "/solutions/vulnerability-validation" },
    { number: "03", role: "Engineering Teams", title: "Build security into delivery without slowing progress.", copy: "Learn how continuous testing and clear fix guidance help teams resolve meaningful risk earlier.", href: "/solutions/continuous-pentesting" }
  ];

  return <section className="resource-audience-section" aria-labelledby="resource-audience-title">
    <div className="resource-audience-inner">
      <header className="resource-audience-heading">
        <span>Built for Your Team</span>
        <div>
          <h2 id="resource-audience-title">The Right Insight for Better Security Decisions.</h2>
          <p>Find focused guidance for the people responsible for understanding, prioritizing, and resolving exposure.</p>
        </div>
      </header>
      <div className="resource-audience-grid">
        {audiences.map((audience) => <article key={audience.number}>
          <div><span>{audience.number}</span><small>{audience.role}</small></div>
          <h3>{audience.title}</h3>
          <p>{audience.copy}</p>
          <Link href={audience.href}>View Resources <span aria-hidden="true">→</span></Link>
        </article>)}
      </div>
    </div>
  </section>;
}

function ResourceLearningSection() {
  return <section className="resource-learning-section" aria-labelledby="resource-learning-title">
    <div className="resource-learning-inner">
      <div className="resource-learning-copy">
        <span className="resource-learning-kicker">From Insight to Action</span>
        <h2 id="resource-learning-title">Give your team knowledge they can use immediately.</h2>
        <p>Forge-Sec resources connect security research with the practical decisions teams make every day—from identifying meaningful exposure to validating fixes with confidence.</p>
        <div className="resource-learning-points">
          <div><b>01</b><span><strong>Practical by design</strong><small>Clear guidance grounded in real security workflows.</small></span></div>
          <div><b>02</b><span><strong>Built for collaboration</strong><small>Shared context for security, engineering, and leadership.</small></span></div>
          <div><b>03</b><span><strong>Focused on outcomes</strong><small>Knowledge that supports faster, better-informed action.</small></span></div>
        </div>
        <div className="resource-learning-actions">
          <Link href="/resources/documentation">Explore Documentation <span aria-hidden="true">→</span></Link>
          <Link href="/request-demo">Talk to an Expert</Link>
        </div>
      </div>
      <figure className="resource-learning-visual">
        <Image alt="Cybersecurity team learning from a collaborative security workshop" fill sizes="(min-width: 900px) 50vw, 100vw" src="/images/resource-learning-workshop.png" />
        <figcaption><span>Team Enablement</span><strong>Research · Guidance · Shared Action</strong></figcaption>
      </figure>
    </div>
  </section>;
}

function ResourceClosingSection() {
  return <section className="resource-closing-section" aria-labelledby="resource-closing-title">
    <div className="resource-closing-inner">
      <span className="resource-closing-kicker"><i /> Keep Learning. Stay Ready.</span>
      <h2 id="resource-closing-title">Turn security knowledge into<span>confident action.</span></h2>
      <p>Explore Forge-Sec research, practical guidance, and platform insights—or speak with our team about building a stronger continuous security program.</p>
      <div className="resource-closing-actions">
        <Link href="https://1drv.ms/b/c/7b8f40e24e768561/IQD96J9seqhuTJATP33UhiGGAYGylBzttP2tLz6YoD8VUBQ" target="_blank">Read Featured Report <span aria-hidden="true">↗</span></Link>
        <Link href="/request-demo">Talk to Forge-Sec <span aria-hidden="true">→</span></Link>
      </div>
      <div className="resource-closing-proof" aria-label="Forge-Sec resource benefits">
        <span><b>01</b> Evidence-led research</span><i /><span><b>02</b> Practical guidance</span><i /><span><b>03</b> Security expertise</span>
      </div>
    </div>
  </section>;
}

function HybridVisibilitySection() {
  return <section className="hybrid-visibility-section" aria-labelledby="hybrid-visibility-title">
    <div className="hybrid-visibility-inner">
      <header className="hybrid-visibility-heading">
        <span className="hybrid-section-kicker">Connected Visibility</span>
        <h2 id="hybrid-visibility-title">See hybrid risk as<span>one connected system.</span></h2>
      </header>
      <div className="hybrid-visibility-layout">
        <div className="hybrid-visibility-copy">
        <p>Cloud and on-premises environments should not create separate security stories. Forge-Sec connects findings, assets, and exposure paths so teams can understand how risk moves across every layer.</p>
        <div className="hybrid-visibility-points">
          <article><b>01</b><div><h3>Unify Asset Context</h3><p>Connect applications, APIs, workloads, hosts, and infrastructure to the systems they support.</p></div></article>
          <article><b>02</b><div><h3>Trace Exposure Paths</h3><p>Understand how vulnerabilities combine across cloud and on-premises boundaries.</p></div></article>
          <article><b>03</b><div><h3>Prioritize Real Risk</h3><p>Focus remediation on verified weaknesses with meaningful operational impact.</p></div></article>
        </div>
        </div>
        <figure className="hybrid-visibility-visual">
          <Image alt="Security engineer monitoring cloud and on-premises infrastructure from one workspace" fill sizes="(min-width: 900px) 48vw, 92vw" src="/images/hybrid-unified-visibility-v2.png" />
          <figcaption><strong>One security view</strong><span>Cloud · On-Prem · Apps · APIs</span></figcaption>
        </figure>
      </div>
    </div>
  </section>;
}

function HybridCoverageSection() {
  const coverage = [
    { number: "01", label: "Cloud Workloads", title: "Secure dynamic cloud infrastructure", copy: "Continuously assess workloads, services, configurations, and exposed cloud assets as environments evolve." },
    { number: "02", label: "On-Premises", title: "Protect critical internal systems", copy: "Identify vulnerabilities across hosts, servers, operating systems, services, and connected infrastructure." },
    { number: "03", label: "Applications & APIs", title: "Connect application-layer risk", copy: "Bring website and API findings into the same security context as the infrastructure supporting them." },
    { number: "04", label: "Unified Operations", title: "Coordinate remediation across teams", copy: "Give security, cloud, IT, and development teams one prioritized path from exposure to verified resolution." }
  ];

  return <section className="hybrid-coverage-section" aria-labelledby="hybrid-coverage-title">
    <div className="hybrid-coverage-inner">
      <header className="hybrid-coverage-heading">
        <div>
          <span className="hybrid-light-kicker">CONNECTED ENVIRONMENT SECURITY</span>
          <h2 id="hybrid-coverage-title">Security built for the way<span>your environment operates.</span></h2>
        </div>
        <p>Hybrid infrastructure spans multiple technologies, owners, and security boundaries. Forge-Sec brings those layers together without forcing teams into disconnected workflows.</p>
      </header>
      <div className="hybrid-coverage-grid">
        {coverage.map((item) => <article key={item.number}>
          <div className="hybrid-coverage-card-top"><span>{item.number}</span><i /></div>
          <small>{item.label}</small>
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
          <b aria-hidden="true">→</b>
        </article>)}
      </div>
      <div className="hybrid-coverage-summary">
        <span>One platform</span><i /><span>Connected context</span><i /><span>Clear priorities</span><i /><span>Verified remediation</span>
      </div>
    </div>
  </section>;
}

function HybridWorkflowSection() {
  const steps = [
    { number: "01", title: "Discover", copy: "Continuously map cloud assets, applications, APIs, hosts, services, and on-premises infrastructure.", outcome: "Complete asset visibility" },
    { number: "02", title: "Validate", copy: "Confirm which findings represent genuine exposure using evidence, exploitability, and connected asset context.", outcome: "Evidence-backed findings" },
    { number: "03", title: "Prioritize", copy: "Rank verified risks by impact, exposure path, affected systems, and operational importance.", outcome: "Clear remediation order" },
    { number: "04", title: "Remediate", copy: "Deliver actionable guidance, coordinate ownership, and verify that every critical fix is complete.", outcome: "Faster verified fixes" }
  ];

  return <section className="hybrid-workflow-section" aria-labelledby="hybrid-workflow-title">
    <div className="hybrid-workflow-inner">
      <header className="hybrid-workflow-heading">
        <span className="hybrid-light-kicker">How It Works</span>
        <h2 id="hybrid-workflow-title">One Connected Path From <span>Exposure to Resolution.</span></h2>
        <p>Replace fragmented tools and handoffs with a connected security workflow that follows risk across every environment.</p>
      </header>
      <ol className="hybrid-workflow-track">
        {steps.map((step) => <li key={step.number}>
          <div className="hybrid-workflow-number"><small>{step.number}</small><span>{step.title}</span></div>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
          <footer>{step.outcome}</footer>
        </li>)}
      </ol>
      <div className="hybrid-workflow-context">
        <div><small>Works across</small><strong>Public cloud, private cloud, data centers, remote hosts, applications, and APIs</strong></div>
        <div><small>Built for</small><strong>Security, infrastructure, cloud, DevSecOps, and vulnerability management teams</strong></div>
      </div>
    </div>
  </section>;
}

function HybridOutcomesSection() {
  const outcomes = [
    { value: "01", title: "Less fragmented visibility", copy: "Replace isolated cloud, application, and infrastructure findings with one connected view of exposure." },
    { value: "02", title: "Faster risk decisions", copy: "Give analysts the evidence and environment context needed to prioritize meaningful risk with confidence." },
    { value: "03", title: "Clearer team ownership", copy: "Route findings to the right cloud, IT, security, or development owner without losing remediation context." }
  ];

  return <section className="hybrid-outcomes-section" aria-labelledby="hybrid-outcomes-title">
    <div className="hybrid-outcomes-inner">
      <header className="hybrid-outcomes-heading">
        <span className="hybrid-light-kicker">Operational Outcomes</span>
        <div>
          <h2 id="hybrid-outcomes-title">Turn hybrid complexity into<span>clear security action.</span></h2>
          <p>Forge-Sec helps teams move beyond disconnected alerts by connecting technical findings to the environments, systems, and owners that matter.</p>
        </div>
      </header>
      <div className="hybrid-outcomes-grid">
        {outcomes.map((outcome) => <article key={outcome.value}>
          <span>{outcome.value}</span>
          <div><h3>{outcome.title}</h3><p>{outcome.copy}</p></div>
        </article>)}
      </div>
      <div className="hybrid-outcomes-banner">
        <div><small>Built for changing environments</small><strong>Maintain continuous security context as cloud workloads, applications, hosts, and infrastructure evolve.</strong></div>
        <Link href="/signup">Start Scan Now <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </section>;
}

function HybridClosingSection() {
  return <section className="hybrid-closing-section" aria-labelledby="hybrid-closing-title">
    <div className="hybrid-closing-inner">
      <span className="hybrid-closing-kicker"><i /> UNIFIED HYBRID SECURITY</span>
      <h2 id="hybrid-closing-title">Bring Hybrid Security Risk<span>Into One Clear View.</span></h2>
      <p>Connect cloud, on-premises, application, API, host, and infrastructure security—then focus your teams on the verified risks that matter most.</p>
      <div className="hybrid-closing-actions">
        <Link href="/request-demo">Request a Demo <span aria-hidden="true">→</span></Link>
        <Link href="/signup">Start Scan Now <span aria-hidden="true">→</span></Link>
      </div>
      <div className="hybrid-closing-proof" aria-label="Forge-Sec hybrid security advantages">
        <span><b>01</b> Unified visibility</span>
        <i />
        <span><b>02</b> Evidence-backed risk</span>
        <i />
        <span><b>03</b> Guided remediation</span>
      </div>
    </div>
  </section>;
}

export default async function WorkInProgressPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageName = pageNames[slug] ?? "This Page";
  const pageClassName = [
    "wip-page",
    slug === "hybrid-scanner" ? "hybrid-scanner-page" : "",
    slug === "resource-center" ? "resource-center-page" : "",
    companyPageSlugs.has(slug) ? "company-page" : "",
    resourcePageSlugs.has(slug) ? "resources-page" : ""
  ].filter(Boolean).join(" ");

  return <main className={pageClassName}>
    <Navbar />
    {slug === "about" ? <AboutHero /> : slug === "careers" ? <CareersHero /> : slug === "trust" ? <TrustAuroraHero /> : slug === "customers" ? <CustomersHero /> : slug === "contact" ? <ContactPageContent /> : slug === "hybrid-scanner" ? <HybridScannerHero /> : slug === "hybrid-environments" ? <HybridEnvironmentsHero /> : slug === "resource-center" ? <ResourceCenterHero /> : slug === "insights" ? <InsightsHero /> : slug === "documentation" ? <DocumentationHero /> : slug === "blog" ? <BlogHero /> : slug === "webinars" ? <WebinarsHero /> : slug === "help-center" ? <HelpCenterContent /> : <section className="wip-hero">
      <div className="wip-orbit" aria-hidden="true"><i /><i /><i /><span>FS</span></div>
      <span className="wip-label">FORGE-SEC / IN DEVELOPMENT</span>
      <h1>{pageName}</h1>
      <h2>{slug === "pricing" ? "Coming Soon" : "Work in progress."}</h2>
      <p>We are building this experience now. Please check back soon for the completed page.</p>
      <div className="wip-actions"><Link href="/">Return to Home <span>→</span></Link><Link href="/products/ai-risk-prioritization">Explore AI Risk Prioritization</Link></div>
    </section>}
    {slug === "hybrid-scanner" && <HybridScannerLayersSection />}
    {slug === "hybrid-scanner" && <HybridScannerWorkflowSection />}
    {slug === "hybrid-scanner" && <HybridScannerReportingSection />}
    {slug === "hybrid-scanner" && <HybridScannerFinalSection />}
    {slug === "webinars" && <WebinarsVideoSection />}
    {slug === "webinars" && <WebinarsSessionsSection />}
    {slug === "webinars" && <WebinarsLearningTracksSection />}
    {slug === "webinars" && <WebinarsClosingSection />}
    {slug === "about" && <AboutFactsSection />}
    {slug === "about" && <AboutApproachSection />}
    {slug === "about" && <AboutClosingSection />}
    {slug === "careers" && <CareersValuesSection />}
    {slug === "careers" && <CareersAreasSection />}
    {slug === "careers" && <CareersOpportunities />}
    {slug === "trust" && <TrustStickyPrinciples />}
    {slug === "trust" && <TrustEvidenceSection />}
    {slug === "trust" && <TrustClosingSection />}
    {slug === "customers" && <CustomersOutcomesSection />}
    {slug === "customers" && <CustomersWorkflowSection />}
    {slug === "customers" && <CustomersUseCasesSection />}
    {slug === "customers" && <CustomersClosingSection />}
    {slug === "insights" && <InsightsFeaturedSection />}
    {slug === "insights" && <InsightsPerspectivesSection />}
    {slug === "insights" && <InsightsFrameworkSection />}
    {slug === "hybrid-environments" && <HybridVisibilitySection />}
    {slug === "hybrid-environments" && <HybridCoverageSection />}
    {slug === "hybrid-environments" && <HybridWorkflowSection />}
    {slug === "hybrid-environments" && <HybridOutcomesSection />}
    {slug === "hybrid-environments" && <HybridClosingSection />}
    {slug === "resource-center" && <ResourceFeaturedSection />}
    {slug === "resource-center" && <ResourceTopicsSection />}
    {slug === "resource-center" && <ResourceAudienceSection />}
    {slug === "resource-center" && <ResourceLearningSection />}
    {slug === "resource-center" && <ResourceClosingSection />}
    {slug === "documentation" && <DocumentationGettingStarted />}
    {slug === "documentation" && <DocumentationTopicsSection />}
    {slug === "documentation" && <DocumentationIntegrationsSection />}
    {slug === "documentation" && <DocumentationClosingSection />}
    {slug === "blog" && <BlogFeaturedSection />}
    {slug === "blog" && <BlogTopicsSection />}
    {slug === "blog" && <BlogPlaybooksSection />}
    {slug === "blog" && <BlogClosingSection />}
    {slug !== "about" && slug !== "careers" && slug !== "trust" && slug !== "customers" && slug !== "contact" && slug !== "hybrid-scanner" && slug !== "hybrid-environments" && slug !== "resource-center" && slug !== "insights" && slug !== "documentation" && slug !== "blog" && slug !== "webinars" && slug !== "help-center" && <div className="wip-marquee" aria-label="Development status"><div><span>PAGE UNDER DEVELOPMENT</span><i /> <span>NEW FORGE-SEC EXPERIENCE IN PROGRESS</span><i /> <span>SECURE BY DESIGN</span><i /> <span>PAGE UNDER DEVELOPMENT</span><i /> <span>NEW FORGE-SEC EXPERIENCE IN PROGRESS</span><i /> <span>SECURE BY DESIGN</span><i /></div></div>}
  </main>;
}
