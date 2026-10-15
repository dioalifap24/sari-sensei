import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Black Clover Mana Particle System (魔力粒子・マナダスト)
 *
 * Efek partikel debu sihir / pendaran "Mana" khas anime Black Clover:
 * 1. Butiran debu sihir bercahaya (Luminous Mana Dust) yang melayang halus ke atas.
 * 2. Orb mana berkabut (Soft Mana Orbs) dengan aura berpendar lembut.
 * 3. Percikan api anti-sihir merah-hitam (Asta Anti-Magic Embers) di sisi kiri.
 * 4. Pusaran debu sihir angin zamrud (Yuno Wind Spirit Mana) di sisi kanan.
 * 5. Pendaran mana emas kerajaan (Clover Kingdom Royal Mana) di poros tengah.
 * 6. Glint kilau bintang sihir 4-titik (✦) yang sesekali berkedip anggun.
 * 7. Siluet lambang semanggi sihir mini (Grimoire Clover Runes) melayang langka.
 * 8. Interaktivitas Mana Zone (魔力領域): Mana bereaksi halus ketika kursor mouse / sentuhan melintas.
 */

interface ManaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  swaySpeed: number;
  swayAmp: number;
  swayPhase: number;
  type: 'dust' | 'orb' | 'ember' | 'wind' | 'glint' | 'clover';
  rotation: number;
  vRot: number;
  leaves?: number;
}

interface ManaWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface BlackCloverManaFieldProps {
  className?: string;
  density?: 'normal' | 'dense' | 'ethereal';
  interactive?: boolean;
}

