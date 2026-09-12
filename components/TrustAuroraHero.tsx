"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useMotionTemplate, useMotionValue, animate } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const AURORA_COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

function StarField() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(1800 * 3);
    for (let index = 0; index < values.length; index += 3) {
      values[index] = (Math.random() - 0.5) * 18;
      values[index + 1] = (Math.random() - 0.5) * 10;
      values[index + 2] = (Math.random() - 0.5) * 9;
    }
    return values;
  }, []);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.018;
  });

  return <points ref={points}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <pointsMaterial color="#b9fff1" size={0.018} transparent opacity={0.7} sizeAttenuation />
  </points>;
}

export default function TrustAuroraHero() {
  const color = useMotionValue(AURORA_COLORS[0]);

  useEffect(() => {
    const controls = animate(color, AURORA_COLORS, { duration: 12, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" });
    return () => controls.stop();
  }, [color]);

  const backgroundImage = useMotionTemplate`radial-gradient(70% 85% at 8% 100%, rgba(19, 255, 170, .52), transparent 68%), radial-gradient(70% 85% at 92% 100%, rgba(206, 132, 207, .5), transparent 68%), radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const borderColor = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0 10px 38px -18px ${color}`;

  return <motion.section className="trust-aurora" style={{ backgroundImage }} aria-labelledby="trust-hero-title">
    <div className="trust-aurora-stars" aria-hidden="true"><Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ position: [0, 0, 5], fov: 65 }}><StarField /></Canvas></div>
    <div className="trust-aurora-glow" aria-hidden="true" />
    <div className="trust-aurora-content">
      <span className="trust-aurora-kicker"><i /> FORGESEC TRUST CENTER</span>
      <h1 id="trust-hero-title">Security Practices Built for<span>Trust and Accountability.</span></h1>
      <p>Forge-Sec brings responsible testing, protected access, and clear evidence into one accountable security workflow—giving your team confidence from assessment through remediation.</p>
      <div className="trust-aurora-actions">
        <motion.div style={{ border: borderColor, boxShadow }} whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }}><Link href="/company/contact">Speak With Security <span>→</span></Link></motion.div>
        <motion.div className="trust-aurora-secondary" style={{ border: borderColor, boxShadow }} whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }}><Link href="/resources/documentation">View Documentation <span>→</span></Link></motion.div>
      </div>
      <div className="trust-aurora-proof"><span>Responsible testing</span><i /><span>Protected workflows</span><i /><span>Verifiable evidence</span></div>
    </div>
  </motion.section>;
}
