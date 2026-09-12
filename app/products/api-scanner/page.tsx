import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import ApiCoverageCards from "../../../components/ApiCoverageCards";

export const metadata: Metadata = {
  title: "API Vulnerability Scanner | Forge-Sec",
  description: "Discover API endpoints, test authorization, validate vulnerabilities, and deliver evidence-backed fixes with Forge-Sec."
};

const coverage = [
  { code: "PATH", title: "Endpoint Inventory", copy: "Identify available API paths, HTTP methods, parameters, request bodies, content types, and expected responses. Build a complete, structured inventory that gives your team a reliable view of every operation exposed across the API environment." },
  { code: "SPEC", title: "Specification Analysis", copy: "Analyze OpenAPI and Swagger files to understand API structure, authentication requirements, server URLs, deprecated operations, and required test values. Validate documented behavior against the live implementation to uncover missing or inconsistent coverage." },
  { code: "AUTH", title: "Authentication Mapping", copy: "Determine which endpoints are public, protected, or incorrectly exposed and identify the authentication methods associated with each operation. Map tokens, roles, and access requirements so authorization testing reflects real user and service boundaries." },
  { code: "SHADOW", title: "Shadow and Deprecated APIs", copy: "Highlight undocumented, outdated, forgotten, or inconsistently protected endpoints that may increase your organization’s exposure." }
];

