import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";

export const metadata: Metadata = {
  title: "OS Vulnerability Scanner | Forge-Sec",
  description: "Discover exposed hosts, identify vulnerable services and software, correlate CVEs, and prioritize operating-system risk with Forge-Sec."
};

const hostVisibility = [
  { number: "01", label: "DISCOVER", title: "Detect Active Hosts", copy: "Determine whether each authorized target is reachable and responding before deeper security checks begin. Forge-Sec establishes a reliable inventory of active servers and endpoints across the approved scope.", prompt: "Which systems are currently reachable?" },
  { number: "02", label: "MAP", title: "Find Open Ports", copy: "Identify exposed TCP and UDP ports that could provide attackers with an entry point. See which network services are externally accessible and where unnecessary exposure should be reduced.", prompt: "Where is the network exposed?" },
  { number: "03", label: "IDENTIFY", title: "Profile Services and Systems", copy: "Discover SSH, HTTP, FTP, database, mail, and remote-management services with their detected versions. Analyze response patterns and fingerprints to identify the probable operating system and platform configuration.", prompt: "What is running on every host?" },
  { number: "04", label: "INVENTORY", title: "Map Software Exposure", copy: "Build one structured inventory of exposed applications, packages, services, technologies, operating-system details, and security controls associated with every scanned host.", prompt: "What needs security attention first?" }
];

const assessmentCapabilities = [
  { number: "01", title: "Remote Security Checks", copy: "Assess ports, protocols, exposed services, detected versions, and network-accessible weaknesses without logging into the host." },
  { number: "02", title: "Authenticated Host Checks", copy: "Use approved credentials or SSH keys to inspect installed packages, patch status, local configuration, and hidden weaknesses." },
  { number: "03", title: "CVE and Patch Intelligence", copy: "Correlate affected software and missing updates with known CVEs, vendor fixes, severity, and available remediation." },
  { number: "04", title: "Configuration and Lifecycle Risk", copy: "Find weak protocols, exposed administration, unsafe settings, unnecessary services, and unsupported technology, then prioritize by impact." }
];

const reportEvidence = [
  "Affected host, port, and protocol",
  "Detected service and software version",
  "CVE, CVSS score, and technical evidence",
  "Security and business impact",
  "Patch or configuration guidance",
  "Validation and reproduction details"
];

const reportExports = ["Printable PDF", "CSV export", "Canonical JSON", "Executive summary"];

const continuousSecurity = [
  { number: "01", title: "Scheduled Scanning", copy: "Run approved assessments automatically across defined hosts and maintenance windows." },
  { number: "02", title: "Exposure Change Detection", copy: "Identify new hosts, open ports, changed services, and software drift as they appear." },
  { number: "03", title: "Risk Re-Prioritization", copy: "Continuously rank findings using severity, exposure, asset importance, and fix status." },
  { number: "04", title: "Remediation Verification", copy: "Retest resolved findings and preserve clear evidence of closure for every asset." }
];

const scannerProcess = [
  { number: "01", title: "Configure the Target", copy: "Add an authorized IP address or hostname, select Light, Full, or Authenticated scanning, and choose an immediate or scheduled start time." },
  { number: "02", title: "Verify Availability", copy: "Confirm that the target is reachable and responding, then establish a reliable baseline before deeper assessment begins." },
  { number: "03", title: "Discover Exposure", copy: "Map open ports, network protocols, running services, response banners, and detected software versions across the approved host." },
  { number: "04", title: "Detect the OS", copy: "Analyze network fingerprints and service responses to identify the likely operating system, platform, and host configuration." },
  { number: "05", title: "Perform Security Checks", copy: "Run controlled remote checks or approved authenticated checks for vulnerable packages, missing patches, exposed services, and configuration weaknesses." },
  { number: "06", title: "Correlate Vulnerabilities", copy: "Connect detected services, packages, versions, and configurations to known CVEs, severity data, and current security intelligence." },
  { number: "07", title: "Prioritize Findings", copy: "Organize validated issues by severity, external exposure, exploitability, operational impact, and the remediation effort required." },
  { number: "08", title: "Remediate & Retest", copy: "Rerun the assessment after patching or reconfiguration to verify each fix and preserve clear evidence of closure." }
];

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.5 12.5 3.4 3.4 7.7-8" /></svg>;
}

