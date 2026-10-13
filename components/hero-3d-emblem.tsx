"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import type { Locale } from "@/lib/catalog";

function EmblemModel() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.getElapsedTime();
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.22 + Math.sin(time * 0.45) * 0.06, 0.045);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, time * 0.18 + state.pointer.x * 0.42, 0.04);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, state.pointer.x * -0.11, 0.04);
  });

  return (
    <Float speed={1.15} rotationIntensity={0.08} floatIntensity={0.22}>
      <group ref={group}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.06, 0.045, 24, 128]} />
          <meshPhysicalMaterial color="#f2d37b" metalness={0.92} roughness={0.16} clearcoat={1} emissive="#6b4610" emissiveIntensity={0.16} />
        </mesh>
        <mesh rotation={[0.48, 0.2, Math.PI / 2]}>
          <torusGeometry args={[0.91, 0.027, 20, 120]} />
          <meshPhysicalMaterial color="#bb8732" metalness={0.88} roughness={0.2} clearcoat={1} />
        </mesh>
        <mesh rotation={[-0.38, 0.62, 0.2]}>
          <torusKnotGeometry args={[0.72, 0.026, 144, 18, 2, 3]} />
          <meshPhysicalMaterial color="#d9aa51" metalness={0.82} roughness={0.24} clearcoat={0.9} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.55, 4]} />
          <meshPhysicalMaterial color="#5d3619" roughness={0.3} metalness={0.12} clearcoat={1} clearcoatRoughness={0.18} />
        </mesh>
        <mesh scale={0.78}>
          <icosahedronGeometry args={[0.55, 2]} />
          <meshPhysicalMaterial color="#c6903d" wireframe transparent opacity={0.34} />
        </mesh>
      </group>
    </Float>
  );
}

export function Hero3DEmblem({ locale }: { locale: Locale }) {
  const label = locale === "tr" ? "Döndürmek için hareket ettirin" : "Move to rotate";
  return (
    <div className="hero-3d-emblem" aria-label={locale === "tr" ? "Etkileşimli üç boyutlu Wooden Universe simgesi" : "Interactive Wooden Universe 3D emblem"}>
      <div className="hero-3d-canvas">
        <Canvas camera={{ position: [0, 0, 4.1], fov: 38 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[3, 4, 5]} intensity={4.8} color="#ffe3a0" />
          <pointLight position={[-3, -2, 3]} intensity={3.2} color="#9a611b" />
          <EmblemModel />
          <Environment preset="studio" />
        </Canvas>
      </div>
      <span className="hero-3d-index">WU / 360°</span>
      <span className="hero-3d-hint">{label}</span>
    </div>
  );
}
