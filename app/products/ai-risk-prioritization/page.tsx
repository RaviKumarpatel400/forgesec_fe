import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import RiskScrollReveal from "../../../components/RiskScrollReveal";

export const metadata: Metadata = {
  title: "AI Risk Prioritization | Forge-Sec",
  description: "Prioritize validated security findings using exposure, exploitability, asset context, and remediation intelligence."
};

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.5 12.5 3.4 3.4 7.7-8" /></svg>;
}

function ArrowIcon() {
  return (
    <svg className="risk-link-arrow" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="risk-play-icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="m8.5 7.5 4 2.5-4 2.5v-5Z" />
    </svg>
  );
}

export default function AiRiskPrioritizationPage() {
  return (
    <main className="site-shell risk-page">
      <Navbar />
      <RiskScrollReveal />

      <section className="risk-hero">
        <div className="risk-hero-copy">
          <div className="risk-hero-proof">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 1.8 2.1 5.6 5.9.3-4.6 3.7 1.6 5.8-5-3.2-5 3.2 1.6-5.8L2 7.7l5.9-.3L10 1.8Z" /></svg>
            <strong>Forge-Sec</strong>
            <span className="risk-proof-stars" aria-hidden="true"><i>★</i><i>★</i><i>★</i><i>★</i><i>★</i></span>
            <span>Evidence-led risk scoring</span>
          </div>
          <h1><span>Turn Validated Findings Into</span><em>Clear Remediation Priorities.</em></h1>
          <p>Forge-Sec combines technical evidence, exploitability, exposure, asset importance, and remediation context to show teams what needs attention first—and why.</p>
          <div className="risk-actions">
            <Link href="/signup"><span className="risk-link-label">Prioritize My Findings</span><ArrowIcon /></Link>
            <a href="#risk-model"><PlayIcon /><span className="risk-link-label">See How Scoring Works</span></a>
          </div>
        </div>

      </section>

      <section className="risk-context" id="risk-model">
        <header className="risk-context-head">
          <div className="risk-context-meta">
            <span className="risk-section-number">02 / THE PRIORITIZATION GAP</span>
            <span className="risk-kicker"><i /> Context Changes Everything</span>
          </div>
          <h2>Not every critical finding is your biggest risk.</h2>
        </header>
        <div className="risk-context-compare">
          <article className="severity-view">
            <span>SEVERITY-BASED VIEW</span>
            <h3>A score without direction.</h3>
            <p>Critical, High, Medium, and Low findings appear in a long queue with limited guidance on what should be fixed first.</p>
            <ul className="comparison-list severity-list"><li><i /> <span><strong>Technical score dominates.</strong> Findings are ordered without asset context.</span></li><li><i /> <span><strong>Exposure stays unclear.</strong> Reachability and production impact are not validated.</span></li><li><i /> <span><strong>Remediation becomes reactive.</strong> Teams receive volume instead of direction.</span></li></ul>
          </article>
          <div className="context-shift" aria-hidden="true"><span>CONTEXT</span><b>→</b></div>
          <article className="forgesec-view">
            <span>FORGE-SEC RISK VIEW</span>
            <h3>Evidence-Backed Priorities for Remediation.</h3>
            <p>See what requires immediate action, what can be planned, and the evidence behind every priority decision.</p>
            <ul className="comparison-list"><li><CheckIcon /> <span><strong>Exposure and reachability.</strong> Confirm whether the weakness is accessible.</span></li><li><CheckIcon /> <span><strong>Asset and business impact.</strong> Understand what the affected system supports.</span></li><li><CheckIcon /> <span><strong>Exploitability and evidence.</strong> Prioritize using validated attack context.</span></li></ul>
          </article>
        </div>
      </section>

      <section className="risk-analysis" id="context-analysis">
        <header className="risk-analysis-head">
          <div className="risk-analysis-meta"><span>03 / CONTEXT ANALYSIS</span><span><i /> Beyond Traditional Severity Scores</span></div>
          <h2>Severity is a signal. Context decides the priority.</h2>
        </header>
        <div className="risk-analysis-grid">
          <article><span>01</span><h3>Exposure</h3><p>Determine whether the application, API, host, or service is public or reachable through another asset.</p></article>
          <article><span>02</span><h3>Exploitability</h3><p>Evaluate attack complexity, authentication requirements, exploit availability, and validation evidence.</p></article>
          <article><span>03</span><h3>Asset Importance</h3><p>Weight systems supporting sensitive data, customers, authentication, payments, or essential operations.</p></article>
          <article><span>04</span><h3>Potential Impact</h3><p>Assess the likelihood of data exposure, account compromise, disruption, or infrastructure access.</p></article>
        </div>
        <div className="risk-analysis-example"><span>CONTEXT IN PRACTICE</span><p>An exposed production API can require immediate action, while a technically critical issue on an isolated test system may follow a planned remediation cycle.</p></div>
      </section>

      <section className="priority-board" id="priority-board">
        <header className="priority-board-head">
          <div className="priority-board-meta"><span>04 / PRIORITY BOARD</span><span><i /> Clear Priorities for Every Team</span></div>
          <div><h2>Turn Findings Into a Clear Remediation Order.</h2></div>
        </header>
        <div className="priority-lanes">
          <article className="priority-now"><header><span>01</span><small>IMMEDIATE</small></header><h3>Act Now</h3><p>Confirmed or highly exploitable vulnerabilities affecting exposed, sensitive, or business-critical systems.</p><footer><i /> Critical action</footer></article>
          <article className="priority-next"><header><span>02</span><small>NEXT CYCLE</small></header><h3>Fix Next</h3><p>Serious risks that should be assigned and resolved during the next remediation sprint or patching cycle.</p><footer><i /> Assign and resolve</footer></article>
          <article className="priority-plan"><header><span>03</span><small>SCHEDULED</small></header><h3>Plan</h3><p>Important findings with limited current exposure that can move through scheduled engineering or infrastructure work.</p><footer><i /> Planned remediation</footer></article>
          <article className="priority-monitor"><header><span>04</span><small>OBSERVE</small></header><h3>Monitor</h3><p>Lower-risk or constrained findings that remain visible and are reassessed whenever conditions change.</p><footer><i /> Continuous review</footer></article>
        </div>
      </section>

      <section className="risk-reduction" id="risk-reduction">
        <div className="risk-reduction-meta"><span>05 / RISK REDUCTION</span><span><i /> Remediation That Moves Forward</span></div>
        <div className="risk-reduction-layout">
          <div className="risk-reduction-copy">
            <h2>Prioritize. Remediate. Retest. Reduce Risk.</h2>
            <p>Forge-Sec turns prioritized vulnerabilities into actionable remediation work with the evidence, ownership context, and practical fix guidance teams need to move forward.</p>
            <p>After remediation, retest affected assets and automatically update the queue using the latest scan evidence.</p>
          </div>
          <div className="risk-reduction-actions">
            <span>WHAT YOUR TEAM CAN DO</span>
            <ul><li><CheckIcon /><span>Assign findings to the correct remediation owner</span></li><li><CheckIcon /><span>Review technical evidence and affected assets</span></li><li><CheckIcon /><span>Follow practical remediation guidance</span></li><li><CheckIcon /><span>Track progress from discovery to resolution</span></li><li><CheckIcon /><span>Retest fixes using updated scan results</span></li><li><CheckIcon /><span>Reprioritize remaining risks automatically</span></li></ul>
          </div>
        </div>
        <footer className="risk-reduction-cta">
          <div><small>MEASURABLE RISK REDUCTION</small><h3>Focus Remediation on the Risks That Matter Most.</h3><p>Focus resources on the weaknesses that create the greatest exposure.</p></div>
          <div><Link href="/signup"><span className="risk-link-label">Start AI Risk Prioritization</span><ArrowIcon /></Link><Link href="/request-demo">Request a Demo</Link></div>
        </footer>
      </section>

    </main>
  );
}
