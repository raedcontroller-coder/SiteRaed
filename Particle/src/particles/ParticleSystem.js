import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene, count = 10000) {
        this.scene = scene;
        this.count = count;
        this.particles = null;
        this.geometry = new THREE.BufferGeometry();
        
        // Criar uma textura circular simples
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);

        this.material = new THREE.PointsMaterial({
            size: 0.15,
            map: texture,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.positions = new Float32Array(this.count * 3);
        this.colors = new Float32Array(this.count * 3);
        this.targetPositions = new Float32Array(this.count * 3);
        this.velocities = new Float32Array(this.count * 3);

        this.init();
    }

    init() {
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            // Posicionamento inicial aleatório
            this.positions[i3] = (Math.random() - 0.5) * 10;
            this.positions[i3 + 1] = (Math.random() - 0.5) * 10;
            this.positions[i3 + 2] = (Math.random() - 0.5) * 10;

            this.targetPositions[i3] = this.positions[i3];
            this.targetPositions[i3 + 1] = this.positions[i3 + 1];
            this.targetPositions[i3 + 2] = this.positions[i3 + 2];

            this.colors[i3] = Math.random();
            this.colors[i3 + 1] = Math.random();
            this.colors[i3 + 2] = Math.random();
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

        this.particles = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particles);
    }

    update(handData) {
        const positions = this.geometry.attributes.position.array;
        
        // Fator de escala baseado na mão
        let targetScale = 1.0;
        if (handData) {
            targetScale = handData.isOpen ? 1.5 : 0.6;
        }

        // Suavização para as posições alvo
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            
            const tx = this.targetPositions[i3] * targetScale;
            const ty = this.targetPositions[i3 + 1] * targetScale;
            const tz = this.targetPositions[i3 + 2] * targetScale;

            // Mover em direção ao target escalonado
            positions[i3] += (tx - positions[i3]) * 0.1;
            positions[i3 + 1] += (ty - positions[i3 + 1]) * 0.1;
            positions[i3 + 2] += (tz - positions[i3 + 2]) * 0.1;
        }

        this.geometry.attributes.position.needsUpdate = true;

        if (handData) {
            this.reactToHand(handData);
        }
    }

    reactToHand(handData) {
        // Mover levemente o sistema em direção à mão
        // Inverter o eixo X para compensar o espelhamento da câmera
        const tx = -(handData.x - 0.5) * 15;
        const ty = -(handData.y - 0.5) * 15;

        this.particles.position.x += (tx - this.particles.position.x) * 0.1;
        this.particles.position.y += (ty - this.particles.position.y) * 0.1;
    }

    setTemplate(name) {
        switch (name) {
            case 'sphere':
                this.generateSphere();
                break;
            case 'heart':
                this.generateHeart();
                break;
            case 'saturn':
                this.generateSaturn();
                break;
            case 'flower':
                this.generateFlower();
                break;
            case 'fireworks':
                this.generateFireworks();
                break;
        }
    }

    generateSphere() {
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            const phi = Math.acos(-1 + (2 * i) / this.count);
            const theta = Math.sqrt(this.count * Math.PI) * phi;
            const radius = 3;

            this.targetPositions[i3] = radius * Math.cos(theta) * Math.sin(phi);
            this.targetPositions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            this.targetPositions[i3 + 2] = radius * Math.cos(phi);
        }
    }

    generateHeart() {
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            const t = (i / this.count) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            
            const scale = 0.2;
            this.targetPositions[i3] = x * scale;
            this.targetPositions[i3 + 1] = y * scale;
            this.targetPositions[i3 + 2] = (Math.random() - 0.5) * 2;
        }
    }

    generateSaturn() {
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            if (i < this.count * 0.6) {
                // Planeta (Esfera)
                const phi = Math.acos(-1 + (2 * i) / (this.count * 0.6));
                const theta = Math.sqrt(this.count * 0.6 * Math.PI) * phi;
                const radius = 2;
                this.targetPositions[i3] = radius * Math.cos(theta) * Math.sin(phi);
                this.targetPositions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
                this.targetPositions[i3 + 2] = radius * Math.cos(phi);
            } else {
                // Anel
                const t = Math.random() * Math.PI * 2;
                const r = 3 + Math.random() * 1.5;
                this.targetPositions[i3] = r * Math.cos(t);
                this.targetPositions[i3 + 1] = (Math.random() - 0.5) * 0.2;
                this.targetPositions[i3 + 2] = r * Math.sin(t);
            }
        }
    }

    generateFlower() {
        const petals = 5;
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            const t = (i / this.count) * Math.PI * 2;
            const r = 3 * Math.cos(petals * t);
            this.targetPositions[i3] = r * Math.cos(t);
            this.targetPositions[i3 + 1] = r * Math.sin(t);
            this.targetPositions[i3 + 2] = (Math.random() - 0.5) * 2;
        }
    }

    generateFireworks() {
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            const r = 5 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            this.targetPositions[i3] = r * Math.cos(theta) * Math.sin(phi);
            this.targetPositions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            this.targetPositions[i3 + 2] = r * Math.cos(phi);
        }
    }

    updateColors(baseColor) {
        const colors = this.geometry.attributes.color.array;
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            colors[i3] = baseColor.r + (Math.random() - 0.5) * 0.2;
            colors[i3 + 1] = baseColor.g + (Math.random() - 0.5) * 0.2;
            colors[i3 + 2] = baseColor.b + (Math.random() - 0.5) * 0.2;
        }
        this.geometry.attributes.color.needsUpdate = true;
    }
}