export const BlackCloverManaField: React.FC<BlackCloverManaFieldProps> = ({
  className = '',
  density = 'normal',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ManaParticle[]>([]);
  const wavesRef = useRef<ManaWave[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const lastTimeRef = useRef<number>(performance.now());
  const [isLowPower] = useState<boolean>(false);

  // Palet Warna Mana Bertema Black Clover
  const GOLD_PALETTE = ['#fbbf24', '#f59e0b', '#fde047', '#fef08a', '#d97706'];
  const CRIMSON_PALETTE = ['#ef4444', '#dc2626', '#f87171', '#ff6b6b', '#fca5a5'];
  const EMERALD_PALETTE = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'];
  const VIOLET_PALETTE = ['#c084fc', '#e879f9', '#a855f7', '#ddd6fe'];

  const createParticle = useCallback((width: number, height: number, forceBottom = false): ManaParticle => {
    const x = Math.random() * width;
    const y = forceBottom ? height + Math.random() * 20 : Math.random() * height;

    // Tentukan afiliasi mana berdasarkan posisi horizontal (Asta di kiri, Yuno di kanan, Emas di tengah)
    const ratioX = x / Math.max(1, width);
    let color: string;
    let glowColor: string;
    let type: ManaParticle['type'] = 'dust';

    const randType = Math.random();
    if (randType < 0.58) {
      type = 'dust';
    } else if (randType < 0.76) {
      type = 'orb';
    } else if (randType < 0.88) {
      type = ratioX < 0.45 ? 'ember' : ratioX > 0.55 ? 'wind' : 'dust';
    } else if (randType < 0.96) {
      type = 'glint';
    } else {
      type = 'clover';
    }

    if (ratioX < 0.33) {
      // Sisi Kiri: Dominan Mana Merah / Anti-Magic Asta
      color = CRIMSON_PALETTE[Math.floor(Math.random() * CRIMSON_PALETTE.length)];
      glowColor = 'rgba(239, 68, 68, 0.45)';
    } else if (ratioX > 0.67) {
      // Sisi Kanan: Dominan Mana Hijau Zamrud / Wind Spirit Yuno
      color = EMERALD_PALETTE[Math.floor(Math.random() * EMERALD_PALETTE.length)];
      glowColor = 'rgba(16, 185, 129, 0.45)';
    } else {
      // Bagian Tengah: Dominan Mana Emas Kerajaan Clover / Mahojin
      if (Math.random() < 0.78) {
        color = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
        glowColor = 'rgba(245, 158, 11, 0.45)';
      } else {
        color = VIOLET_PALETTE[Math.floor(Math.random() * VIOLET_PALETTE.length)];
        glowColor = 'rgba(192, 132, 252, 0.4)';
      }
    }

    let radius = 1.2 + Math.random() * 2.2;
    if (type === 'orb') radius = 3.5 + Math.random() * 4.5;
    if (type === 'clover') radius = 4.0 + Math.random() * 3.5;
    if (type === 'glint') radius = 2.5 + Math.random() * 3.0;

    const baseAlpha = 0.25 + Math.random() * 0.55;

    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.35 + Math.random() * 0.75), // Mana mengalir anggun melayang ke atas
      radius,
      color,
      glowColor,
      alpha: baseAlpha,
      baseAlpha,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
      twinklePhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.015 + Math.random() * 0.03,
      swayAmp: 0.4 + Math.random() * 1.1,
      swayPhase: Math.random() * Math.PI * 2,
      type,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.025,
      leaves: Math.random() < 0.25 ? 5 : Math.random() < 0.6 ? 4 : 3,
    };
  }, []);

  // Gambar siluet Semanggi Magis (3, 4, atau 5 Daun)
  const drawCloverGlyph = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rot: number,
    color: string,
    alpha: number,
    leaves = 4
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;

    const angleStep = (Math.PI * 2) / leaves;
    for (let i = 0; i < leaves; i++) {
      ctx.save();
      ctx.rotate(i * angleStep);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size * 0.5, -size * 0.6, -size * 0.8, -size * 1.1, 0, -size * 1.25);
      ctx.bezierCurveTo(size * 0.8, -size * 1.1, size * 0.5, -size * 0.6, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    // Inti bercahaya
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  };

  // Gambar Bintang Kilau Sihir 4-Titik (✦ Magic Glint)
  const drawMagicGlint = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rot: number,
    color: string,
    alpha: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    // 4 titik tajam
    ctx.moveTo(0, -size * 2);
    ctx.quadraticCurveTo(0, 0, size * 2, 0);
    ctx.quadraticCurveTo(0, 0, 0, size * 2);
    ctx.quadraticCurveTo(0, 0, -size * 2, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size * 2);
    ctx.fill();

    // Titik pusat putih menyilaukan
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Hitung jumlah partikel optimal berdasarkan ukuran layar
    const isMobile = width < 768;
    const targetCount = density === 'dense'
      ? (isMobile ? 70 : 130)
      : density === 'ethereal'
      ? (isMobile ? 35 : 65)
      : (isMobile ? 50 : 95);

    // Inisialisasi partikel
    particlesRef.current = [];
    for (let i = 0; i < targetCount; i++) {
      particlesRef.current.push(createParticle(width, height, false));
    }

    // Timer pemicu gelombang mana atmosferik (Mana Wave Pulse)
    let waveTimer = 0;

    // Track mouse / touch pada window agar interaktif
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        mousePosRef.current = { x: clientX, y: clientY, active: true };
      }
    };

    const handlePointerLeave = () => {
      mousePosRef.current.active = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);

    // Animasi Canvas Loop
    const render = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      ctx.clearRect(0, 0, width, height);

      // Periodik pemicu gelombang mana lembut dari langit tengah
      waveTimer += dt;
      if (waveTimer > 7.5) {
        waveTimer = 0;
        wavesRef.current.push({
          x: width * 0.5,
          y: height * 0.25,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.65,
          alpha: 0.28,
          color: Math.random() < 0.6 ? '#f59e0b' : '#10b981',
        });
      }

      // Render & update gelombang mana
      for (let i = wavesRef.current.length - 1; i >= 0; i--) {
        const w = wavesRef.current[i];
        w.radius += dt * 75;
        w.alpha *= 0.985;

        if (w.alpha > 0.01 && w.radius < w.maxRadius) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
          ctx.strokeStyle = w.color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = w.alpha;
          ctx.shadowColor = w.color;
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.restore();
        } else {
          wavesRef.current.splice(i, 1);
        }
      }

      const mouse = mousePosRef.current;

      // Render partikel debu sihir
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update fase osilasi
        p.twinklePhase += p.twinkleSpeed;
        p.swayPhase += p.swaySpeed;
        p.rotation += p.vRot;

        // Gerak vertikal & sway horizontal
        const sway = Math.sin(p.swayPhase) * p.swayAmp;
        p.x += p.vx + sway * 0.35;
        p.y += p.vy;

        // Efek Interaktif Mana Zone: Kursor mouse menghasilkan pendaran / tolakan halus
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 130;
          if (distSq < maxDist * maxDist && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 1.5;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force - 0.4;
            p.alpha = Math.min(1, p.baseAlpha + 0.35); // Pendaran meningkat saat berdekatan
          }
        }

        // Kalkulasi alpha berkedip (twinkling)
        const twinkle = (Math.sin(p.twinklePhase) + 1) * 0.5;
        const currentAlpha = Math.max(0.08, Math.min(0.95, p.baseAlpha * 0.45 + twinkle * p.baseAlpha * 0.85));

        // Jika keluar dari layar atas, reset ke bawah
        if (p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[i] = createParticle(width, height, true);
          continue;
        }

        // Gambar sesuai jenis partikel
        if (p.type === 'clover') {
          drawCloverGlyph(ctx, p.x, p.y, p.radius, p.rotation, p.color, currentAlpha, p.leaves);
        } else if (p.type === 'glint') {
          drawMagicGlint(ctx, p.x, p.y, p.radius, p.rotation, p.color, currentAlpha);
        } else if (p.type === 'orb') {
          // Soft mana orb dengan gradien bercahaya
          ctx.save();
          ctx.globalAlpha = currentAlpha;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.35, p.color);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'ember') {
          // Percikan api merah anti-sihir Asta
          ctx.save();
          ctx.globalAlpha = currentAlpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Inti panas
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'wind') {
          // Debu sihir angin zamrud Yuno
          ctx.save();
          ctx.globalAlpha = currentAlpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 7;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Standard luminous magic dust mote
          ctx.save();
          ctx.globalAlpha = currentAlpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Hentikan loop saat tab tidak terlihat untuk hemat baterai
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      } else {
        lastTimeRef.current = performance.now();
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [createParticle, density, interactive]);

  return (
    <div className={`fixed inset-0 pointer-events-none select-none overflow-hidden z-[2] ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full block filter contrast-110"
      />
    </div>
  );
};
