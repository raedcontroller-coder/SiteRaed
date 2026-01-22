import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ParticleSystem } from './src/particles/ParticleSystem.js';
import { HandTracker } from './src/tracking/HandTracker.js';

class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.video = document.getElementById('video');
        this.gestureInfo = document.getElementById('gesture-info');

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ReinhardToneMapping;

        // Post-processing
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(this.bloomPass);

        this.particleSystem = new ParticleSystem(this.scene);
        this.handTracker = new HandTracker(this.video, this.handleHandResults.bind(this));

        this.camera.position.z = 15;

        this.templates = ['sphere', 'heart', 'saturn', 'flower', 'fireworks'];
        this.currentTemplateIndex = 0;
        this.lastTemplateSwitch = 0;
        this.currentHandData = null;

        this.init();
        this.animate();
        console.log('App initialized');
    }

    async init() {
        try {
            window.addEventListener('resize', () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.composer.setSize(window.innerWidth, window.innerHeight);
            });

            console.log('Starting hand tracker...');
            await this.handTracker.start();
            console.log('Hand tracker started');
            this.particleSystem.setTemplate('sphere');
        } catch (error) {
            console.error('Error during initialization:', error);
            this.gestureInfo.innerText = 'Erro ao acessar a câmera. Verifique as permissões.';
        }
    }

    handleHandResults(handData) {
        this.currentHandData = handData;
        if (handData) {
            this.gestureInfo.innerText = `Mão detectada: ${handData.isOpen ? 'Aberta (Expande)' : 'Fechada (Troca)'}`;
            
            const now = Date.now();
            if (!handData.isOpen && now - this.lastTemplateSwitch > 2000) {
                this.currentTemplateIndex = (this.currentTemplateIndex + 1) % this.templates.length;
                const nextTemplate = this.templates[this.currentTemplateIndex];
                this.particleSystem.setTemplate(nextTemplate);
                this.lastTemplateSwitch = now;
                
                this.particleSystem.updateColors({
                    r: Math.random(),
                    g: Math.random(),
                    b: Math.random()
                });
            }
        } else {
            this.gestureInfo.innerText = 'Aproxime sua mão da câmera';
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.particleSystem.particles.rotation.y += 0.005;
        this.particleSystem.particles.rotation.x += 0.002;

        this.particleSystem.update(this.currentHandData);
        this.composer.render();
    }
}

new App();
