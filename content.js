function processImage(originalImage) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create a new image with crossOrigin set
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            // Set canvas size to match loaded image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image to canvas
            ctx.drawImage(img, 0, 0);
            
            // Calculate dimensions
            const barHeight = Math.min(30, Math.floor(canvas.height * 0.05));
            const lineHeight = Math.min(30, Math.floor(barHeight * 0.25));
            const barY = canvas.height - barHeight;
            const lineY = barY - lineHeight;
            
            // Draw white line above black bar
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, lineY, canvas.width, lineHeight);
            
            // Draw black bar
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, barY, canvas.width, barHeight);
            
            // Add text
            const text = 'GAMBLE RESPONSIBLY | #AD';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Calculate font size based on bar height
            const fontSize = Math.min(6, Math.floor(barHeight * 0.6));
            ctx.font = `bold ${fontSize}px Arial`;
            
            // Draw text centered in the black bar
            ctx.fillText(text, canvas.width / 2, barY + (barHeight / 2));
            
            // Convert canvas to base64 URL
            const newImageUrl = canvas.toDataURL('image/png');
            resolve(newImageUrl);
        };

        img.onerror = () => {
            console.error('Failed to load image:', originalImage.src);
            resolve(originalImage.src); // Return original image if we can't process it
        };

        // Try to load the image with a proxy if needed
        if (originalImage.src.startsWith('http')) {
            // Use a CORS proxy to load the image
            // You might need to set up your own proxy or use a service
            img.src = originalImage.src.replace(
                'https://', 
                'https://cors-anywhere.herokuapp.com/'
            );
        } else {
            img.src = originalImage.src;
        }
    });
}

// Main function to process all images on the page
async function processAllImages() {
    const images = document.getElementsByTagName('img');
    
    for (let img of images) {
        // Skip if image is already processed
        if (img.dataset.processed) continue;
        
        // Skip small images (optional)
        if (img.width < 100 || img.height < 100) continue;
        
        try {
            // Process the image
            const newImageUrl = await processImage(img);
            
            // Replace original image with processed version
            img.src = newImageUrl;
            img.dataset.processed = 'true';
        } catch (error) {
            console.error('Error processing image:', error);
        }
    }
}

// Run when page loads
processAllImages();

// Run when new content is loaded (for dynamic websites)
const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
            processAllImages();
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});