"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; size: number; alpha: number; phase: number; speed: number };

export default function CinematicGrid() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = true;
    let stars: Star[] = [];

    const makeStars = () => {
      let seed = 7319;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      const count = Math.max(45, Math.min(130, Math.round(width / 10)));
      stars = Array.from({ length: count }, () => ({
        x: random(),
        y: random() * 0.57,
        size: 0.35 + random() * 1.15,
        alpha: 0.2 + random() * 0.62,
        phase: random() * Math.PI * 2,
        speed: 0.12 + random() * 0.22
      }));
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      makeStars();
    };

    const draw = (time = 0) => {
      const seconds = reducedMotion ? 0 : time / 1000;
      const horizon = height * 0.57;
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const twinkle = reducedMotion ? 0.75 : 0.58 + Math.sin(seconds * star.speed + star.phase) * 0.34;
        const alpha = Math.max(0.08, star.alpha * twinkle);
        context.beginPath();
        context.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(174, 255, 239, ${alpha})`;
        context.shadowColor = "rgba(68, 234, 207, .8)";
        context.shadowBlur = star.size > 1 ? 7 : 3;
        context.fill();
      }
      context.shadowBlur = 0;

      const fog = context.createLinearGradient(0, horizon - height * 0.17, 0, horizon + height * 0.18);
      fog.addColorStop(0, "rgba(4, 36, 35, 0)");
      fog.addColorStop(0.48, "rgba(10, 111, 96, .18)");
      fog.addColorStop(0.56, "rgba(26, 220, 182, .13)");
      fog.addColorStop(1, "rgba(2, 18, 19, 0)");
      context.fillStyle = fog;
      context.fillRect(0, horizon - height * 0.17, width, height * 0.35);

      const vanishingX = width * 0.53;
      const bottom = height * 1.06;
      const columns = width < 640 ? 14 : 24;
      context.lineWidth = 0.8;
      for (let column = -columns; column <= columns; column += 1) {
        const bottomX = vanishingX + (column / columns) * width * 1.2;
        const line = context.createLinearGradient(0, horizon, 0, bottom);
        line.addColorStop(0, "rgba(28, 224, 190, 0)");
        line.addColorStop(0.3, "rgba(20, 174, 151, .18)");
        line.addColorStop(1, "rgba(18, 224, 185, .38)");
        context.beginPath();
        context.moveTo(vanishingX, horizon);
        context.lineTo(bottomX, bottom);
        context.strokeStyle = line;
        context.stroke();
      }

      const lineCount = width < 640 ? 17 : 22;
      const drift = (seconds * 0.025) % (1 / lineCount);
      for (let row = 0; row < lineCount; row += 1) {
        const progress = (row / lineCount + drift) % 1;
        const depth = progress ** 2.45;
        const y = horizon + depth * (bottom - horizon);
        const halfWidth = width * (0.055 + depth * 1.18);
        context.beginPath();
        context.moveTo(vanishingX - halfWidth, y);
        context.lineTo(vanishingX + halfWidth, y);
        context.strokeStyle = `rgba(24, 220, 184, ${0.05 + depth * 0.35})`;
        context.stroke();
      }

      if (!reducedMotion && visible) frame = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => { resize(); if (reducedMotion) draw(); });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    });

    resize();
    draw();
    resizeObserver.observe(host);
    visibilityObserver.observe(host);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return <div className="apiscan-cinematic-grid" ref={hostRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
