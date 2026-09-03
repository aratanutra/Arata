"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Object3D } from "three";
import { SkeletonUtils } from "three-stdlib";
import { asset } from "@/lib/asset";

const MODEL_PATH = "/three/aeternyx-carton.glb";

/** Longest-dimension target in scene units so the model reliably fills the frame. */
const TARGET_SIZE = 1.4;

function CartonModel() {
  const { scene } = useGLTF(asset(MODEL_PATH));

  // Clone per-instance so multiple viewers on the same page don't compete for
  // the single cached Object3D (each was mutating the shared scale/position).
  const cloned = useMemo(() => SkeletonUtils.clone(scene) as Object3D, [scene]);

  const transform = useMemo(() => {
    cloned.updateMatrixWorld(true);
    const box = new Box3().setFromObject(cloned);
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
  }, [cloned]);

  useMemo(() => {
    cloned.traverse((child) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyChild = child as any;
      if (anyChild.isMesh) {
        anyChild.castShadow = true;
        anyChild.receiveShadow = true;
        if (anyChild.material) anyChild.material.needsUpdate = true;
      }
    });
  }, [cloned]);

  return (
    <group rotation={[-0.05, -0.4, 0]}>
      <primitive object={cloned} position={transform.offset} scale={transform.scale} />
    </group>
  );
}

function Scene() {
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
        <CartonModel />
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

type Carton3DProps = {
  className?: string;
  showHint?: boolean;
};

export default function Carton3D({
  className = "relative aspect-[4/3] w-full overflow-hidden rounded-3xl md:aspect-[16/10]",
  showHint = true
}: Carton3DProps = {}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [1.5, 0.5, 2.5], fov: 42 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
      {showHint ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[10px] font-medium uppercase tracking-widest text-muted">
          Drag to rotate · Pinch or scroll to zoom
        </div>
      ) : null}
    </div>
  );
}

useGLTF.preload(asset(MODEL_PATH));
