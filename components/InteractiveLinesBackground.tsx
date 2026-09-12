"use client";

import { useEffect, useRef } from "react";

export default function InteractiveLinesBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;
    const interactionTarget = host.closest<HTMLElement>(".webscan-hero") ?? host;

    const pointer = { x: 0.68, y: 0.42, targetX: 0.68, targetY: 0.42 };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let frame = 0;
    let lastFrame = 0;
    let visible = true;

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
    };

    const draw = () => {
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;
      context.clearRect(0, 0, width, height);

      const lineCount = width < 700 ? 16 : 26;
      const startX = width * 1.02;
      const startY = -height * 0.18;
      const bendX = width * (0.42 + pointer.x * 0.14);
      const bendY = height * (0.28 + pointer.y * 0.38);

      context.lineWidth = 1;
      for (let index = 0; index < lineCount; index += 1) {
        const progress = index / Math.max(1, lineCount - 1);
        const endX = -width * 0.1;
        const endY = height * (0.22 + progress * 1.02);
        context.beginPath();
        context.moveTo(startX, startY + progress * height * 0.12);
        context.bezierCurveTo(
          width * (0.88 - progress * 0.1),
          bendY + progress * height * 0.12,
          bendX - progress * width * 0.16,
          endY - height * 0.12,
          endX,
          endY
        );
        context.strokeStyle = `rgba(111, 211, 236, ${0.05 + (1 - progress) * 0.13})`;
        context.stroke();
      }

      if (!reduceMotion && visible) frame = requestAnimationFrame(loop);
    };

    const loop = (time: number) => {
      if (time - lastFrame < 33) {
        frame = requestAnimationFrame(loop);
        return;
      }
      lastFrame = time;
      draw();
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointer.targetX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      pointer.targetY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw();
    });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === "visible";
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(loop);
    });
    const onVisibilityChange = () => {
      visible = document.visibilityState === "visible" && host.getBoundingClientRect().bottom > 0;
      cancelAnimationFrame(frame);
      if (visible && !reduceMotion) frame = requestAnimationFrame(loop);
    };

    resize();
    draw();
    interactionTarget.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    resizeObserver.observe(host);
    visibilityObserver.observe(host);

    return () => {
      cancelAnimationFrame(frame);
      interactionTarget.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return (
    <div className="webscan-interactive-lines" ref={hostRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
