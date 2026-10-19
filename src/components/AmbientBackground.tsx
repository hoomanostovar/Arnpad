import React, { useEffect, useRef } from "react";
import type { ThemeId, ThemeConfig } from "../App";

interface AmbientBackgroundProps {
  theme: ThemeConfig;
  bpm: number;
}

interface StarParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  alpha: number;
  hue: number;
  twinkleSpeed: number;
}

export default function AmbientBackground({ theme, bpm }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;
    let animTime = 0;

    // Pre-populate particles
    const particleCount = 75;
    const particles: StarParticle[] = [];

    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2.8 + 1,
          speed: Math.random() * 0.4 + 0.15,
          angle: Math.random() * Math.PI * 2,
          alpha: Math.random() * 0.7 + 0.2,
          hue: (theme.trailHue + Math.random() * 40 - 20 + 360) % 360,
          twinkleSpeed: Math.random() * 3 + 1.5,
        });
      }
    };

    let prevWidth = 0;
    let prevHeight = 0;

    const render = () => {
      if (!isRunning) return;
      animTime += 0.025;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      if (Math.abs(width - prevWidth) > 50 || Math.abs(height - prevHeight) > 50) {
        prevWidth = width;
        prevHeight = height;
        initParticles(width, height);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep theme-colored base clear
      ctx.clearRect(0, 0, width, height);

      const themeId = theme.id as ThemeId;
      const beatsPerSec = bpm / 60;
      const tempoPulse = Math.pow(Math.sin((animTime * beatsPerSec * Math.PI) % Math.PI), 4);

      if (themeId === "sakura" || themeId === "unicorn") {
        // === SAKURA / UNICORN: Floating Sakura Petals & Fairy Dust ===
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          // Gentle swaying drift downwards and sideways
          p.y += p.speed * 0.7;
          p.x += Math.sin(animTime * 1.5 + p.angle) * 0.6;

          if (p.y > height + 20) p.y = -20;
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          const twinkle = Math.sin(animTime * p.twinkleSpeed + p.angle) * 0.4 + 0.6;
          const curAlpha = p.alpha * twinkle * 0.6;

          // Soft petal glow
          ctx.fillStyle = `hsla(${p.hue}, 95%, 75%, ${curAlpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Petal / Star diamond core
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(animTime * 0.8 + p.angle);
          ctx.fillStyle = `rgba(255, 230, 245, ${curAlpha * 0.85})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else if (themeId === "cyberkitty" || themeId === "neonmagenta") {
        // === CYBERPUNK / NEON: Slow Perspective 3D Cyber Grid & Floating Matrix Bits ===
        const horizon = height * 0.45;
        const gridGlow = 0.08 + tempoPulse * 0.08;

        // Perspective grid lines receding to vanishing point
        ctx.strokeStyle = `hsla(${theme.trailHue}, 100%, 65%, ${gridGlow})`;
        ctx.lineWidth = 1;

        const vpX = width / 2;
        const vpY = horizon;
        const groundCols = 16;

        for (let i = -groundCols; i <= groundCols; i++) {
          const groundX = vpX + (i * width) / (groundCols * 0.75);
          ctx.beginPath();
          ctx.moveTo(vpX, vpY);
          ctx.lineTo(groundX, height);
          ctx.stroke();
        }

        // Horizontal grid lines flowing toward camera
        const gridOffset = (animTime * 35) % 40;
        for (let yStep = 0; yStep < 14; yStep++) {
          const normY = (yStep * 40 + gridOffset) / 560;
          const lineY = vpY + Math.pow(normY, 1.8) * (height - vpY);
          const alphaFade = Math.pow(normY, 1.4) * gridGlow * 1.5;
          ctx.strokeStyle = `hsla(${theme.trailHue}, 100%, 65%, ${alphaFade})`;
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(width, lineY);
          ctx.stroke();
        }

        // Digital matrix cyber dust
        for (let i = 0; i < 40; i++) {
          const p = particles[i];
          p.y += p.speed * 1.8;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          const alpha = 0.15 + Math.sin(animTime * 4 + i) * 0.1;
          ctx.fillStyle = `hsla(${theme.trailHue}, 100%, 70%, ${alpha})`;
          ctx.fillRect(p.x, p.y, 2, 4 + Math.random() * 4);
        }
      } else if (themeId === "marshmallow") {
        // === SUNSET PEACH: Undulating Twilight Waves & Warm Floating Embers ===
        const waveCount = 3;
        for (let w = 0; w < waveCount; w++) {
          const wPhase = animTime * 0.8 + w * 1.6;
          const wBaseY = height - 120 + w * 45;
          const wAlpha = 0.05 + (w / waveCount) * 0.08 + tempoPulse * 0.04;

          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 30) {
            const waveY =
              wBaseY +
              Math.sin(wPhase + (x / width) * Math.PI * 3) * (20 + w * 10) +
              Math.cos(wPhase * 0.7 + (x / width) * Math.PI * 2) * 15;
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, height);
          ctx.closePath();

          ctx.fillStyle = `hsla(${theme.trailHue + w * 15}, 90%, 55%, ${wAlpha})`;
          ctx.fill();
        }

        // Warm floating sunset embers rising upward
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y -= p.speed * 0.8;
          p.x += Math.sin(animTime * 1.2 + p.angle) * 0.4;

          if (p.y < -20) p.y = height + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          const twinkle = Math.sin(animTime * p.twinkleSpeed + p.angle) * 0.5 + 0.5;
          ctx.fillStyle = `hsla(${theme.trailHue + Math.sin(animTime) * 15}, 95%, 65%, ${p.alpha * twinkle * 0.45})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // === PASTEL DREAMS / COSMOS: Ethereal Constellations & Twinkling Stars ===
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += Math.sin(animTime * 0.5 + p.angle) * 0.2;
          p.x += Math.cos(animTime * 0.5 + p.angle) * 0.2;

          const twinkle = Math.sin(animTime * p.twinkleSpeed + p.angle) * 0.5 + 0.5;
          const starAlpha = p.alpha * twinkle * 0.55;

          // Faint constellation links between nearby stars
          for (let j = i + 1; j < Math.min(i + 6, particles.length); j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              const linkAlpha = (1 - dist / 110) * 0.12 * twinkle;
              ctx.strokeStyle = `hsla(${p.hue}, 90%, 80%, ${linkAlpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Star diamond
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.fillStyle = `rgba(245, 235, 255, ${starAlpha})`;
          const sSize = p.size * 1.4;
          ctx.beginPath();
          ctx.moveTo(0, -sSize);
          ctx.quadraticCurveTo(0, 0, sSize, 0);
          ctx.quadraticCurveTo(0, 0, 0, sSize);
          ctx.quadraticCurveTo(0, 0, -sSize, 0);
          ctx.quadraticCurveTo(0, 0, 0, -sSize);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.restore();
      animFrameId = requestAnimationFrame(render);
    };

    let animFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId);
    };
  }, [theme.id, theme.trailHue, bpm]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}
