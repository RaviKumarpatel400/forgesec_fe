import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import AppFooter from "../components/AppFooter";
import CookieConsent from "../components/CookieConsent";
import NavigationProgress from "../components/NavigationProgress";
import AppProviders from "../components/providers/AppProviders";
import "./globals.css";
import "./integration-ui.css";
import "./pricing-billing.css";
import "./web-scanner.css";
import "./web-scanner-dialogs.css";
import "./web-scan-details.css";
import "./os-scanner.css";
import "./api-scanner.css";
import "./ai-pentest-overview.css";
import "./ai-pentest-new-scan.css";
import "./ai-pentest-pipeline.css";
import "./ai-pentest-stage-detail.css";
import "./ai-pentest-knowledge-base.css";
import "./ai-pentest-reports.css";
import "./ai-pentest-theme.css";
import "./report-centre.css";
import "./network-scanner.css";
import "./hybrid-scanner.css";
import "./marketing-consistency.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    "sans-serif"
  ]
});

export const metadata: Metadata = {
  title: "ForgeSec | Agentic SOC",
  description:
    "The agentic SOC for security teams responding to machine-speed threats."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={inter.variable} lang="en">
      <body>
        <AppProviders>
          <NavigationProgress />
          {children}
          <AppFooter />
          <CookieConsent />
        </AppProviders>
      </body>
    </html>
  );
}
