"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function ContactPageContent() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const formSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = formSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      section.classList.toggle("contact-main--blue", entry.isIntersecting || entry.boundingClientRect.top < 0);
    }, { rootMargin: "0px 0px -35% 0px" });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <>
    <section className="contact-hero" aria-labelledby="contact-hero-title">
      <div className="contact-hero-copy">
        <span><i /> CONTACT FORGESEC</span>
        <h1 id="contact-hero-title">Let&apos;s talk about your security program.</h1>
        <p>Whether you are evaluating Forge-Sec, planning a new testing workflow, or looking for product support, we will help you find the right next step.</p>
        <a href="#contact-form">Start a Conversation <span>→</span></a>
      </div>
      <div className="contact-hero-visual" aria-hidden="true">
        <div className="contact-orbit contact-orbit-a" /><div className="contact-orbit contact-orbit-b" />
        <div className="contact-person"><i /><span /></div>
        <div className="contact-check"><span>✓</span></div>
        <small>Secure connection</small>
      </div>
    </section>

    <section className="contact-main" id="contact-form" aria-labelledby="contact-form-title" ref={formSectionRef}>
      <div className="contact-main-inner">
      <form className="contact-form" onSubmit={submitForm}>
        <div className="contact-form-heading"><span><i /> Send a message</span><h2 id="contact-form-title">Tell us how we can help.</h2><p>Share a few details and the Forge-Sec team will route your request to the right person.</p></div>
        <div className="contact-fields two"><label>First name<input name="firstName" placeholder="First name" required /></label><label>Last name<input name="lastName" placeholder="Last name" required /></label></div>
        <div className="contact-fields"><label>Work email<input name="email" type="email" placeholder="you@company.com" required /></label></div>
        <div className="contact-fields"><label>What can we help with?<select name="topic" defaultValue=""><option value="" disabled>Select a topic</option><option>Product evaluation</option><option>Request a demo</option><option>Technical support</option><option>Partnership</option><option>General question</option></select></label></div>
        <div className="contact-fields"><label>Message<textarea maxLength={1200} name="message" onChange={(event) => setMessage(event.target.value)} placeholder="Tell us about your security goals, environment, or question." required value={message} /><small>{message.length} / 1200 characters</small></label></div>
        <label className="contact-consent"><input type="checkbox" required /><span>I agree that Forge-Sec may use these details to respond to my request.</span></label>
        <button type="submit">Send Message <span>→</span></button>
        {submitted && <p className="contact-success" role="status">Thanks—your message is ready for the Forge-Sec team.</p>}
      </form>

      <aside className="contact-details">
        <span><i /> FIND THE RIGHT TEAM</span>
        <h2>Connect With the Right ForgeSec Team.</h2>
        <p>Questions about scanning, validation, remediation, pricing, or implementation are welcome.</p>
        <div className="contact-detail-list">
          <article><b>01</b><div><h3>Product & Demo</h3><p>Explore Forge-Sec for your security program or arrange a product walkthrough.</p><Link href="/request-demo">Request a Demo →</Link></div></article>
          <article><b>02</b><div><h3>Product Support</h3><p>Get help with platform setup, scanning workflows, findings, or your account.</p><Link href="/resources/help-center">Visit Help Center →</Link></div></article>
          <article><b>03</b><div><h3>Partnerships & General Enquiries</h3><p>For partnerships, company questions, or anything else, contact us directly.</p><a href="mailto:hello@forgesec.com">hello@forgesec.com →</a></div></article>
        </div>
        <footer>Interested in Joining ForgeSec? <Link href="/company/careers">View careers</Link></footer>
      </aside>
      </div>
    </section>
  </>;
}
