"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { asset } from "@/lib/asset";

const MODEL_PATH = "/three/aeternyx-carton.glb";

function CartonModel() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(asset(MODEL_PATH));

  useEffect(() => {
    scene.traverse((child) => {
      // enable shadows on every mesh
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyChild = child as any;
      if (anyChild.isMesh) {
        anyChild.castShadow = true;
        anyChild.receiveShadow = true;
        if (anyChild.material) {
          anyChild.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} rotation={[-0.05, -0.4, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Scene() {
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
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        rotateSpeed={0.7}
        makeDefault
      />
    </>
  );
}

export default function Carton3D() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-cream md:aspect-[16/10]">
      <Canvas
        camera={{ position: [1.8, 0.6, 2.6], fov: 40 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[11px] font-medium uppercase tracking-widest text-muted">
        Drag to rotate
      </div>
    </div>
  );
}

useGLTF.preload(asset(MODEL_PATH));
