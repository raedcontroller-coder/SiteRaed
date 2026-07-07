'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import './sobre.css';

/* ── Dados dos valores ── */
const VALORES = [
  {
    icon: 'ph-smiley',
    title: 'Pessoas felizes constroem o sucesso',
    desc: 'Acreditamos que pessoas felizes constroem o sucesso. A felicidade no trabalho não é consequência, é fundação.',
  },
  {
    icon: 'ph-graduation-cap',
    title: 'A empresa também é uma escola',
    desc: 'A empresa também é uma escola: evoluímos juntos. Cada projeto é uma aula, cada desafio é um professor.',
  },
  {
    icon: 'ph-rocket',
    title: 'Projetos impossíveis são nosso combustível',
    desc: 'Projetos impossíveis são o nosso combustível. Quanto mais complexo, mais brilham nossos olhos.',
  },
  {
    icon: 'ph-hands-clapping',
    title: 'Respeito e colaboração',
    desc: 'No caldeirão de diferenças, criamos um ambiente de respeito e colaboração. Diversidade gera inovação.',
  },
  {
    icon: 'ph-paw-print',
    title: 'Cuidamos da vida em todas as formas',
    desc: 'Cuidamos da vida em todas as suas formas, dos colaboradores aos seus bichinhos de estimação.',
  },
  {
    icon: 'ph-chart-line-up',
    title: 'Valor real e mensurável',
    desc: 'Nosso compromisso é com projetos que geram valor real e mensurável para o cliente. Resultado importa.',
  },
];

/* ── Three.js Particle Network ── */
function useParticleNetwork(canvasRef) {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* Partículas */
    const PARTICLE_COUNT = 120;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];
    const spread = 500;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150;
      velocities.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.1,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffa103,
      size: 2,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    /* Linhas de conexão */
    const lineGeometry = new THREE.BufferGeometry();
    const MAX_LINES = PARTICLE_COUNT * PARTICLE_COUNT;
    const linePositions = new Float32Array(MAX_LINES * 6);
    const lineColors = new Float32Array(MAX_LINES * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    /* Mouse tracking */
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    /* Resize */
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      camera.aspect = parent.clientWidth / parent.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(parent.clientWidth, parent.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    /* Animation loop */
    const CONNECTION_DISTANCE = 100;
    const AMBER_R = 255 / 255;
    const AMBER_G = 161 / 255;
    const AMBER_B = 3 / 255;
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const pos = particleGeometry.attributes.position.array;

      /* Mover partículas */
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        /* Bounce nas bordas */
        if (Math.abs(pos[i * 3]) > spread / 2) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > spread / 2) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 75) velocities[i].z *= -1;
      }

      particleGeometry.attributes.position.needsUpdate = true;

      /* Linhas de conexão */
      let lineIndex = 0;
      const lp = lineGeometry.attributes.position.array;
      const lc = lineGeometry.attributes.color.array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = 1 - dist / CONNECTION_DISTANCE;
            const idx = lineIndex * 6;

            lp[idx] = pos[i * 3];
            lp[idx + 1] = pos[i * 3 + 1];
            lp[idx + 2] = pos[i * 3 + 2];
            lp[idx + 3] = pos[j * 3];
            lp[idx + 4] = pos[j * 3 + 1];
            lp[idx + 5] = pos[j * 3 + 2];

            lc[idx] = AMBER_R * alpha;
            lc[idx + 1] = AMBER_G * alpha;
            lc[idx + 2] = AMBER_B * alpha;
            lc[idx + 3] = AMBER_R * alpha;
            lc[idx + 4] = AMBER_G * alpha;
            lc[idx + 5] = AMBER_B * alpha;

            lineIndex++;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIndex * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      /* Rotação suave com mouse */
      const targetRotX = mouseRef.current.y * 0.15;
      const targetRotY = mouseRef.current.x * 0.15;
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.02;
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, [canvasRef]);
}

