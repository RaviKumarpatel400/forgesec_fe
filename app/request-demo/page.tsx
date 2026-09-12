import type { Metadata } from "next";
import Navbar from "../../components/Navbar";

export const metadata: Metadata = {
  title: "Request a Demo | Forge-Sec",
  description: "See how Forge-Sec helps security teams continuously test, prioritize, and remediate real-world risk."
};

const outcomes = [
  "Map Forge-Sec to your applications, APIs, hosts, and infrastructure",
  "See how validated findings are prioritized by real-world business risk",
  "Explore actionable remediation workflows built for security and engineering teams"
];

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.5 12.5 3.4 3.4 7.7-8" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default function RequestDemoPage() {
  return (
    <main className="site-shell demo-page">
      <Navbar />

      <section className="request-demo-hero">
        <div className="demo-ambient" aria-hidden="true"><span /><span /><span /></div>
        <div className="demo-wave-field" aria-hidden="true">
          <svg preserveAspectRatio="none" viewBox="0 0 1600 560">
            <path className="demo-wave wave-one" d="M-80 330C170 160 330 420 590 270S980 120 1220 275s390 10 520-80" />
            <path className="demo-wave wave-two" d="M-100 395C165 245 345 470 620 330s420-225 670-50 345 35 470-35" />
            <path className="demo-wave wave-three" d="M-120 260C150 410 360 145 650 290s390 180 650 0 350-140 480-15" />
            <path className="demo-wave wave-four" d="M-100 445C210 315 390 560 710 370s330-390 620-125 350 155 480 40" />
            <path className="demo-wave wave-five" d="M-80 210C210 360 390 190 675 250s410 230 665 60 310-190 450-130" />
          </svg>
        </div>
        <span className="demo-notch demo-notch-left" aria-hidden="true" />
        <span className="demo-notch demo-notch-right" aria-hidden="true" />

        <div className="demo-intro">
          <span className="demo-kicker">PERSONALIZED FORGESEC DEMO</span>
          <h1>See How ForgeSec Turns Findings Into Validated Risk.</h1>
          <p className="demo-lead">
            Explore how ForgeSec connects security findings with validation, evidence, risk prioritization, and remediation in one workflow.
          </p>

          <div className="demo-outcomes">
            <span className="demo-outcomes-label">In your session, we’ll:</span>
            <ul>
              {outcomes.map((outcome) => <li key={outcome}><CheckIcon /><span>{outcome}</span></li>)}
            </ul>
          </div>

          <div className="demo-proof">
            <div><strong>30 min</strong><span>Focused session</span></div>
            <div><strong>1:1</strong><span>Security specialist</span></div>
            <div><strong>Tailored</strong><span>To your environment</span></div>
          </div>
        </div>

        <div className="demo-form-shell">
          <div className="demo-form-heading">
            <span>REQUEST A DEMO</span>
            <h2>Request Your ForgeSec Demo</h2>
            <p>Tell us about your security needs, and we’ll tailor the demo to your environment and priorities.</p>
          </div>

          <form className="demo-form" action="mailto:hello@forgesec.com" method="post" encType="text/plain">
            <div className="demo-field-row">
              <label><span>First name</span><input autoComplete="given-name" name="firstName" placeholder="Alex" required /></label>
              <label><span>Last name</span><input autoComplete="family-name" name="lastName" placeholder="Morgan" required /></label>
            </div>
            <label><span>Work email</span><input autoComplete="email" name="email" placeholder="alex@company.com" required type="email" /></label>
            <div className="demo-field-row">
              <label><span>Company</span><input autoComplete="organization" name="company" placeholder="Company name" required /></label>
              <label><span>Role</span><input autoComplete="organization-title" name="role" placeholder="Security lead" required /></label>
            </div>
            <label>
              <span>What would you like to explore?</span>
              <select defaultValue="" name="interest" required>
                <option disabled value="">Choose a primary interest</option>
                <option>Continuous pentesting</option>
                <option>Web and API security</option>
                <option>Host and OS scanning</option>
                <option>AI risk prioritization</option>
                <option>Remediation guidance</option>
                <option>Complete Forge-Sec platform</option>
              </select>
            </label>
            <label><span>Anything else we should know? <em>Optional</em></span><textarea name="message" placeholder="Share your current challenges, environment, or goals." rows={4} /></label>

            <label className="demo-consent"><input name="consent" required type="checkbox" /><span>I agree to be contacted about my demo request and understand that my information will be handled according to Forge-Sec’s privacy practices.</span></label>

            <button className="demo-submit" type="submit">Request My Demo <ArrowIcon /></button>
            <p className="demo-form-note">No pressure. Just a practical conversation about your security goals.</p>
          </form>
        </div>
      </section>
    </main>
  );
}
