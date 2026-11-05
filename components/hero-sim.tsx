"use client";

import {
  createMobilitySim,
  type SimColors,
  type SimHandle,
} from "@/lib/mobility-sim";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

// Most travelers are neutral; a minority carry the site's emerald accent.
const LIGHT: SimColors = {
  palette: [
    { rgb: [161, 161, 170], weight: 6, alpha: 0.6 }, // zinc-400
    { rgb: [5, 150, 105], weight: 4, alpha: 1 }, // emerald-600
  ],
  street: "rgba(24, 24, 27, 0.07)",
  streetArt: "rgba(24, 24, 27, 0.12)",
  hub: "rgba(5, 150, 105, 0.28)",
  blend: "source-over",
};

const DARK: SimColors = {
  palette: [
    { rgb: [113, 113, 122], weight: 6, alpha: 0.75 }, // zinc-500
    { rgb: [52, 211, 153], weight: 4, alpha: 0.95 }, // emerald-400
  ],
  street: "rgba(244, 244, 245, 0.06)",
  streetArt: "rgba(244, 244, 245, 0.11)",
  hub: "rgba(52, 211, 153, 0.3)",
  blend: "lighter",
};

export default function HeroSim({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<SimHandle | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // next-themes sets the class before hydration, so this is already right.
    const dark = document.documentElement.classList.contains("dark");
    const sim = createMobilitySim(host, dark ? DARK : LIGHT);
    simRef.current = sim;
    return () => {
      sim.destroy();
      simRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!resolvedTheme) return;
    simRef.current?.setColors(resolvedTheme === "dark" ? DARK : LIGHT);
  }, [resolvedTheme]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      title="A live simulation of synthetic travelers on a synthetic street grid"
      className={`hero-sim ${className}`}
    />
  );
}
