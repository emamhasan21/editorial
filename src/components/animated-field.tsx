"use client";

import { useEffect, useRef } from "react";

export function AnimatedField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let raf = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * ratio;
      canvas!.height = height * ratio;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      context!.clearRect(0, 0, width, height);
      const dark = document.documentElement.dataset.theme === "dark";
      const step = 28;
      context!.lineWidth = 1;
      context!.strokeStyle = dark
        ? "rgba(255,255,255,.055)"
        : "rgba(20,20,25,.07)";
      for (let x = -step; x < width + step; x += step) {
        context!.beginPath();
        for (let y = 0; y <= height; y += 8) {
          const wave = Math.sin(y * 0.018 + frame * 0.012 + x * 0.009) * 5;
          const px = x + wave * (y / Math.max(height, 1));
          if (y === 0) context!.moveTo(px, y);
          else context!.lineTo(px, y);
        }
        context!.stroke();
      }
      for (let y = 0; y < height + step; y += step) {
        context!.beginPath();
        context!.moveTo(0, y);
        context!.lineTo(width, y + Math.sin(frame * 0.01 + y) * 3);
        context!.stroke();
      }
      frame += 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const themeObserver = new MutationObserver(() => reduced && draw());
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden />;
}
