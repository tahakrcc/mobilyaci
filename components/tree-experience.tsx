"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/catalog";
import { trees } from "@/lib/catalog";

function TreeModel({ progress, color }: { progress: number; color: string }) {
  const group = useRef<THREE.Group>(null);
  const bark = useRef<THREE.MeshStandardMaterial>(null);
  const slab = useRef<THREE.Group>(null);
  const crossSection = useRef<THREE.Group>(null);
  const rings = useMemo(() => Array.from({ length: 13 }, (_, index) => 0.22 + index * 0.075), []);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, progress * 0.45 - 0.2, 0.06);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.PI / 2 + progress * 0.08, 0.06);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, progress > 0.74 ? -1.2 : 0, 0.05);
    if (bark.current) bark.current.opacity = THREE.MathUtils.lerp(1, 0.12, Math.min(1, progress * 2.4));
    if (slab.current) {
      const reveal = THREE.MathUtils.smoothstep(progress, 0.65, 0.95);
      slab.current.scale.setScalar(0.65 + reveal * 0.35);
      slab.current.position.x = 2.2 - reveal * 0.5;
      slab.current.rotation.y = -0.22 + reveal * 0.22;
    }
    if (crossSection.current) {
      const reveal = THREE.MathUtils.smoothstep(progress, 0.14, 0.38);
      const leave = 1 - THREE.MathUtils.smoothstep(progress, 0.72, 0.92);
      crossSection.current.scale.setScalar(Math.max(0.001, reveal * leave * 0.68));
      crossSection.current.rotation.z = progress * 0.45;
      crossSection.current.position.x = -2.05 + progress * 0.25;
    }
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 7.2 - progress * 1.2, 0.04);
  });

  return (
    <>
      <group ref={group}>
        <mesh castShadow>
          <cylinderGeometry args={[1.12, 1.28, 3.45, 64, 10]} />
          <meshStandardMaterial ref={bark} color="#3a2418" roughness={0.92} transparent />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.99, 1.08, 3.48, 64]} />
          <meshStandardMaterial color={color} roughness={0.55} metalness={0.03} />
        </mesh>
        <group position={[0, 1.76, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <circleGeometry args={[1.08, 96]} />
            <meshStandardMaterial color="#c79a62" roughness={0.7} />
          </mesh>
          {rings.map((radius, index) => (
            <mesh key={radius} position={[0, 0, 0.012 + index * 0.0004]}>
              <ringGeometry args={[radius, radius + 0.012 + (index % 3) * 0.005, 96]} />
              <meshBasicMaterial color={index % 3 === 0 ? "#5f3823" : "#8d603a"} transparent opacity={0.58} />
            </mesh>
          ))}
          <mesh position={[0.16, -0.18, 0.03]}>
            <circleGeometry args={[0.11, 48]} />
            <meshBasicMaterial color="#412519" />
          </mesh>
        </group>
      </group>
      <group ref={crossSection} position={[-2.05, 0, 1.1]} scale={0.001}>
        <mesh>
          <circleGeometry args={[1.32, 96]} />
          <meshStandardMaterial color="#c99c63" roughness={0.78} />
        </mesh>
        {rings.map((radius, index) => (
          <mesh key={`front-${radius}`} position={[0, 0, 0.014 + index * 0.0005]}>
            <ringGeometry args={[radius, radius + 0.018 + (index % 3) * 0.004, 96]} />
            <meshBasicMaterial color={index % 2 ? "#7d4f2f" : "#5c351f"} transparent opacity={0.78} />
          </mesh>
        ))}
        <mesh position={[0.18, -0.2, 0.035]}>
          <circleGeometry args={[0.13, 48]} />
          <meshBasicMaterial color="#3d2115" />
        </mesh>
      </group>
      <group ref={slab} position={[2.2, -0.3, 0]} rotation={[0, -0.22, -0.08]}>
        <mesh castShadow>
          <boxGeometry args={[3.3, 0.22, 1.55]} />
          <meshStandardMaterial color={color} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[1.38, 0.045, 1.58]} />
          <meshPhysicalMaterial color="#0c5e68" transmission={0.45} transparent opacity={0.83} roughness={0.12} metalness={0.08} />
        </mesh>
      </group>
    </>
  );
}

export function TreeExperience({ locale }: { locale: Locale }) {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [treeId, setTreeId] = useState("olive");
  useEffect(() => {
    const update = () => {
      if (!section.current) return;
      const rect = section.current.getBoundingClientRect();
      const travel = section.current.offsetHeight - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, -rect.top / Math.max(1, travel))));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const tree = trees.find((item) => item.id === treeId) ?? trees[0];
  const stagesTr = ["Yaşayan gövde", "Kabuk ve öz", "Yıllık halkalar", "Damar seçimi", "Plakadan tasarıma"];
  const stagesEn = ["Living trunk", "Bark and core", "Growth rings", "Grain selection", "Slab to design"];
  const stage = Math.min(4, Math.floor(progress * 5));
  return (
    <section ref={section} className="tree-journey" id="woods">
      <div className="tree-sticky">
        <div className="tree-canvas" aria-label={locale === "tr" ? "Etkileşimli ağaç kesiti" : "Interactive tree cross-section"}>
          <Canvas camera={{ position: [0, 0, 7.2], fov: 42 }} dpr={[1, 1.65]} shadows>
            <color attach="background" args={["#0b0b09"]} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 6, 4]} intensity={4.5} color="#ffd69c" castShadow />
            <pointLight position={[-4, -2, 3]} intensity={4} color="#487b67" />
            <Float speed={0.7} rotationIntensity={0.08} floatIntensity={0.18}>
              <TreeModel progress={progress} color={tree.tone} />
            </Float>
            <Sparkles count={45} scale={8} size={1.2} speed={0.18} opacity={0.35} color="#d4b276" />
            <Environment preset="warehouse" />
          </Canvas>
        </div>
        <div className="tree-copy">
          <p className="eyebrow">{locale === "tr" ? "3D DAMAR ATLASI" : "3D GRAIN ATLAS"}</p>
          <div className="tree-switcher">
            {trees.map((item) => <button key={item.id} onClick={() => setTreeId(item.id)} className={item.id === tree.id ? "active" : ""}>{locale === "tr" ? item.tr : item.en}</button>)}
          </div>
          <p className="stage-index">0{stage + 1} / 05</p>
          <h3>{(locale === "tr" ? stagesTr : stagesEn)[stage]}</h3>
          <p>{locale === "tr" ? tree.traitTr : tree.traitEn}</p>
          <div className="tree-data">
            <span>{locale === "tr" ? "Karakter" : "Character"}<strong>{locale === "tr" ? tree.tr : tree.en}</strong></span>
            <span>{locale === "tr" ? "Tipik olgunluk" : "Typical maturity"}<strong>{tree.years} {locale === "tr" ? "yıl" : "years"}</strong></span>
          </div>
          <div className="journey-progress"><i style={{ width: `${Math.max(3, progress * 100)}%` }} /></div>
          <small>{locale === "tr" ? "Devam etmek için kaydırın" : "Scroll to continue"}</small>
        </div>
      </div>
    </section>
  );
}
