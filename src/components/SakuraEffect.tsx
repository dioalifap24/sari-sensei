import React, { useEffect, useRef } from 'react';

export type SakuraTriggerType = 'burst' | 'rain' | 'celebration';

interface SakuraEffectProps {
  triggerRain?: boolean;
  triggerCelebration?: boolean;
  onRainComplete?: () => void;
  onCelebrationComplete?: () => void;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  opacity: number;
  decay: number;
  color: string;
  type: 'burst' | 'falling' | 'celebration';
  life?: number;
  maxLife?: number;
  swaySpeed?: number;
  swayAmp?: number;
  baseX?: number;
}

export const SakuraEffect: React.FC<SakuraEffectProps> = ({
  triggerRain = false,
  triggerCelebration = false,
  onRainComplete,
  onCelebrationComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const rainTimerRef = useRef<number | null>(null);
  const celebrationTimerRef = useRef<number | null>(null);

  // Sakura petal color palette
  const colors = [
    '#fbcfe8', // soft light pink
    '#f472b6', // rose pink
    '#fda4af', // cherry blossom blush
    '#fecdd3', // pale sakura
    '#fff1f2', // off-white sakura
    '#fb7185', // vibrant blossom
    '#fef08a', // touch of gold pollen
  ];

  // Helper to draw a single organic cherry blossom petal
  const drawPetal = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    color: string,
    opacity: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
    ctx.fillStyle = color;

    ctx.beginPath();
    // Bezier curve petal with slight notch at tip
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.7, -size * 0.7, size * 0.8, size * 0.3, 0, size);
    ctx.bezierCurveTo(-size * 0.8, size * 0.3, -size * 0.7, -size * 0.7, 0, -size);
    ctx.closePath();
    ctx.fill();

    // Subtle petal center vein
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(0, size * 0.5);
    ctx.stroke();

    ctx.restore();
  };

  // Helper to spawn a button-click burst at x, y
  const spawnBurst = (originX: number, originY: number) => {
    const count = 14 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2.5 + Math.random() * 5.5;
      petalsRef.current.push({
        x: originX,
        y: originY,
        size: 7 + Math.random() * 7,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        decay: 0.015 + Math.random() * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'burst',
      });
    }
  };

  // Helper to spawn continuous rain
  const spawnRainWave = (w: number) => {
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * w;
      petalsRef.current.push({
        x,
        baseX: x,
        y: -20 - Math.random() * 60,
        size: 8 + Math.random() * 8,
        vx: 0.5 + Math.random() * 1.5,
        vy: 2 + Math.random() * 2.5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.08,
        opacity: 0.9,
        decay: 0.001,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'falling',
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayAmp: 25 + Math.random() * 35,
        life: 0,
      });
    }
  };

  // Helper to spawn celebration storm
  const spawnCelebrationWave = (w: number, h: number) => {
    for (let i = 0; i < 12; i++) {
      const fromLeft = Math.random() > 0.5;
      const x = fromLeft ? -20 : Math.random() * w;
      const y = Math.random() * (h * 0.8);
      const angle = (Math.random() * 0.6 + 0.2) * (Math.PI / 2);
      petalsRef.current.push({
        x,
        baseX: x,
        y,
        size: 10 + Math.random() * 10,
        vx: 3 + Math.random() * 5,
        vy: (Math.random() - 0.3) * 3,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25,
        opacity: 0.95,
        decay: 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'celebration',
        swaySpeed: 0.04 + Math.random() * 0.04,
        swayAmp: 40 + Math.random() * 40,
        life: 0,
      });
    }
  };

  // Handle global button clicks for petal burst
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if clicked element or parent is a button or interactive link/tab
      const isButton = target.closest('button, [role="button"], a, input[type="radio"], input[type="checkbox"], .sakura-clickable');
      if (isButton) {
        spawnBurst(e.clientX, e.clientY);
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  // Handle Login Rain trigger
  useEffect(() => {
    if (triggerRain) {
      const canvas = canvasRef.current;
      const w = canvas ? canvas.width : window.innerWidth;
      
      // Rain wave interval for 4 seconds
      const startTime = Date.now();
      const interval = window.setInterval(() => {
        spawnRainWave(w);
        if (Date.now() - startTime > 4000) {
          clearInterval(interval);
          if (onRainComplete) {
            setTimeout(onRainComplete, 2000);
          }
        }
      }, 120);

      return () => {
        clearInterval(interval);
      };
    }
  }, [triggerRain, onRainComplete]);

  // Handle Score >= 90 Celebration trigger
  useEffect(() => {
    if (triggerCelebration) {
      const canvas = canvasRef.current;
      const w = canvas ? canvas.width : window.innerWidth;
      const h = canvas ? canvas.height : window.innerHeight;

      const startTime = Date.now();
      const interval = window.setInterval(() => {
        spawnCelebrationWave(w, h);
        if (Date.now() - startTime > 5500) {
          clearInterval(interval);
          if (onCelebrationComplete) {
            setTimeout(onCelebrationComplete, 2500);
          }
        }
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, [triggerCelebration, onCelebrationComplete]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const petals = petalsRef.current;
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];

        if (p.type === 'burst') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // gentle gravity
          p.vx *= 0.96; // air drag
          p.rotation += p.vRot;
          p.opacity -= p.decay;

          drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);

          if (p.opacity <= 0 || p.y > canvas.height + 50) {
            petals.splice(i, 1);
          }
        } else if (p.type === 'falling') {
          p.life = (p.life || 0) + 1;
          const sway = Math.sin(p.life * (p.swaySpeed || 0.03)) * (p.swayAmp || 20);
          p.x = (p.baseX || p.x) + sway;
          p.y += p.vy;
          p.rotation += p.vRot;

          drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);

          if (p.y > canvas.height + 30) {
            petals.splice(i, 1);
          }
        } else if (p.type === 'celebration') {
          p.life = (p.life || 0) + 1;
          p.x += p.vx;
          p.y += p.vy + Math.sin(p.life * 0.05) * 1.5;
          p.rotation += p.vRot;
          p.opacity -= p.decay;

          drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);

          if (p.x > canvas.width + 50 || p.y > canvas.height + 50 || p.opacity <= 0) {
            petals.splice(i, 1);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ pointerEvents: 'none' }}
    />
  );
};
