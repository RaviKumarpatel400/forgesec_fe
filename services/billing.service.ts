import { BILLING_ROUTES } from "../config/api-routes";
import { api } from "../lib/axios";

export type BillingPlan = {
  slug: "free" | "pro" | "enterprise";
  name: string;
  description: string;
  amount: string;
  currency: string;
  interval: string;
  features: string[];
  price_configured: boolean;
};

export type SubscriptionPayment = {
  id: string;
  invoice_id: string;
  amount: string;
  currency: string;
  status: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  paid_at: string | null;
  created_at: string;
};

export type CustomerSubscription = {
  id: string;
  plan: "free" | "pro" | "enterprise";
  status: string;
  payment_status: string;
  amount: string;
  currency: string;
  billing_name: string;
  company_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_configured: boolean;
  payments: SubscriptionPayment[];
  updated_at: string;
};

export type CheckoutOnboarding = {
  plan: "pro" | "enterprise";
  billing_name: string;
  company_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id: string;
};

export const BillingService = {
  plans: (skipGlobalLoader = false) => api.get<{ plans: BillingPlan[] }>(BILLING_ROUTES.plans, {
    loaderMessage: "Loading current plans...",
    skipGlobalLoader
  }),
  subscription: () => api.get<{ subscription: CustomerSubscription | null }>(BILLING_ROUTES.subscription, {
    loaderMessage: "Loading billing information..."
  }),
  checkout: (payload: CheckoutOnboarding) => api.post<{ checkout_url: string; session_id: string }>(
    BILLING_ROUTES.checkout,
    payload,
    { loaderMessage: "Preparing secure Stripe Checkout..." }
  ),
  checkoutStatus: (sessionId: string) => api.get<{ subscription: CustomerSubscription }>(
    BILLING_ROUTES.checkoutStatus,
    { loaderMessage: "Confirming your payment...", params: { session_id: sessionId } }
  ),
  portal: () => api.post<{ portal_url: string }>(BILLING_ROUTES.portal, undefined, {
    loaderMessage: "Opening your billing portal..."
  })
};
