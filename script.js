document.addEventListener('DOMContentLoaded', () => {
    const githubUsername = 'Pruthvi-l';

    // Dynamic GitHub data fetcher
    async function fetchGitHubStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}`);
            if (!response.ok) return;

            const data = await response.json();

            // Populate live GitHub details onto HUD (but NOT the avatar to avoid CORS taint)
            // Keep local avatar: assets/images/profile.jpg
            if (data.public_repos !== undefined) {
                document.getElementById('gh-repos').textContent = data.public_repos;
            }
            if (data.followers !== undefined) {
                document.getElementById('gh-followers').textContent = data.followers;
            }
        } catch (err) {
            console.log('Using default local stats fallback:', err);
        }
    }

    // Pixelated Grayscale Scan Animation
    function initPixelatedScan() {
        const imgElement = document.getElementById('gh-avatar');
        const canvas = document.getElementById('pixel-canvas');
        
        if (!imgElement || !canvas) return;

        const w = 200;
        const h = 300;
        const pixelSize = 5; // Smaller pixels for clarity
        const animationDuration = 3500; // 3.5s

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // Draw the image to a temporary canvas for sampling
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Wait for image to load
        const draw = () => {
            if (!imgElement.complete || imgElement.naturalHeight === 0) {
                setTimeout(draw, 100);
                return;
            }

            // Draw original image to temp canvas
            tempCtx.drawImage(imgElement, 0, 0, w, h);

            let animationId = null;
            let startTime = null;

            function animate(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = (timestamp - startTime) % animationDuration;
                const progress = elapsed / animationDuration;
                const revealHeight = progress * h; // 0 to 200

                // Clear canvas with black
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, w, h);

                // Draw pixelated grayscale image
                for (let y = 0; y < h; y += pixelSize) {
                    for (let x = 0; x < w; x += pixelSize) {
                        if (y < revealHeight) {
                            // Get average color from this pixel block
                            const imageData = tempCtx.getImageData(x, y, pixelSize, pixelSize);
                            const data = imageData.data;
                            
                            let r = 0, g = 0, b = 0, a = 0;
                            const len = data.length;
                            
                            // Calculate average color
                            for (let i = 0; i < len; i += 4) {
                                r += data[i];
                                g += data[i + 1];
                                b += data[i + 2];
                                a += data[i + 3];
                            }
                            
                            const pixelCount = len / 4;
                            r = Math.floor(r / pixelCount);
                            g = Math.floor(g / pixelCount);
                            b = Math.floor(b / pixelCount);
                            a = Math.floor(a / pixelCount);
                            
                            // Convert to grayscale
                            const gray = Math.floor(r * 0.299 + g * 0.587 + b * 0.114);
                            
                            // Draw grayscale pixel block
                            ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
                            ctx.fillRect(x, y, pixelSize, pixelSize);
                        }
                    }
                }

                animationId = requestAnimationFrame(animate);
            }

            animationId = requestAnimationFrame(animate);
        };

        draw();
    }

    fetchGitHubStats();
    // Wait for DOM to be ready
    setTimeout(initPixelatedScan, 200);
});