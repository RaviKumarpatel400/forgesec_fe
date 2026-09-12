import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | ForgeSec",
  description: "The requested ForgeSec page could not be found."
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-ascii" aria-hidden="true">404</div>
      <div className="not-found-vignette" aria-hidden="true" />
      <div className="not-found-motion" aria-hidden="true">
        <span className="not-found-circuit not-found-circuit-left" />
        <span className="not-found-circuit not-found-circuit-right" />
        <span className="not-found-cut not-found-cut-top" />
        <span className="not-found-cut not-found-cut-mid" />
        <span className="not-found-cut not-found-cut-bottom" />
        <span className="not-found-laser" />
      </div>

      <header className="not-found-header">
        <Link className="not-found-logo" href="/" aria-label="ForgeSec home">
          <Image alt="ForgeSec" height={181} priority src="/images/logo1.png" style={{ height: "auto" }} width={188} />
        </Link>
      </header>

      <section className="not-found-content" aria-labelledby="not-found-title">
        <span className="not-found-code">404</span>
        <h1 id="not-found-title">Page not found</h1>
        <p>Sorry, we can't find the page you're looking for.</p>

        <div className="not-found-actions">
          <Link className="not-found-action" href="/pricing">View our pricing plans</Link>
          <a className="not-found-action" href="mailto:hello@forgesec.com?subject=ForgeSec%20page%20support">Email us</a>
          <Link className="not-found-action not-found-action-primary" href="/">Back to Homepage</Link>
        </div>
      </section>
    </main>
  );
}
