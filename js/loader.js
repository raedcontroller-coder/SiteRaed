document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loading-screen');
    const modelViewer = document.querySelector('model-viewer');

    if (modelViewer && loader) {
        // Function to hide loader
        const hideLoader = () => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // Wait for transition
        };

        // Wait for model to load
        modelViewer.addEventListener('load', () => {
            // Give a small buffer for animation to start (hide T-pose)
            setTimeout(hideLoader, 500);
        });

        // Safety fallback: if model takes too long (e.g. 8s), hide anyway so user isn't stuck
        setTimeout(hideLoader, 8000);
    }
});
