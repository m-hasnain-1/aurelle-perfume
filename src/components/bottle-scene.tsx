"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import { CanvasTexture, ExtrudeGeometry, Group, Shape, SRGBColorSpace } from "three";

function Bottle({ tone, rotationOffset }: { tone: string; rotationOffset: number }) {
  const group = useRef<Group>(null);
  const bodyGeometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.55, -0.76);
    shape.lineTo(-0.55, 0.32);
    shape.quadraticCurveTo(-0.55, 0.46, -0.44, 0.55);
    shape.lineTo(-0.23, 0.74);
    shape.lineTo(0.23, 0.74);
    shape.lineTo(0.44, 0.55);
    shape.quadraticCurveTo(0.55, 0.46, 0.55, 0.32);
    shape.lineTo(0.55, -0.76);
    shape.quadraticCurveTo(0.55, -0.84, 0.47, -0.84);
    shape.lineTo(-0.47, -0.84);
    shape.quadraticCurveTo(-0.55, -0.84, -0.55, -0.76);
    return new ExtrudeGeometry(shape, {
      depth: 0.34,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      steps: 1,
    });
  }, []);
  const labelTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not create the bottle label.");
    context.fillStyle = "#e9ddc3";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.fillStyle = "#4a4132";
    context.font = "26px Arial";
    context.letterSpacing = "8px";
    context.fillText("A U R E L L E", 256, 91);
    context.fillStyle = "#a48c60";
    context.fillRect(165, 117, 182, 2);
    context.fillStyle = "#514632";
    context.font = "19px Georgia";
    context.letterSpacing = "5px";
    context.fillText("PARFUM", 256, 160);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, []);
  const liquidColors: Record<string, string> = {
    amber: "#b78b48", plum: "#75546a", sage: "#8d9c76", rose: "#b57a7b",
  };
  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y = rotationOffset + Math.sin(state.clock.elapsedTime * 0.12) * 0.06 + delta * 0.12;
  });
  return (
    <group ref={group} position={[0, -0.12, 0]}>
      <mesh position={[0, 0.94, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.19, 0.28, 32]} />
        <meshStandardMaterial color="#a99061" metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.145, 0.15, 0.38, 32]} />
        <meshStandardMaterial color="#d4c092" metalness={0.58} roughness={0.24} />
      </mesh>
      <mesh position={[0, -0.02, -0.17]} geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial color="#f0dfbd" roughness={0.18} metalness={0.04} transmission={0.82} thickness={0.32} ior={1.42} transparent opacity={0.72} />
      </mesh>
      <mesh position={[0, -0.29, 0]}>
        <boxGeometry args={[0.92, 0.94, 0.22]} />
        <meshStandardMaterial color={liquidColors[tone] || liquidColors.amber} roughness={0.2} metalness={0.08} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -0.03, 0.225]}>
        <planeGeometry args={[0.86, 0.47]} />
        <meshBasicMaterial map={labelTexture} toneMapped={false} />
      </mesh>
      <mesh position={[-0.48, 0.02, 0.225]}>
        <planeGeometry args={[0.025, 1.05]} />
        <meshBasicMaterial color="#fff4dd" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export function BottleScene({ tone }: { tone: string }) {
  const [rotationOffset, setRotationOffset] = useState(0);
  return (
    <div className="relative h-[350px] w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_50%,rgba(180,154,104,.2),transparent_58%),#1d1c19] md:h-[440px]" aria-label="Interactive AURELLE perfume bottle viewer">
      <Canvas shadows camera={{ position: [3.1, 2.35, 5], fov: 42 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#1d1c19"]} />
        <ambientLight intensity={0.8} />
        <spotLight position={[3, 5, 4]} intensity={70} angle={0.45} penumbra={0.8} castShadow />
        <pointLight position={[-3, 1, -2]} intensity={18} color="#c6a877" />
        <Suspense fallback={null}>
          <Bottle tone={tone} rotationOffset={rotationOffset} />
        </Suspense>
        <ContactShadows position={[0, -1.02, 0]} opacity={0.5} scale={4} blur={2.5} far={4} />
        <OrbitControls enablePan={false} minDistance={3.5} maxDistance={7} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
      <span className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-[9px] uppercase tracking-[.18em] text-[#a9a49a]">Drag to explore · Scroll to inspect</span>
      <div className="absolute right-4 top-4 flex gap-2">
        <button type="button" className="grid h-9 w-9 place-items-center border border-white/20 bg-[#171715]/70 text-sm hover:border-[#d1bd8c]" aria-label="Rotate bottle left" onClick={() => setRotationOffset((value) => value - Math.PI / 6)}>↶</button>
        <button type="button" className="grid h-9 w-9 place-items-center border border-white/20 bg-[#171715]/70 text-sm hover:border-[#d1bd8c]" aria-label="Rotate bottle right" onClick={() => setRotationOffset((value) => value + Math.PI / 6)}>↷</button>
        <button type="button" className="h-9 border border-white/20 bg-[#171715]/70 px-3 text-[9px] uppercase tracking-widest hover:border-[#d1bd8c]" onClick={() => setRotationOffset(0)}>Reset view</button>
      </div>
    </div>
  );
}
