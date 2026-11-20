"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BottleArt } from "./bottle-art";

const BottleScene = dynamic(() => import("./bottle-scene").then((module) => module.BottleScene), {
  ssr: false,
  loading: () => <div className="grid h-[440px] place-items-center bg-[#1d1c19] text-xs uppercase tracking-[.18em] text-[#a9a49a]">Preparing your view…</div>,
});

export function BottleViewer({ tone }: { tone: string }) {
  const [canRender3d, setCanRender3d] = useState(false);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    let canUseWebGL = false;
    try {
      canUseWebGL = Boolean(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
      );
    } catch {
      canUseWebGL = false;
    }
    setCanRender3d(canUseWebGL && !reducedMotion);
  }, []);
  return canRender3d
    ? <BottleScene tone={tone} />
    : <BottleArt tone={tone} className="!h-full !min-h-[380px]" />;
}
