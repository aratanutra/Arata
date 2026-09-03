"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { asset } from "@/lib/asset";
import PanZoomImage from "./PanZoomImage";

type ModelSlide = {
  kind: "model";
  key: string;
  label: string;
  hint: string;
  path: string;
  initialRotation: [number, number, number];
};

type ImageSlide = {
  kind: "image";
  key: string;
  label: string;
  hint: string;
  src: string;
  alt: string;
};

type Slide = ModelSlide | ImageSlide;

const SLIDES: Slide[] = [
  {
    kind: "model",
    key: "carton",
    label: "Carton",
    hint: "Drag to rotate · Pinch or scroll to zoom",
    path: "/three/aeternyx-carton.glb",
    initialRotation: [-0.05, -0.4, 0]
  },
  {
    kind: "image",
    key: "label",
    label: "Blister label",
    hint: "Pinch or scroll to zoom · Drag to pan · Double-tap to reset",
    src: "/product/aeternyx-back-panel.jpg",
    alt: "AETERNYX blister label — composition, nutrition, storage, FSSAI"
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    const stop = () => setAutoRotate(false);
    c.addEventListener("start", stop);
    return () => c.removeEventListener("start", stop);
  }, []);

  // Reset auto-rotate when the model changes so a new slide spins.
  useEffect(() => {
    setAutoRotate(true);
  }, [path]);

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
        ref={controlsRef}
        enablePan={false}
        enableZoom
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
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
  className = "relative aspect-[4/3] w-full overflow-hidden rounded-3xl md:aspect-[16/10]",
  showHint = true
}: Props = {}) {
  const [index, setIndex] = useState(0);
  const current = SLIDES[index];

  return (
    <div className={className}>
      {current.kind === "model" ? (
        <Canvas
          camera={{ position: [1.4, 0.5, 2.2], fov: 42 }}
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene path={current.path} rotation={current.initialRotation} />
        </Canvas>
      ) : (
        <PanZoomImage src={asset(current.src)} alt={current.alt} />
      )}

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

      {/* Dot indicator + hint */}
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
            {current.hint}
          </span>
        ) : null}
      </div>
    </div>
  );
}

SLIDES.forEach((s) => {
  if (s.kind === "model") useGLTF.preload(asset(s.path));
});
