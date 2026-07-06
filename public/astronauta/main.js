document.addEventListener('DOMContentLoaded', () => {
    // 1. Controle do Vídeo por Scroll com Lerp (Linear Interpolation)
    const vid = document.getElementById('v0');
    const heroContainer = document.querySelector('.hero-container');
    let targetTime = 0;
    let currentTime = 0;
    const lerpAmount = 0.06; // Um pouco mais suave que o original

    const finalAstraText = document.querySelector('.final-astra-text');
    let targetOpacity = 0;
    let currentOpacity = 0;

    window.addEventListener('scroll', () => {
        const scrollHeight = heroContainer.offsetHeight - window.innerHeight;
        const scrollTop = window.pageYOffset;
        const scrollFraction = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
        
        // Fase 1: Até 65% do scroll controla o vídeo
        // Fase 2: De 65% a 100% controla o fade in do texto
        if (scrollFraction <= 0.65) {
            const videoFraction = scrollFraction / 0.65;
            if (vid.duration) {
                targetTime = vid.duration * Math.min(videoFraction, 0.99); // Evita estourar o vídeo
            }
            targetOpacity = 0;
        } else {
            if (vid.duration) {
                targetTime = vid.duration; // Trava no último frame
            }
            // Fade in do texto nos 35% restantes
            const textFraction = (scrollFraction - 0.65) / 0.35;
            targetOpacity = textFraction;
        }
    });

    function updateVideo() {
        // Interpolação suave do vídeo
        currentTime += (targetTime - currentTime) * lerpAmount;
        if (Math.abs(targetTime - currentTime) > 0.001) {
            vid.currentTime = currentTime;
        }
        
        // Interpolação suave da opacidade do texto
        currentOpacity += (targetOpacity - currentOpacity) * lerpAmount;
        if (finalAstraText) {
            finalAstraText.style.opacity = currentOpacity;
        }
        
        requestAnimationFrame(updateVideo);
    }

    // Inicializa o loop de animação
    requestAnimationFrame(updateVideo);

    // Pausa o vídeo para permitir o controle manual do currentTime
    vid.pause();

    // Garante que o vídeo carregou os metadados para pegar a duração
    vid.addEventListener('loadedmetadata', () => {
        console.log('Duração do vídeo carregada:', vid.duration);
    });

    // 2. Timer da Missão (Relógio Futurista)
    const timerElement = document.getElementById('timer');
    const startTime = Date.now();

    function updateTimer() {
        const elapsedTime = Date.now() - startTime;
        
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

        const format = (num) => String(num).padStart(2, '0');

        timerElement.textContent = `T+ ${format(hours)}:${format(minutes)}:${format(seconds)}`;
    }
    
    setInterval(updateTimer, 1000);

    // 3. Animação de Entrada dos Elementos (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Efeito visual HUD temporário
                entry.target.classList.add('hud-glitch');
                setTimeout(() => {
                    entry.target.classList.remove('hud-glitch');
                }, 400);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.vital-card, .spec-row').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });

    // Estilo dinâmico para o efeito de Glitch HUD
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        .hud-glitch {
            animation: hud-scan 0.4s ease;
        }
        @keyframes hud-scan {
            0% { filter: brightness(2) contrast(2); transform: skewX(-5deg); }
            50% { filter: hue-rotate(180deg); transform: skewX(5deg); }
            100% { filter: brightness(1) contrast(1); transform: skewX(0deg); }
        }
    `;
    document.head.appendChild(styleSheet);
});
