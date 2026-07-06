# Guia Técnico: Implementação de Vídeo Transparente Controlado por Scroll

Este documento detalha o processo de engenharia utilizado para implementar um elemento de vídeo transparente (`.webm`) cujo progresso é controlado dinamicamente pelo scroll do usuário, garantindo alta fidelidade visual e performance fluida.

---

## 1. O Desafio do Controle de Vídeo por Scroll

Navegadores web não foram projetados nativamente para retroceder vídeos ou pular para frames específicos em alta velocidade. Ao alterar o `currentTime` de um vídeo via JavaScript (Lerp), o navegador precisa decodificar os frames sob demanda. Se o vídeo não estiver otimizado, ocorrerão travamentos severos (stuttering).

### Requisitos para Scroll Suave:
1. **Intra-only Encoding (GOP = 1):** Cada frame do vídeo DEVE ser um *Keyframe* (I-Frame). Em vídeos normais, apenas alguns frames guardam a imagem completa (outros guardam apenas a diferença). Para scroll, precisamos da imagem completa em todos os frames.
2. **Remoção de Áudio:** O processamento de áudio é desnecessário para essa técnica e consome recursos de CPU.
3. **Resolução Adequada:** Vídeos com resoluções muito altas (ex: 4K ou 1080p pesado) travam a decodificação em tempo real.

---

## 2. Pipeline de Processamento FFmpeg (Chroma Key + Otimização)

Para transformar um arquivo `.mp4` com fundo verde (Chroma Key) em um arquivo `.webm` transparente e otimizado, utilize o seguinte comando do **FFmpeg**:

```bash
ffmpeg -i input.mp4 -vf "chromakey=0x00FF00:0.22:0.15,despill=type=green,scale=800:-2" -an -c:v libvpx-vp9 -pix_fmt yuva420p -g 1 -auto-alt-ref 0 output.webm
```

### Desmembramento dos Parâmetros:

| Parâmetro | Função |
| :--- | :--- |
| `-vf "chromakey=..."` | Remove a cor verde (`0x00FF00`). `0.22` é a similaridade (tolerância) e `0.15` é a suavidade da borda. |
| `despill=type=green` | Filtro avançado que remove o reflexo verde ("outglow/spill") das bordas do objeto. |
| `scale=800:-2` | Redimensiona a largura para 800px (ajuste conforme necessário) para reduzir o peso de decodificação. |
| `-an` | **Audio None:** Remove completamente a faixa de áudio. |
| `-c:v libvpx-vp9` | Codec de vídeo VP9 (suporta canal alfa no WebM). |
| `-pix_fmt yuva420p` | Formato de pixel YUV + Alfa (essencial para transparência). |
| `-g 1` | **GOP size 1:** Define que cada frame é um keyframe independente. |

---

## 3. Implementação no Frontend

### HTML (Estrutura Sticky)
O vídeo deve ficar preso na tela (`sticky`) enquanto a seção "hero" dá espaço para o scroll.

```html
<section class="hero-container">
    <div class="video-sticky-wrapper">
        <video id="v0" muted playsinline preload="auto">
            <source src="output.webm" type="video/webm">
        </video>
        <div class="content">Conteúdo por cima ou atrás</div>
    </div>
</section>
```

### CSS (Profundidade e Efeitos)
Para colocar elementos *atrás* do astronauta transparente:
- O vídeo deve ter um `z-index` superior ao fundo, mas inferior aos textos da frente.
- O vídeo NÃO precisa de `mix-blend-mode` se o canal alfa estiver correto.

```css
.hero-container { height: 400vh; } /* Espaço do scroll */
.video-sticky-wrapper { position: sticky; top: 0; height: 100vh; }

#v0 {
    position: absolute;
    z-index: 2; /* Fica no meio */
    object-fit: contain;
}

.background-text {
    z-index: 1; /* Atrás do vídeo */
}
```

### JavaScript (Scroll Lerp)
Utiliza Interpolação Linear (Lerp) para suavizar a movimentação do vídeo.

```javascript
const vid = document.getElementById('v0');
const hero = document.querySelector('.hero-container');
let targetTime = 0;
let currentTime = 0;
const lerpAmount = 0.06;

window.addEventListener('scroll', () => {
    const maxScroll = hero.offsetHeight - window.innerHeight;
    const scrollFraction = Math.min(Math.max(window.pageYOffset / maxScroll, 0), 1);
    if (vid.duration) targetTime = vid.duration * scrollFraction;
});

function updateVideo() {
    currentTime += (targetTime - currentTime) * lerpAmount;
    if (Math.abs(targetTime - currentTime) > 0.001) {
        vid.currentTime = currentTime;
    }
    requestAnimationFrame(updateVideo);
}
vid.pause();
requestAnimationFrame(updateVideo);

C:\ffmpeg\bin\ffmpeg.exe -i c:\Users\Glen\Documents\Raed\EpicFront\astronauta\chromakey.mp4 -vf "chromakey=0x00FF00:0.22:0.15,despill=type=green,scale=800:-2" -an -c:v libvpx-vp9 -pix_fmt yuva420p -g 1 -auto-alt-ref 0 -y c:\Users\Glen\Documents\Raed\EpicFront\astronauta\astro.webm

```

