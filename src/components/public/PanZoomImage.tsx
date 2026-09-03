"use client";

import { useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;

/**
 * Minimal pinch/wheel zoom + drag pan for a static image inside a fixed frame.
 * Uses PointerEvents for unified touch/mouse handling; no external dep.
 * Double-click / double-tap resets.
 */
export default function PanZoomImage({ src, alt, className }: Props) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStartRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }

  function boundOffset(sc: number, ox: number, oy: number) {
    const el = containerRef.current;
    if (!el) return { x: ox, y: oy };
    const w = el.clientWidth;
    const h = el.clientHeight;
    const maxX = ((sc - 1) * w) / 2;
    const maxY = ((sc - 1) * h) / 2;
    return { x: clamp(ox, -maxX, maxX), y: clamp(oy, -maxY, maxY) };
  }

  function reset() {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const next = clamp(scale * (1 - e.deltaY * 0.002), MIN_SCALE, MAX_SCALE);
    setScale(next);
    setOffset((o) => boundOffset(next, o.x, o.y));
  }

  function handlePointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsInteracting(true);
    if (pointersRef.current.size === 2) {
      const [a, b] = Array.from(pointersRef.current.values());
      pinchStartRef.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        scale
      };
      dragStartRef.current = null;
    } else if (pointersRef.current.size === 1) {
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        ox: offset.x,
        oy: offset.y
      };
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const [a, b] = Array.from(pointersRef.current.values());
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const next = clamp(
        pinchStartRef.current.scale * (d / pinchStartRef.current.distance),
        MIN_SCALE,
        MAX_SCALE
      );
      setScale(next);
      setOffset((o) => boundOffset(next, o.x, o.y));
    } else if (pointersRef.current.size === 1 && dragStartRef.current && scale > 1) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setOffset(boundOffset(scale, dragStartRef.current.ox + dx, dragStartRef.current.oy + dy));
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) {
      dragStartRef.current = null;
      setIsInteracting(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full select-none ${className ?? ""}`}
      style={{ touchAction: "none" }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={reset}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          transformOrigin: "center center",
          transition: isInteracting ? "none" : "transform 0.18s ease-out",
          cursor: scale > 1 ? "grab" : "zoom-in"
        }}
      />
    </div>
  );
}
