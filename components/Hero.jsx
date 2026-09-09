"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function Hero({ onVideoLoaded }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const heroContainerRef = useRef(null);
  const heroContentBlockRef = useRef(null);
  const finalAstraTextRef = useRef(null);
  const videoBgTextRef = useRef(null);
  const heroTitleRef = useRef(null);

  // Video ready notification.
  // The <video> is present in the server-rendered HTML, so the browser can start
  // loading it (and fire "loadedmetadata") before React finishes hydrating and
  // attaches the onLoadedMetadata handler. That race means the JSX event prop
  // alone can miss the event and always fall through to the safety timeout.
  // Checking readyState first covers the case where it already fired.
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !onVideoLoaded) return;

    if (vid.readyState >= 1) { // HAVE_METADATA or further along
      onVideoLoaded();
      return;
    }

    vid.addEventListener('loadedmetadata', onVideoLoaded);
    return () => vid.removeEventListener('loadedmetadata', onVideoLoaded);
  }, [onVideoLoaded]);

  // Text Gradient
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroTitleRef.current) {
        const rect = heroTitleRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        heroTitleRef.current.style.setProperty('--x', `${x}px`);
        heroTitleRef.current.style.setProperty('--y', `${y}px`);
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Video Scroll Control
  useEffect(() => {
    const vid = videoRef.current;
    const heroContainer = heroContainerRef.current;
    if (!vid || !heroContainer) return;

    let targetTime = 0;
    let currentTime = 0;
    const lerpAmount = 0.06;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let targetTextOpacity = 1;
    let currentTextOpacity = 1;
    let animationFrameId;

    const handleScroll = () => {
      const scrollHeight = heroContainer.offsetHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollFraction = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

      // Video animation
      if (scrollFraction <= 0.65) {
        const videoFraction = scrollFraction / 0.65;
        if (vid.duration) {
          targetTime = vid.duration * Math.min(videoFraction, 0.99);
        }
        targetOpacity = 0;
      } else {
        if (vid.duration) {
          targetTime = vid.duration;
        }
        const textFraction = (scrollFraction - 0.65) / 0.35;
        targetOpacity = textFraction;
      }

      // Background text & Logo animation
      if (scrollFraction < 0.4) {
        targetTextOpacity = 1;
      } else if (scrollFraction <= 0.6) {
        targetTextOpacity = 1 - ((scrollFraction - 0.4) / 0.2);
      } else {
        targetTextOpacity = 0;
      }
    };

    window.addEventListener('scroll', handleScroll);

    const updateVideo = () => {
      currentTime += (targetTime - currentTime) * lerpAmount;
      if (Math.abs(targetTime - currentTime) > 0.001) {
        vid.currentTime = currentTime;
      }

      currentOpacity += (targetOpacity - currentOpacity) * lerpAmount;
      currentTextOpacity += (targetTextOpacity - currentTextOpacity) * lerpAmount;

      if (finalAstraTextRef.current) {
        finalAstraTextRef.current.style.opacity = currentOpacity;
      }

      if (heroContentBlockRef.current) {
        heroContentBlockRef.current.style.opacity = currentTextOpacity;
        heroContentBlockRef.current.style.pointerEvents = currentTextOpacity < 0.5 ? 'none' : 'auto';
      }

      if (videoBgTextRef.current) {
        videoBgTextRef.current.style.opacity = currentTextOpacity;
      }

      if (vid) {
        const videoOpacity = Math.max(0, 1 - currentOpacity);
        vid.style.opacity = videoOpacity;
        vid.style.filter = `brightness(${videoOpacity})`;
      }

      animationFrameId = requestAnimationFrame(updateVideo);
    };

    animationFrameId = requestAnimationFrame(updateVideo);
    vid.pause();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;

    const createParticles = () => {
      particles = [];
      const numParticles = Math.floor((width * height) / 15000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2,
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="hero-container" ref={heroContainerRef}>
      <canvas id="bg-canvas" ref={canvasRef}></canvas>
      <div className="video-sticky-wrapper">
        <div className="video-bg-text" ref={videoBgTextRef} style={{ display: 'none' }}>
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="612px"
            height="260px"
            viewBox="0 255.5 612 260"
            enableBackground="new 0 255.5 612 260"
            xmlSpace="preserve"
          >
            <path d="M499.449,471.512c-2.231,0-4.207-1.274-5.004-1.849c-0.797-0.542-1.467-1.435-1.977-2.613 c-0.51-1.212-0.765-2.933-0.765-5.196v-25.372c0-5.26,0.765-9.913,2.263-13.993s3.634-7.555,6.407-10.455 c2.772-2.9,6.056-5.195,9.849-6.885c3.825-1.689,8.033-2.742,12.623-3.156h82.843v-40.226h-0.159l-100.661-95.529h-56.642 l100.82,95.529c-4.494,0-35.477,0.542-40.608,1.689c-5.101,1.116-10.169,2.964-15.205,5.482s-9.849,5.738-14.439,9.658 c-4.59,3.92-8.638,8.638-12.176,14.152c-3.506,5.515-6.312,11.89-8.383,19.093c-2.051,7.16-3.066,15.258-3.088,24.32H341.923 c-4.813,0-8.766-1.657-11.921-4.94s-4.718-7.745-4.718-13.323v-59.766c0-5.259,1.435-9.658,4.335-13.164s7.013-5.259,12.304-5.259 h68.946c0.414-0.032,0.828-0.064,1.243-0.064c7.649,0,13.833,6.279,13.833,13.993s-6.184,13.993-13.833,13.993 c-0.128,0-0.256,0-0.351,0h-69.774v40.832h70.315c9.786,0,18.105-1.977,24.959-5.929c6.853-3.952,12.398-8.861,16.639-14.726 c4.239-5.865,7.331-12.272,9.212-19.189c1.912-6.917,1.052-30.695-2.551-38.218c-3.602-7.522-8.064-13.611-13.419-18.265 c-5.355-4.654-11.156-8.032-17.404-10.136c-6.247-2.072-12.08-3.124-17.467-3.124h-70.316c-9.786,0-18.105,1.976-24.958,5.929 c-4.112,2.391-7.618,5.1-10.774,8.192c-0.351-0.287-12.048-8.734-18.296-10.806s-12.081-3.124-17.467-3.124H155.012 c-0.106-0.414-0.208-0.826-0.323-1.243c-1.562-5.642-4.112-10.934-7.618-15.842c-3.538-4.877-8.096-8.957-13.738-12.208 c-5.642-3.251-12.559-3.57-20.719-3.57H6.216v38.218h106.431c2.231,0,4.207,1.275,5.004,1.849c0.797,0.542,1.466,1.434,1.977,2.614 c0.51,1.211,0.765,2.933,0.765,5.195v25.373c0,5.259-0.765,9.913-2.263,13.993s-3.634,7.554-6.407,10.455 c-2.773,2.901-6.056,5.196-9.849,6.885c-3.825,1.689-8.033,2.741-12.623,3.155H6.375v40.227h0.191l100.661,95.497h56.706 L63.112,414.137c4.495,0,35.477-0.542,40.609-1.689c5.1-1.115,10.168-2.965,15.205-5.482c5.036-2.518,9.849-5.737,14.439-9.658 c4.59-3.92,8.638-8.638,12.176-14.152c3.506-5.514,6.312-11.889,8.383-19.093c2.05-7.159,3.066-15.258,3.088-24.32h113.416 c4.813,0,8.766,1.657,11.921,4.94c3.156,3.283,4.718,7.746,4.718,13.324v59.766c0,5.26-1.435,9.658-4.335,13.164 c-2.901,3.507-7.013,5.26-12.304,5.26h-68.914c-0.414,0.032-0.829,0.063-1.243,0.063c-7.65,0-13.833-6.279-13.833-13.993 s6.184-13.993,13.833-13.993c0.127,0,0.255,0,0.351,0h69.774V367.44h-70.284c-9.786,0-18.105,1.976-24.958,5.929 c-6.854,3.953-12.399,8.861-16.639,14.727c-4.239,5.865-7.331,12.272-9.211,19.188c-1.945,6.918-1.084,30.696,2.518,38.219 c3.602,7.522,8.064,13.61,13.419,18.265c5.355,4.653,11.156,8.032,17.403,10.136c6.248,2.072,12.081,3.124,17.468,3.124h70.316 c9.786,0,18.105-1.977,24.958-5.929c4.111-2.391,7.618-5.101,10.773-8.192c0.351,0.287,12.049,8.734,18.297,10.806 c6.247,2.072,12.08,3.124,17.467,3.124h115.224c0.106,0.414,0.208,0.825,0.323,1.243c1.563,5.642,4.112,10.933,7.618,15.842 c3.538,4.877,8.097,8.957,13.738,12.208s12.559,3.57,20.719,3.57h106.398v-38.187H499.449z" />
          </svg>
        </div>

        <video
          id="v0"
          ref={videoRef}
          tabIndex="0"
          autobuffer="auto"
          preload="auto"
          muted
          playsInline
        >
          <source src="/astronauta/astro.webm" type="video/webm" />
        </video>

        <div className="final-astra-text" ref={finalAstraTextRef}>
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="612px"
            height="260px"
            viewBox="0 255.5 612 260"
            enableBackground="new 0 255.5 612 260"
            xmlSpace="preserve"
          >
            <path d="M499.449,471.512c-2.231,0-4.207-1.274-5.004-1.849c-0.797-0.542-1.467-1.435-1.977-2.613 c-0.51-1.212-0.765-2.933-0.765-5.196v-25.372c0-5.26,0.765-9.913,2.263-13.993s3.634-7.555,6.407-10.455 c2.772-2.9,6.056-5.195,9.849-6.885c3.825-1.689,8.033-2.742,12.623-3.156h82.843v-40.226h-0.159l-100.661-95.529h-56.642 l100.82,95.529c-4.494,0-35.477,0.542-40.608,1.689c-5.101,1.116-10.169,2.964-15.205,5.482s-9.849,5.738-14.439,9.658 c-4.59,3.92-8.638,8.638-12.176,14.152c-3.506,5.515-6.312,11.89-8.383,19.093c-2.051,7.16-3.066,15.258-3.088,24.32H341.923 c-4.813,0-8.766-1.657-11.921-4.94s-4.718-7.745-4.718-13.323v-59.766c0-5.259,1.435-9.658,4.335-13.164s7.013-5.259,12.304-5.259 h68.946c0.414-0.032,0.828-0.064,1.243-0.064c7.649,0,13.833,6.279,13.833,13.993s-6.184,13.993-13.833,13.993 c-0.128,0-0.256,0-0.351,0h-69.774v40.832h70.315c9.786,0,18.105-1.977,24.959-5.929c6.853-3.952,12.398-8.861,16.639-14.726 c4.239-5.865,7.331-12.272,9.212-19.189c1.912-6.917,1.052-30.695-2.551-38.218c-3.602-7.522-8.064-13.611-13.419-18.265 c-5.355-4.654-11.156-8.032-17.404-10.136c-6.247-2.072-12.08-3.124-17.467-3.124h-70.316c-9.786,0-18.105,1.976-24.958,5.929 c-4.112,2.391-7.618,5.1-10.774,8.192c-0.351-0.287-12.048-8.734-18.296-10.806s-12.081-3.124-17.467-3.124H155.012 c-0.106-0.414-0.208-0.826-0.323-1.243c-1.562-5.642-4.112-10.934-7.618-15.842c-3.538-4.877-8.096-8.957-13.738-12.208 c-5.642-3.251-12.559-3.57-20.719-3.57H6.216v38.218h106.431c2.231,0,4.207,1.275,5.004,1.849c0.797,0.542,1.466,1.434,1.977,2.614 c0.51,1.211,0.765,2.933,0.765,5.195v25.373c0,5.259-0.765,9.913-2.263,13.993s-3.634,7.554-6.407,10.455 c-2.773,2.901-6.056,5.196-9.849,6.885c-3.825,1.689-8.033,2.741-12.623,3.155H6.375v40.227h0.191l100.661,95.497h56.706 L63.112,414.137c4.495,0,35.477-0.542,40.609-1.689c5.1-1.115,10.168-2.965,15.205-5.482c5.036-2.518,9.849-5.737,14.439-9.658 c4.59-3.92,8.638-8.638,12.176-14.152c3.506-5.514,6.312-11.889,8.383-19.093c2.05-7.159,3.066-15.258,3.088-24.32h113.416 c4.813,0,8.766,1.657,11.921,4.94c3.156,3.283,4.718,7.746,4.718,13.324v59.766c0,5.26-1.435,9.658-4.335,13.164 c-2.901,3.507-7.013,5.26-12.304,5.26h-68.914c-0.414,0.032-0.829,0.063-1.243,0.063c-7.65,0-13.833-6.279-13.833-13.993 s6.184-13.993,13.833-13.993c0.127,0,0.255,0,0.351,0h69.774V367.44h-70.284c-9.786,0-18.105,1.976-24.958,5.929 c-6.854,3.953-12.399,8.861-16.639,14.727c-4.239,5.865-7.331,12.272-9.211,19.188c-1.945,6.918-1.084,30.696,2.518,38.219 c3.602,7.522,8.064,13.61,13.419,18.265c5.355,4.653,11.156,8.032,17.403,10.136c6.248,2.072,12.081,3.124,17.468,3.124h70.316 c9.786,0,18.105-1.977,24.958-5.929c4.111-2.391,7.618-5.101,10.773-8.192c0.351,0.287,12.049,8.734,18.297,10.806 c6.247,2.072,12.08,3.124,17.467,3.124h115.224c0.106,0.414,0.208,0.825,0.323,1.243c1.563,5.642,4.112,10.933,7.618,15.842 c3.538,4.877,8.097,8.957,13.738,12.208s12.559,3.57,20.719,3.57h106.398v-38.187H499.449z" />
          </svg>
          <p className="final-astra-slogan">
            Tornarmos tangível o que habita no imaginário,<br />construindo o futuro dos negócios através do código.
          </p>
        </div>

        <div className="container hero-content" ref={heroContentBlockRef} style={{ transform: 'translateY(10vh)' }}>
          <div className="hero-text">
            <h1 ref={heroTitleRef}>
              Software e IA <br />Orientados a <br />Resultado.
            </h1>
            <div className="hero-actions">
              <a href="#contact" className="btn-primary">
                <i className="ph ph-arrow-right"></i>
                Iniciar Projeto
              </a>
              <a href="#services" className="btn-primary" style={{ borderColor: 'transparent', color: 'var(--text-secondary)' }}>
                Explorar Nossos Serviços
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
