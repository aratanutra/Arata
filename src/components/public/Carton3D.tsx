"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { asset } from "@/lib/asset";

const MODEL_PATH = "/three/aeternyx-carton.glb";

function CartonModel() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(asset(MODEL_PATH));

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
    <group ref={groupRef} rotation={[-0.05, -0.4, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Scene({ enableZoom }: { enableZoom: boolean }) {
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
        <Bounds fit clip observe margin={1.15}>
          <Center>
            <CartonModel />
          </Center>
        </Bounds>
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={enableZoom}
        minDistance={1.2}
        maxDistance={5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        rotateSpeed={0.7}
        makeDefault
      />
    </>
  );
}

function ViewerCanvas({ enableZoom }: { enableZoom: boolean }) {
  return (
    <Canvas
      camera={{ position: [1.8, 0.6, 2.6], fov: 40 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene enableZoom={enableZoom} />
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

type Carton3DProps = {
  className?: string;
  showHint?: boolean;
};

export default function Carton3D({
  className = "relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-cream md:aspect-[16/10]",
  showHint = true
}: Carton3DProps = {}) {
  const [expanded, setExpanded] = useState(false);

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
        <ViewerCanvas enableZoom={false} />

        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Expand for full view"
          className="absolute right-3 top-3 z-10 rounded-full border border-hairline/70 bg-canvas/85 p-2 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-canvas md:right-4 md:top-4"
        >
          <ExpandIcon />
        </button>

        {showHint ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[10px] font-medium uppercase tracking-widest text-muted">
            Tap ⤢ to expand · Drag to rotate
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {expanded ? (
          <motion.div
            key="carton-modal"
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
                Drag to rotate · Pinch or scroll to zoom
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
              <ViewerCanvas enableZoom />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

useGLTF.preload(asset(MODEL_PATH));
