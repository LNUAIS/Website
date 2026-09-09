"use client";

import { useEffect, useRef } from "react";

// Animated version of the logo: a tapered ribbon swept along a lemniscate,
// shaded head-to-tail so it reads as an ouroboros. Slider values are baked in.
const SPEED = 1.49;
const HALF_WIDTH = 0.13 * 0.57;
const TAPER = 0.8;
const SQUISH = 0.23;
const HUE = 49;
const HUE_TRAVEL = 5;
const SATURATION = 95;
const SHADING = 1;
const BULGE = 1;
const SEGMENTS = 640;
const ASPECT = 0.46;
const ROTATION = (-19 * Math.PI) / 180;
const MAX_DPR = 2;

const TAU = Math.PI * 2;
const CR = Math.cos(ROTATION);
const SR = Math.sin(ROTATION);

function start(host: HTMLElement) {
  const cv = document.createElement("canvas");
  cv.setAttribute("role", "img");
  cv.setAttribute("aria-label", "LNU AI Society");
  cv.style.display = "block";
  cv.style.width = "100%";
  host.appendChild(cv);
  const context2d = cv.getContext("2d");
  if (!context2d) return () => cv.remove();
  const ctx: CanvasRenderingContext2D = context2d;

  const N = SEGMENTS;
  const px = new Float32Array(N);
  const py = new Float32Array(N);
  const nx = new Float32Array(N);
  const ny = new Float32Array(N);
  const shp = new Float32Array(N);
  const out = new Float32Array(N * 2);
  const inn = new Float32Array(N * 2);
  const bri = new Float32Array(N);
  const phs = new Float32Array(N);

  let W = 0;
  let H = 0;
  let DPR = 1;
  let S = 1;
  let OX = 0;
  let OY = 0;
  let tau = 0;
  let last = 0;
  let raf = 0;
  let visible = true;

  for (let i = 0; i < N; i++) {
    const t = (i * TAU) / N;
    px[i] = Math.cos(t);
    py[i] = SQUISH * Math.sin(t) * Math.cos(t);
    const dx = -Math.sin(t);
    const dy = SQUISH * Math.cos(2 * t);
    const L = Math.hypot(dx, dy) || 1e-6;
    nx[i] = -dy / L;
    ny[i] = dx / L;
    shp[i] = Math.abs(Math.cos(t)) ** TAPER;
  }

  // Scale and centre the swept ribbon's bounding box inside the canvas.
  function fit() {
    let x0 = 1e9;
    let x1 = -1e9;
    let y0 = 1e9;
    let y1 = -1e9;
    for (let i = 0; i < N; i++) {
      const h = HALF_WIDTH * shp[i];
      for (let k = -1; k < 2; k += 2) {
        const ax = px[i] + nx[i] * h * k;
        const ay = py[i] + ny[i] * h * k;
        const rx = ax * CR - ay * SR;
        const ry = ax * SR + ay * CR;
        if (rx < x0) x0 = rx;
        if (rx > x1) x1 = rx;
        if (ry < y0) y0 = ry;
        if (ry > y1) y1 = ry;
      }
    }
    S = Math.min((W * 0.95) / (x1 - x0), (H * 0.95) / (y1 - y0));
    OX = W / 2 - ((x0 + x1) / 2) * S;
    OY = H / 2 - ((y0 + y1) / 2) * S;
  }

  function resize() {
    W = Math.max(200, host.clientWidth || 640);
    H = Math.round(W * ASPECT);
    DPR = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    cv.width = Math.round(W * DPR);
    cv.height = Math.round(H * DPR);
    cv.style.height = `${H}px`;
    fit();
  }

  const body = (u: number) =>
    1 - BULGE + BULGE * Math.sin(Math.PI * u) ** 0.55 * (1 - 0.5 * u);

  function render(now: number, speed: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    tau = (tau + dt * speed * 0.12) % 1;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < N; i++) {
      let u = (i / N - tau) % 1;
      if (u < 0) u += 1;
      const h = HALF_WIDTH * shp[i] * body(u);
      bri[i] = 1 - SHADING * (1 - (1 - u) ** 1.4);
      phs[i] = HUE + HUE_TRAVEL * u;
      const ox = px[i] + nx[i] * h;
      const oy = py[i] + ny[i] * h;
      const ix = px[i] - nx[i] * h;
      const iy = py[i] - ny[i] * h;
      out[i * 2] = OX + (ox * CR - oy * SR) * S;
      out[i * 2 + 1] = OY + (ox * SR + oy * CR) * S;
      inn[i * 2] = OX + (ix * CR - iy * SR) * S;
      inn[i * 2 + 1] = OY + (ix * SR + iy * CR) * S;
    }

    // Wrap the last quad back onto sample 0 — stopping at N-1 leaves the ring
    // open, and that missing sliver reads as a tear once the mark is scaled up.
    for (let m = 0; m < N; m++) {
      const j = (m + 1) % N;
      const b = (bri[m] + bri[j]) * 0.5;
      const hh = ((((phs[m] + phs[j]) * 0.5) % 360) + 360) % 360;
      const c = `hsl(${hh.toFixed(1)},${SATURATION}%,${(8 + 46 * b).toFixed(1)}%)`;
      ctx.beginPath();
      ctx.moveTo(out[m * 2], out[m * 2 + 1]);
      ctx.lineTo(out[j * 2], out[j * 2 + 1]);
      ctx.lineTo(inn[j * 2], inn[j * 2 + 1]);
      ctx.lineTo(inn[m * 2], inn[m * 2 + 1]);
      ctx.closePath();
      ctx.fillStyle = c;
      ctx.strokeStyle = c;
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    }
  }

  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    if (!visible) {
      last = now;
      return;
    }
    render(now, SPEED);
  }

  resize();

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
  });
  io.observe(cv);

  last = performance.now();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    render(last, 0);
  } else {
    raf = requestAnimationFrame(loop);
  }

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    cv.remove();
  };
}

export function InfinityMark({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => (host.current ? start(host.current) : undefined), []);
  return <div ref={host} className={className} />;
}
