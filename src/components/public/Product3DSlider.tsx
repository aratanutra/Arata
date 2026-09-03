"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { asset } from "@/lib/asset";

type Slide = { key: string; path: string; label: string };

const SLIDES: Slide[] = [
  { key: "carton", path: "/three/aeternyx-carton.glb", label: "Carton" },
  { key: "blister", path: "/three/aeternyx-blister.glb", label: "Blister strip" }
];

/**
 * Renders a single GLB by URL, centred + auto-fit, with a gentle Y-rotate.
 * useGLTF caches by URL, so re-mounting with a different path swaps
 * instantly after the first load — no download re-cost.
 */
function GLBModel({ path }: { path: string }) {
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

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.32;
  });

  return (
    <group ref={groupRef} rotation={[-0.05, -0.4, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/** Bounds re-observes on model change via its `key`, so each slide fits correctly. */
function Scene({ path }: { path: string }) {
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
            <GLBModel path={path} />
          </Center>
        </Bounds>
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        rotateSpeed={0.7}
        makeDefault
      />
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
  const current = SLIDES[index];

  function go(next: number) {
    const wrapped = (next + SLIDES.length) % SLIDES.length;
    setIndex(wrapped);
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [1.8, 0.6, 2.6], fov: 40 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene path={current.path} />
      </Canvas>

      {/* Slide label + hint */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-hairline/70 bg-canvas/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink backdrop-blur-sm"
        >
          {current.label}
        </motion.div>
      </AnimatePresence>

      {/* Prev / next arrows */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous product view"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-hairline/70 bg-canvas/85 p-2 text-ink shadow-sm transition-colors hover:bg-canvas md:left-4"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M15 5l-7 7 7 7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next product view"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-hairline/70 bg-canvas/85 p-2 text-ink shadow-sm transition-colors hover:bg-canvas md:right-4"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dot indicator + optional hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-2">
        <div className="pointer-events-auto flex items-center gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.label}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-gold-deep" : "w-1.5 bg-hairline hover:bg-gold/60"
              }`}
            />
          ))}
        </div>
        {showHint ? (
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
            Drag to rotate
          </span>
        ) : null}
      </div>
    </div>
  );
}

SLIDES.forEach((s) => useGLTF.preload(asset(s.path)));
