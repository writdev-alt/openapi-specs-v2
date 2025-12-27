const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Script to generate multiple favicon sizes from a source favicon.png using sharp
 * 
 * Requirements:
 * - sharp library (install via: npm install)
 * 
 * Expected source file: assets/favicon.png
 * Generates files in: dist/assets/ (for deployment)
 */

const assetsDir = path.join(__dirname, '..', 'assets');
const distDir = path.join(__dirname, '..', 'dist');
const distAssetsDir = path.join(distDir, 'assets');
const sourceFavicon = path.join(assetsDir, 'favicon.png');

// Favicon sizes to generate
const faviconSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

// Check if source favicon exists
if (!fs.existsSync(sourceFavicon)) {
  console.error(`❌ Source favicon not found: ${sourceFavicon}`);
  console.error('Please ensure assets/favicon.png exists');
  process.exit(1);
}

// Ensure dist/assets directory exists
if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir, { recursive: true });
}

// Generate favicons using sharp
async function generateFavicons() {
  try {
    console.log('Generating favicons using sharp...\n');
    console.log(`Source: ${sourceFavicon}`);
    console.log(`Output: ${distAssetsDir}\n`);
    
    await Promise.all(
      faviconSizes.map(async ({ name, size }) => {
        const outputPath = path.join(distAssetsDir, name);
        await sharp(sourceFavicon)
          .resize(size, size, { 
            fit: 'contain', 
            background: { r: 255, g: 255, b: 255, alpha: 0 } 
          })
          .png()
          .toFile(outputPath);
        console.log(`✓ Generated ${name} (${size}x${size})`);
      })
    );
    
    // Also copy the source favicon as fallback
    const fallbackPath = path.join(distAssetsDir, 'favicon.png');
    fs.copyFileSync(sourceFavicon, fallbackPath);
    console.log(`✓ Copied favicon.png (fallback)`);
    
    // Create web manifest file for PWA support
    const webmanifestContent = {
      name: "WRPay API Documentation",
      short_name: "WRPay API Docs",
      icons: [
        {
          src: "./assets/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "./assets/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone"
    };
    
    const manifestPath = path.join(distAssetsDir, 'site.webmanifest');
    fs.writeFileSync(manifestPath, JSON.stringify(webmanifestContent, null, 2));
    console.log(`✓ Created site.webmanifest`);
    
    console.log('\n✓ All favicons generated successfully!');
    console.log(`✓ Files saved to: ${distAssetsDir}`);
  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\nPlease install sharp: npm install --save-dev sharp');
    }
    process.exit(1);
  }
}

// Run the generation
generateFavicons();

