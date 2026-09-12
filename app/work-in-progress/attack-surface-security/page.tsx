import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";

export const metadata: Metadata = {
  title: "Attack Surface Security | Forge-Sec",
  description: "Continuously discover, test, validate, and prioritize exposure across your external attack surface with Forge-Sec."
};

const coverage = [
  { number: "01", title: "Discover Unknown Assets", copy: "Find forgotten subdomains, untracked applications, undocumented API endpoints, exposed hosts, and services missing from your inventory." },
  { number: "02", title: "Map External Exposure", copy: "See which assets and services are reachable from the internet and could become potential attacker entry points." },
  { number: "03", title: "Identify Technologies & Services", copy: "Detect web technologies, software versions, network services, operating systems, protocols, and connected components." },
  { number: "04", title: "Monitor Surface Changes", copy: "Track newly discovered assets, opened ports, changed services, modified technologies, and exposure drift between assessments." }
];

const workflow = [
  "Discover Assets",
  "Map External Exposure",
  "Identify Technologies and Services",
  "Validate Security Weaknesses",
  "Connect Related Attack Paths",
  "Prioritize Real-World Risk",
  "Remediate and Retest",
  "Monitor for New Exposure"
];

const validationCapabilities = [
  { number: "01", title: "Validate Vulnerabilities", copy: "Confirm weaknesses through controlled checks, response analysis, service detection, payload results, and technical evidence." },
  { number: "02", title: "Understand Exposure Context", copy: "See whether an affected application, endpoint, port, or service is public, restricted, authenticated, or protected." },
  { number: "03", title: "Connect Related Weaknesses", copy: "Identify how exposed services, vulnerable applications, insecure APIs, and host weaknesses combine into attack paths." },
  { number: "04", title: "Prioritize by Actual Risk", copy: "Rank findings using exploitability, asset importance, confidence, potential impact, and exposure—not severity alone." }
];