export default function ApiScannerPage() {
  return (
    <main className="site-shell apiscan-page">
      <Navbar />
      <section className="apiscan-hero">
        <div className="apiscan-hero-shade" />
        <div className="apiscan-hero-texture" aria-hidden="true" />
        <div className="apiscan-hero-inner">
          <div className="apiscan-hero-copy">
            <span className="apiscan-hero-kicker"><i /> Forge-Sec API Vulnerability Scanner</span>
            <h1><span>Discover API Exposure.</span><span>Validate Real Risk.</span></h1>
            <p>Discover your API attack surface, test authenticated operations, validate exploitable weaknesses, and give developers the evidence they need to fix risk quickly.</p>
            <div className="apiscan-actions">
              <Link className="webscan-primary" href="/signup">
                <span>Start API scan</span>
                <span className="webscan-click-cursor" aria-hidden="true">
                  <svg viewBox="0 0 20 20"><path d="M4 2.5 15.5 11l-5 .8 2.7 4.4-2.2 1.3-2.6-4.4-3.2 4.1L4 2.5Z" /></svg>
                </span>
              </Link>
              <a className="webscan-secondary" href="#api-coverage"><span>Explore coverage</span></a>
            </div>
            <div className="apiscan-hero-proof" aria-label="API scanner capabilities">
              <span><i /> Complete endpoint discovery</span>
              <span><i /> Auth-aware testing</span>
              <span><i /> Evidence-backed findings</span>
            </div>
          </div>
          <figure className="apiscan-hero-workflow">
            <Image
              alt="API scanner workflow connecting API specifications, testing engines, validation, and servers"
              src="/images/api-scanner-workflow-hero.png"
              width={880}
              height={560}
              priority
            />
          </figure>
        </div>
      </section>

      <section className="apiscan-coverage" id="api-coverage">
        <div className="apiscan-coverage-inner">
          <header className="apiscan-section-head"><div><span className="apiscan-eyebrow"><i /> API Attack Surface Discovery</span><h2>Map Your API Attack Surface</h2></div><p>APIs can expose hundreds of endpoints, parameters, authentication flows, and data objects. Forge-Sec builds a structured inventory of your API attack surface before security testing begins.</p></header>
          <ApiCoverageCards items={coverage} />
        </div>
      </section>

      <section className="apiscan-testing">
        <div className="apiscan-testing-inner">
          <div className="apiscan-testing-copy">
            <span className="apiscan-eyebrow"><i /> Real-World API Security Testing</span>
            <h2>Identify API Weaknesses. Validate Real Risk.</h2>
            <p>Forge-Sec performs controlled security testing across authorized API endpoints and analyzes live responses to identify vulnerabilities that could expose sensitive data, business functions, or backend systems.</p>
            <p>It tests path parameters, query strings, headers, authentication tokens, cookies, and request bodies for broken access control, authentication weaknesses, injection risks, unsafe input handling, missing rate limits, excessive data exposure, server-side request risks, and security misconfigurations.</p>
            <p>Every validated vulnerability includes the affected endpoint, HTTP method, vulnerable input, severity, potential impact, supporting request-and-response evidence, and clear remediation guidance—so teams can fix and confidently retest the endpoint.</p>
          </div>
          <div className="apiscan-testing-visual" aria-label="Example API vulnerability test result">
            <div className="apiscan-testing-top"><span>CONTROLLED TEST</span><small>LIVE RESPONSE ANALYSIS</small></div>
            <div className="apiscan-endpoint"><b>GET</b><code>/api/v1/accounts/&#123;accountId&#125;</code><span>200 OK</span></div>
            <div className="apiscan-inputs">
              <span>PATH PARAMETER</span><span>QUERY STRING</span><span>AUTH TOKEN</span><span>HEADERS</span><span>COOKIES</span><span>REQUEST BODY</span>
            </div>
            <div className="apiscan-evidence">
              <div><small>VALIDATED FINDING</small><strong>Broken Object-Level Authorization</strong><p>Resource returned outside the authorized account scope.</p></div>
              <span>HIGH</span>
            </div>
            <div className="apiscan-testing-meta"><span><i /> Evidence captured</span><span><i /> Remediation ready</span><span><i /> Retest supported</span></div>
          </div>
        </div>
      </section>

      <section className="apiscan-reporting" id="api-reporting">
        <div className="apiscan-reporting-inner">
          <div className="apiscan-reporting-main">
            <div className="apiscan-report-evidence" id="api-report-evidence">
              <header className="apiscan-reporting-head">
                <span className="apiscan-eyebrow"><i /> Actionable Security Reports</span>
                <h2>Turn Validated API Risk Into Action</h2>
                <p>Forge-Sec converts raw scanner output into structured reports with validated evidence, risk context, and practical guidance for every team involved.</p>
              </header>
              <div className="apiscan-report-proof-strip" aria-label="Report capabilities">
                <span><i /> Validated evidence</span>
                <span><i /> Risk prioritized</span>
                <span><i /> Fix guidance included</span>
              </div>
              <div className="apiscan-report-copy">
                <section>
                  <span>01</span>
                  <div>
                    <h3>Prioritize the Most Important API Risks</h3>
                    <p>Organize validated vulnerabilities by severity, exploitability, affected API service, authentication context, and potential impact—so teams can focus on the risks that require action first.</p>
                    <ul>
                      <li><strong>Risk context</strong><small>Severity and exploitability</small></li>
                      <li><strong>API exposure</strong><small>Service and authentication scope</small></li>
                      <li><strong>Business impact</strong><small>Data and operations at risk</small></li>
                    </ul>
                  </div>
                </section>
                <section>
                  <span>02</span>
                  <div>
                    <h3>Reports for Every Security Role</h3>
                    <p>Give developers technical evidence, leaders a clear risk summary, and compliance teams structured records—all from the same validated security data.</p>
                    <ul>
                      <li><strong>Developers</strong><small>Evidence and remediation steps</small></li>
                      <li><strong>Leadership</strong><small>Risk and priority summaries</small></li>
                      <li><strong>Compliance</strong><small>Structured audit documentation</small></li>
                    </ul>
                  </div>
                </section>
              </div>
              <div className="apiscan-reporting-actions"><Link href="/signup">View Sample Report <span aria-hidden="true">→</span></Link><a href="#api-report-evidence">Explore Reporting</a></div>
            </div>
            <figure className="apiscan-report-preview">
              <figcaption>
                <div><span>Sample API Security Report</span><small>Evidence-backed findings, ready to share</small></div>
                <b>PDF</b>
              </figcaption>
              <div className="apiscan-report-sheet">
                <Image
                  className="apiscan-report-preview-image"
                  src="/images/forge-sec-api-report-white.png"
                  alt="Forge-Sec API vulnerability scanner report showing risk distribution, scan information, and a validated authorization finding"
                  width={1024}
                  height={1536}
                />
                <span className="apiscan-report-preview-brand">
                  <Image
                    src="/images/logo1.png"
                    alt="Forge-Sec"
                    width={188}
                    height={181}
                    style={{ height: "auto" }}
                  />
                </span>
              </div>
            </figure>
          </div>

        </div>
      </section>

      <section className="apiscan-continuous" id="continuous-api-security" aria-labelledby="continuous-api-title">
        <div className="apiscan-continuous-inner">
          <header className="apiscan-continuous-head">
            <div>
              <span className="apiscan-eyebrow"><i /> Continuous Vulnerability Monitoring</span>
              <h2 id="continuous-api-title">Track API Risk Across Every Release</h2>
            </div>
            <p>APIs change frequently as developers introduce new endpoints, update authentication logic, modify request schemas, and deploy new integrations. Forge-Sec helps your team continuously monitor these changes and detect risks throughout the API lifecycle.</p>
          </header>

          <div className="apiscan-continuous-grid">
            <article>
              <span>01</span>
              <div><small>AUTOMATE</small><h3>Scheduled API Scans</h3><p>Run API security scans automatically on a daily, weekly, monthly, or custom schedule without repeatedly configuring the target.</p></div>
            </article>
            <article>
              <span>02</span>
              <div><small>DISCOVER</small><h3>Detect New and Changed Endpoints</h3><p>Compare API specifications and scan results to identify newly introduced, modified, deprecated, or undocumented operations.</p></div>
            </article>
            <article>
              <span>03</span>
              <div><small>PRIORITIZE</small><h3>Track New and Recurring Risks</h3><p>Identify vulnerabilities introduced by recent releases, unresolved findings from previous scans, and security issues that return after deployment.</p></div>
            </article>
            <article>
              <span>04</span>
              <div><small>VALIDATE</small><h3>Verify Remediation</h3><p>Retest affected endpoints after fixes are deployed and confirm whether vulnerabilities have been resolved using updated evidence.</p></div>
            </article>
            <article>
              <span>05</span>
              <div><small>REPORT</small><h3>Maintain API Scan and Validation History</h3><p>Track API scans, findings, severity changes, remediation activity, and validation results from one centralized dashboard.</p></div>
            </article>
          </div>

          <div className="apiscan-continuous-footer">
            <p><strong>Continuous protection for every API release.</strong><span>Monitor changes, validate fixes, and preserve a complete evidence trail from one workflow.</span></p>
            <div className="apiscan-continuous-actions"><Link href="/signup">Schedule API Scans <span aria-hidden="true">→</span></Link><a href="#api-coverage">Review Coverage</a></div>
          </div>
        </div>
      </section>

    </main>
  );
}
