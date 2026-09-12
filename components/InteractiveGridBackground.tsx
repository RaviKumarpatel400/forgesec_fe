"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

export default function InteractiveGridBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;

    const hero = host.closest<HTMLElement>(".webscan-hero") ?? host;
    const pointer = { x: 0.68, y: 0.48, tx: 0.68, ty: 0.48, active: 0, targetActive: 0 };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = true;
    let lastFrame = 0;

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

    const deform = (point: Point) => {
      const mouseX = pointer.x * width;
      const mouseY = pointer.y * height;
      const dx = point.x - mouseX;
      const dy = point.y - mouseY;
      const radius = Math.min(width, height) * 0.34;
      const distance = Math.hypot(dx, dy);
      const influence = Math.max(0, 1 - distance / radius) ** 2 * pointer.active;
      const safeDistance = Math.max(distance, 1);
      return {
        x: point.x + (dx / safeDistance) * influence * 34,
        y: point.y + (dy / safeDistance) * influence * 25 - influence * 18
      };
    };

    const gridPoint = (column: number, row: number, columns: number, rows: number) => {
      const rowProgress = row / rows;
      const depth = rowProgress ** 1.75;
      const horizonY = height * 0.12;
      const y = horizonY + depth * height * 1.05;
      const spread = width * (0.1 + depth * 1.08);
      const xProgress = column / columns - 0.5;
      const tilt = (pointer.x - 0.5) * pointer.active * 70 * (1 - rowProgress);
      return deform({ x: width * 0.5 + xProgress * spread + tilt, y });
    };

    const draw = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.active += (pointer.targetActive - pointer.active) * 0.08;
      context.clearRect(0, 0, width, height);

      const columns = width < 700 ? 14 : 22;
      const rows = width < 700 ? 12 : 16;
      context.lineWidth = 1;

      for (let column = 0; column <= columns; column += 1) {
        context.beginPath();
        for (let row = 0; row <= rows; row += 1) {
          const point = gridPoint(column, row, columns, rows);
          if (row === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.strokeStyle = "rgba(72, 137, 230, 0.22)";
        context.stroke();
      }

      for (let row = 0; row <= rows; row += 1) {
        context.beginPath();
        for (let column = 0; column <= columns; column += 1) {
          const point = gridPoint(column, row, columns, rows);
          if (column === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.strokeStyle = `rgba(93, 186, 239, ${0.07 + (row / rows) * 0.2})`;
        context.stroke();
      }

      for (let row = 2; row <= rows; row += 2) {
        for (let column = 0; column <= columns; column += 2) {
          const point = gridPoint(column, row, columns, rows);
          context.beginPath();
          context.arc(point.x, point.y, 1.15, 0, Math.PI * 2);
          context.fillStyle = "rgba(118, 218, 240, 0.52)";
          context.fill();
        }
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
      pointer.tx = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      pointer.ty = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      pointer.targetActive = 1;
    };
    const onPointerLeave = () => { pointer.targetActive = 0; };

    const resizeObserver = new ResizeObserver(() => { resize(); if (reduceMotion) draw(); });
    const viewportObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(loop);
    });

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

  return <div className="webscan-interactive-grid" ref={hostRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