export default function OsScannerPage() {
  return (
    <main className="site-shell osscan-page">
      <Navbar />

      <section className="osscan-hero">
        <div className="osscan-orbit" aria-hidden="true"><i /><i /><i /></div>
        <div className="osscan-hero-inner">
          <div className="osscan-hero-copy">
            <span className="osscan-kicker"><i /> Infrastructure Vulnerability Intelligence</span>
            <h1>Discover OS Vulnerabilities<br /><em>Before They Become Attack Paths</em></h1>
            <p>Discover exposed infrastructure, identify vulnerable software and services, and give IT and security teams the context they need to reduce operating-system risk.</p>
            <div className="osscan-actions">
              <Link className="webscan-primary" href="/signup">
                <span>Start an OS scan</span>
                <span className="webscan-click-cursor" aria-hidden="true">
                  <svg viewBox="0 0 20 20"><path d="M4 2.5 15.5 11l-5 .8 2.7 4.4-2.2 1.3-2.6-4.4-3.2 4.1L4 2.5Z" /></svg>
                </span>
              </Link>
              <a className="webscan-secondary" href="#os-host-visibility"><span>Explore capabilities</span></a>
            </div>
            <div className="osscan-hero-trust"><span><CheckIcon /> Safe, controlled checks</span><span><CheckIcon /> CVE intelligence</span><span><CheckIcon /> Clear fix guidance</span></div>
          </div>

        </div>
      </section>

      <nav className="osscan-journey" aria-label="OS Scanner workflow overview">
        <div>
          <a href="#os-host-visibility"><span>01</span><small>DISCOVER</small><strong>Map every asset</strong></a>
          <a href="#os-assessment"><span>02</span><small>ASSESS</small><strong>Validate host risk</strong></a>
          <a href="#os-reporting"><span>03</span><small>REPORT</small><strong>Guide remediation</strong></a>
        </div>
      </nav>

      <section className="osscan-hosts" id="os-host-visibility">
        <div className="osscan-hosts-inner">
          <header className="osscan-hosts-intro">
            <span className="osscan-kicker"><i /> Complete Host Security Visibility</span>
            <h2>See What Every Server and Endpoint Is Exposing</h2>
            <div className="osscan-hosts-status"><span><i /> Authorized targets only</span><span><i /> Centralized exposure view</span></div>
          </header>

          <div className="osscan-hosts-grid">
            {hostVisibility.map((item) => (
              <article key={item.number}>
                <span className="osscan-hosts-step">STEP {item.number}</span>
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <span className="osscan-hosts-prompt">{item.prompt}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="osscan-assessment" id="os-assessment">
        <div className="osscan-assessment-inner">
          <svg className="osscan-section-rails" viewBox="0 0 1366 520" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="osscanWorkflowConnector" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#6e4512" />
                <stop offset="48%" stopColor="#d49333" />
                <stop offset="100%" stopColor="#6e4512" />
              </linearGradient>
            </defs>
            <g className="osscan-rail-base">
              <path d="M-50 56H106C154 56 168 128 250 184C294 215 330 210 392 210H626" />
              <path d="M-50 512H106C154 512 168 440 250 384C294 353 330 358 392 358H670" />
              <path d="M1416 56H1260C1212 56 1198 128 1116 184C1072 215 1036 210 974 210H740" />
              <path d="M1416 512H1260C1212 512 1198 440 1116 384C1072 353 1036 358 974 358H696" />
            </g>
            <g className="osscan-rail-motion">
              <path d="M-50 56H106C154 56 168 128 250 184C294 215 330 210 392 210H626" />
              <path d="M-50 512H106C154 512 168 440 250 384C294 353 330 358 392 358H670" />
              <path d="M1416 56H1260C1212 56 1198 128 1116 184C1072 215 1036 210 974 210H740" />
              <path d="M1416 512H1260C1212 512 1198 440 1116 384C1072 353 1036 358 974 358H696" />
            </g>
          </svg>
          <header className="osscan-engine-head">
            <h2>Detect, Assess, and Prioritize Host Risk</h2>
            <p>Forge-Sec connects authorized hosts to a controlled OpenVAS-based assessment workflow, helping teams detect operating-system and service vulnerabilities with clear evidence.</p>
            <a className="osscan-engine-link" href="#os-reporting">Explore reporting evidence -&gt;</a>
          </header>

          <div className="osscan-engine-flow" aria-label="Forge-Sec host assessment workflow">
            <div className="osscan-engine-tools is-left" aria-hidden="true">
              <span>NET</span><span>SSH</span><span>TCP</span><span>OS</span><span>PKG</span>
            </div>
            <div className="osscan-engine-core">
              <span className="osscan-engine-brand" aria-hidden="true">
                <Image src="/images/logo1.png" alt="" width={160} height={160} style={{ height: "auto" }} />
              </span>
              <span className="osscan-engine-title">OS Scanner</span>
            </div>
            <div className="osscan-engine-tools is-right" aria-hidden="true">
              <span>CVE</span><span>CVSS</span><span>EOL</span><span>FIX</span><span>RPT</span>
            </div>
          </div>

          <div className="osscan-engine-capabilities">
            {assessmentCapabilities.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}
          </div>

          <p className="osscan-engine-proof">Every validated finding includes the affected host, port, protocol, service, detected version, severity, technical evidence, potential impact, and recommended remediation.</p>
        </div>
      </section>

      <section className="osscan-reporting" id="os-reporting">
        <div className="osscan-reporting-inner">
          <div className="osscan-report-content">
            <header className="osscan-reporting-head">
              <span className="osscan-section-number">04 / REPORT</span>
              <span className="osscan-kicker"><i /> Actionable Vulnerability Reports</span>
              <h2>Evidence-backed reporting built for remediation.</h2>
              <p>Turn raw OS scan results into clear findings with severity, affected assets, technical evidence, and practical remediation guidance.</p>
            </header>

            <div className="osscan-report-buttons">
              <Link href="/signup">View Sample OS Report <span>-&gt;</span></Link>
              <a href="#os-assessment">Explore Reporting</a>
            </div>

            <div className="osscan-report-points">
              {reportEvidence.slice(0, 4).map((item, index) => <article key={item}><small>0{index + 1}</small><strong>{item}</strong></article>)}
            </div>

            <div className="osscan-report-exports"><small>AVAILABLE EXPORTS</small>{reportExports.map(item => <span key={item}>{item}</span>)}</div>
          </div>

          <div className="osscan-report-visual">
            <Image className="osscan-report-artwork-compact" src="/images/os-vulnerability-scanner-report-v2.png" alt="Forge-Sec OS vulnerability scanner report showing risk ratings, host evidence, remediation guidance, and validation status" width={1024} height={1536} sizes="(max-width: 900px) 82vw, 370px" />
          </div>
        </div>
      </section>

      <section className="osscan-continuous" id="os-continuous">
        <div className="osscan-continuous-inner">
          <header className="osscan-continuous-head">
            <div>
              <span className="osscan-section-number">05 / MONITOR</span>
              <span className="osscan-kicker"><i /> Continuous OS Security</span>
              <h2>Keep your infrastructure risk picture current.</h2>
            </div>
            <p>Systems change every day. Forge-Sec continuously tracks exposure, validates remediation, and helps teams respond before small changes become security gaps.</p>
          </header>

          <div className="osscan-continuous-grid">
            <div className="osscan-continuous-status">
              <div className="osscan-continuous-score"><div><small>CURRENT SECURITY POSTURE</small><strong>Protected &amp; monitored</strong><span>Last assessed today at 04:32 UTC</span></div><b>92<small>/100</small></b></div>
              <div className="osscan-continuous-track" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
              <div className="osscan-continuous-metrics"><span><small>HOSTS</small><strong>248</strong></span><span><small>FIXED</small><strong>37</strong></span><span><small>NEW RISKS</small><strong>04</strong></span></div>
              <div className="osscan-continuous-next"><span>NEXT CONTROLLED SCAN</span><strong>Today, 22:00</strong></div>
            </div>

            <div className="osscan-continuous-list">
              {continuousSecurity.map(item => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}
            </div>
          </div>

          <div className="osscan-continuous-foot"><div><small>CONTINUOUS ASSURANCE</small><strong>Know what changed. Verify what was fixed.</strong></div><Link href="/signup">Start continuous monitoring <span>-&gt;</span></Link></div>
        </div>
      </section>

      <section className="osscan-process" id="os-process">
        <div className="osscan-process-inner">
          <header className="osscan-process-head">
            <span className="osscan-section-number">06 / PROCESS</span>
            <span className="osscan-kicker"><i /> Structured Host Assessment Workflow</span>
            <h2>How Does the OS Vulnerability Scanner Work?</h2>
          </header>

          <div className="osscan-process-layout">
            <div className="osscan-process-steps">
              {scannerProcess.map((item, index) => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div>{index < scannerProcess.length - 1 && <i aria-hidden="true">→</i>}</article>)}
            </div>
          </div>

        </div>
      </section>

      <section className="osscan-final-cta">
        <div className="osscan-final-cta-inner">
          <div className="osscan-final-cta-copy">
            <span className="osscan-kicker"><i /> Start With Clear Host Visibility</span>
            <h2>Find OS risk before it becomes an attack path.</h2>
          </div>
          <div className="osscan-final-cta-actions">
            <Link href="/signup">Start an OS Scan <span>-&gt;</span></Link>
            <a href="mailto:hello@forgesec.com">Talk to Security</a>
          </div>
          <div className="osscan-final-cta-trust">
            <span><CheckIcon /> Controlled assessments</span>
            <span><CheckIcon /> Evidence-backed findings</span>
            <span><CheckIcon /> Remediation-ready reports</span>
          </div>
        </div>
      </section>

    </main>
  );
}
