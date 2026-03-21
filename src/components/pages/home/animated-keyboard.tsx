"use client";

import { useEffect, useRef } from "react";

export default function AnimatedKeyboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const currentFrameRef = useRef(-1);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const video = document.createElement("video");
    video.src = "/videos/keyboard.mp4";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    let disposed = false;
    let rafId: number | null = null;

    async function extractFrames() {
      await new Promise<void>((resolve) => {
        if (video.readyState >= 2) return resolve();
        video.addEventListener("loadeddata", () => resolve(), { once: true });
        video.load();
      });

      if (disposed) return;

      canvas!.width = video.videoWidth;
      canvas!.height = video.videoHeight;

      const START_TIME = 1.7; // in seconds
      const MAX_FRAMES = 60;
      const effectiveDuration = video.duration - START_TIME;
      const fps = Math.min(30, MAX_FRAMES / effectiveDuration);
      const totalFrames = Math.ceil(effectiveDuration * fps);
      const frames: ImageBitmap[] = [];

      await new Promise<void>((r) => {
        video.addEventListener("seeked", () => r(), { once: true });
        video.currentTime = START_TIME;
      });
      if (disposed) return;

      const firstFrame = await createImageBitmap(video);
      frames.push(firstFrame);
      framesRef.current = frames;
      currentFrameRef.current = -1;
      drawFrame();

      for (let i = 1; i < totalFrames && !disposed; i++) {
        video.currentTime = START_TIME + i / fps;
        await new Promise<void>((r) => {
          video.addEventListener("seeked", () => r(), { once: true });
        });
        frames.push(await createImageBitmap(video));
        framesRef.current = frames;
      }

      if (disposed) {
        frames.forEach((f) => f.close());
        return;
      }

      drawFrame();
    }

    function drawFrame() {
      const frames = framesRef.current;
      if (!frames.length || !container || !canvas || !ctx) return;

      const rect = container.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const scrollStart = containerTop - window.innerHeight;
      const scrollEnd = containerTop + rect.height;
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - scrollStart) / (scrollEnd - scrollStart))
      );

      const frameIndex = Math.min(
        frames.length - 1,
        Math.floor(progress * frames.length)
      );

      if (frameIndex === currentFrameRef.current) return;
      currentFrameRef.current = frameIndex;

      const frame = frames[frameIndex];
      if (frame) {
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      }
    }

    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        drawFrame();
      });
    }

    extractFrames();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      framesRef.current.forEach((f) => f.close());
      framesRef.current = [];
    };
  }, []);

  return (
    <section ref={containerRef} className="bg-background relative w-full py-16 lg:py-24 h-[220dvh] -mb-16 lg:-mb-24">
      <div className="sticky top-0 h-[100dvh]">
        <canvas
          ref={canvasRef}
          className="absolute top-20 inset-x-o bottom-0 h-full w-full object-cover"
        />
        <div className="absolute top-40 inset-x-0 flex center gap-3 flex-col">
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold font-loud uppercase tracking-wide z-10 max-w-200">
            Keyboards to perfection
          </h2>
          <p className="text-center text-lg text-muted-foreground/60 leading-relaxed max-w-150 text-balance">Our rigid quality standards ensure every keyboard is built to perfection. You deserve the best.</p>
        </div>
      </div>  
    </section>
  );
}
