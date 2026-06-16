/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useTransition } from 'react';
import { SimulationType, Particle } from '../types';

interface ParticleCanvasProps {
  type: SimulationType;
  timeLeft: number; // 5.0 to 0.0 seconds
  isActive: boolean;
}

export default function ParticleCanvas({ type, timeLeft, isActive }: ParticleCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const nextId = useRef(0);
  const [, startTransition] = useTransition();

  // ResizeObserver to track container size dynamically
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      startTransition(() => {
        setDimensions({
          width: Math.max(width, 100),
          height: Math.max(height, 100),
        });
      });
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Update canvas size when dimensions change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
  }, [dimensions]);

  // Clean up particles when type changes or animation ends
  useEffect(() => {
    if (!isActive || type === 'none') {
      particlesRef.current = [];
    }
  }, [type, isActive]);

  // Helper to create a snowflake particle with crystal colors and properties
  const createSnowflake = (yPos: number, isInitial = false): Particle => {
    const size = 12 + Math.random() * 10; // intricate-detailed snowflake size: 12px to 22px
    const speedY = 0.9 + Math.random() * 1.4; // natural drifts
    const speedX = -0.4 + Math.random() * 0.8;
    const swayFreq = 0.006 + Math.random() * 0.012;
    const swayAmp = 10 + Math.random() * 18;
    const swayPhase = Math.random() * Math.PI * 2;
    const opacity = 0.55 + Math.random() * 0.45;

    // Premium intricate color variations
    const crystalColors = [
      'rgba(8, 145, 178, opacityPlaceholder)',   // Brilliant Cyan-600
      'rgba(3, 105, 161, opacityPlaceholder)',   // Sky Blue-700
      'rgba(13, 148, 136, opacityPlaceholder)',  // Vibrant Teal-600
      'rgba(79, 70, 229, opacityPlaceholder)',   // Electric Indigo-600
      'rgba(2, 132, 199, opacityPlaceholder)',   // Deep Azure Blue
    ];
    const chosenColorTemplate = crystalColors[Math.floor(Math.random() * crystalColors.length)];

    return {
      id: nextId.current++,
      x: Math.random() * dimensions.width,
      y: yPos,
      size,
      speedY,
      speedX,
      swayFreq,
      swayAmp,
      swayPhase,
      opacity,
      color: chosenColorTemplate,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: -0.015 + Math.random() * 0.03,
    };
  };

  // Helper to create a balloon particle with highly vibrant, glossy, energetic colors
  const createBalloon = (yPos: number, isInitial = false): Particle => {
    const size = 22 + Math.random() * 8; // vibrant medium-sized balloons
    const speedY = -(1.6 + Math.random() * 1.8); // Floats upward
    const speedX = -0.3 + Math.random() * 0.6;
    const swayFreq = 0.006 + Math.random() * 0.012;
    const swayAmp = 18 + Math.random() * 22;
    const swayPhase = Math.random() * Math.PI * 2;
    const opacity = 0.88 + Math.random() * 0.12;

    // Premium, vibrant, saturated colors that pop with outstanding saturation
    const vibrantColors = [
      'rgba(239, 68, 68, opacityPlaceholder)',   // Vibrant Red
      'rgba(244, 63, 94, opacityPlaceholder)',   // Rich Pink/Rose
      'rgba(99, 102, 241, opacityPlaceholder)',  // Electric Indigo
      'rgba(6, 182, 212, opacityPlaceholder)',   // Deep Cyan/Teal
      'rgba(245, 158, 11, opacityPlaceholder)',  // Golden Amber Orange
      'rgba(16, 185, 129, opacityPlaceholder)',  // Vibrant Green
      'rgba(59, 130, 246, opacityPlaceholder)',  // Royal Blue
    ];

    const chosenColorTemplate = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];

    return {
      id: nextId.current++,
      x: Math.random() * dimensions.width,
      y: yPos,
      size, // width
      speedY,
      speedX,
      swayFreq,
      swayAmp,
      swayPhase,
      opacity,
      color: chosenColorTemplate,
      stringLength: 40 + Math.random() * 15,
    };
  };

  // Animation effect loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      if (!isActive || type === 'none') {
        // Clear anything
        return;
      }

      // Check for spawning new particles
      const particles = particlesRef.current;
      const targetCount = type === 'snowflakes' ? 65 : 45;

      // Only spawn new particles if there is substantial timeLeft remaining
      // In the last 0.8s, we fade out or stop spawning of new particles
      const isSpawningAllowed = timeLeft > 0.8;

      if (isSpawningAllowed && particles.length < targetCount) {
        const diff = targetCount - particles.length;
        // Spawn gradually or initially
        const spawnAmount = particles.length === 0 ? targetCount : Math.min(diff, 2);
        for (let i = 0; i < spawnAmount; i++) {
          if (type === 'snowflakes') {
            // Spawn just above top, or initially distributed vertically if first load
            const y = particles.length === 0 ? Math.random() * dimensions.height : -20 - Math.random() * 40;
            particles.push(createSnowflake(y, particles.length === 0));
          } else {
            // Spawn just below bottom, or initially distributed if first load
            const y = particles.length === 0 ? dimensions.height + Math.random() * dimensions.height : dimensions.height + 20 + Math.random() * 60;
            particles.push(createBalloon(y, particles.length === 0));
          }
        }
      }

      // Global fade factor near the end of the 5-second lifetime
      let fadeFactor = 1.0;
      if (timeLeft <= 1.0) {
        fadeFactor = Math.max(0, timeLeft); // smooth linear fade out in last 1 second
      }

      // Update and Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Sway calculation
        p.swayPhase += p.swayFreq;
        const currentSwayX = Math.sin(p.swayPhase) * p.swayAmp;

        // Apply velocities
        p.y += p.speedY;
        p.x += p.speedX;

        // Visual position coordinates: X includes sway
        const drawX = p.x + currentSwayX;
        const drawY = p.y;

        // Rotate if snowflakes
        if (p.rotation !== undefined && p.rotSpeed !== undefined) {
          p.rotation += p.rotSpeed;
        }

        // Draw particle
        const finalOpacity = p.opacity * fadeFactor;
        ctx.save();

        if (type === 'snowflakes') {
          // Draw a highly intricate geometric crystalline snowflake with central hexagon ring and multiple side branches
          ctx.translate(drawX, drawY);
          ctx.rotate(p.rotation || 0);

          const baseColor = p.color ? p.color.replace('opacityPlaceholder', finalOpacity.toFixed(3)) : `rgba(13, 148, 136, ${finalOpacity})`;
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 1.1;
          ctx.lineCap = 'round';

          // Crisply defined glowing high-refraction shadow effect
          ctx.shadowColor = baseColor;
          ctx.shadowBlur = 1.5;

          const r = p.size / 2;

          // 1. Draw elegant core hexagon structure
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const angle = (k * Math.PI) / 3;
            const hx = Math.cos(angle) * (r * 0.25);
            const hy = Math.sin(angle) * (r * 0.25);
            if (k === 0) {
              ctx.moveTo(hx, hy);
            } else {
              ctx.lineTo(hx, hy);
            }
          }
          ctx.closePath();
          ctx.stroke();

          // 2. Draw 6 main branches with sub-branches
          for (let k = 0; k < 6; k++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -r);
            ctx.stroke();

            // Intricate multi-tier branch features
            if (r > 4) {
              ctx.beginPath();
              
              // Tier 1: Wide feather wings near base (0.35 r)
              ctx.moveTo(0, -r * 0.35);
              ctx.lineTo(-r * 0.25, -r * 0.52);
              ctx.moveTo(0, -r * 0.35);
              ctx.lineTo(r * 0.25, -r * 0.52);

              // Tier 2: Perpendicular delicate crossbars at middle (0.55 r)
              ctx.moveTo(-r * 0.15, -r * 0.55);
              ctx.lineTo(r * 0.15, -r * 0.55);

              // Tier 3: Pointy tip feather wings near top (0.75 r)
              ctx.moveTo(0, -r * 0.75);
              ctx.lineTo(-r * 0.15, -r * 0.88);
              ctx.moveTo(0, -r * 0.75);
              ctx.lineTo(r * 0.15, -r * 0.88);

              ctx.stroke();
            }

            ctx.rotate(Math.PI / 3);
          }
        } else {
          // Draw an elegant elegant 3D shaded balloon of medium size
          const w = p.size;
          const h = p.size * 1.32; // slightly taller than wide

          ctx.translate(drawX, drawY);
          
          // Balloon color template custom opacity replacement
          const baseColor = p.color ? p.color.replace('opacityPlaceholder', finalOpacity.toFixed(3)) : `rgba(153, 27, 27, ${finalOpacity})`;
          const lightColor = p.color ? p.color.replace('opacityPlaceholder', (finalOpacity * 0.3).toFixed(3)) : `rgba(255, 255, 255, ${finalOpacity * 0.3})`;

          // 1. Draw thread/string first (below balloon)
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          
          // Draw a gentle wave for string
          const sLength = p.stringLength || 40;
          ctx.bezierCurveTo(
            Math.sin(p.swayPhase * 2) * 5, h / 2 + sLength * 0.3,
            -Math.sin(p.swayPhase * 2) * 5, h / 2 + sLength * 0.7,
            0, h / 2 + sLength
          );
          ctx.strokeStyle = `rgba(156, 163, 175, ${finalOpacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // 2. Draw small tying triangle at bottom of balloon
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          ctx.lineTo(-4, h / 2 + 5);
          ctx.lineTo(4, h / 2 + 5);
          ctx.closePath();
          ctx.fillStyle = baseColor;
          ctx.fill();

          // 3. Draw balloon body
          ctx.beginPath();
          // Draw beautiful oval shape
          ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
          
          // 3D Radial Gradient for premium glossy formal looks
          const grad = ctx.createRadialGradient(
            -w * 0.15, -h * 0.15, w * 0.05,
            0, 0, w * 0.55
          );
          // Highlight shine
          grad.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * 0.95})`);
          grad.addColorStop(0.2, baseColor);
          grad.addColorStop(1, baseColor.replace(/rgba\((\d+,\s*\d+,\s*\d+),\s*([\d.]+)\)/, 'rgba($1, ' + (finalOpacity * 0.85).toFixed(3) + ')')); // darker edge shadow
          
          ctx.fillStyle = grad;
          ctx.fill();

          // Highlight glossy reflection streak
          ctx.beginPath();
          ctx.ellipse(-w * 0.18, -h * 0.18, w * 0.08, h * 0.08, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 0.4})`;
          ctx.fill();
        }

        ctx.restore();

        // Boundary checks
        let outOfBounds = false;
        if (type === 'snowflakes') {
          if (p.y > dimensions.height + 30) {
            outOfBounds = true;
          }
        } else {
          // balloons
          if (p.y < -120) {
            outOfBounds = true;
          }
        }

        // Keep horizontal within bounds or let them wrap
        if (p.x < -100) {
          p.x = dimensions.width + 50;
        } else if (p.x > dimensions.width + 100) {
          p.x = -50;
        }

        // Remove out of bounds particle
        if (outOfBounds) {
          particles.splice(i, 1);
        }
      }

      // Keep animation running
      localFrameId = requestAnimationFrame(render);
    };

    render(lastTime);

    return () => {
      cancelAnimationFrame(localFrameId);
    };
  }, [type, dimensions, isActive, timeLeft]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none rounded-2xl"
      style={{ zIndex: 10 }}
    >
      <canvas
        ref={canvasRef}
        id="particle-effect-canvas"
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
}
