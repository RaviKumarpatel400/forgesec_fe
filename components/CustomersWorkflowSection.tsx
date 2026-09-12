"use client";

import { motion } from "motion/react";

const workflow = [
  { number: "01", owner: "Security", title: "Validate what matters", copy: "Review exposure with technical evidence and the context needed to set a defensible priority." },
  { number: "02", owner: "Engineering", title: "Act with clear direction", copy: "Give remediation owners a focused finding, affected asset details, and a clear next action." },
  { number: "03", owner: "Shared outcome", title: "Confirm the Outcome", copy: "Retest the original exposure and keep resolution status visible to everyone involved." }
];

export default function CustomersWorkflowSection() {
  return <section className="customers-workflow" aria-labelledby="customers-workflow-title">
    <header className="customers-workflow-heading">
      <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><i /> Connected teams</motion.span>
      <motion.h2 id="customers-workflow-title" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .6, ease: [0.22, 1, 0.36, 1] }}>From Finding to Resolution,<br /><em>Without Losing Context.</em></motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .55, delay: .15 }}>Forge-Sec gives security and engineering teams a connected workflow for deciding, acting, and confirming results.</motion.p>
    </header>
    <div className="customers-workflow-track">
      <motion.div className="customers-workflow-progress" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: .3 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
      {workflow.map((item, index) => <motion.article key={item.number} initial={{ opacity: 0, x: 35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .45 }} transition={{ duration: .58, delay: index * .15, ease: [0.22, 1, 0.36, 1] }}>
        <div className="customers-workflow-marker"><motion.i initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: .2 + index * .15, type: "spring", stiffness: 190, damping: 16 }} /></div>
        <span>{item.number}</span><div><small>{item.owner}</small><h3>{item.title}</h3><p>{item.copy}</p></div>
      </motion.article>)}
    </div>
  </section>;
}
