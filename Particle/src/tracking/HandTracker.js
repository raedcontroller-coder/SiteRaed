// MediaPipe Hands e Camera são carregados via script tag no index.html para evitar problemas de ESM
const Hands = window.Hands;
const Camera = window.Camera;

export class HandTracker {
    constructor(videoElement, onResults) {
        this.videoElement = videoElement;
        this.onResults = onResults;
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults((results) => {
            this.processResults(results);
        });

        this.camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.hands.send({ image: this.videoElement });
            },
            width: 640,
            height: 480
        });
    }

    start() {
        this.camera.start();
    }

    processResults(results) {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            this.onResults(null);
            return;
        }

        const landmarks = results.multiHandLandmarks[0];
        
        // Posição do pulso (WRIST) como referência central
        const wrist = landmarks[0];
        
        // Calcular se a mão está aberta ou fechada
        // Comparar distância entre ponta dos dedos e o pulso
        const isOpen = this.checkIfHandIsOpen(landmarks);

        this.onResults({
            x: wrist.x,
            y: wrist.y,
            z: wrist.z,
            isOpen: isOpen,
            landmarks: landmarks
        });
    }

    checkIfHandIsOpen(landmarks) {
        // Pontas dos dedos: 8 (indicador), 12 (médio), 16 (anelar), 20 (mínimo)
        // Base dos dedos: 5, 9, 13, 17
        const tips = [8, 12, 16, 20];
        const bases = [5, 9, 13, 17];
        
        let openFingers = 0;
        for (let i = 0; i < tips.length; i++) {
            if (landmarks[tips[i]].y < landmarks[bases[i]].y) {
                openFingers++;
            }
        }
        
        return openFingers >= 3;
    }
}
