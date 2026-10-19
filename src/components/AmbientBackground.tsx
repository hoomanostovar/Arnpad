import React, { useEffect, useRef } from "react";
import type { ThemeId, ThemeConfig } from "../App";

interface AmbientBackgroundProps {
  theme: ThemeConfig;
  bpm: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  alpha: number;
  hue: number;
  twinkleSpeed: number;
  rotation: number;
  rotSpeed: number;
  extra?: number;
}

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
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

    // Particles array
    const particles: Particle[] = [];
    const matrixColumns: MatrixColumn[] = [];

    const initScene = (w: number, h: number) => {
      particles.length = 0;
      matrixColumns.length = 0;
      const themeId = theme.id as ThemeId;

      if (themeId === "cyberkitty") {
        const colCount = Math.floor(w / 32);
        const chars = "01KAT79XY⚡♪#+<>{}*~";
        for (let i = 0; i < colCount; i++) {
          const colChars: string[] = [];
          const len = 6 + Math.floor(Math.random() * 10);
          for (let j = 0; j < len; j++) {
            colChars.push(chars[Math.floor(Math.random() * chars.length)]);
          }
          matrixColumns.push({
            x: i * 32 + 16,
            y: Math.random() * h,
            speed: 1.2 + Math.random() * 2.2,
            length: len,
            chars: colChars,
          });
        }
      } else {
        const count = themeId === "neonmagenta" ? 50 : 65;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 3 + 1.2,
            speed: Math.random() * 0.5 + 0.2,
            angle: Math.random() * Math.PI * 2,
            alpha: Math.random() * 0.6 + 0.3,
            hue: (theme.trailHue + Math.random() * 40 - 20 + 360) % 360,
            twinkleSpeed: Math.random() * 3 + 1.5,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.03,
            extra: Math.random(),
          });
        }
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
        initScene(width, height);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const themeId = theme.id as ThemeId;
      const beatsPerSec = bpm / 60;
      const tempoPulse = Math.pow(Math.sin((animTime * beatsPerSec * Math.PI) % Math.PI), 4);

      // =====================================================================
      // 1. SAKURA DAWN: Fluttering Cherry Blossoms & Fairy Stardust
      // =====================================================================
      if (themeId === "sakura") {
        // Soft background ambient glow
        const radGrad = ctx.createRadialGradient(width * 0.3, height * 0.4, 10, width * 0.3, height * 0.4, width * 0.6);
        radGrad.addColorStop(0, "rgba(255, 126, 165, 0.08)");
        radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.speed * 0.85;
          p.x += Math.sin(animTime * 1.2 + p.angle) * 0.8;
          p.rotation += p.rotSpeed;

          if (p.y > height + 25) p.y = -25;
          if (p.x > width + 25) p.x = -25;
          if (p.x < -25) p.x = width + 25;

          const twinkle = Math.sin(animTime * p.twinkleSpeed + p.angle) * 0.35 + 0.65;
          const curAlpha = p.alpha * twinkle;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          if ((p.extra || 0) > 0.4) {
            // Render 5-petal cherry blossom
            const petalSize = p.size * 2.8;
            ctx.fillStyle = `rgba(255, 180, 205, ${curAlpha * 0.65})`;
            for (let petal = 0; petal < 5; petal++) {
              ctx.rotate((Math.PI * 2) / 5);
              ctx.beginPath();
              ctx.ellipse(petalSize * 0.7, 0, petalSize * 0.6, petalSize * 0.3, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            // Blossom center pistil
            ctx.fillStyle = `rgba(255, 235, 245, ${curAlpha * 0.9})`;
            ctx.beginPath();
            ctx.arc(0, 0, petalSize * 0.25, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Soft stardust glowing orb
            ctx.fillStyle = `rgba(255, 126, 165, ${curAlpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 3.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 230, 245, ${curAlpha * 0.85})`;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // =====================================================================
      // 2. UNICORN SPARKLE: Liquid Aurora Ribbons & Rainbow Diamond Crystals
      // =====================================================================
      else if (themeId === "unicorn") {
        // Multi-layered morphing liquid aurora ribbons
        const ribbonCount = 3;
        for (let r = 0; r < ribbonCount; r++) {
          const rPhase = animTime * 0.6 + r * 1.8;
          const rBaseY = height * (0.35 + r * 0.25);
          const rAlpha = 0.07 + (r / ribbonCount) * 0.05 + tempoPulse * 0.03;

          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 35) {
            const waveY =
              rBaseY +
              Math.sin(rPhase + (x / width) * Math.PI * 2.5) * 45 +
              Math.cos(rPhase * 0.8 + (x / width) * Math.PI * 3.5) * 30;
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, height);
          ctx.closePath();

          const rGrad = ctx.createLinearGradient(0, rBaseY - 50, width, rBaseY + 120);
          rGrad.addColorStop(0, `hsla(${290 + r * 30}, 95%, 70%, ${rAlpha})`);
          rGrad.addColorStop(0.5, `hsla(${330 + r * 20}, 95%, 75%, ${rAlpha * 1.3})`);
          rGrad.addColorStop(1, `hsla(${240 + r * 25}, 90%, 75%, ${rAlpha})`);
          ctx.fillStyle = rGrad;
          ctx.fill();
        }

        // Floating rainbow diamond crystals drifting upward
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y -= p.speed * 0.65;
          p.x += Math.sin(animTime * 1.0 + p.angle) * 0.5;
          p.rotation += p.rotSpeed * 1.5;

          if (p.y < -25) p.y = height + 25;
          if (p.x > width + 25) p.x = -25;
          if (p.x < -25) p.x = width + 25;

          const twinkle = Math.sin(animTime * p.twinkleSpeed + p.angle) * 0.4 + 0.6;
          const curAlpha = p.alpha * twinkle * 0.8;
          const starHue = (p.hue + animTime * 20) % 360;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          // Star diamond shape
          const s = p.size * 2.2;
          ctx.fillStyle = `hsla(${starHue}, 90%, 80%, ${curAlpha})`;
          ctx.beginPath();
          ctx.moveTo(0, -s * 1.4);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s * 1.4);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s * 1.4);
          ctx.fill();

          // Core starlight
          ctx.fillStyle = `rgba(255, 255, 255, ${curAlpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // =====================================================================
      // 3. CYBER KITTY: Neo-Tokyo Digital Matrix Rain & Circuit Nodes
      // =====================================================================
      else if (themeId === "cyberkitty") {
        ctx.font = "12px monospace";
        ctx.textAlign = "center";

        for (let i = 0; i < matrixColumns.length; i++) {
          const col = matrixColumns[i];
          col.y += col.speed;
          if (col.y - col.length * 18 > height) {
            col.y = -20;
            col.x = Math.random() * width;
          }

          for (let j = 0; j < col.length; j++) {
            const charY = col.y - j * 18;
            if (charY < -10 || charY > height + 10) continue;

            const isHead = j === 0;
            const alpha = isHead ? 0.85 : Math.max(0.08, 0.55 - (j / col.length) * 0.5);

            if (isHead) {
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.shadowColor = "#22d3ee";
              ctx.shadowBlur = 8;
            } else {
              ctx.fillStyle = j % 2 === 0 ? `rgba(34, 211, 238, ${alpha})` : `rgba(52, 211, 153, ${alpha})`;
              ctx.shadowBlur = 0;
            }

            ctx.fillText(col.chars[j % col.chars.length], col.x, charY);
          }
        }
        ctx.shadowBlur = 0;

        // Faint horizontal cyber scanlines
        const scanGlow = 0.05 + tempoPulse * 0.05;
        ctx.strokeStyle = `rgba(34, 211, 238, ${scanGlow})`;
        ctx.lineWidth = 1;
        const lineSpacing = 48;
        const offset = (animTime * 20) % lineSpacing;
        for (let y = offset; y < height; y += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // =====================================================================
      // 4. PASTEL DREAMS: Deep Celestial Constellations & Lavender Starlight
      // =====================================================================
      else if (themeId === "pasteldreams") {
        // Deep nebula radial haze
        const nebGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 50, width * 0.5, height * 0.5, width * 0.55);
        nebGrad.addColorStop(0, "rgba(192, 170, 253, 0.07)");
        nebGrad.addColorStop(0.6, "rgba(167, 139, 250, 0.03)");
        nebGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = nebGrad;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += Math.sin(animTime * 0.4 + p.angle) * 0.3;
          p.x += Math.cos(animTime * 0.4 + p.angle) * 0.3;

          const twinkle = Math.sin(animTime * p.twinkleSpeed + p.angle) * 0.45 + 0.55;
          const starAlpha = p.alpha * twinkle * 0.75;

          // Constellation links between nearby stars
          for (let j = i + 1; j < Math.min(i + 6, particles.length); j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 125) {
              const linkAlpha = (1 - dist / 125) * 0.16 * twinkle;
              ctx.strokeStyle = `rgba(215, 200, 255, ${linkAlpha})`;
              ctx.lineWidth = 0.9;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Star diamond node
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.fillStyle = `rgba(240, 230, 255, ${starAlpha})`;
          const sSize = p.size * 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -sSize);
          ctx.quadraticCurveTo(0, 0, sSize, 0);
          ctx.quadraticCurveTo(0, 0, 0, sSize);
          ctx.quadraticCurveTo(0, 0, -sSize, 0);
          ctx.quadraticCurveTo(0, 0, 0, -sSize);
          ctx.fill();

          // Soft purple outer aura
          ctx.fillStyle = `rgba(192, 170, 253, ${starAlpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(0, 0, sSize * 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // =====================================================================
      // 5. SUNSET PEACH: Twilight Waves & Warm Rising Firefly Embers
      // =====================================================================
      else if (themeId === "marshmallow") {
        // Multi-tier undulating warm twilight waves
        const waveCount = 4;
        for (let w = 0; w < waveCount; w++) {
          const wPhase = animTime * 0.75 + w * 1.4;
          const wBaseY = height - 130 + w * 38;
          const wAlpha = 0.06 + (w / waveCount) * 0.08 + tempoPulse * 0.03;

          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 30) {
            const waveY =
              wBaseY +
              Math.sin(wPhase + (x / width) * Math.PI * 2.8) * (22 + w * 8) +
              Math.cos(wPhase * 0.6 + (x / width) * Math.PI * 2.2) * 14;
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, height);
          ctx.closePath();

          ctx.fillStyle = `hsla(${25 + w * 12}, 95%, 55%, ${wAlpha})`;
          ctx.fill();
        }

        // Warm golden firefly embers rising upward
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y -= p.speed * 0.9;
          p.x += Math.sin(animTime * 1.3 + p.angle) * 0.55;

          if (p.y < -20) p.y = height + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          const twinkle = Math.sin(animTime * p.twinkleSpeed + p.angle) * 0.45 + 0.55;
          const emberAlpha = p.alpha * twinkle * 0.75;

          // Warm ember halo
          ctx.fillStyle = `rgba(251, 146, 60, ${emberAlpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
          ctx.fill();

          // Bright ember core
          ctx.fillStyle = `rgba(255, 240, 180, ${emberAlpha * 0.95})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // =====================================================================
      // 6. NEON MAGENTA: 3D Outrun Synthwave Grid & High-Voltage Laser Beams
      // =====================================================================
      else if (themeId === "neonmagenta") {
        const horizon = height * 0.42;
        const gridGlow = 0.12 + tempoPulse * 0.1;

        // Perspective grid lines receding to vanishing point
        ctx.strokeStyle = `rgba(255, 0, 200, ${gridGlow})`;
        ctx.lineWidth = 1.2;

        const vpX = width / 2;
        const vpY = horizon;
        const groundCols = 18;

        for (let i = -groundCols; i <= groundCols; i++) {
          const groundX = vpX + (i * width) / (groundCols * 0.65);
          ctx.beginPath();
          ctx.moveTo(vpX, vpY);
          ctx.lineTo(groundX, height);
          ctx.stroke();
        }

        // Horizontal grid lines flowing towards the camera
        const gridOffset = (animTime * 50) % 45;
        for (let yStep = 0; yStep < 14; yStep++) {
          const normY = (yStep * 45 + gridOffset) / 630;
          const lineY = vpY + Math.pow(normY, 1.7) * (height - vpY);
          const alphaFade = Math.pow(normY, 1.3) * gridGlow * 2.0;
          ctx.strokeStyle = `rgba(0, 229, 255, ${alphaFade})`;
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(width, lineY);
          ctx.stroke();
        }

        // Glowing horizon laser bar
        ctx.strokeStyle = `rgba(255, 0, 200, ${0.4 + tempoPulse * 0.3})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ff00c8";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(0, horizon);
        ctx.lineTo(width, horizon);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Shooting laser particles speeding horizontally
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.speed * 4.0;
          if (p.x > width + 30) {
            p.x = -30;
            p.y = Math.random() * horizon;
          }

          const alpha = 0.3 + Math.sin(animTime * 3 + i) * 0.25;
          ctx.fillStyle = i % 2 === 0 ? `rgba(255, 0, 200, ${alpha})` : `rgba(0, 229, 255, ${alpha})`;
          ctx.fillRect(p.x, p.y, p.size * 6, 2);
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
      style={{ opacity: 0.95 }}
    />
  );
}
