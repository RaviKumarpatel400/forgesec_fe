"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const principles = [
  { number: "01", eyebrow: "Testing governance", title: "Define authorization before execution.", copy: "Targets, assessment boundaries, and testing intent are established before work begins, creating a clear record of what your team has approved.", note: "Approved scope / Controlled execution" },
  { number: "02", eyebrow: "Evidence integrity", title: "Keep Evidence and Context Connected.", copy: "Technical evidence, affected assets, and supporting detail remain together so reviewers can understand the finding and act without rebuilding context.", note: "Traceable evidence / Clear decisions" },
  { number: "03", eyebrow: "Operational accountability", title: "Make ownership visible through resolution.", copy: "Responsibility, remediation activity, and verification status remain clear from initial discovery to confirmed closure.", note: "Visible ownership / Verified remediation" }
];

function PrincipleCard({ principle, index }: { principle: typeof principles[number]; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [0.45, 1]);

  return <motion.article ref={cardRef} className={`trust-sticky-card trust-sticky-card-${index + 1}`} style={{ scale, opacity, top: 112 + index * 18 }}>
    <div className="trust-sticky-number"><span>{principle.number}</span><i /></div>
    <div className="trust-sticky-copy"><small>{principle.eyebrow}</small><h3>{principle.title}</h3><p>{principle.copy}</p></div>
    <div className="trust-sticky-note"><span>Operating principle</span><strong>{principle.note}</strong></div>
  </motion.article>;
}

export default function TrustStickyPrinciples() {
  return <section className="trust-sticky" aria-labelledby="trust-sticky-title">
    <header className="trust-sticky-heading">
      <div><span><i /> How Forge-Sec operates</span><h2 id="trust-sticky-title">Trust Built Into<br />the Security Workflow.</h2></div>
      <p>Three practical commitments guide how testing is authorized, how findings are supported, and how remediation remains accountable.</p>
    </header>
    <div className="trust-sticky-stack">{principles.map((principle, index) => <PrincipleCard key={principle.number} principle={principle} index={index} />)}</div>
  </section>;
}
