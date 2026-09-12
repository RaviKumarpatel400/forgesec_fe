import type { Metadata } from "next";
import PricingPageContent from "../../components/pricing/PricingPageContent";

export const metadata: Metadata = {
  title: "Pricing | ForgeSec",
  description: "Choose a ForgeSec security plan and subscribe securely through Stripe."
};

export default function PricingPage() {
  return <PricingPageContent />;
}
