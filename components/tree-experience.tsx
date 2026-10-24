"use client";

/* eslint-disable react-hooks/immutability -- Three.js scene objects are intentionally animated inside useFrame. */

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Locale } from "@/lib/catalog";
import { trees } from "@/lib/catalog";

function TreeModel({ progress, color, rotationTarget, modelUrl }: { progress: number; color: string; rotationTarget: { current: number }; modelUrl: string }) {
  const stageRoot = useRef<THREE.Group>(null);
  const rotation = useRef(0);
  const { scene } = useGLTF(modelUrl);
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
        if (material.name === "Bark_Rough" || material.name === "Bark_Ridge") {
          material.color.set(material.name === "Bark_Rough" ? "#ffffff" : "#412010");
          material.roughness = 1;
          material.envMapIntensity = 0;
          if (material instanceof THREE.MeshPhysicalMaterial) {
            material.clearcoat = 0;
            material.specularIntensity = 0.06;
            material.needsUpdate = true;
          }
        }
        if (material.name === "Growth_Rings") material.roughness = 0.86;
        if (material.name === "Real_Olive_Wood_Photo") {
          material.color.set("#dfc19d");
          material.roughness = 0.34;
        }
        if (material.name === "Real_Turquoise_Epoxy_Photo") {
          material.color.set("#d6eeee");
          material.roughness = 0.1;
        }
        if (material.name === "Olive_Heartwood" || material.name === "Endgrain_Cut") {
          material.color.copy(selected).lerp(new THREE.Color("#ffffff"), 0.78);
          material.roughness = material.name === "Endgrain_Cut" ? 1 : 0.58;
          if (material.name === "Endgrain_Cut" && material instanceof THREE.MeshPhysicalMaterial) {
            material.envMapIntensity = 0;
            material.clearcoat = 0;
            material.specularIntensity = 0.06;
          }
          material.needsUpdate = true;
        }
      });
    });
  }, [color, model]);

  useFrame((state, delta) => {
    if (!stageRoot.current || !trunk || !crossSection || !slab) return;
    rotation.current = THREE.MathUtils.damp(rotation.current, rotationTarget.current, 12, delta);
    const mobile = state.size.width < 640;
    const tablet = state.size.width < 980;

    const cutReveal = THREE.MathUtils.smoothstep(progress, 0.12, 0.35);
    const trunkExit = mobile
      ? THREE.MathUtils.smoothstep(progress, 0.32, 0.5)
      : THREE.MathUtils.smoothstep(progress, 0.52, 0.68);
    const sliceExit = mobile
      ? THREE.MathUtils.smoothstep(progress, 0.7, 0.8)
      : THREE.MathUtils.smoothstep(progress, 0.72, 0.86);
    const productReveal = mobile
      ? THREE.MathUtils.smoothstep(progress, 0.76, 0.88)
      : THREE.MathUtils.smoothstep(progress, 0.69, 0.86);
    trunk.visible = trunkExit < 0.88;
    trunk.scale.setScalar(Math.max(0.001, (1 - trunkExit) * (mobile ? 0.64 : 1)));
    trunk.position.x = mobile
      ? -0.3 + trunkExit * 0.3
      : THREE.MathUtils.lerp(0.5, 1.55, cutReveal) + trunkExit * 0.8;
    trunk.position.y = THREE.MathUtils.lerp(0.05, 0.22, cutReveal) + trunkExit * 0.2;
    trunk.rotation.x = -0.04;
    trunk.rotation.y = THREE.MathUtils.lerp(0.7, 1.05, progress) + state.clock.elapsedTime * 0.035 + rotation.current;
    trunk.rotation.z = -0.09 + progress * 0.06;

    crossSection.visible = progress > 0.08 && sliceExit < 0.94;
    const sliceScale = cutReveal * (1 - sliceExit) * (mobile ? 0.86 : 1.08);
    crossSection.scale.setScalar(Math.max(0.001, sliceScale));
    crossSection.position.set(
      mobile
        ? THREE.MathUtils.lerp(-0.8, -0.1, trunkExit) - sliceExit * 0.15
        : THREE.MathUtils.lerp(-2.5, -1.35, cutReveal) + trunkExit * 0.2 - sliceExit * 0.65,
      THREE.MathUtils.lerp(-0.32, 0.04, cutReveal),
      0.62,
    );
    crossSection.rotation.set(0, Math.PI / 2 - 0.03 + rotation.current, -0.12 + progress * 0.32);

    slab.visible = productReveal > 0.04;
    slab.scale.setScalar(Math.max(0.001, productReveal * (mobile ? 0.82 : 0.76)));
    slab.position.set(THREE.MathUtils.lerp(mobile ? 0.15 : 1.45, -0.12, productReveal), -0.1, 0.15);
    slab.rotation.set(0.78 - productReveal * 0.12, 0.05 + rotation.current, -0.08);

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

export function TreeExperience({ locale, modelUrl }: { locale: Locale; modelUrl: string }) {
  const section = useRef<HTMLElement>(null);
  const rotationTarget = useRef(0);
  const pointer = useRef<{ id: number; startX: number; startY: number; lastX: number; dragging: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointer.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, dragging: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = pointer.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    const horizontal = event.clientX - gesture.startX;
    const vertical = event.clientY - gesture.startY;
    if (!gesture.dragging) {
      if (Math.abs(horizontal) < 6 || Math.abs(horizontal) <= Math.abs(vertical)) return;
      gesture.dragging = true;
      setDragging(true);
    }
    rotationTarget.current += (event.clientX - gesture.lastX) * 0.007;
    gesture.lastX = event.clientX;
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

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
  useEffect(() => {
    const target = section.current;
    if (!target) return;
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  const tree = trees[0];
  const stagesTr = ["Yaşayan gövde", "Kabuk ve öz", "Yıllık halkalar", "Doğal damar", "Plakadan tasarıma"];
  const stagesEn = ["Living trunk", "Bark and core", "Growth rings", "Natural grain", "Slab to design"];
  const stage = Math.min(4, Math.floor(progress * 5));
  return (
    <section ref={section} className="tree-journey" id="woods">
      <div className="tree-sticky">
        <div
          className={`tree-canvas${dragging ? " is-dragging" : ""}`}
          role="group"
          tabIndex={0}
          aria-label={locale === "tr" ? "3D modeli sağa sola sürükleyerek veya ok tuşlarıyla çevirin" : "Rotate the 3D model by dragging sideways or using the arrow keys"}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onLostPointerCapture={onPointerEnd}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            rotationTarget.current += event.key === "ArrowLeft" ? -0.2 : 0.2;
          }}
        >
          <Canvas camera={{ position: [0, 0, 7.2], fov: 42 }} dpr={[1, 1.65]} frameloop={visible ? "always" : "never"} shadows>
            <color attach="background" args={["#0b0b09"]} />
            <ambientLight intensity={0.34} />
            <directionalLight position={[5, 7, 5]} intensity={2.65} color="#ffd7a0" castShadow />
            <pointLight position={[-4, 1, 3]} intensity={1.4} color="#7f5227" />
            <Suspense fallback={null}>
              <TreeModel progress={progress} color={tree.tone} rotationTarget={rotationTarget} modelUrl={modelUrl} />
            </Suspense>
            <ContactShadows position={[0, -1.72, 0]} opacity={0.34} scale={8} blur={2.8} far={4} color="#000000" />
            <Environment preset="warehouse" environmentIntensity={0.38} />
          </Canvas>
        </div>
        <div className="tree-copy">
          <p className="eyebrow">{locale === "tr" ? "3D DAMAR ATLASI" : "3D GRAIN ATLAS"}</p>
          <p className="stage-index">0{stage + 1} / 05</p>
          <h3>{(locale === "tr" ? stagesTr : stagesEn)[stage]}</h3>
          <p>{locale === "tr" ? tree.traitTr : tree.traitEn}</p>
          <div className="tree-data">
            <span>{locale === "tr" ? "Karakter" : "Character"}<strong>{locale === "tr" ? tree.tr : tree.en}</strong></span>
            <span>{locale === "tr" ? "Tipik olgunluk" : "Typical maturity"}<strong>{tree.years} {locale === "tr" ? "yıl" : "years"}</strong></span>
          </div>
          <div className="journey-progress"><i style={{ width: `${Math.max(3, progress * 100)}%` }} /></div>
          <small>{locale === "tr" ? "Devam etmek için kaydırın · modeli sağa sola sürükleyin" : "Scroll to continue · drag sideways to rotate"}</small>
        </div>
      </div>
    </section>
  );
}
