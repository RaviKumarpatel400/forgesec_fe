"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect height="10" rx="2.2" width="16" x="4" y="10" />
      <path d="M8 10V7.8C8 5.1 9.7 3.4 12 3.4s4 1.7 4 4.4V10" />
      <path d="M12 14v2.7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3 19 6v5c0 4.5-2.8 7.6-7 9-4.2-1.4-7-4.5-7-9V6l7-3Z" />
      <path d="m8.8 12.1 2.1 2.1 4.4-5" />
    </svg>
  );
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

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m15 18-6-6 6-6M9 12h11" />
    </svg>
  );
}

const rules = [
  { id: "length", label: "At least 12 characters" },
  { id: "case", label: "Uppercase and lowercase letters" },
  { id: "number", label: "At least one number" },
  { id: "symbol", label: "At least one special character" },
  { id: "match", label: "Passwords match" }
] as const;

type RuleId = typeof rules[number]["id"];

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibleField, setVisibleField] = useState<"current" | "new" | "confirm" | null>(null);
  const [status, setStatus] = useState("");

  const passedRules = useMemo<Record<RuleId, boolean>>(() => ({
    length: newPassword.length >= 12,
    case: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    symbol: /[^A-Za-z0-9]/.test(newPassword),
    match: Boolean(newPassword) && newPassword === confirmPassword
  }), [confirmPassword, newPassword]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    if (!currentPassword.trim()) {
      setStatus("Enter your current password to continue.");
      return;
    }

    if (rules.some((rule) => !passedRules[rule.id])) {
      setStatus("Use a stronger new password and make sure both new password fields match.");
      return;
    }

    setStatus("Password requirements are satisfied. Your secure update request is ready.");
  };

  return (
    <main className="auth-page auth-page-forgot change-password-page">
      <div className="auth-glow auth-glow-one" aria-hidden="true" />
      <div className="auth-glow auth-glow-two" aria-hidden="true" />
      <div className="auth-wave-field" aria-hidden="true">
        <svg preserveAspectRatio="none" viewBox="0 0 1600 560">
          <path className="auth-wave auth-wave-one" d="M-80 330C170 160 330 420 590 270S980 120 1220 275s390 10 520-80" />
          <path className="auth-wave auth-wave-two" d="M-100 395C165 245 345 470 620 330s420-225 670-50 345 35 470-35" />
          <path className="auth-wave auth-wave-three" d="M-120 260C150 410 360 145 650 290s390 180 650 0 350-140 480-15" />
        </svg>
      </div>

      <header className="auth-header forgot-header change-password-header">
        <Link className="auth-logo change-password-logo" href="/" aria-label="ForgeSec home">
          <Image alt="ForgeSec" height={181} priority src="/images/logo1.png" style={{ height: "auto" }} width={188} />
        </Link>
        <div className="auth-header-action change-password-header-action">
          <span>Back to workspace?</span>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </header>

      <section className="forgot-layout change-password-layout">
        <div className="forgot-story change-password-story">
          <span className="auth-eyebrow change-password-eyebrow"><span /> Secure credential update</span>
          <h1>Change your password securely.</h1>
          <p>
            Keep your ForgeSec account protected with a stronger password, clear requirements, and a guided update flow.
          </p>

          <div className="forgot-story-body change-password-story-body">
            <figure className="forgot-visual change-password-visual">
              <Image
                alt="A user confirming a password reset with a lock and password fields"
                fill
                priority
                sizes="(max-width: 560px) calc(100vw - 66px), (max-width: 1080px) 240px, 280px"
                src="/images/change-password-update-v2.png"
              />
              <figcaption><span aria-hidden="true" /> Secure password update</figcaption>
            </figure>

            <div className="forgot-steps change-password-steps" aria-label="Secure password update steps">
              <div>
                <span>01</span>
                <div><strong>Confirm current access</strong><p>Verify your existing password before changing credentials.</p></div>
              </div>
              <div>
                <span>02</span>
                <div><strong>Create a stronger password</strong><p>Use length, variation, numbers, and special characters.</p></div>
              </div>
              <div>
                <span>03</span>
                <div><strong>Continue securely</strong><p>Return to your workspace with a safer account posture.</p></div>
              </div>
            </div>
          </div>

          <div className="forgot-security-note change-password-note">
            <ShieldIcon />
            <span>Password values stay private inside this secure update flow.</span>
          </div>
        </div>

        <div className="forgot-card-wrap change-password-card-wrap">
          <div className="forgot-card change-password-card">
            <span className="forgot-card-icon change-password-card-icon"><LockIcon /></span>
            <p className="forgot-card-label change-password-card-label">ACCOUNT SECURITY</p>
            <h2>Update Your Password</h2>
            <p className="forgot-card-intro change-password-card-intro">
              Enter your current password, then choose a new password that meets every security requirement.
            </p>

            <form className="change-password-form" onSubmit={handleSubmit}>
              <PasswordField
                autoComplete="current-password"
                id="current-password"
                label="Current password"
                onChange={(value) => {
                  setCurrentPassword(value);
                  setStatus("");
                }}
                placeholder="Enter current password"
                setVisibleField={setVisibleField}
                value={currentPassword}
                visible={visibleField === "current"}
                visibleKey="current"
              />
              <PasswordField
                autoComplete="new-password"
                id="new-password"
                label="New password"
                onChange={(value) => {
                  setNewPassword(value);
                  setStatus("");
                }}
                placeholder="Create a strong password"
                setVisibleField={setVisibleField}
                value={newPassword}
                visible={visibleField === "new"}
                visibleKey="new"
              />
              <PasswordField
                autoComplete="new-password"
                id="confirm-password"
                label="Confirm new password"
                onChange={(value) => {
                  setConfirmPassword(value);
                  setStatus("");
                }}
                placeholder="Re-enter new password"
                setVisibleField={setVisibleField}
                value={confirmPassword}
                visible={visibleField === "confirm"}
                visibleKey="confirm"
              />

              <button className="change-password-submit" type="submit">
                Update Password <span aria-hidden="true">-&gt;</span>
              </button>

              {status && <p className="change-password-status" role="status">{status}</p>}
            </form>

            <div className="forgot-card-footer change-password-footer">
              <Link href="/login"><ArrowLeftIcon /> Back to login</Link>
              <span>Need help? <a href="mailto:hello@forgesec.com">Contact support</a></span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type PasswordFieldProps = {
  autoComplete: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  setVisibleField: (value: "current" | "new" | "confirm" | null) => void;
  value: string;
  visible: boolean;
  visibleKey: "current" | "new" | "confirm";
};

function PasswordField({
  autoComplete,
  id,
  label,
  onChange,
  placeholder,
  setVisibleField,
  value,
  visible,
  visibleKey
}: PasswordFieldProps) {
  return (
    <label className="change-password-field" htmlFor={id}>
      <span>{label}</span>
      <span className="change-password-input-wrap">
        <input
          autoComplete={autoComplete}
          id={id}
          minLength={8}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          type={visible ? "text" : "password"}
          value={value}
        />
        <button
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          type="button"
          onClick={() => setVisibleField(visible ? null : visibleKey)}
        >
          <EyeIcon hidden={visible} />
        </button>
      </span>
    </label>
  );
}
