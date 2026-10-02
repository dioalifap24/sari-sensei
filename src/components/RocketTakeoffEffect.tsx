import React, { useEffect, useRef, useState } from 'react';

interface RocketTakeoffEffectProps {
  active: boolean;
  mode?: 'takeoff' | 'landing';
  onComplete?: () => void;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  growth: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  vRot: number;
}

interface FlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export const RocketTakeoffEffect: React.FC<RocketTakeoffEffectProps> = ({ 
  active, 
  mode = 'takeoff', 
  onComplete 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number | null>(null);
  const smokeRef = useRef<SmokeParticle[]>([]);
  const flameRef = useRef<FlameParticle[]>([]);
  const [rocketStage, setRocketStage] = useState<'idle' | 'ignition' | 'liftoff' | 'descending' | 'braking' | 'touchdown'>('idle');
  const [rocketY, setRocketY] = useState(0);

  useEffect(() => {
    if (!active) {
      setRocketStage('idle');
      setRocketY(0);
      smokeRef.current = [];
      flameRef.current = [];
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const isLanding = mode === 'landing';
    const totalDuration = isLanding ? 6.0 : 4.5; // 6 detik untuk landing, 4.5 detik untuk takeoff

    let startTime = Date.now();
    let currentY = isLanding ? -canvas.height * 0.95 : 0;
    let velocityY = isLanding ? 7.5 : 0;

    setRocketStage(isLanding ? 'descending' : 'ignition');

    // Web Audio Sound Effect (Synthesized Engine Sound)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const bufferSize = audioCtx.sampleRate * (totalDuration + 0.5);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise for deep engine roar
          lastOut = data[i];
          data[i] *= 3.5;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const gain = audioCtx.createGain();

        if (isLanding) {
          // Landing: starts medium, loud braking thrust, ramps down to silence on touchdown
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.22, audioCtx.currentTime + 2.5);
          gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 4.5);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5.5);
        } else {
          // Takeoff: starts at ignition, roars loud, fades into stratosphere
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.24, audioCtx.currentTime + 1.8);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.2);
        }

        noise.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
      }
    } catch {
      // Audio fallback
    }

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const padY = canvas.height * 0.72; // Launchpad height

      // ================= PHYSICS & TRAJECTORY =================
      if (!isLanding) {
        // === TAKEOFF TRAJECTORY (Durasi ~4.5s) ===
        if (elapsed < 1.1) {
          setRocketStage('ignition');
          currentY = (Math.random() - 0.5) * 3; // Vibration rumble at launchpad
        } else {
          setRocketStage('liftoff');
          velocityY += 0.88; // Acceleration
          currentY -= velocityY;
        }
      } else {
        // === LANDING TRAJECTORY (Durasi ~6.0s) ===
        if (elapsed < 3.2) {
          // Descending down from space with retro braking
          setRocketStage('descending');
          const progress = elapsed / 3.2;
          currentY = -canvas.height * 0.95 * (1 - Math.pow(progress, 1.4));
        } else if (elapsed < 4.4) {
          // Maximum retro braking thrust near the pad
          setRocketStage('braking');
          const brakeProgress = (elapsed - 3.2) / 1.2;
          const remainingDist = -canvas.height * 0.95 * (1 - Math.pow(1, 1.4));
          currentY = remainingDist * (1 - brakeProgress) + (Math.random() - 0.5) * 3;
        } else {
          // Touchdown! Rocket sits on pad firmly
          setRocketStage('touchdown');
          currentY = 0;
        }
      }

      setRocketY(currentY);
      const rocketCurrentY = padY + currentY;

      // ================= 1. MASSIVE BILLOWING SMOKE CLOUDS =================
      // In both modes, dense smoke clouds billow out and fill the login screen
      let shouldGenerateSmoke = false;
      let smokeCount = 0;

      if (!isLanding) {
        shouldGenerateSmoke = elapsed < 3.8;
        smokeCount = elapsed < 2.5 ? 16 : 6;
      } else {
        // For landing: heavy smoke bursts during descent & braking (1.5s - 4.8s)
        shouldGenerateSmoke = elapsed > 1.2 && elapsed < 5.2;
        smokeCount = elapsed > 2.8 && elapsed < 4.6 ? 20 : 8;
      }

      if (shouldGenerateSmoke) {
        for (let i = 0; i < smokeCount; i++) {
          const isIgnitionFire = Math.random() < 0.22;
          const color = isIgnitionFire
            ? `rgba(255, ${Math.floor(180 + Math.random() * 60)}, 100, `
            : Math.random() < 0.5
            ? `rgba(245, 245, 250, `
            : `rgba(220, 225, 235, `;

          smokeRef.current.push({
            x: centerX + (Math.random() - 0.5) * (isLanding ? 120 : 90),
            y: Math.max(rocketCurrentY + 45, padY + 20 + (Math.random() - 0.5) * 40),
            vx: (Math.random() - 0.5) * (isLanding ? 16 : 14),
            vy: (Math.random() - 0.6) * 4 - 0.5,
            radius: 35 + Math.random() * 50,
            growth: 1.3 + Math.random() * 2.0,
            alpha: 0.88 + Math.random() * 0.12,
            decay: 0.0035 + Math.random() * 0.003,
            color,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.02,
          });
        }
      }

      // ================= 2. ENGINE FLAME JET PARTICLES =================
      const shouldGenerateFlames = !isLanding 
        ? elapsed < 3.6 
        : elapsed < 4.4; // Extinguishes when touching down

      if (shouldGenerateFlames) {
        const flameCount = isLanding && elapsed > 2.8 ? 14 : 9;
        for (let i = 0; i < flameCount; i++) {
          flameRef.current.push({
            x: centerX + (Math.random() - 0.5) * 28,
            y: rocketCurrentY + 36,
            vx: (Math.random() - 0.5) * 4,
            vy: 6 + Math.random() * 14,
            size: 6 + Math.random() * 14,
            alpha: 1,
            decay: 0.04 + Math.random() * 0.04,
            color: Math.random() < 0.4 ? '#fef08a' : Math.random() < 0.7 ? '#f97316' : '#ef4444',
          });
        }
      }

      // ================= RENDER SMOKE PUFFS =================
      for (let i = smokeRef.current.length - 1; i >= 0; i--) {
        const p = smokeRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += p.growth;
        p.alpha -= p.decay;
        p.rotation += p.vRot;

        if (p.alpha <= 0) {
          smokeRef.current.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.15, p.x, p.y, p.radius);
        grad.addColorStop(0, `${p.color}${p.alpha * 0.85})`);
        grad.addColorStop(0.6, `${p.color}${p.alpha * 0.5})`);
        grad.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ================= RENDER FLAME THRUST PARTICLES =================
      for (let i = flameRef.current.length - 1; i >= 0; i--) {
        const f = flameRef.current[i];
        f.x += f.vx;
        f.y += f.vy;
        f.alpha -= f.decay;

        if (f.alpha <= 0) {
          flameRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = f.color;
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (elapsed < totalDuration) {
        animIdRef.current = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [active, mode, onComplete]);

  if (!active) return null;

  const showEngineFlame = mode === 'takeoff' || (rocketStage !== 'touchdown');

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
      {/* Background Dim / Atmospheric Glow Overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-700 animate-in fade-in" />

      {/* HTML5 Canvas for Thick Billowing Rocket Smoke Clouds & Flames */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 🚀 THE ROCKET CRAFT (Takeoff or Landing) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 select-none"
        style={{
          bottom: '24%',
          transform: `translateX(-50%) translateY(${rocketY}px) scale(${
            rocketStage === 'ignition' || rocketStage === 'braking' ? 1.08 : 1.15
          })`,
          filter: 'drop-shadow(0 0 25px rgba(255, 100, 0, 0.75))',
          transition: rocketStage === 'touchdown' ? 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
        }}
      >
        <div className={`relative flex flex-col items-center ${
          rocketStage === 'ignition' || rocketStage === 'braking' ? 'animate-bounce' : ''
        }`}>
          {/* Rocket Vessel */}
          <div className="relative">
            <svg
              viewBox="0 0 120 200"
              className="w-24 h-40 sm:w-28 sm:h-48 drop-shadow-2xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rocket Nose Cone */}
              <path
                d="M 60 10 C 50 40 40 70 38 100 L 82 100 C 80 70 70 40 60 10 Z"
                fill="url(#noseGrad)"
                stroke="#7f1d1d"
                strokeWidth="2.5"
              />
              {/* Rocket Main Fuselage */}
              <rect
                x="38"
                y="98"
                width="44"
                height="65"
                rx="4"
                fill="url(#bodyGrad)"
                stroke="#1f2937"
                strokeWidth="2.5"
              />
              {/* Cockpit Window */}
              <circle cx="60" cy="115" r="10" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
              <circle cx="58" cy="113" r="3" fill="#ffffff" opacity="0.8" />

              {/* Uchiha Emblem on Rocket Body */}
              <circle cx="60" cy="142" r="7" fill="#ffffff" stroke="#7f1d1d" strokeWidth="1" />
              <path d="M 53 142 A 7 7 0 0 1 67 142 Z" fill="#dc2626" />
              <rect x="58.5" y="147" width="3" height="4" fill="#ffffff" stroke="#7f1d1d" strokeWidth="0.8" />

              {/* Left Wing / Fin */}
              <path
                d="M 38 125 L 12 165 L 38 160 Z"
                fill="#b91c1c"
                stroke="#7f1d1d"
                strokeWidth="2.5"
              />
              {/* Right Wing / Fin */}
              <path
                d="M 82 125 L 108 165 L 82 160 Z"
                fill="#b91c1c"
                stroke="#7f1d1d"
                strokeWidth="2.5"
              />
              {/* Engine Exhaust Nozzle */}
              <path
                d="M 46 163 L 42 175 L 78 175 L 74 163 Z"
                fill="#475569"
                stroke="#1e293b"
                strokeWidth="2"
              />

              <defs>
                <linearGradient id="noseGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
                <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Engine Exhaust Blast Plume (Active during flight, off on touchdown) */}
          {showEngineFlame && (
            <div className="relative -mt-3 flex flex-col items-center">
              {/* Inner Core Flame */}
              <div
                className="w-6 h-28 bg-gradient-to-b from-yellow-100 via-orange-400 to-transparent rounded-full blur-xs"
                style={{
                  animation: 'flameFlicker 0.15s infinite alternate ease-in-out',
                  transformOrigin: 'top center',
                }}
              />
              {/* Outer Giant Fire Cone */}
              <div
                className="w-16 h-40 -mt-26 bg-gradient-to-b from-orange-400 via-red-600 to-transparent rounded-full opacity-90 blur-sm"
                style={{
                  animation: 'flameFlicker 0.22s infinite alternate ease-in-out',
                  transformOrigin: 'top center',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
