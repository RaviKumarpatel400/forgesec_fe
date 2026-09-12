"use client";

import { motion } from "motion/react";

const assurances = [
  { number: "01", title: "Approved scope", copy: "Testing begins only after targets and boundaries are clearly defined." },
  { number: "02", title: "Defensible findings", copy: "Each result carries the evidence and context required for review." },
  { number: "03", title: "Confirmed Remediation", copy: "Remediation remains visible until the original exposure is checked again." }
];

export default function TrustEvidenceSection() {
  return <section className="trust-assurance-story" aria-labelledby="trust-assurance-story-title">
    <motion.div className="trust-assurance-story-intro" initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}>
      <span><i /> Assurance in practice</span>
      <h2 id="trust-assurance-story-title">Confidence should come from clarity—not assumptions.</h2>
      <p>Forge-Sec keeps the important parts of security work visible, from approval through remediation.</p>
      <div className="trust-assurance-signature"><b>Forge-Sec</b><small>Responsible security operations</small></div>
    </motion.div>
    <div className="trust-assurance-rows">
      {assurances.map((item, index) => <motion.article key={item.number} initial={{ opacity: 0, x: 34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .45 }} transition={{ duration: .55, delay: index * .13, ease: [0.22, 1, 0.36, 1] }}>
        <span>{item.number}</span>
        <div><h3>{item.title}</h3><p>{item.copy}</p></div>
        <motion.i aria-hidden="true" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: .2 + index * .13, type: "spring", stiffness: 180, damping: 16 }} />
      </motion.article>)}
    </div>
  </section>;
}
