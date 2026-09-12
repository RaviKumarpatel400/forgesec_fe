"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

function RecoveryShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3 19 6v5c0 4.5-2.8 7.6-7 9-4.2-1.4-7-4.5-7-9V6l7-3Z" />
      <path d="M9.2 12.2h5.6M12 9.4v5.6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="m4 7 8 6 8-6" />
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [requestStarted, setRequestStarted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const subject = encodeURIComponent("ForgeSec password reset request");
    const body = encodeURIComponent(`Please help me reset the password for my ForgeSec account: ${normalizedEmail}`);

    setRequestStarted(true);
    window.location.href = `mailto:hello@forgesec.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="auth-page auth-page-forgot">
      <div className="auth-glow auth-glow-one" aria-hidden="true" />
      <div className="auth-glow auth-glow-two" aria-hidden="true" />
      <div className="auth-wave-field" aria-hidden="true">
        <svg preserveAspectRatio="none" viewBox="0 0 1600 560">
          <path className="auth-wave auth-wave-one" d="M-80 330C170 160 330 420 590 270S980 120 1220 275s390 10 520-80" />
          <path className="auth-wave auth-wave-two" d="M-100 395C165 245 345 470 620 330s420-225 670-50 345 35 470-35" />
          <path className="auth-wave auth-wave-three" d="M-120 260C150 410 360 145 650 290s390 180 650 0 350-140 480-15" />
        </svg>
      </div>

      <header className="auth-header forgot-header">
        <Link className="auth-logo" href="/" aria-label="ForgeSec home">
          <Image alt="ForgeSec" height={181} priority src="/images/logo1.png" style={{ height: "auto" }} width={188} />
        </Link>
        <div className="auth-header-action">
          <span>Remember your password?</span>
          <Link href="/login">Log in</Link>
        </div>
      </header>

      <section className="forgot-layout">
        <div className="forgot-story">
          <span className="auth-eyebrow"><span /> Secure account recovery</span>
          <h1>Regain secure access to your workspace.</h1>
          <p>
            Start a protected password reset request and get back to managing security risk with confidence.
          </p>

          <div className="forgot-story-body">
            <figure className="forgot-visual">
              <Image
                alt="A secure shield and unlocked recovery ring"
                fill
                priority
                sizes="(max-width: 560px) calc(100vw - 66px), (max-width: 1080px) 240px, 280px"
                src="/images/forgot-account-recovery-v3.png"
              />
              <figcaption><span aria-hidden="true" /> Protected recovery</figcaption>
            </figure>

            <div className="forgot-steps" aria-label="Password recovery steps">
              <div>
                <span>01</span>
                <div><strong>Enter your work email</strong><p>Use the address connected to your ForgeSec account.</p></div>
              </div>
              <div>
                <span>02</span>
                <div><strong>Verify your request</strong><p>Our security team will confirm the account details.</p></div>
              </div>
              <div>
                <span>03</span>
                <div><strong>Restore access securely</strong><p>Follow the protected reset instructions you receive.</p></div>
              </div>
            </div>
          </div>

          <p className="forgot-security-note">
            <RecoveryShieldIcon /> Your password and account details are never included in this request.
          </p>
        </div>

        <div className="forgot-card-wrap">
          <div className="forgot-card">
            <span className="forgot-card-icon"><RecoveryShieldIcon /></span>
            <p className="forgot-card-label">ACCOUNT RECOVERY</p>
            <h2>Reset your password</h2>
            <p className="forgot-card-intro">
              Enter your account email and we’ll help you start a secure reset request.
            </p>

            <form className="forgot-form" onSubmit={handleSubmit}>
              <label htmlFor="recovery-email">Work email address</label>
              <span className="forgot-email-field">
                <MailIcon />
                <input
                  autoComplete="email"
                  id="recovery-email"
                  name="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setRequestStarted(false);
                  }}
                  placeholder="you@company.com"
                  required
                  type="email"
                  value={email}
                />
              </span>

              <button className="forgot-submit" type="submit">
                Send reset request <span aria-hidden="true">→</span>
              </button>
            </form>

            {requestStarted && (
              <p className="forgot-status" role="status">
                Your email app should now be open with the secure reset request ready to send.
              </p>
            )}

            <div className="forgot-card-footer">
              <Link href="/login"><ArrowLeftIcon /> Back to login</Link>
              <span>Need help? <a href="mailto:hello@forgesec.com">Contact support</a></span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
