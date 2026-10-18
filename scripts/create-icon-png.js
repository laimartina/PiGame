/**
 * Create 1024x1024 PNG icon with π and ∞ symbols
 * Uses Node.js canvas if available, otherwise provides instructions
 */

const fs = require('fs');
const path = require('path');

async function createIcon() {
    try {
        // Try to use node-canvas
        const { createCanvas } = require('canvas');
        
        const canvas = createCanvas(1024, 1024);
        const ctx = canvas.getContext('2d');

        // Background gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 1024, 1024);
        bgGradient.addColorStop(0, '#0a0a1a');
        bgGradient.addColorStop(0.5, '#1a1a2e');
        bgGradient.addColorStop(1, '#0a0a1a');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, 1024, 1024);

        // Rounded corners
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.roundRect(0, 0, 1024, 1024, 180);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        // Subtle stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(150, 150, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(874, 200, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(155, 93, 229, 0.2)';
        ctx.beginPath();
        ctx.arc(200, 850, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(850, 800, 2, 0, Math.PI * 2);
        ctx.fill();

        // Pi symbol (π) - large, prominent
        ctx.font = '900 380px "Orbitron", Arial, sans-serif';
        const piGradient = ctx.createLinearGradient(300, 200, 724, 580);
        piGradient.addColorStop(0, '#00f5d4');
        piGradient.addColorStop(1, '#00bbf9');
        ctx.fillStyle = piGradient;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 245, 212, 0.6)';
        ctx.shadowBlur = 30;
        ctx.fillText('π', 512, 580);
        ctx.shadowBlur = 0;

        // Infinity symbol (∞) - smaller, to the right
        ctx.font = '900 240px "Orbitron", Arial, sans-serif';
        ctx.fillStyle = '#9b5de5';
        ctx.shadowColor = 'rgba(155, 93, 229, 0.5)';
        ctx.shadowBlur = 20;
        ctx.fillText('∞', 680, 520);
        ctx.shadowBlur = 0;

        // Border glow
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.2)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(1.5, 1.5, 1021, 1021, 180);
        ctx.stroke();

        // Helper for rounded rectangles
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
            this.beginPath();
            this.moveTo(x + radius, y);
            this.lineTo(x + width - radius, y);
            this.quadraticCurveTo(x + width, y, x + width, y + radius);
            this.lineTo(x + width, y + height - radius);
            this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            this.lineTo(x + radius, y + height);
            this.quadraticCurveTo(x, y + height, x, y + height - radius);
            this.lineTo(x, y + radius);
            this.quadraticCurveTo(x, y, x + radius, y);
            this.closePath();
        };

        // Save PNG
        const outputPath = path.join(__dirname, '../icons/app-icon-1024.png');
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        
        console.log('✅ Successfully created: icons/app-icon-1024.png');
        console.log('   Size: 1024x1024 PNG');
        console.log('   Contains: π and ∞ symbols matching game logo style');
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log('⚠️  node-canvas not installed.');
            console.log('\nTo create the PNG icon, you have 3 options:\n');
            console.log('Option 1: Use the HTML converter (Easiest)');
            console.log('  1. Open icons/create-png-icon.html in your browser');
            console.log('  2. Click "Download PNG Icon"');
            console.log('  3. Save it as icons/app-icon-1024.png\n');
            console.log('Option 2: Install node-canvas and run this script');
            console.log('  npm install canvas');
            console.log('  node scripts/create-icon-png.js\n');
            console.log('Option 3: Use online converter');
            console.log('  1. Open icons/app-icon-1024.svg in a browser');
            console.log('  2. Use https://cloudconvert.com/svg-to-png');
            console.log('  3. Set size to 1024x1024\n');
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

createIcon();
