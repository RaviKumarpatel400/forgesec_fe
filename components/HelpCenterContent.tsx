"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

const categories = [
  { number: "01", title: "Getting Started", copy: "Set up your workspace, add approved targets, understand core concepts, and prepare your first ForgeSec scan.", links: ["Create your workspace", "Add and verify targets", "Run your first scan"] },
  { number: "02", title: "Scanners & Testing", copy: "Configure web, API, OS, network, and hybrid assessments with the right coverage, policies, and guardrails.", links: ["Choose a scanner", "Configure scan policies", "Troubleshoot scan runs"] },
  { number: "03", title: "Findings & Validation", copy: "Review technical evidence, understand severity and exploitability, and separate meaningful exposure from noise.", links: ["Review a finding", "Understand risk context", "Validate remediation"] },
  { number: "04", title: "Reports & Evidence", copy: "Generate audit-ready reports, export security data, and share clear evidence with engineering and leadership.", links: ["Create a report", "Export findings", "Share remediation evidence"] },
  { number: "05", title: "Integrations & API", copy: "Connect ForgeSec with delivery pipelines, ticketing workflows, authentication systems, and security operations tools.", links: ["Integration setup", "API authentication", "Pipeline troubleshooting"] },
  { number: "06", title: "Account & Billing", copy: "Manage your profile, workspace access, team permissions, plan usage, billing details, and account security.", links: ["Manage team access", "Review plan usage", "Update account settings"] }
];

export default function HelpCenterContent() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return categories;
    return categories.filter((category) =>
      [category.title, category.copy, ...category.links].some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [normalizedQuery]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return <>
    <section className="help-center-hero">
      <div className="help-center-hero-content">
        <div className="help-center-badge"><span>FORGESEC</span><strong>HELP CENTER</strong></div>
        <h1>How can we help?</h1>
        <p>Search practical guidance for configuring ForgeSec, running scans, understanding validated findings, managing reports, and resolving account or integration questions.</p>
        <form className="help-center-search" onSubmit={submitSearch} role="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
          <input aria-controls="help-center-results" aria-label="Search ForgeSec help" autoComplete="off" onChange={(event) => setQuery(event.target.value)} placeholder="Search the Help Center" type="search" value={query} />
          <button onClick={() => setQuery("")} type="button">{query ? "Clear" : "Search"}<span aria-hidden="true">{query ? "×" : "→"}</span></button>
        </form>
        <div className="help-center-popular" aria-label="Popular help topics">
          <small>Popular:</small>
          {["Getting started", "Configure a scanner", "Understand findings", "Export reports"].map((topic) => <button key={topic} onClick={() => setQuery(topic)} type="button">{topic}</button>)}
        </div>
        <div className="help-center-actions"><button type="button">Browse Documentation <span aria-hidden="true">→</span></button><button type="button">Contact Support</button></div>
      </div>
    </section>

    <section className="help-categories-section" aria-labelledby="help-categories-title">
      <div className="help-categories-inner">
        <header className="help-categories-heading">
          <div><span><i /> Browse Help Topics</span><h2 id="help-categories-title">{normalizedQuery ? `Results for “${query.trim()}”` : "Find Guidance Across ForgeSec Workflows."}</h2></div>
          <p>{normalizedQuery ? `${filteredCategories.length} matching ${filteredCategories.length === 1 ? "category" : "categories"} found. Results update automatically as you type.` : "Start with a category to find practical instructions, troubleshooting steps, and answers organized around the work you need to complete."}</p>
        </header>
        <div className="help-categories-grid" id="help-center-results" aria-live="polite">
          {filteredCategories.map((category) => <article key={category.number}>
            <header><span>{category.number}</span><small>Help Topic</small></header>
            <h3>{category.title}</h3><p>{category.copy}</p>
            <ul>{category.links.map((link) => <li key={link}><button type="button">{link}<span aria-hidden="true">→</span></button></li>)}</ul>
          </article>)}
        </div>
        {normalizedQuery && filteredCategories.length === 0 && <div className="help-search-empty" role="status"><strong>No matching help topics</strong><p>Try a broader term such as scanner, findings, reports, API, account, or setup.</p><button onClick={() => setQuery("")} type="button">Clear search</button></div>}
      </div>
    </section>

    <section className="help-guides-section" aria-labelledby="help-guides-title">
      <div className="help-guides-inner">
        <div className="help-guides-main">
          <header className="help-guides-heading"><span><i /> Popular Guides</span><h2 id="help-guides-title">Answers for Common ForgeSec Workflows.</h2><p>Start with the guides customers use most when configuring coverage, reviewing results, and coordinating remediation.</p></header>
          <div className="help-guides-list">
            {[
              ["01", "Set up and verify your first scan target", "Workspace setup · 6 min"],
              ["02", "Choose the right scanner for your environment", "Scanner configuration · 8 min"],
              ["03", "Understand evidence, severity, and validated risk", "Findings and validation · 7 min"],
              ["04", "Create an audit-ready vulnerability report", "Reporting · 5 min"],
              ["05", "Retest a remediation and confirm closure", "Remediation workflow · 6 min"]
            ].map(([number, title, meta]) => <article key={number}>
              <span>{number}</span><div><h3>{title}</h3><small>{meta}</small></div><button aria-label={`Open ${title}`} type="button">→</button>
            </article>)}
          </div>
        </div>
        <aside className="help-support-panel">
          <span className="help-support-label">ForgeSec Support</span>
          <h2>Still need help?</h2>
          <p>Share your question with our support team and include the workspace, scanner, or finding details needed to investigate efficiently.</p>
          <div className="help-support-status"><i /><div><strong>Support available</strong><small>Typical response within one business day</small></div></div>
          <button type="button">Contact Support <span aria-hidden="true">→</span></button>
          <footer><span>Technical guidance</span><i /><span>Account support</span><i /><span>Product questions</span></footer>
        </aside>
      </div>
    </section>

    <section className="help-closing-section" aria-labelledby="help-closing-title">
      <div className="help-closing-inner">
        <header className="help-closing-heading">
          <span><i /> More ways to get help</span>
          <div>
            <h2 id="help-closing-title">Not sure where to start?</h2>
            <p>Choose the path that best fits your question. Whether you are setting up ForgeSec, troubleshooting a scan, or evaluating the platform, we will help you move forward.</p>
          </div>
        </header>

        <div className="help-closing-paths">
          <article>
            <span>01</span>
            <div><small>Self-service</small><h3>Explore the documentation</h3><p>Follow step-by-step setup, scanner, integration, and reporting guides.</p></div>
            <Link href="/resources/documentation" aria-label="Explore ForgeSec documentation">View Documentation <span aria-hidden="true">→</span></Link>
          </article>
          <article>
            <span>02</span>
            <div><small>Customer support</small><h3>Talk to a support specialist</h3><p>Get help with your workspace, scan configuration, findings, or account.</p></div>
            <a href="mailto:hello@forgesec.com">Contact Support <span aria-hidden="true">→</span></a>
          </article>
          <article>
            <span>03</span>
            <div><small>Platform guidance</small><h3>See ForgeSec in action</h3><p>Discuss your security program and get a walkthrough tailored to your needs.</p></div>
            <Link href="/request-demo">Request a Demo <span aria-hidden="true">→</span></Link>
          </article>
        </div>

        <div className="help-closing-cta">
          <div><span><i /> Support team online</span><h3>Still have a question?</h3><p>Tell us what you are working on and we will connect you with the right ForgeSec specialist.</p></div>
          <a href="mailto:hello@forgesec.com">Get in Touch <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  </>;
}
