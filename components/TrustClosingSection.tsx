"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function TrustClosingSection() {
  return <section className="trust-closing" aria-labelledby="trust-closing-title">
    <motion.div className="trust-closing-copy" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .58, ease: [0.22, 1, 0.36, 1] }}>
      <span><i /> Questions about security?</span>
      <h2 id="trust-closing-title">Let&apos;s review what matters to your team.</h2>
      <p>Talk with Forge-Sec about testing controls, evidence handling, access expectations, or the way security work moves through the platform.</p>
    </motion.div>
    <motion.div className="trust-closing-actions" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .55, delay: .12, ease: [0.22, 1, 0.36, 1] }}>
      <Link href="/company/contact">Talk to Our Security Team <span>→</span></Link>
      <Link href="/resources/documentation">Review Documentation</Link>
    </motion.div>
  </section>;
}
