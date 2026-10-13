"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
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
        if ("envMapIntensity" in material) material.envMapIntensity = 0.42;
        if ("metalness" in material && material.name !== "Blackened_Steel") material.metalness = 0;
        if (material.name === "Bark_Rough") {
          material.color.set("#2b160c");
          material.roughness = 0.96;
        }
        if (material.name === "Bark_Ridge") {
          material.color.set("#412010");
          material.roughness = 0.9;
        }
        if (material.name === "Growth_Rings") material.roughness = 0.86;
        if (material.name === "Olive_Heartwood" || material.name === "Sapwood_Gold") {
          material.color.copy(selected).lerp(new THREE.Color("#8f5d2f"), 0.22);
          material.roughness = 0.68;
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

    const mobile = state.size.width < 640;
    const tablet = state.size.width < 980;
    stageRoot.current.scale.setScalar(mobile ? 0.72 : tablet ? 0.88 : 1.08);
    stageRoot.current.position.y = (mobile ? 1.02 : tablet ? 0.45 : 0) + Math.sin(state.clock.elapsedTime * 0.42) * 0.02;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, (mobile ? 8.6 : 7.6) - progress * 0.45, 0.04);
  });

  return (
    <group ref={stageRoot}>
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
            <ambientLight intensity={0.34} />
            <directionalLight position={[5, 7, 5]} intensity={2.65} color="#ffd7a0" castShadow />
            <pointLight position={[-4, 1, 3]} intensity={1.4} color="#7f5227" />
            <Suspense fallback={null}>
              <TreeModel progress={progress} color={tree.tone} />
            </Suspense>
            <ContactShadows position={[0, -1.72, 0]} opacity={0.34} scale={8} blur={2.8} far={4} color="#000000" />
            <Environment preset="warehouse" environmentIntensity={0.38} />
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
