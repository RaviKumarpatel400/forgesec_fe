import Image from "next/image";
import Navbar from "../../../components/Navbar";

const findings = [
  ["Critical", "Remote administration exposed", "TCP 3389"],
  ["High", "Outdated TLS configuration", "TCP 443"],
  ["High", "Database service reachable", "TCP 5432"],
] as const;

const capabilities = [
  ["01", "Network Discovery and Service Intelligence", "Discover reachable hosts, open ports, running services, versions, and related vulnerabilities across approved ranges.", "Discovery · Fingerprinting · CVE context"],
  ["02", "Current Detection Intelligence", "Keep detection logic aligned with newly disclosed weaknesses and changes in the services your environment exposes.", "Current detection intelligence"],
  ["03", "Evidence and Context for Network Findings", "Give teams the host, port, service fingerprint, severity context, and remediation direction needed to move quickly.", "Proof-backed remediation"],
] as const;

export default function NetworkScannerPage() {
  return (
    <main className="nettool-page">
      <Navbar />

      <section className="nettool-hero" aria-labelledby="nettool-title">
        <div className="nettool-hero-copy">
          <span className="nettool-eyebrow"><i /> ForgeSec Network Scanner</span>
          <h1 id="nettool-title">Discover Network<br />Exposure.<br /><span>Understand What Matters.</span></h1>
          <p>Continuously discover and assess hosts, open ports, exposed services, and vulnerabilities across approved networks—so your team can reduce risk before attackers find a path.</p>
          <div className="nettool-actions">
            <a href="/signup">Start Network Scan</a>
            <a href="#exposure-overview">See How It Works</a>
          </div>
          <div className="nettool-proof"><span>Continuous visibility</span><i /><span>Evidence-backed findings</span><i /><span>Verified remediation</span></div>
        </div>

        <figure className="nettool-hero-visual">
          <Image src="/images/network-scanner-hero-v3.png" alt="Security analyst using ForgeSec to map hosts, services, and network exposure" fill priority sizes="(min-width: 900px) 58vw, 100vw" />
        </figure>
      </section>

      <nav className="nettool-jump" aria-label="Network scanner page sections">
        <a href="#exposure-overview">Exposure overview</a><a href="#capabilities">Capabilities</a><a href="#sample-report">Sample report</a><a href="/resources/documentation">Documentation</a>
      </nav>

      <section className="nettool-detections" id="exposure-overview" aria-labelledby="detection-title">
        <header className="nettool-detections-heading">
          <div><span className="nettool-eyebrow"><i /> Exposure overview</span><h2 id="detection-title">Know what is reachable<br />and what matters first.</h2></div>
          <p>ForgeSec turns network discovery into a clear view of exposed assets, services, and prioritized security findings, so teams can move from detection to remediation with the right context.</p>
        </header>
        <div className="nettool-detections-panel">
          <aside>
            <span>Current scan</span>
            <strong>Exposure mapped</strong>
            <p>Approved external range</p>
            <dl><div><dt>24</dt><dd>Active assets</dd></div><div><dt>86</dt><dd>Open services</dd></div><div><dt>09</dt><dd>Priority findings</dd></div></dl>
          </aside>
          <div className="nettool-findings-table">
            <header><span>Priority findings</span><small>Service</small><small>Status</small></header>
            {findings.map(([severity, title, port]) => <article key={title}><span className={`nettool-severity nettool-severity-${severity.toLowerCase()}`}>{severity}</span><strong>{title}</strong><small>{port}</small><b>Ready to review</b></article>)}
          </div>
        </div>
      </section>

      <section className="nettool-capabilities" id="capabilities" aria-labelledby="capabilities-title">
        <header className="nettool-capabilities-head">
          <div><span className="nettool-eyebrow"><i /> Purpose-built visibility</span><h2 id="capabilities-title">Connect Network Exposure to Risk and Remediation.</h2></div>
          <p>Move beyond a flat port list. ForgeSec connects discovery, detection, evidence, and remediation in one focused workflow.</p>
          <ul><li>External and internal ranges</li><li>TCP service intelligence</li><li>Asset-level risk context</li></ul>
        </header>
        <div className="nettool-capability-grid">{capabilities.map(([number, title, copy, meta], index) => <article className={index === 0 ? "is-featured" : undefined} key={number}><header><span>{number}</span><small>{meta}</small></header><div><h3>{title}</h3><p>{copy}</p></div><footer><b>ForgeSec network intelligence</b><i /></footer></article>)}</div>
      </section>

      <section className="nettool-report" id="sample-report" aria-labelledby="report-title">
        <div className="nettool-report-copy">
          <span className="nettool-eyebrow"><i /> Actionable reporting</span>
          <h2 id="report-title">Turn Network Findings Into Actionable Remediation.</h2>
          <p>Give security, IT, and infrastructure teams one organized view of network exposure, supporting evidence, affected assets, and remediation progress.</p>
          <div className="nettool-report-benefits"><article><span>01</span><div><strong>Prioritized for action</strong><small>Focus attention on reachable critical and high-risk services first.</small></div></article><article><span>02</span><div><strong>Evidence included</strong><small>Keep host, port, protocol, and service context attached to every finding.</small></div></article><article><span>03</span><div><strong>Progress made visible</strong><small>Track ownership, remediation status, and verification in one report.</small></div></article></div>
          <a href="/signup">Explore ForgeSec reports</a>
        </div>
        <figure className="nettool-report-visual">
          <Image src="/images/network-actionable-report-v1.png" alt="ForgeSec network vulnerability report showing severity, affected assets, evidence, and remediation progress" width={1536} height={1024} sizes="(min-width: 900px) 58vw, 100vw" />
          <figcaption><span><i /> Evidence connected</span><strong>Ready for remediation</strong></figcaption>
        </figure>
      </section>

      <section className="nettool-final" aria-labelledby="nettool-final-title">
        <div>
          <span>Network exposure changes continuously</span>
          <h2 id="nettool-final-title">Know what is reachable. Fix what matters.</h2>
          <p>Start with an approved target and turn network visibility into prioritized remediation.</p>
        </div>
        <div className="nettool-actions"><a href="/signup">Start Network Scan</a><a href="/request-demo">Talk to Our Team</a></div>
      </section>
    </main>
  );
}