/* ── Scroll Reveal Hook ── */
function useScrollReveal() {
  const observe = useCallback((node) => {
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return observe;
}

/* ── Componente Principal ── */
export default function SobreRaedClient() {
  const canvasRef = useRef(null);
  const observe = useScrollReveal();

  useParticleNetwork(canvasRef);

  /* Refs para scroll reveal staggered nos valores */
  const valorRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index, 10);
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, idx * 120);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    valorRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sobre-page">
      {/* Background Three.js */}
      <canvas ref={canvasRef} className="sobre-canvas" />

      <div className="sobre-content">
        {/* ── Hero ── */}
        <section className="sobre-hero" ref={observe}>
          {/* Logo SVG animado */}
          <div className="sobre-logo-wrapper">
            <svg
              className="sobre-logo-svg"
              viewBox="0 255.5 612 260"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="sobre-logo-path"
                d="M499.449,471.512c-2.231,0-4.207-1.274-5.004-1.849c-0.797-0.542-1.467-1.435-1.977-2.613
	c-0.51-1.212-0.765-2.933-0.765-5.196v-25.372c0-5.26,0.765-9.913,2.263-13.993s3.634-7.555,6.407-10.455
	c2.772-2.9,6.056-5.195,9.849-6.885c3.825-1.689,8.033-2.742,12.623-3.156h82.843v-40.226h-0.159l-100.661-95.529h-56.642
	l100.82,95.529c-4.494,0-35.477,0.542-40.608,1.689c-5.101,1.116-10.169,2.964-15.205,5.482s-9.849,5.738-14.439,9.658
	c-4.59,3.92-8.638,8.638-12.176,14.152c-3.506,5.515-6.312,11.89-8.383,19.093c-2.051,7.16-3.066,15.258-3.088,24.32H341.923
	c-4.813,0-8.766-1.657-11.921-4.94s-4.718-7.745-4.718-13.323v-59.766c0-5.259,1.435-9.658,4.335-13.164s7.013-5.259,12.304-5.259
	h68.946c0.414-0.032,0.828-0.064,1.243-0.064c7.649,0,13.833,6.279,13.833,13.993s-6.184,13.993-13.833,13.993
	c-0.128,0-0.256,0-0.351,0h-69.774v40.832h70.315c9.786,0,18.105-1.977,24.959-5.929c6.853-3.952,12.398-8.861,16.639-14.726
	c4.239-5.865,7.331-12.272,9.212-19.189c1.912-6.917,1.052-30.695-2.551-38.218c-3.602-7.522-8.064-13.611-13.419-18.265
	c-5.355-4.654-11.156-8.032-17.404-10.136c-6.247-2.072-12.08-3.124-17.467-3.124h-70.316c-9.786,0-18.105,1.976-24.958,5.929
	c-4.112,2.391-7.618,5.1-10.774,8.192c-0.351-0.287-12.048-8.734-18.296-10.806s-12.081-3.124-17.467-3.124H155.012
	c-0.106-0.414-0.208-0.826-0.323-1.243c-1.562-5.642-4.112-10.934-7.618-15.842c-3.538-4.877-8.096-8.957-13.738-12.208
	c-5.642-3.251-12.559-3.57-20.719-3.57H6.216v38.218h106.431c2.231,0,4.207,1.275,5.004,1.849c0.797,0.542,1.466,1.434,1.977,2.614
	c0.51,1.211,0.765,2.933,0.765,5.195v25.373c0,5.259-0.765,9.913-2.263,13.993s-3.634,7.554-6.407,10.455
	c-2.773,2.901-6.056,5.196-9.849,6.885c-3.825,1.689-8.033,2.741-12.623,3.155H6.375v40.227h0.191l100.661,95.497h56.706
	L63.112,414.137c4.495,0,35.477-0.542,40.609-1.689c5.1-1.115,10.168-2.965,15.205-5.482c5.036-2.518,9.849-5.737,14.439-9.658
	c4.59-3.92,8.638-8.638,12.176-14.152c3.506-5.514,6.312-11.889,8.383-19.093c2.05-7.159,3.066-15.258,3.088-24.32h113.416
	c4.813,0,8.766,1.657,11.921,4.94c3.156,3.283,4.718,7.746,4.718,13.324v59.766c0,5.26-1.435,9.658-4.335,13.164
	c-2.901,3.507-7.013,5.26-12.304,5.26h-68.914c-0.414,0.032-0.829,0.063-1.243,0.063c-7.65,0-13.833-6.279-13.833-13.993
	s6.184-13.993,13.833-13.993c0.127,0,0.255,0,0.351,0h69.774V367.44h-70.284c-9.786,0-18.105,1.976-24.958,5.929
	c-6.854,3.953-12.399,8.861-16.639,14.727c-4.239,5.865-7.331,12.272-9.211,19.188c-1.945,6.918-1.084,30.696,2.518,38.219
	c3.602,7.522,8.064,13.61,13.419,18.265c5.355,4.653,11.156,8.032,17.403,10.136c6.248,2.072,12.081,3.124,17.468,3.124h70.316
	c9.786,0,18.105-1.977,24.958-5.929c4.111-2.391,7.618-5.101,10.773-8.192c0.351,0.287,12.049,8.734,18.297,10.806
	c6.247,2.072,12.08,3.124,17.467,3.124h115.224c0.106,0.414,0.208,0.825,0.323,1.243c1.563,5.642,4.112,10.933,7.618,15.842
	c3.538,4.877,8.097,8.957,13.738,12.208s12.559,3.57,20.719,3.57h106.398v-38.187H499.449z"
              />
            </svg>
          </div>

          <div className="sobre-hero-tag">
            <i className="ph ph-buildings" />
            Cultura &amp; Propósito
          </div>
          <h1>Sobre a Raed</h1>
        </section>

        <div className="sobre-divider" />

        {/* ── Nosso Propósito ── */}
        <section className="sobre-section" ref={observe}>
          <div className="sobre-glass-card">
            <div className="sobre-card-header">
              <div className="sobre-card-icon proposito">
                <i className="ph ph-crosshair" />
              </div>
              <div>
                <p className="sobre-card-title">Nosso Propósito</p>
                <h2 className="sobre-card-heading">Por que existimos</h2>
              </div>
            </div>
            <p className="sobre-card-text">
              &ldquo;Tornar tangível o que habita no imaginário, construindo o
              futuro dos negócios através do código.&rdquo;
            </p>
          </div>
        </section>

        {/* ── Onde Estamos Mirando ── */}
        <section className="sobre-section" ref={observe}>
          <div className="sobre-glass-card">
            <div className="sobre-card-header">
              <div className="sobre-card-icon visao">
                <i className="ph ph-rocket-launch" />
              </div>
              <div>
                <p className="sobre-card-title">Onde Estamos Mirando</p>
                <h2 className="sobre-card-heading">Nossa Visão</h2>
              </div>
            </div>
            <p className="sobre-card-text">
              &ldquo;Ser reconhecida pela entrega de sistemas complexos e
              inovadores que transformam negócios e lideram mercados.&rdquo;
            </p>
          </div>
        </section>

        <div className="sobre-divider" />

        {/* ── Valores ── */}
        <section className="sobre-valores-section" ref={observe}>
          <div className="sobre-valores-header">
            <h2>No que acreditamos</h2>
            <p>Os pilares que sustentam cada decisão e cada linha de código.</p>
          </div>

          <div className="sobre-valores-grid">
            {VALORES.map((valor, idx) => (
              <div
                key={idx}
                className="sobre-valor-card"
                data-index={idx}
                ref={(el) => { valorRefs.current[idx] = el; }}
              >
                <div className="sobre-valor-icon">
                  <i className={`ph ${valor.icon}`} />
                </div>
                <h3 className="sobre-valor-title">{valor.title}</h3>
                <p className="sobre-valor-desc">{valor.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <section className="sobre-footer" ref={observe}>
          <div className="sobre-footer-line">
            <span className="dot" />
            Raed — Construindo o futuro
          </div>
        </section>
      </div>
    </div>
  );
}
