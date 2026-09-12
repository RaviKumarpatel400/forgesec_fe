import type { Metadata } from "next";
import ChangePasswordPage from "../../components/ChangePasswordPage";

export const metadata: Metadata = {
  title: "Change Password | ForgeSec",
  description: "Update your ForgeSec account password with a secure, guided flow."
};

export default function ChangePasswordRoute() {
  return <ChangePasswordPage />;
}
