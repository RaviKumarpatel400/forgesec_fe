"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "forgesec-cookie-consent-v1";

type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      setIsVisible(!window.localStorage.getItem(CONSENT_KEY));
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (nextAnalytics: boolean, nextMarketing: boolean) => {
    const preferences: ConsentPreferences = {
      essential: true,
      analytics: nextAnalytics,
      marketing: nextMarketing,
      updatedAt: new Date().toISOString()
    };

    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences));
      document.cookie = `${CONSENT_KEY}=saved; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {
      // Keep the visitor's choice for the current page when storage is unavailable.
    }

    window.dispatchEvent(
      new CustomEvent("forgesec:cookie-consent", { detail: preferences })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie preferences"
      aria-live="polite"
      className="cookie-consent"
    >
      <div className="cookie-consent-accent" aria-hidden="true" />
      <button
        aria-label="Close cookie notice and use essential cookies only"
        className="cookie-consent-close"
        onClick={() => saveConsent(false, false)}
        title="Close"
        type="button"
      >
        <span aria-hidden="true">×</span>
      </button>

      <div className="cookie-consent-header">
        <span className="cookie-consent-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3a4 4 0 0 0 5.4 3.75A4.5 4.5 0 0 0 21 11.16V12a9 9 0 1 1-9-9Z" />
            <circle cx="8.1" cy="10.1" r="1" />
            <circle cx="11.2" cy="15.2" r="1" />
            <circle cx="6.9" cy="16.2" r="1" />
          </svg>
        </span>
        <div>
          <span className="cookie-consent-label">Privacy preferences</span>
          <h2>We respect your privacy</h2>
        </div>
      </div>

      <p className="cookie-consent-copy">
        We use essential cookies to keep ForgeSec secure and operational. With your
        permission, we may also use analytics and marketing cookies to understand
        website usage and improve your experience. Read our{" "}
        <Link href="/privacy-policy#cookies">Privacy Policy</Link>.
      </p>

      {isCustomizing && (
        <div className="cookie-consent-preferences" id="cookie-preferences">
          <label>
            <span>
              <strong>Essential cookies</strong>
              <small>Required for security and core website functionality.</small>
            </span>
            <input checked disabled type="checkbox" />
            <i aria-hidden="true" />
          </label>

          <label>
            <span>
              <strong>Analytics cookies</strong>
              <small>Help us understand how visitors use the website.</small>
            </span>
            <input
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
              type="checkbox"
            />
            <i aria-hidden="true" />
          </label>

          <label>
            <span>
              <strong>Marketing cookies</strong>
              <small>Support relevant communications and campaign measurement.</small>
            </span>
            <input
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
              type="checkbox"
            />
            <i aria-hidden="true" />
          </label>
        </div>
      )}

      <div className="cookie-consent-actions">
        <button
          className="cookie-consent-essential"
          onClick={() => saveConsent(false, false)}
          type="button"
        >
          Essential only
        </button>

        {isCustomizing ? (
          <button
            className="cookie-consent-save"
            onClick={() => saveConsent(analytics, marketing)}
            type="button"
          >
            Save preferences
          </button>
        ) : (
          <button
            aria-controls="cookie-preferences"
            aria-expanded="false"
            className="cookie-consent-customize"
            onClick={() => setIsCustomizing(true)}
            type="button"
          >
            Customize
          </button>
        )}

        <button
          className="cookie-consent-accept"
          onClick={() => saveConsent(true, true)}
          type="button"
        >
          Accept all
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>
  );
}
