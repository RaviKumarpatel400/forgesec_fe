"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../lib/api-error";
import { getCsrfToken } from "../lib/api-utils";
import { toast } from "../lib/toast";
import { UnifiedAPIService } from "../services/unified-api.service";

type AuthMode = "login" | "signup";

function getSafeNextPath(): string {
  if (typeof window === "undefined") return "/dashboard";
  const value = new URLSearchParams(window.location.search).get("next");
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function getRequestedNextPath(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("next");
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isStrongPassword(value: string): boolean {
  return value.length >= 12
    && /[a-z]/.test(value)
    && /[A-Z]/.test(value)
    && /\d/.test(value)
    && /[^A-Za-z0-9]/.test(value)
    && !/\s/.test(value);
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.8" />
      {hidden && <path d="m4 4 16 16" />}
    </svg>
  );
}

function ShieldCheck() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3 19 6v5c0 4.5-2.8 7.6-7 9-4.2-1.4-7-4.5-7-9V6l7-3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthChecking } = useAuth({ enabled: !isSignup });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isSignup && !isAuthChecking && isAuthenticated) {
      router.replace(getSafeNextPath());
    }
  }, [isAuthChecking, isAuthenticated, isSignup, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSignup) {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedTenantName = tenantName.trim();

      if (!firstName.trim() || !lastName.trim()) {
        toast.error("First name and last name are required.", "Check your details");
        return;
      }
      if (!isValidEmail(normalizedEmail)) {
        toast.error("Please enter a valid email address.", "Check your email");
        return;
      }
      if (!normalizedTenantName) {
        toast.error("Workspace name is required.", "Check your details");
        return;
      }
      if (!isStrongPassword(password)) {
        toast.error(
          "Use at least 12 characters with uppercase, lowercase, number, and special character.",
          "Choose a stronger password"
        );
        return;
      }

      setIsSubmitting(true);
      setSuccessMessage("");
      try {
        await UnifiedAPIService.auth.getCsrf();
        const response = await UnifiedAPIService.auth.register({
          email: normalizedEmail,
          password,
          tenant_name: normalizedTenantName,
          username: fullName
        });

        if (String(response.data.status ?? "").toLowerCase() !== "ok") {
          throw new Error("Unable to create your account. Please try again.");
        }

        const message = response.data.message
          ?? "Registration successful. Your workspace account has been created.";

        const nextPath = getRequestedNextPath();
        if (nextPath) {
          window.localStorage.setItem("forgesec_authenticated", "true");
          window.dispatchEvent(new Event("forgesec-auth-change"));
          toast.success("Account created successfully. Opening billing setup.", "Workspace ready");
          window.location.assign(nextPath);
          return;
        }

        await UnifiedAPIService.auth.logout();
        setSuccessMessage(message);
        setFirstName("");
        setLastName("");
        setTenantName("");
        setEmail("");
        setPassword("");
        toast.success("Account created successfully. Redirecting you to login.", "Account created");
        const loginPath = `/login?next=${encodeURIComponent(getSafeNextPath())}`;
        window.setTimeout(() => window.location.replace(loginPath), 650);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to create your account."), "Registration failed");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (!getCsrfToken()) {
        await UnifiedAPIService.auth.getCsrf();
      }

      const response = await UnifiedAPIService.auth.login({ email, password });
      const status = String(response.data.status ?? "").toLowerCase();
      const loginSucceeded = response.status >= 200 && response.status < 300
        && (!status || status === "ok" || status === "success" || status === "authenticated");

      if (!loginSucceeded) {
        throw new Error("The server could not confirm your login. Please try again.");
      }

      window.localStorage.setItem("forgesec_authenticated", "true");
      window.dispatchEvent(new Event("forgesec-auth-change"));
      toast.success("Your secure session is ready. Opening your workspace.", "Welcome back");
      window.setTimeout(() => window.location.assign(getSafeNextPath()), 450);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Invalid email or password."), "Login failed");
      setIsSubmitting(false);
    }
  };

  return (
    <main className={isSignup ? "auth-page auth-page-signup" : "auth-page auth-page-login"}>
      <div className="auth-glow auth-glow-one" aria-hidden="true" />
      <div className="auth-glow auth-glow-two" aria-hidden="true" />
      <div className="auth-wave-field" aria-hidden="true">
        <svg preserveAspectRatio="none" viewBox="0 0 1600 560">
          <path className="auth-wave auth-wave-one" d="M-80 330C170 160 330 420 590 270S980 120 1220 275s390 10 520-80" />
          <path className="auth-wave auth-wave-two" d="M-100 395C165 245 345 470 620 330s420-225 670-50 345 35 470-35" />
          <path className="auth-wave auth-wave-three" d="M-120 260C150 410 360 145 650 290s390 180 650 0 350-140 480-15" />
          <path className="auth-wave auth-wave-four" d="M-100 445C210 315 390 560 710 370s330-390 620-125 350 155 480 40" />
          <path className="auth-wave auth-wave-five" d="M-80 210C210 360 390 190 675 250s410 230 665 60 310-190 450-130" />
        </svg>
      </div>

      <header className="auth-header">
        <Link className="auth-logo" href="/" aria-label="Forge-Sec home">
          <Image alt="ForgeSec" height={181} priority src="/images/logo1.png" style={{ height: "auto" }} width={188} />
        </Link>
        <div className="auth-header-action">
          <span>{isSignup ? "Already have an account?" : "New to Forge-Sec?"}</span>
          <Link href={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Log in" : "Create account"}
          </Link>
        </div>
      </header>

      <section className="auth-layout">
        <div className="auth-story">
          <span className="auth-eyebrow">
            <span /> {isSignup ? "Security Assurance Across Your Attack Surface" : "Evidence-Backed Security Assurance"}
          </span>
          <h1>
            {isSignup ? (
              <>Start With Visibility.<br />Move Toward Validated Risk.</>
            ) : (
              <>Get everything you need to discover,<br />validate, and reduce security risk.</>
            )}
          </h1>
          <p>
            {isSignup
              ? "Bring security discovery, evidence-backed validation, risk prioritization, and remediation into one workflow."
              : "Access security discovery, validation, evidence, risk prioritization, and remediation in one workflow."}
          </p>

          <div className="auth-benefits" aria-label="Platform benefits">
            <div><ShieldCheck /><span>{isSignup ? <><strong>Continuous coverage</strong> across website, API, OS, and hybrid environments.</> : <><strong>Security visibility</strong> across web, API, OS, and hybrid environments.</>}</span></div>
            <div><ShieldCheck /><span>{isSignup ? <><strong>Validated findings</strong> with less noise and clearer context.</> : <><strong>Validated findings</strong> with evidence and clearer risk context.</>}</span></div>
            <div><ShieldCheck /><span><strong>Priority-first remediation</strong> for the risks that matter.</span></div>
          </div>

          <div className="auth-trust-row">
            <span>Protected by enterprise-grade security</span>
            <span aria-hidden="true" />
            <span>Your data stays private</span>
          </div>
        </div>

        <div className="auth-card-wrap">
          <div className="auth-card">
            <div className="auth-card-heading">
              <span className="auth-card-icon"><ShieldCheck /></span>
              <div>
                <p>{isSignup ? "GET STARTED" : "SECURE ACCESS"}</p>
                <h2>{isSignup ? "Create Your ForgeSec Account" : "Log in to Forge-Sec"}</h2>
              </div>
            </div>
            <p className="auth-card-intro">
              {isSignup
                ? "Set up your workspace and start managing security exposure with confidence."
                : "Enter your credentials to access your security workspace."}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {isSignup && (
                <div className="auth-field-row">
                  <label>
                    <span>First name</span>
                    <input autoComplete="given-name" name="firstName" onChange={(event) => setFirstName(event.target.value)} placeholder="Alex" required value={firstName} />
                  </label>
                  <label>
                    <span>Last name</span>
                    <input autoComplete="family-name" name="lastName" onChange={(event) => setLastName(event.target.value)} placeholder="Morgan" required value={lastName} />
                  </label>
                </div>
              )}

              {isSignup && (
                <label>
                  <span>Workspace name</span>
                  <input autoComplete="organization" name="tenantName" onChange={(event) => setTenantName(event.target.value)} placeholder="Acme Security" required value={tenantName} />
                </label>
              )}

              <label>
                <span>{isSignup ? "Work email" : "Email address"}</span>
                <input autoComplete="email" name="email" onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required type="email" value={email} />
              </label>

              <label>
                <span>Password</span>
                <span className="auth-password-field">
                  <input
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    minLength={isSignup ? 12 : 8}
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={isSignup ? "12+ strong characters" : "Enter your password"}
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    <EyeIcon hidden={showPassword} />
                  </button>
                </span>
              </label>

              {isSignup ? (
                <label className="auth-check">
                  <input required type="checkbox" />
                  <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>.</span>
                </label>
              ) : (
                <div className="auth-form-options">
                  <label className="auth-check"><input type="checkbox" /><span>Remember me</span></label>
                  <Link href="/forgot-password">Forgot password?</Link>
                </div>
              )}

              <button className="auth-submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? (isSignup ? "Creating account..." : "Signing in securely...") : isSignup ? "Create Account" : "Log In"}
                <span aria-hidden="true">→</span>
              </button>
              {successMessage && (
                <p className="auth-form-notice" role="status">
                  {successMessage}
                </p>
              )}
            </form>

            <p className="auth-switch">
              {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
              <Link href={isSignup ? "/login" : "/signup"}>
                {isSignup ? "Log in" : "Sign up"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
