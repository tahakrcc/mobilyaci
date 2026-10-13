"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/catalog";
import { trees } from "@/lib/catalog";

function TreeModel({ progress, color }: { progress: number; color: string }) {
  const stageRoot = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/wood-journey.glb");
  const { model, trunk, crossSection, slab } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = Array.isArray(child.material)
          ? child.material.map((material) => material.clone())
          : child.material.clone();
      }
    });
    return {
      model: cloned,
      trunk: cloned.getObjectByName("TrunkRoot") as THREE.Group,
      crossSection: cloned.getObjectByName("CrossSection") as THREE.Group,
      slab: cloned.getObjectByName("SlabAssembly") as THREE.Group,
    };
  }, [scene]);

  useEffect(() => {
    const selected = new THREE.Color(color);
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material.name === "Olive_Heartwood" || material.name === "Sapwood_Gold") {
          material.color.copy(selected).lerp(new THREE.Color("#c88b4c"), 0.28);
          material.needsUpdate = true;
        }
      });
    });
  }, [color, model]);

  useFrame((state) => {
    if (!stageRoot.current || !trunk || !crossSection || !slab) return;

    const cutReveal = THREE.MathUtils.smoothstep(progress, 0.12, 0.35);
    const productReveal = THREE.MathUtils.smoothstep(progress, 0.56, 0.78);
    const trunkScale = 1 - productReveal * 0.36;
    trunk.visible = progress < 0.79;
    trunk.scale.setScalar(trunkScale);
    trunk.position.x = THREE.MathUtils.lerp(0.5, 1.55, cutReveal);
    trunk.position.y = THREE.MathUtils.lerp(0.05, 0.22, cutReveal);
    trunk.rotation.x = -0.04;
    trunk.rotation.y = THREE.MathUtils.lerp(0.7, 1.05, progress) + state.clock.elapsedTime * 0.035;
    trunk.rotation.z = -0.09 + progress * 0.06;

    crossSection.visible = progress > 0.08 && progress < 0.79;
    const sliceScale = cutReveal * (1 - productReveal) * 1.08;
    crossSection.scale.setScalar(Math.max(0.001, sliceScale));
    crossSection.position.set(
      THREE.MathUtils.lerp(-2.5, -1.35, cutReveal),
      THREE.MathUtils.lerp(-0.32, 0.04, cutReveal),
      0.62,
    );
    crossSection.rotation.set(0, Math.PI / 2 - 0.03, -0.12 + progress * 0.32);

    slab.visible = progress > 0.53;
    slab.scale.setScalar(Math.max(0.001, productReveal * 0.76));
    slab.position.set(THREE.MathUtils.lerp(2.4, -0.12, productReveal), -0.1, 0.15);
    slab.rotation.set(0.78 - productReveal * 0.12, 0.05, -0.08);

    stageRoot.current.position.y = Math.sin(state.clock.elapsedTime * 0.42) * 0.035;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 7.6 - progress * 0.55, 0.04);
  });

  return (
    <group ref={stageRoot} scale={1.08}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/wood-journey.glb");

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
              <Suspense fallback={null}>
                <TreeModel progress={progress} color={tree.tone} />
              </Suspense>
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
