"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import Navbar from "../Navbar";
import { BillingService, type BillingPlan } from "../../services/billing.service";

const fallbackPlans: BillingPlan[] = [
  { slug: "free", name: "Free", description: "Essential security visibility for individuals and small teams getting started.", amount: "0", currency: "USD", interval: "month", price_configured: true, features: ["5 devices/month", "All scan formats", "Google SSO", "30-day data retention", "Community support"] },
  { slug: "pro", name: "Pro", description: "Continuous scanning and AI-powered validation for growing security teams.", amount: "49", currency: "USD", interval: "month", price_configured: false, features: ["50 devices/month", "AI-powered exploit verification", "AI script generation", "Up to 5 team members", "PDF reports and 1-year retention", "Email support", "Read-only API keys", "90-day audit logs"] },
  { slug: "enterprise", name: "Enterprise", description: "Unlimited scale, advanced governance and priority support for larger organisations.", amount: "199", currency: "USD", interval: "month", price_configured: false, features: ["Unlimited devices", "AI exploit and script generation", "Knowledge base contributions and approval", "Unlimited team members", "PDF, HTML and CSV reports", "Unlimited data retention", "SLA and priority support", "Full-scope API keys", "Unlimited audit logs", "20 concurrent exploit runs"] }
];

const comparisons = [
  ["Validated priority list", true, true, true],
  ["Human-approved validation", true, true, true],
  ["Evidence-backed findings", true, true, true],
  ["Continuous validation cadence", false, true, true],
  ["Approval and audit workflows", false, true, true],
  ["Review-ready reporting", false, true, true],
  ["Onboarding support", false, false, true],
  ["Security consultation", false, false, true]
] as const;

const included = [
  ["AI-supported review", "Sort findings, context and risk signals while keeping people in control.", "spark"],
  ["Human approval", "Keep sensitive validation under review before checks or decisions move forward.", "shield"],
  ["Evidence records", "Capture findings, notes, approvals and remediation context in one place.", "file"],
  ["Progress reporting", "Show what matters, what changed and what is ready for follow-up.", "chart"],
  ["Safe validation", "Run controlled validation workflows designed for practical security teams.", "lock"],
  ["ForgeSec support", "Get practical onboarding and guidance from the ForgeSec security team.", "users"]
] as const;

const faqs = [
  ["How are paid plans billed?", "Pro and Enterprise are billed monthly through Stripe. Your subscription activates after Stripe confirms payment."],
  ["Which plan should we start with?", "Free supports initial evaluation, Pro fits growing teams, and Enterprise supports unlimited scale and priority service."],
  ["Is onboarding included?", "Yes. After creating your account, complete company and billing onboarding before continuing to secure Stripe Checkout."],
  ["Can we upgrade later?", "Yes. Subscribers can open the Stripe customer portal from Billing & Cost Management to manage payment details and subscriptions."],
  ["Does ForgeSec store card details?", "No. Stripe collects and stores card details. ForgeSec retains subscription, invoice, payment status and billing records only."]
] as const;

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /><circle cx="12" cy="12" r="3" /></>,
    shield: <><path d="M12 3 19 6v5c0 4.5-2.8 7.6-7 9-4.2-1.4-7-4.5-7-9V6l7-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    file: <><path d="M7 3h7l4 4v14H7V3Z" /><path d="M14 3v5h5M10 13h5M10 17h5" /></>,
    chart: <><path d="M5 20V10M12 20V4M19 20v-7" /><path d="M3 20h18" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5" /></>
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name] ?? paths.shield}</svg>;
}

function priceLabel(plan: BillingPlan): string {
  if (plan.slug === "free") return "Free";
  const amount = Number(plan.amount);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency, maximumFractionDigits: 0 }).format(amount)
    : `$${plan.amount}`;
}

function purchaseHref(plan: BillingPlan): string {
  if (plan.slug === "free") return "/signup";
  return `/signup?next=${encodeURIComponent(`/subscription?plan=${plan.slug}`)}`;
}

export default function PricingPageContent() {
  const [plans, setPlans] = useState(fallbackPlans);

  useEffect(() => {
    let active = true;
    BillingService.plans()
      .then((response) => {
        if (active && response.data.plans?.length) setPlans(response.data.plans);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return (
    <main className="pricing-page">
      <Navbar />
      <section className="pricing-hero">
        <div className="pricing-grid" aria-hidden="true" />
        <div className="pricing-hero-copy">
          <span className="pricing-kicker"><i /> Pricing</span>
          <h1>Security plans that<br /><em>scale with you.</em></h1>
          <p>Start free or subscribe monthly. Every paid plan includes guided billing onboarding and secure Stripe Checkout.</p>
          <span className="pricing-stripe-note"><Icon name="shield" /> Card details stay securely with Stripe</span>
        </div>

        <div className="pricing-plan-grid">
          {plans.map((plan) => (
            <article className={`pricing-plan pricing-plan-${plan.slug}`} key={plan.slug}>
              {plan.slug === "pro" && <span className="pricing-popular">Most popular</span>}
              <header><span>{plan.slug === "free" ? "Get started" : plan.slug === "pro" ? "For growing teams" : "Maximum scale"}</span><h2>{plan.name}</h2><p>{plan.description}</p></header>
              <div className="pricing-price"><strong>{priceLabel(plan)}</strong>{plan.slug !== "free" && <span>/{plan.interval}</span>}</div>
              <div className="pricing-rule" />
              <ul>{plan.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
              <Link className="pricing-plan-action" href={purchaseHref(plan)}>{plan.slug === "free" ? "Create free account" : `Choose ${plan.name}`} <span>→</span></Link>
            </article>
          ))}
        </div>
        <p className="pricing-sales">Need private cloud, custom limits, or procurement support? <Link href="/request-demo">Contact sales</Link>.</p>
      </section>

      <section className="pricing-comparison" id="compare">
        <div className="pricing-section-heading"><span>Plan comparison</span><h2>Compare what each plan includes.</h2><p>Choose Free for evaluation, Pro for growing teams, or Enterprise for unlimited scale and priority support.</p></div>
        <div className="pricing-table-wrap"><table><thead><tr><th>Capability</th><th>Free</th><th>Pro</th><th>Enterprise</th></tr></thead><tbody>{comparisons.map(([feature, free, pro, enterprise]) => <tr key={feature}><td>{feature}</td>{[free, pro, enterprise].map((enabled, index) => <td key={index}><span className={enabled ? "included" : "excluded"}>{enabled ? "✓" : "·"}</span></td>)}</tr>)}</tbody></table></div>
      </section>

      <section className="pricing-included">
        <div className="pricing-section-heading"><span>What is included</span><h2>Every plan starts with the same core value.</h2><p>ForgeSec is packaged around practical validation outcomes: clearer priorities, safer checks, approval and evidence.</p></div>
        <div className="pricing-included-grid">{included.map(([title, text, icon]) => <article key={title}><i><Icon name={icon} /></i><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="pricing-faq">
        <div className="pricing-section-heading"><span>Pricing FAQ</span><h2>Questions buyers usually ask first.</h2></div>
        <div className="pricing-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="pricing-cta"><div><span>Ready to start?</span><h2>Build your ForgeSec workspace.</h2><p>Choose a plan that fits your security operations and scale when your needs change.</p></div><div><Link href="/signup?next=%2Fsubscription%3Fplan%3Dpro">Start with Pro</Link><Link href="/request-demo">Contact sales</Link></div></section>
    </main>
  );
}
