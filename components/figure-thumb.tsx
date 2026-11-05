"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type RevealState = "idle" | "armed" | "shown";

/**
 * Paper figure in a white card. Below the fold it fades in and comes into
 * focus the first time it scrolls into view (skipped under prefers-reduced-motion);
 * clicking it opens the full figure in a dialog.
 */
export default function FigureThumb({
  src,
  caption,
  sizes,
  className = "block",
}: {
  src: string;
  caption: string;
  sizes: string;
  className?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reveal, setReveal] = useState<RevealState>("idle");

  useEffect(() => {
    const el = buttonRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Figures already on screen at load stay put; only later ones animate.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setReveal("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReveal("shown");
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={open}
        aria-label={`Enlarge figure: ${caption}`}
        className={`${className} group w-full cursor-zoom-in self-start rounded-lg border border-zinc-200 bg-white p-1.5 text-left transition-colors hover:border-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-zinc-800 dark:hover:border-emerald-700/70`}
      >
        <span className="fig-reveal block overflow-hidden rounded" data-state={reveal}>
          <Image
            src={src}
            alt=""
            width={960}
            height={480}
            sizes={sizes}
            className="aspect-[2/1] h-auto w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] dark:brightness-[0.9]"
          />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={caption}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="fig-dialog w-[min(64rem,calc(100vw-2rem))] max-w-none rounded-xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-2xl backdrop:bg-zinc-950/70 backdrop:backdrop-blur-[2px] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <figure className="p-4 sm:p-6">
          <div className="rounded-lg bg-white p-2 sm:p-4">
            <Image
              src={src}
              alt={`Figure from ${caption}`}
              width={960}
              height={480}
              sizes="(min-width: 1024px) 960px, 100vw"
              className="h-auto w-full object-contain"
            />
          </div>
          <figcaption className="mt-4 flex items-start justify-between gap-6">
            <span className="text-pretty text-sm font-medium leading-snug">
              {caption}
            </span>
            <button
              type="button"
              onClick={close}
              className="shrink-0 rounded-md px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              Close
            </button>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}
