import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import RemediationHeroScroll from "../../../components/RemediationHeroScroll";
import RemediationScrollReveal from "../../../components/RemediationScrollReveal";

export const metadata: Metadata = {
  title: "Remediation Guidance | Forge-Sec",
  description: "Turn verified security findings into clear, evidence-backed remediation work."
};

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.5 12.5 3.4 3.4 7.7-8" /></svg>;
}

export default function RemediationGuidancePage() {
  return <main className="remediation-page">
    <RemediationScrollReveal />
    <Navbar />
    <section className="remediation-hero">
      <RemediationHeroScroll />
      <div className="remediation-hero-copy">
        <span className="remediation-eyebrow"><i /> REMEDIATION GUIDANCE</span>
        <h1><span>From Validated Finding to</span><br /><em>Confirmed Remediation.</em></h1>
        <p>Forge-Sec translates validated vulnerabilities into practical remediation steps, giving every team the evidence, ownership context, and fix guidance needed to resolve risk with confidence.</p>
        <div className="remediation-hero-actions"><Link href="/signup">Start Remediating <span>→</span></Link><Link href="#remediation-process">See How It Works</Link></div>
        <div className="remediation-proof"><span><CheckIcon /> Evidence-backed guidance</span><span><CheckIcon /> Clear remediation ownership</span><span><CheckIcon /> Fix verification</span></div>
      </div>
    </section>

    <section className="remediation-process" id="remediation-process">
      <header className="remediation-process-head">
        <div><span className="remediation-section-number">02 / GUIDED REMEDIATION</span><span className="remediation-section-label"><i /> From Finding to Verified Fix</span><h2>Give Every Validated Finding a Clear Path Forward.</h2></div>
      </header>
      <div className="remediation-process-grid">
        <article><header><span>01</span><small>UNDERSTAND</small></header><h3>Review the Evidence</h3><p>See the affected asset, vulnerable component, exposure, severity, and proof that confirms the finding. Understand the root cause and likely impact before making a change.</p><footer>Validated security context <b>→</b></footer></article>
        <article><header><span>02</span><small>OWN</small></header><h3>Route the Work</h3><p>Assign the issue to the team responsible for the application, API, host, service, or infrastructure control. Keep evidence, priority, and recommended actions attached during handoff.</p><footer>Clear remediation owner <b>→</b></footer></article>
        <article><header><span>03</span><small>FIX</small></header><h3>Apply Clear Guidance</h3><p>Follow practical patch, code, dependency, or configuration steps tailored to the affected technology. Use clear implementation guidance and compensating controls when an immediate fix is unavailable.</p><footer>Actionable fix plan <b>→</b></footer></article>
        <article><header><span>04</span><small>VERIFY</small></header><h3>Retest and Close</h3><p>Rerun validation after deployment and preserve updated evidence that confirms the risk is resolved. If the weakness remains, reopen the finding with its remediation history intact.</p><footer>Evidence-backed closure <b>✓</b></footer></article>
      </div>
    </section>

    <section className="finding-guidance">
      <div className="finding-guidance-intro">
        <span className="remediation-section-number">03 / MORE THAN A GENERIC RECOMMENDATION</span>
        <span className="remediation-section-label"><i /> Guidance Built Around the Finding</span>
        <h2>Get the Context Needed to Resolve the Issue.</h2>
        <p>Generic advice leaves remediation teams with more questions than answers. Forge-Sec uses the vulnerability type, affected technology, exposed component, scanner evidence, and potential impact to build guidance specific to the finding.</p>
        <p>Every plan explains what caused the weakness, where it was detected, what should change, and how to confirm the correction is effective.</p>
      </div>
      <div className="finding-guidance-list">
        <article><span>01</span><div><small>DIAGNOSE</small><h3>Understand the Root Cause</h3><p>See why the vulnerability exists, which security control failed, and how an attacker could take advantage of it.</p></div></article>
        <article><span>02</span><div><small>PINPOINT</small><h3>Locate the Affected Component</h3><p>Identify the vulnerable page, API endpoint, parameter, service, port, package, configuration, or operating-system component.</p></div></article>
        <article><span>03</span><div><small>CORRECT</small><h3>Apply the Recommended Fix</h3><p>Follow clear coding, patch, configuration, access-control, or compensating-control guidance suited to the finding.</p></div></article>
        <article><span>04</span><div><small>CONFIRM</small><h3>Verify the Correction</h3><p>Use defined validation steps and automated retesting to confirm the vulnerability is no longer exploitable.</p></div></article>
      </div>
    </section>

    <section className="team-guidance">
      <header className="team-guidance-head">
        <div className="team-guidance-meta"><span>04 / GUIDANCE FOR THE TEAM DOING THE WORK</span><span><i /> One Finding. The Right Instructions for Every Team.</span></div>
        <h2>Tailor Remediation Guidance to the Team Doing the Work.</h2>
        <p>Forge-Sec adapts technical context and recommended actions to the team responsible for the fix, reducing handoffs and helping remediation begin faster.</p>
      </header>
      <div className="team-guidance-grid">
        <article><header><span>01</span><small>APPLICATION</small></header><h3>For Developers</h3><p>Affected endpoints, vulnerable parameters, request-and-response evidence, root-cause explanations, secure coding recommendations, and safer implementation patterns.</p></article>
        <article><header><span>02</span><small>PLATFORM</small></header><h3>For DevOps and Cloud Teams</h3><p>Deployment settings, environment exposure, container risks, access controls, secrets handling, security headers, and infrastructure configuration changes.</p></article>
        <article><header><span>03</span><small>INFRASTRUCTURE</small></header><h3>For IT and Infrastructure Teams</h3><p>Affected hosts, services, software versions, missing patches, insecure protocols, operating-system settings, and recommended hardening actions.</p></article>
        <article><header><span>04</span><small>ASSURANCE</small></header><h3>For Security Teams</h3><p>Validate evidence, review exploitability and impact, assign remediation ownership, monitor progress, and confirm fixes through retesting.</p></article>
      </div>
      <div className="remediation-includes">
        <span>EVERY REMEDIATION ITEM CAN INCLUDE</span>
        <ul><li>Vulnerability summary and severity</li><li>Affected asset and technical location</li><li>Root-cause explanation</li><li>Supporting scan evidence</li><li>Recommended correction</li><li>Alternative mitigation</li><li>Suggested remediation owner</li><li>Validation and retesting</li><li>Current resolution status</li></ul>
      </div>
    </section>

    <section className="remediation-loop" id="remediation-loop">
      <header className="remediation-loop-head">
        <div><span className="remediation-section-number">05 / CLOSE THE GAP BETWEEN FINDING AND FIX</span><span className="remediation-section-label"><i /> Remediate. Retest. Confirm.</span><h2>Make Remediation Traceable From Finding to Closure.</h2></div>
      </header>
      <div className="remediation-loop-layout">
        <div className="remediation-loop-flow">
          <span>A COMPLETE REMEDIATION LOOP</span>
          <ol><li><b>01</b><strong>Review the Finding</strong></li><li><b>02</b><strong>Understand the Root Cause</strong></li><li><b>03</b><strong>Assign the Correct Owner</strong></li><li><b>04</b><strong>Apply the Recommended Fix</strong></li><li><b>05</b><strong>Retest the Affected Asset</strong></li><li><b>06</b><strong>Verify and Close the Risk</strong></li></ol>
        </div>
        <div className="remediation-resolution">
          <span>FROM RECOMMENDATION TO RESOLUTION</span>
          <h3>Keep Evidence and Context Connected Through Remediation.</h3>
          <p>When a vulnerability is no longer detected, Forge-Sec records updated evidence and marks it verified. Unresolved or recurring issues can be reopened with their full history preserved.</p>
          <ul><li><CheckIcon /> Convert findings into remediation tasks</li><li><CheckIcon /> Track ownership and resolution status</li><li><CheckIcon /> Preserve evidence and fix notes</li><li><CheckIcon /> Retest the affected asset or vulnerability</li><li><CheckIcon /> Compare results before and after remediation</li><li><CheckIcon /> Reopen recurring or unresolved findings</li><li><CheckIcon /> Maintain records for reporting and audits</li></ul>
        </div>
      </div>
      <footer className="remediation-loop-cta"><div><small>GIVE VALIDATED RISK A CLEAR PATH TO CLOSURE</small><strong>Help every remediation team resolve risk with guidance that is specific, understandable, and ready to act on.</strong></div><div><Link href="/signup">Start Remediating Risks <span>→</span></Link><a href="#remediation-loop">View Remediation Workflow</a></div></footer>
    </section>
  </main>;
}