const intelligenceCapabilities = [
  { number: "01", title: "Asset Relationship Mapping", copy: "Visualize how domains, APIs, servers, services, and technologies connect across your environment." },
  { number: "02", title: "Attack-Path Discovery", copy: "Find combinations of exposed services, weak controls, and validated vulnerabilities that lead toward critical systems." },
  { number: "03", title: "Ownership & Business Context", copy: "Connect assets with responsible teams, business functions, exposure levels, and operational importance." },
  { number: "04", title: "Unified Investigation", copy: "Review related assets, evidence, vulnerabilities, and remediation activity from one connected security view." }
];

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default function AttackSurfaceSecurityPage() {
  return (
    <main className="site-shell attack-surface-page">
      <Navbar />

      <section className="attack-hero">
        <div className="attack-hero-copy">
          <span className="attack-kicker"><i /> Attack Surface Security</span>
          <h1>Discover Exposure. <em>Validate What Matters.</em></h1>
          <p>Your attack surface spans websites, APIs, servers, IP addresses, ports, services, and connected technologies. Forge-Sec brings them into one continuously updated, evidence-backed security view.</p>
          <div className="attack-actions">
            <Link href="/request-demo">Assess My Attack Surface <Arrow /></Link>
            <Link href="#coverage">See How It Works</Link>
          </div>
        </div>

        <div className="attack-hero-visual">
          <Image alt="Forge-Sec attack surface security operations environment" fill priority sizes="(min-width: 900px) 50vw, 100vw" src="/images/scanner-hybrid-realistic.png" />
          <div className="attack-status-card attack-status-one"><small>EXTERNAL ASSETS</small><strong>1,284</strong><span>Continuously monitored</span></div>
          <div className="attack-status-card attack-status-two"><small>VALIDATED RISK</small><strong>24</strong><span>Requires attention</span></div>
        </div>
      </section>

      <section className="attack-overview" id="coverage">
        <header className="attack-section-head">
          <div>
            <div className="attack-section-labels"><span>01 / Continuous Exposure Discovery</span><span>Know What Attackers Can See</span></div>
            <h2>Find What Was Deployed, Forgotten, or Left Exposed</h2>
          </div>
          <p>Your environment changes with every application, API, server, and public service, making static inventories quickly outdated. Forge-Sec continuously connects these assets into one current attack-surface inventory.</p>
        </header>
        <div className="attack-coverage-grid">
          {coverage.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p><i /></article>)}
        </div>
      </section>

      <section className="attack-validation">
        <div className="attack-validation-intro">
          <div className="attack-validation-copy">
            <div className="attack-section-labels"><span>02 / Exposure Validation</span><span>Discovery Is Only the Beginning</span></div>
            <h2>Separate Real Security Risk From Surface-Level Noise</h2>
            <p>An exposed asset is not automatically an urgent vulnerability. Forge-Sec tests authorized assets and correlates Web, API, and OS scanner signals with reachability, exploitability, technical evidence, and business importance.</p>
          </div>

          <aside className="attack-risk-equation" aria-label="Example risk context">
            <span>Example Risk Context</span>
            <div><strong>Publicly Exposed Service</strong><b>+</b></div>
            <div><strong>Outdated Software Version</strong><b>+</b></div>
            <div><strong>Known Exploitable CVE</strong><b>+</b></div>
            <div><strong>Business-Critical Host</strong><b>=</b></div>
            <footer><small>IMMEDIATE</small><strong>Remediation Priority</strong></footer>
          </aside>
        </div>

        <div className="attack-validation-grid">
          {validationCapabilities.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="attack-workflow">
        <div className="attack-workflow-intro">
          <div className="attack-section-labels"><span>03 / From Visibility to Risk Reduction</span></div>
          <h2>Discover. Validate. Prioritize. <em>Remediate.</em></h2>
          <p>Forge-Sec keeps every asset, exposure, vulnerability, and remediation action connected. Security teams gain complete visibility while engineering teams receive the evidence and guidance needed to resolve real risk.</p>
        </div>

        <div className="attack-process-panel">
          <header><span>A Continuous Attack-Surface Security Process</span><small>Continuous monitoring</small></header>
          <div className="attack-process-grid">
            {workflow.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                {index < workflow.length - 1 && <i aria-hidden="true">→</i>}
              </article>
            ))}
          </div>
        </div>

        <div className="attack-workflow-outcomes">
          <article>
            <span>Turn Exposure Into Action</span>
            <h3>One View From Finding to Confirmed Remediation.</h3>
            <p>Maintain asset visibility, validate vulnerabilities, assign ownership, track remediation, and confirm resolved weaknesses do not return.</p>
          </article>
          <article>
            <span>Reduce What Matters First</span>
            <h3>Know what is exposed. Prove what is risky.</h3>
            <p>Build a continuously updated attack-surface view and help every team focus on the exposures most likely to affect your organization.</p>
          </article>
        </div>
      </section>

      <section className="attack-intelligence">
        <div className="attack-intelligence-intro">
          <div className="attack-intelligence-copy">
            <div className="attack-section-labels"><span>04 / Connected Attack Surface Intelligence</span><span>Understand How Every Asset Connects</span></div>
            <h2>See Your Attack Surface as One <em>Connected System.</em></h2>
            <p>Applications, APIs, domains, hosts, ports, certificates, and cloud services do not exist in isolation. Forge-Sec connects related assets, technologies, vulnerabilities, and dependencies so teams can see how an exposed entry point could lead toward sensitive systems.</p>
          </div>

          <aside className="attack-exposure-path" aria-label="Example exposure path">
            <header><span>Example Exposure Path</span><small>Critical route detected</small></header>
            <div className="attack-path-flow">
              {[
                "Forgotten Subdomain",
                "Exposed Web Application",
                "Unprotected API Endpoint",
                "Sensitive Data Access",
                "Business-Critical Risk"
              ].map((step, index) => (
                <div key={step} className={index === 4 ? "is-critical" : ""}>
                  <i>{String(index + 1).padStart(2, "0")}</i><strong>{step}</strong>
                  {index < 4 && <span aria-hidden="true">↓</span>}
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="attack-intelligence-grid">
          {intelligenceCapabilities.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="attack-final">
        <div className="attack-final-copy">
          <span><i /> Ready to Reduce Your External Risk?</span>
          <h2>Know What Is Exposed. Prove What Is Risky. <em>Fix What Matters First.</em></h2>
          <p>Build a continuously updated view of your attack surface and give every team the evidence, ownership, and remediation context needed to reduce meaningful exposure.</p>
        </div>
        <div className="attack-final-actions">
          <Link href="/request-demo">Assess My Attack Surface <Arrow /></Link>
          <Link href="/signup">Start With Forge-Sec</Link>
        </div>
        <div className="attack-final-proof" aria-label="Platform capabilities">
          <span>Continuous discovery</span><i />
          <span>Evidence-backed validation</span><i />
          <span>Risk-based remediation</span>
        </div>
      </section>

    </main>
  );
}
