"use client";

import { useEffect, useRef } from "react";

type NodePoint = { x: number; y: number };

export default function QuantumNodesBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;

    const hero = host.closest<HTMLElement>(".webscan-hero") ?? host;
    const pointer = { x: -9999, y: -9999, inside: false };
    const nodes: NodePoint[] = [];
    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = true;

    const rebuild = () => {
      const spacing = width < 700 ? 34 : 36;
      nodes.length = 0;
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          nodes.push({ x, y });
        }
      }
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
      rebuild();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const cursorDistance = width < 700 ? 115 : 145;

      for (const node of nodes) {
        const cursorGap = pointer.inside ? Math.hypot(pointer.x - node.x, pointer.y - node.y) : Infinity;
        const active = Math.max(0, 1 - cursorGap / cursorDistance);
        if (active > 0) {
          context.strokeStyle = `rgba(222, 255, 0, ${active * 0.5})`;
          context.lineWidth = 0.8;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }

        context.save();
        context.shadowColor = "#eaff00";
        context.shadowBlur = active * 10;
        context.fillStyle = active > 0 ? `rgba(234, 255, 0, ${0.72 + active * 0.28})` : "rgba(151, 163, 174, 0.28)";
        context.beginPath();
        context.arc(node.x, node.y, 1.15 + active * 0.75, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

    };

    const loop = () => draw();

    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.inside = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    };
    const onPointerLeave = () => { pointer.inside = false; cancelAnimationFrame(frame); draw(); };

    const resizeObserver = new ResizeObserver(resize);
    const viewportObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) draw();
    }, { rootMargin: "100px 0px" });

    resize();
    draw();
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    resizeObserver.observe(host);
    viewportObserver.observe(host);

    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      resizeObserver.disconnect();
      viewportObserver.disconnect();
    };
  }, []);

  return <div className="webscan-quantum-nodes" ref={hostRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
