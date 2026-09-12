import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";

export const metadata: Metadata = {
  title: "Security Teams | Forge-Sec",
  description: "Give security teams one connected workflow for validated findings, risk decisions, ownership, and remediation.",
};

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function Check() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}

export default function SecurityTeamsPage() {
  return (
    <main className="site-shell security-teams-page">
      <Navbar />

      <section className="security-teams-hero">
        <div className="security-teams-copy">
          <span className="security-teams-label"><i /> Built for Modern Security Teams</span>
          <h1>Turn Security Findings Into <em>Coordinated Action.</em></h1>
          <p>Bring validated evidence, risk context, ownership, and remediation into one shared workflow—so AppSec, SecOps, and engineering can move from detection to resolution without losing context.</p>

          <div className="security-teams-actions">
            <Link href="/signup">Unify Your Security Workflow <Arrow /></Link>
            <Link href="/#platform">Explore the Platform</Link>
          </div>

          <div className="security-teams-proof" aria-label="Security team workflow advantages">
            <span><Check /> Verified findings</span>
            <span><Check /> Clear ownership</span>
            <span><Check /> Faster remediation</span>
          </div>
        </div>

        <figure className="security-teams-hero-image">
          <Image
            alt="AppSec, SecOps, and engineering professionals collaborating on validated vulnerability evidence"
            fill
            priority
            sizes="100vw"
            src="/images/security-teams-hero-v3.png"
          />
        </figure>
      </section>

      <section className="security-team-simple" aria-labelledby="security-team-simple-title">
        <header className="security-team-simple-head">
          <div>
            <span><i /> 02 / Unified Security Operations</span>
            <h2 id="security-team-simple-title">One Connected Workflow Across Security Teams</h2>
          </div>
          <p>Keep technical evidence, risk context, ownership, and remediation activity connected from the first finding through verified closure.</p>
        </header>

        <div className="security-team-capabilities">
          <article>
            <div className="security-team-cap-visual">
              <div className="security-team-cap-list">
                <div><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14v12H5zM8 9h8M8 13h5" /></svg></span><p><small>Web application</small><strong>Broken Access Control</strong></p><em>Verified</em></div>
                <div><span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" /></svg></span><p><small>Customer API</small><strong>Exposed Account Data</strong></p><em>Verified</em></div>
                <div><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 7v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10" /></svg></span><p><small>Host service</small><strong>Outdated Component</strong></p><em>Validated</em></div>
              </div>
              <span className="security-team-cap-sync"><i /> Evidence synchronized across assets</span>
            </div>
            <div className="security-team-cap-copy">
              <small>AppSec · Validate</small>
              <h3>Turn Scanner Alerts Into Validated Findings</h3>
              <p>Confirm exploitability, preserve technical evidence, and remove unsupported findings before they reach remediation teams.</p>
              <Link href="/solutions/vulnerability-validation">Explore validation <Arrow /></Link>
            </div>
          </article>

          <article>
            <div className="security-team-cap-visual">
              <div className="security-team-cap-finding">
                <header><div><span>FS</span><p><small>Risk decision</small><strong>Priority Analysis</strong></p></div><em>Just now</em></header>
                <h4>Customer data exposed through an authenticated API path.</h4>
                <strong className="security-team-cap-risk"><i /> High-priority exposure</strong>
                <footer><span>Exploit evidence</span><span>Internet exposed</span><span>Business critical</span></footer>
              </div>
            </div>
            <div className="security-team-cap-copy">
              <small>SecOps · Prioritize</small>
              <h3>Put Security Risk in Business Context</h3>
              <p>Connect findings to affected assets, active exposure, business impact, and existing controls to focus response.</p>
              <Link href="/products/ai-risk-prioritization">Explore prioritization <Arrow /></Link>
            </div>
          </article>

          <article>
            <div className="security-team-cap-visual">
              <div className="security-team-cap-progress">
                <header><div><small>Remediation cycle</small><strong>Verified closure</strong></div><em>Report ready</em></header>
                <div className="security-team-cap-score"><strong>100%</strong><span><Check /> Evidence-backed retest complete</span></div>
                <div className="security-team-cap-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
                <footer><span>Assigned</span><span>Fixed</span><span>Retested</span></footer>
              </div>
            </div>
            <div className="security-team-cap-copy">
              <small>Engineering · Remediate</small>
              <h3>Move From Clear Guidance to Confirmed Remediation</h3>
              <p>Give owners the affected component, evidence, fix guidance, and retest criteria required to close the issue confidently.</p>
              <Link href="/products/remediation-guidance">Explore remediation <Arrow /></Link>
            </div>
          </article>
        </div>
      </section>

      <section className="security-team-control" aria-labelledby="security-team-control-title">
        <div className="security-team-control-intro">
          <span><i /> 03 / Operational Control</span>
          <h2 id="security-team-control-title">Keep Security Work Visible, Controlled, and Accountable</h2>
          <p>Give security leaders one clear operating view without taking control away from the analysts and engineers responsible for each decision.</p>

          <div className="security-team-control-proof">
            <span><Check /> Human-approved actions</span>
            <span><Check /> Role-based ownership</span>
            <span><Check /> Complete activity history</span>
          </div>
        </div>

        <div className="security-team-control-list">
          <article>
            <span>01</span>
            <div><small>Centralize</small><h3>One Shared Work Queue</h3><p>Bring validated findings, priority, status, owners, and due dates into one consistent view across security and engineering.</p></div>
            <strong>Less coordination overhead</strong>
          </article>
          <article>
            <span>02</span>
            <div><small>Govern</small><h3>Human Approval Gates</h3><p>Pause sensitive validation or escalation steps until an authorized team member reviews the evidence and approves the action.</p></div>
            <strong>Testing stays controlled</strong>
          </article>
          <article>
            <span>03</span>
            <div><small>Assign</small><h3>Clear Ownership and Status</h3><p>Route each issue to the right team, preserve handoff context, and keep responsibility visible from assignment through retest.</p></div>
            <strong>No finding gets lost</strong>
          </article>
          <article>
            <span>04</span>
            <div><small>Review</small><h3>Complete Audit History</h3><p>Maintain a durable record of evidence, decisions, approvals, configuration, remediation activity, and verified outcomes.</p></div>
            <strong>Every action is traceable</strong>
          </article>
        </div>
      </section>

      <section className="security-team-collaboration" aria-labelledby="security-team-collaboration-title">
        <header className="security-team-collaboration-head">
          <span><i /> 04 / Collaboration in Practice</span>
          <h2 id="security-team-collaboration-title">Shared Context Changes How Security Teams Work</h2>
          <p>Forge-Sec gives every role the same evidence and decision history while presenting the next action each team needs to take.</p>
        </header>

        <div className="security-team-collaboration-grid">
          <figure className="security-team-collaboration-main">
            <Image
              alt="Security, AppSec, and engineering professionals reviewing one verified finding together"
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              src="/images/security-teams-triage.png"
            />
            <figcaption><span>Triage together</span><strong>One finding. One decision record.</strong></figcaption>
          </figure>

          <article className="security-team-collaboration-copy">
            <small>Connected teamwork</small>
            <h3>Decide Together. Act With Shared Context.</h3>
            <p>Security teams can review verified evidence, agree on priority, assign the right owner, and follow remediation without switching between disconnected tools.</p>
            <ul>
              <li><Check /><span><strong>Start from the same evidence</strong>Technical proof stays visible to every role.</span></li>
              <li><Check /><span><strong>Preserve every decision</strong>Priority, approvals, and ownership remain attached.</span></li>
              <li><Check /><span><strong>Verify the outcome together</strong>Retest results confirm when the risk is resolved.</span></li>
            </ul>
          </article>

          <figure className="security-team-collaboration-secondary">
            <Image
              alt="AppSec analyst and software engineer reviewing evidence from a verified remediation retest"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              src="/images/security-teams-remediation-review.png"
            />
            <figcaption><span>Review the fix</span><strong>Evidence-backed closure</strong></figcaption>
          </figure>
        </div>
      </section>

      <section className="security-team-insights" aria-labelledby="security-team-insights-title">
        <header className="security-team-insights-head">
          <div>
            <span><i /> 05 / Program Visibility</span>
            <h2 id="security-team-insights-title">See Security Work From Finding to Resolution</h2>
          </div>
          <p>Give every security team one reliable view of progress, ownership, and verified outcomes across the vulnerability lifecycle.</p>
        </header>

        <div className="security-team-insights-layout">
          <div className="security-team-insights-board">
            <header>
              <div><span>FS</span><p><strong>Security Program Overview</strong><small>Live vulnerability lifecycle</small></p></div>
              <em><i /> Live data</em>
            </header>

            <div className="security-team-insights-metrics">
              <article><small>Open findings</small><strong>38</strong><span>Across all teams</span></article>
              <article><small>Ready to verify</small><strong>12</strong><span>Fixes deployed</span></article>
              <article><small>Within target</small><strong>84%</strong><span>Remediation SLA</span></article>
            </div>

            <div className="security-team-insights-stages">
              <article><span>01</span><div><small>Validated</small><strong>Evidence confirmed</strong></div><em>38 findings</em></article>
              <article><span>02</span><div><small>Prioritized</small><strong>Impact and urgency reviewed</strong></div><em>26 findings</em></article>
              <article><span>03</span><div><small>In remediation</small><strong>Owner and due date assigned</strong></div><em>18 findings</em></article>
              <article><span>04</span><div><small>Verification</small><strong>Fix deployed and ready to retest</strong></div><em>12 findings</em></article>
            </div>

            <footer>
              <span><Check /> Evidence connected</span>
              <span><Check /> Ownership visible</span>
              <span><Check /> Closure verified</span>
            </footer>
          </div>

          <div className="security-team-insights-list">
            <header>
              <span>Connected oversight</span>
              <h3>Clarity Across Security Handoffs</h3>
              <p>Move from technical findings to measurable risk reduction without losing evidence or accountability.</p>
            </header>
            <article><span>01</span><div><h3>Track the Full Lifecycle</h3><p>Follow every risk through validation, prioritization, remediation, retesting, and verified closure.</p></div></article>
            <article><span>02</span><div><h3>Keep Ownership Visible</h3><p>See the responsible team, current status, due date, and next action without manual follow-up.</p></div></article>
            <article><span>03</span><div><h3>Find Workflow Bottlenecks</h3><p>Identify aging queues and delayed handoffs before they slow remediation performance.</p></div></article>
            <article><span>04</span><div><h3>Report Defensible Outcomes</h3><p>Communicate exposure and closure using consistent, evidence-backed program data.</p></div></article>
          </div>
        </div>
      </section>

      <section className="security-team-culture" aria-labelledby="security-team-culture-title">
        <Image
          alt="A diverse Forge-Sec security team working together in a modern security operations center"
          className="security-team-culture-image"
          fill
          sizes="100vw"
          src="/images/security-teams-culture.png"
        />
        <div className="security-team-culture-shade" />
        <div className="security-team-culture-content">
          <span className="security-team-culture-label"><i /> 06 / One Security Mission</span>
          <h2 id="security-team-culture-title">Built for the Teams That Own Security Outcomes</h2>
          <p>Forge-Sec gives every team a shared view of validated evidence, responsible owners, remediation progress, and verified closure—so coordinated action never loses context.</p>
          <div className="security-team-culture-points" aria-label="Team collaboration benefits">
            <span><Check /> Shared context</span>
            <span><Check /> Faster decisions</span>
            <span><Check /> Verified outcomes</span>
          </div>
          <Link className="security-team-culture-cta" href="/request-demo">
            See Forge-Sec in Action <Arrow />
          </Link>
        </div>
      </section>
    </main>
  );
}
