function processImage(originalImage) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create a new image with crossOrigin set
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        // Create logo image
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        
        img.onload = () => {
            // Set canvas size to match loaded image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw original image to canvas
            ctx.drawImage(img, 0, 0);
            
            // Calculate bar dimensions first (we need this for logo sizing)
            // const barHeight = Math.min(30, Math.floor(canvas.height * 0.05));
            // const lineHeight = Math.min(30, Math.floor(barHeight * 0.25));
            const barHeight = canvas.height * 0.05;
            const lineHeight = barHeight * 0.25;
            const barY = canvas.height - barHeight;
            const lineY = barY - lineHeight;
            
            // Calculate logo dimensions
            const logoHeight = barHeight * 3; // 3 times the black bar height
            const logoWidth = Math.floor(logoHeight * (logoImg.width / logoImg.height)); // maintain aspect ratio
            
            // Calculate logo position
            const logoX = Math.floor(canvas.width * 0.75) - (logoWidth / 2); // 75% from left, centered at that point
            const logoY = canvas.height - logoHeight; // Position from bottom of screen
            
            // Draw white line above black bar
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, lineY, canvas.width, lineHeight);
            
            // Draw black bar
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, barY, canvas.width, barHeight);
            
            // Draw logo on top of the bar
            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
            
            // Add text
            const text = 'GAMBLE RESPONSIBLY | #AD';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Calculate font size based on bar height
            const fontSize = barHeight * 0.6;
            ctx.font = `bold ${fontSize}px Arial`;
            
            // Draw text centered in the black bar, regardless of logo position
            ctx.fillText(text, canvas.width / 2, barY + (barHeight / 2));
            
            // Convert canvas to base64 URL
            const newImageUrl = canvas.toDataURL('image/png');
            resolve(newImageUrl);
        };

        logoImg.onload = () => {
            img.src = originalImage.src;
        };

        img.onerror = () => {
            console.error('Failed to load image:', originalImage.src);
            resolve(originalImage.src);
        };

        logoImg.onerror = () => {
            console.error('Failed to load logo');
            console.log('Attempted logo URL:', chrome.runtime.getURL('stakelogo.png'));
            img.src = originalImage.src;
        };

        // Load the logo from extension resources
        logoImg.src = chrome.runtime.getURL('stakelogo.png');
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