"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import SubscriptionSidebar from "../../components/dashboard/SubscriptionSidebar";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/api-error";
import { toast } from "../../lib/toast";
import {
  BillingService,
  type BillingPlan,
  type CheckoutOnboarding,
  type CustomerSubscription
} from "../../services/billing.service";
import { UnifiedAPIService } from "../../services/unified-api.service";

const fallbackPlans: BillingPlan[] = [
  { slug: "free", name: "Free", description: "Start with essential security visibility.", amount: "0", currency: "USD", interval: "month", price_configured: true, features: ["5 devices/month", "All scan formats", "30-day data retention", "Community support"] },
  { slug: "pro", name: "Pro", description: "Continuous scanning and AI validation for growing teams.", amount: "49", currency: "USD", interval: "month", price_configured: false, features: ["50 devices/month", "AI-powered exploit verification", "Up to 5 team members", "PDF reports", "1-year data retention", "Email support"] },
  { slug: "enterprise", name: "Enterprise", description: "Unlimited scale, governance and priority support.", amount: "199", currency: "USD", interval: "month", price_configured: false, features: ["Unlimited devices", "AI exploit and script generation", "Unlimited team members", "PDF, HTML and CSV reports", "Unlimited data retention", "SLA and priority support"] }
];

const emptyForm: CheckoutOnboarding = {
  plan: "pro",
  billing_name: "",
  company_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "US",
  tax_id: ""
};

const fields = [
  ["billing_name", "Billing contact name", true], ["company_name", "Company name", true],
  ["phone", "Phone", false], ["tax_id", "Tax ID (optional)", false],
  ["address_line1", "Address line 1", true], ["address_line2", "Address line 2", false],
  ["city", "City", true], ["state", "State / region", false],
  ["postal_code", "Postal code", true], ["country", "Country code (for example US)", true]
] as const;

function money(plan: BillingPlan): string {
  if (plan.slug === "free") return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency,
    maximumFractionDigits: 0
  }).format(Number(plan.amount));
}

function readableDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export default function SubscriptionPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const formRef = useRef<HTMLElement>(null);
  const [plans, setPlans] = useState(fallbackPlans);
  const [subscription, setSubscription] = useState<CustomerSubscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "enterprise">("pro");
  const [form, setForm] = useState<CheckoutOnboarding>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      const next = `${window.location.pathname}${window.location.search}`;
      window.location.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    let active = true;
    async function loadBilling() {
      try {
        const params = new URLSearchParams(window.location.search);
        const requestedPlan = params.get("plan");
        const paidPlan = requestedPlan === "enterprise" ? "enterprise" : "pro";
        setSelectedPlan(paidPlan);

        const [planResponse, subscriptionResponse] = await Promise.all([
          BillingService.plans(),
          BillingService.subscription()
        ]);
        if (!active) return;

        if (planResponse.data.plans?.length) setPlans(planResponse.data.plans);
        const current = subscriptionResponse.data.subscription;
        setSubscription(current);
        setForm(current ? {
          plan: paidPlan,
          billing_name: current.billing_name,
          company_name: current.company_name,
          phone: current.phone,
          address_line1: current.address_line1,
          address_line2: current.address_line2,
          city: current.city,
          state: current.state,
          postal_code: current.postal_code,
          country: current.country || "US",
          tax_id: current.tax_id
        } : {
          ...emptyForm,
          plan: paidPlan,
          billing_name: user?.first_name || user?.username || "",
          company_name: user?.tenant?.name || ""
        });

        const sessionId = params.get("session_id");
        if (params.get("checkout") === "success" && sessionId) {
          const statusResponse = await BillingService.checkoutStatus(sessionId);
          if (!active) return;
          setSubscription(statusResponse.data.subscription);
          toast.success("Payment received and your subscription status is updated.", "Subscription active");
          window.history.replaceState({}, "", "/subscription");
        } else if (params.get("checkout") === "cancelled") {
          toast.info("Checkout was cancelled. No payment was taken.", "Checkout cancelled");
          window.history.replaceState({}, "", `/subscription?plan=${paidPlan}`);
        }
      } catch (error: unknown) {
        if (active) toast.error(getApiErrorMessage(error, "Unable to load billing information."), "Billing unavailable");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadBilling();
    return () => { active = false; };
  }, [authLoading, isAuthenticated, user?.first_name, user?.tenant?.name, user?.username]);

  const selected = useMemo(() => plans.find((plan) => plan.slug === selectedPlan), [plans, selectedPlan]);
  const currentPlan = subscription && ["active", "trialing"].includes(subscription.status) ? subscription.plan : "free";

  function selectPlan(plan: "pro" | "enterprise") {
    setSelectedPlan(plan);
    setForm((current) => ({ ...current, plan }));
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function update(field: keyof CheckoutOnboarding, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function startCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await UnifiedAPIService.auth.getCsrf();
      const response = await BillingService.checkout({ ...form, plan: selectedPlan });
      window.location.assign(response.data.checkout_url);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to start Stripe Checkout."), "Checkout unavailable");
      setSubmitting(false);
    }
  }

  async function manageBilling() {
    setOpeningPortal(true);
    try {
      await UnifiedAPIService.auth.getCsrf();
      const response = await BillingService.portal();
      window.location.assign(response.data.portal_url);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to open the billing portal."), "Portal unavailable");
      setOpeningPortal(false);
    }
  }

  return (
    <main className="dashboard-shell subscription-dashboard-shell">
      <SubscriptionSidebar user={user} />
      <section className="dashboard-workspace subscription-workspace" aria-label="Billing and cost management">
        <header className="dashboard-topbar"><div><span>Security Workspace</span><b>/</b><strong>Billing &amp; Cost Management</strong></div><div className="dashboard-top-actions"><Link className="subscription-overview-link" href="/dashboard">Overview</Link></div></header>
        <div className="subscription-page">
          <div className="subscription-shell">
        <header className="subscription-heading"><div><span>Billing &amp; cost management</span><h1>Plans and subscription</h1><p>Choose a plan, complete billing onboarding, and pay securely with Stripe.</p></div><Link href="/dashboard">← Overview</Link></header>

        {subscription && <section className="subscription-summary"><div><small>Current plan</small><strong>{currentPlan}</strong></div><div><small>Subscription</small><strong>{subscription.status.replaceAll("_", " ")}</strong></div><div><small>Payment</small><strong>{subscription.payment_status.replaceAll("_", " ")}</strong></div>{subscription.stripe_customer_configured && <button disabled={openingPortal} onClick={manageBilling} type="button">{openingPortal ? "Opening..." : "Manage billing"}</button>}</section>}

        <section className="subscription-card">
          <header><span>Available plans</span><h2>Select the right level of protection.</h2></header>
          {loading ? <div className="subscription-loading"><i /> Loading billing information...</div> : <div className="subscription-plans">{plans.map((plan) => {
            const paid = plan.slug === "pro" || plan.slug === "enterprise";
            const isCurrent = currentPlan === plan.slug;
            return <article className={plan.slug === selectedPlan ? "selected" : ""} key={plan.slug}><div><h3>{plan.name}</h3>{isCurrent && <span>Current</span>}</div><p>{plan.description}</p><strong>{money(plan)}{paid && <small>/{plan.interval}</small>}</strong><ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><button disabled={!paid || isCurrent} onClick={() => { if (plan.slug === "pro" || plan.slug === "enterprise") selectPlan(plan.slug); }} type="button">{isCurrent ? "Current plan" : paid ? `Choose ${plan.name}` : "Included"}</button></article>;
          })}</div>}
        </section>

        <section className="subscription-card subscription-onboarding" ref={formRef}>
          <header><span>Secure checkout</span><h2>Billing onboarding</h2><p>Complete your details before continuing to Stripe for the {selected?.name ?? selectedPlan} plan.</p></header>
          <form onSubmit={startCheckout}>{fields.map(([field, label, required]) => <label className={field.startsWith("address_line") ? "wide" : ""} key={field}><span>{label}{required ? " *" : ""}</span><input value={form[field]} onChange={(event) => update(field, field === "country" ? event.target.value.toUpperCase().slice(0, 2) : event.target.value)} required={required} /></label>)}<div className="subscription-checkout"><p><b>✓</b> Card details are entered and stored securely by Stripe, not ForgeSec.</p><button disabled={submitting || !selected?.price_configured} type="submit">{submitting ? "Opening Stripe..." : selected?.price_configured ? `Continue with ${selected.name}` : "Stripe price not configured"}</button></div></form>
        </section>

        {subscription?.payments.length ? <section className="subscription-card subscription-history"><header><span>Receipts</span><h2>Payment history</h2></header><div><table><thead><tr><th>Date</th><th>Invoice</th><th>Amount</th><th>Status</th><th>Receipt</th></tr></thead><tbody>{subscription.payments.map((payment) => <tr key={payment.id}><td>{readableDate(payment.paid_at || payment.created_at)}</td><td>{payment.invoice_id || "—"}</td><td>{payment.currency} {payment.amount}</td><td>{payment.status}</td><td>{payment.hosted_invoice_url ? <a href={payment.hosted_invoice_url} rel="noreferrer" target="_blank">View invoice</a> : "—"}</td></tr>)}</tbody></table></div></section> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
