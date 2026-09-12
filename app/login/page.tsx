import type { Metadata } from "next";
import AuthPage from "../../components/AuthPage";

export const metadata: Metadata = {
  title: "Log In | Forge-Sec",
  description: "Log in to your Forge-Sec security workspace."
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
