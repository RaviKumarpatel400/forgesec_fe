import type { Metadata } from "next";
import ForgotPasswordPage from "../../components/ForgotPasswordPage";

export const metadata: Metadata = {
  title: "Reset Password | ForgeSec",
  description: "Start a secure password reset request for your ForgeSec account."
};

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
