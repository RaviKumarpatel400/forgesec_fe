"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";

type Opening = {
  number: string;
  team: string;
  title: string;
  type: string;
  copy: string;
};

const openings: Opening[] = [
  {
    number: "01",
    team: "Security Research",
    title: "Security Research & Validation",
    type: "Expression of interest",
    copy: "For practitioners interested in vulnerability research, attack-path analysis, validation methods, and technical evidence."
  },
  {
    number: "02",
    team: "Product Engineering",
    title: "Security Platform Engineering",
    type: "Expression of interest",
    copy: "For engineers interested in reliable scanning systems, automation, security data, and thoughtful product experiences."
  },
  {
    number: "03",
    team: "Customer Security",
    title: "Security Solutions & Success",
    type: "Expression of interest",
    copy: "For security professionals who can connect platform capabilities with customer programs and measurable outcomes."
  }
];

export default function CareersOpportunities() {
  const [selectedOpening, setSelectedOpening] = useState<Opening | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [note, setNote] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  function closeApplication() {
    setSelectedOpening(null);
    setSubmitted(false);
    setNote("");
  }

  function openApplication(opening: Opening) {
    setSelectedOpening(opening);
    setSubmitted(false);
    setNote("");
  }

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  useEffect(() => {
    if (!selectedOpening) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 80);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeApplication();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedOpening]);

  return <>
    <section className="careers-openings" id="open-opportunities" aria-labelledby="careers-openings-title">
      <header className="careers-openings-heading">
        <div><span><i /> Future Opportunities</span><h2 id="careers-openings-title">Find where your experience can make an impact.</h2></div>
        <div><p>We welcome conversations with thoughtful people across security, engineering, product, and customer-facing disciplines.</p><small>Opportunities are shared as team needs evolve.</small></div>
      </header>

      <div className="careers-openings-list">{openings.map((opening) => <article key={opening.number}>
        <span>{opening.number}</span>
        <div><small>{opening.team}</small><h3>{opening.title}</h3><p>{opening.copy}</p></div>
        <div><em>{opening.type}</em><button className="careers-apply-button" onClick={() => openApplication(opening)} type="button">Apply Now <span aria-hidden="true">→</span></button></div>
      </article>)}</div>
    </section>

    {selectedOpening && <div className="careers-application-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeApplication()}>
      <section aria-describedby={descriptionId} aria-labelledby={titleId} aria-modal="true" className="careers-application-modal" role="dialog">
        <header className="careers-application-header">
          <div>
            <span><i /> Career application</span>
            <h2 id={titleId}>{submitted ? "Thank you for your interest." : selectedOpening.title}</h2>
            <p id={descriptionId}>{submitted ? "Your details are ready for review by the Forge-Sec careers team." : `Share your background and interest in ${selectedOpening.team}.`}</p>
          </div>
          <button aria-label="Close application form" className="careers-application-close" onClick={closeApplication} type="button">×</button>
        </header>

        {submitted ? <div className="careers-application-success" role="status">
          <span aria-hidden="true">✓</span>
          <small>Application received</small>
          <h3>We appreciate your interest in Forge-Sec.</h3>
          <p>Our team will review your experience against future opportunities in {selectedOpening.team}. If there is a strong match, we will contact you using the details provided.</p>
          <button onClick={closeApplication} type="button">Done</button>
        </div> : <form className="careers-application-form" onSubmit={submitApplication}>
          <div className="careers-application-context">
            <div><span>Team</span><strong>{selectedOpening.team}</strong></div>
            <div><span>Opportunity</span><strong>Future consideration</strong></div>
          </div>

          <div className="careers-application-intro">
            <span>Applicant details</span>
            <p>Fields marked with an asterisk are required.</p>
          </div>

          <div className="careers-application-fields">
            <label><span>Full name *</span><input ref={firstFieldRef} autoComplete="name" name="fullName" placeholder="Your full name" required /></label>
            <label><span>Email address *</span><input autoComplete="email" name="email" placeholder="you@example.com" required type="email" /></label>
            <label><span>Phone number *</span><input autoComplete="tel" name="phone" placeholder="+1 555 000 0000" required type="tel" /></label>
            <label><span>Current role *</span><input autoComplete="organization-title" name="currentRole" placeholder="Your current role" required /></label>
            <label><span>Relevant experience *</span><select defaultValue="" name="experience" required><option disabled value="">Select experience</option><option>Less than 2 years</option><option>2–4 years</option><option>5–8 years</option><option>9+ years</option></select></label>
            <label><span>Location *</span><input autoComplete="address-level2" name="location" placeholder="City, country" required /></label>
            <label className="wide"><span>LinkedIn, portfolio, or résumé link</span><input name="profileUrl" placeholder="https://" type="url" /></label>
            <label className="wide"><span>Why are you interested in Forge-Sec? *</span><textarea maxLength={1000} name="interest" onChange={(event) => setNote(event.target.value)} placeholder="Tell us about your experience, strengths, and the work you would like to do." required value={note} /><small>{note.length} / 1000 characters</small></label>
          </div>

          <label className="careers-application-consent"><input name="consent" required type="checkbox" /><span>I agree that Forge-Sec may use these details to review my application and contact me about relevant opportunities.</span></label>

          <footer className="careers-application-actions">
            <button onClick={closeApplication} type="button">Cancel</button>
            <button type="submit">Submit Application <span aria-hidden="true">→</span></button>
          </footer>
        </form>}
      </section>
    </div>}
  </>;
}
