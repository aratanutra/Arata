"use client";

import { Suspense, useLayoutEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
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

/** Longest-dimension target size (scene units) so every GLB reads at the same visual weight. */
const TARGET_SIZE = 1.7;

function GLBModel({
  path,
  rotation
}: {
  path: string;
  rotation: [number, number, number];
}) {
  const { scene } = useGLTF(asset(path));

  const transform = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDim;
    return {
      scale,
      offset: [
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      ] as [number, number, number]
    };
  }, [scene]);

  useLayoutEffect(() => {
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
    <group rotation={rotation}>
      <primitive object={scene} position={transform.offset} scale={transform.scale} />
    </group>
  );
}

function Scene({
  path,
  rotation
}: {
  path: string;
  rotation: [number, number, number];
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 2, -4]} intensity={0.4} color="#f5d6a8" />
      <Suspense fallback={null}>
        <GLBModel path={path} rotation={rotation} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={1.4}
        maxDistance={4.5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={(4 * Math.PI) / 5}
        rotateSpeed={0.7}
        zoomSpeed={0.7}
        makeDefault
      />
    </>
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

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [1.4, 0.5, 2.2], fov: 42 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene path={current.path} rotation={current.initialRotation} />
      </Canvas>

      {/* Prev / next arrows */}
      <button
        type="button"
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous product view"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-hairline/70 bg-canvas/85 p-2 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-canvas md:left-4"
      >
        <Arrow dir="left" />
      </button>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        aria-label="Next product view"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-hairline/70 bg-canvas/85 p-2 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-canvas md:right-4"
      >
        <Arrow dir="right" />
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
            Drag to rotate · Pinch or scroll to zoom
          </span>
        ) : null}
      </div>
    </div>
  );
}

SLIDES.forEach((s) => useGLTF.preload(asset(s.path)));
