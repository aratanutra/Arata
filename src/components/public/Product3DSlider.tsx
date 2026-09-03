"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { asset } from "@/lib/asset";

type Slide = {
  key: string;
  path: string;
  label: string;
  /** Resting rotation applied to the model group (radians). */
  initialRotation: [number, number, number];
};

const SLIDES: Slide[] = [
  {
    key: "carton",
    path: "/three/aeternyx-carton.glb",
    label: "Carton",
    initialRotation: [-0.05, -0.4, 0]
  },
  {
    key: "blister",
    path: "/three/aeternyx-blister.glb",
    label: "Blister strip",
    // Start showing the back (add π on Y to the default facing).
    initialRotation: [-0.05, -0.4 + Math.PI, 0]
  }
];

function GLBModel({
  path,
  rotation
}: {
  path: string;
  rotation: [number, number, number];
}) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(asset(path));

  useEffect(() => {
    scene.traverse((child) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyChild = child as any;
      if (anyChild.isMesh) {
        anyChild.castShadow = true;
        anyChild.receiveShadow = true;
        if (anyChild.material) anyChild.material.needsUpdate = true;
      }
    });
  }, [scene]);

  return (
    <group ref={groupRef} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
}

function Scene({
  path,
  rotation,
  enableZoom
}: {
  path: string;
  rotation: [number, number, number];
  enableZoom: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 2, -4]} intensity={0.4} color="#f5d6a8" />
      <Suspense fallback={null}>
        <Bounds key={path} fit clip observe margin={1.15}>
          <Center>
            <GLBModel path={path} rotation={rotation} />
          </Center>
        </Bounds>
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={enableZoom}
        minDistance={1.2}
        maxDistance={6}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        rotateSpeed={0.7}
        makeDefault
      />
    </>
  );
}

function ViewerCanvas({
  path,
  rotation,
  enableZoom
}: {
  path: string;
  rotation: [number, number, number];
  enableZoom: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [1.8, 0.6, 2.6], fov: 40 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene path={path} rotation={rotation} enableZoom={enableZoom} />
    </Canvas>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Shared slide chrome (label + arrows + dots) so inline and modal look identical. */
function SlideChrome({
  index,
  onChange,
  darkMode
}: {
  index: number;
  onChange: (i: number) => void;
  darkMode?: boolean;
}) {
  const current = SLIDES[index];
  const chipCls = darkMode
    ? "border-cream/30 bg-canvas/15 text-cream"
    : "border-hairline/70 bg-canvas/85 text-ink";
  const arrowCls = darkMode
    ? "border-cream/30 bg-canvas/15 text-cream hover:bg-canvas/25"
    : "border-hairline/70 bg-canvas/85 text-ink hover:bg-canvas";
  const activeDot = darkMode ? "bg-cream" : "bg-gold-deep";
  const idleDot = darkMode ? "bg-cream/30 hover:bg-cream/60" : "bg-hairline hover:bg-gold/60";

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className={`pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm ${chipCls}`}
        >
          {current.label}
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => onChange((index - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous product view"
        className={`absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border p-2 shadow-sm backdrop-blur-sm transition-colors md:left-4 ${arrowCls}`}
      >
        <Arrow dir="left" />
      </button>
      <button
        type="button"
        onClick={() => onChange((index + 1) % SLIDES.length)}
        aria-label="Next product view"
        className={`absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border p-2 shadow-sm backdrop-blur-sm transition-colors md:right-4 ${arrowCls}`}
      >
        <Arrow dir="right" />
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onChange(i)}
              aria-label={`Show ${s.label}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? `w-6 ${activeDot}` : `w-1.5 ${idleDot}`
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

type Props = {
  className?: string;
  showHint?: boolean;
};

export default function Product3DSlider({
  className = "relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-cream md:aspect-[16/10]",
  showHint = true
}: Props = {}) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const current = SLIDES[index];

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  return (
    <>
      <div className={className}>
        <ViewerCanvas path={current.path} rotation={current.initialRotation} enableZoom={false} />
        <SlideChrome index={index} onChange={setIndex} />

        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Expand for full view"
          className="absolute right-3 top-3 z-10 rounded-full border border-hairline/70 bg-canvas/85 p-2 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-canvas md:right-4 md:top-4"
        >
          <ExpandIcon />
        </button>

        {showHint ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-[38px] text-center text-[10px] font-medium uppercase tracking-widest text-muted">
            Tap ⤢ to expand · Drag to rotate
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {expanded ? (
          <motion.div
            key="slider-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col bg-ink-deep/95 p-3 backdrop-blur-md md:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setExpanded(false);
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-cream/90 md:text-[11px]">
                Drag to rotate · Pinch or scroll to zoom · Read every panel
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close expanded view"
                className="rounded-full border border-cream/30 bg-canvas/10 p-2 text-cream transition-colors hover:bg-canvas/20"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="relative mt-3 flex-1 overflow-hidden rounded-2xl bg-cream">
              <ViewerCanvas path={current.path} rotation={current.initialRotation} enableZoom />
              <SlideChrome index={index} onChange={setIndex} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

SLIDES.forEach((s) => useGLTF.preload(asset(s.path)));
