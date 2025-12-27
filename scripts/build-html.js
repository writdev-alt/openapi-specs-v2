const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('Building documentation with Redocly...');

try {
  // Use Redocly build-docs command to build static documentation
  // Output to a specific HTML file, then we'll move it
  const tempHtml = path.join(distDir, 'temp.html');
  
  execSync(`npx redocly build-docs openapi.yaml -o ${tempHtml}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // Move temp.html to index.html and inject favicon links
  if (fs.existsSync(tempHtml)) {
    let htmlContent = fs.readFileSync(tempHtml, 'utf8');
    
    // Inject favicon links into the <head> section
    const faviconLinks = `
  <!-- Favicons for multiple sizes -->
  <link rel="icon" type="image/png" sizes="16x16" href="./assets/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="./assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="./assets/favicon-96x96.png">
  <link rel="apple-touch-icon" sizes="180x180" href="./assets/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="./assets/android-chrome-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="./assets/android-chrome-512x512.png">
  <link rel="manifest" href="./assets/site.webmanifest">`;
    
    // Insert favicon links after the <head> tag or after the first meta/viewport tag
    htmlContent = htmlContent.replace(
      /(<head[^>]*>)/i,
      `$1${faviconLinks}`
    );
    
    fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
    fs.unlinkSync(tempHtml);
  }

  // Copy logo assets to dist/assets directory
  const assetsDir = path.join(__dirname, '..', 'assets');
  const distAssetsDir = path.join(distDir, 'assets');
  if (!fs.existsSync(distAssetsDir)) {
    fs.mkdirSync(distAssetsDir, { recursive: true });
  }
  
  // Copy logo assets
  const logosToCopy = ['logo.png', 'logo-light.png'];
  logosToCopy.forEach(asset => {
    const srcPath = path.join(assetsDir, asset);
    const destPath = path.join(distAssetsDir, asset);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  // Favicons are already generated in dist/assets by generate:favicons script
  // No need to copy them here

  // Copy bundled.yaml to dist for reference
  if (fs.existsSync(path.join(__dirname, '..', 'bundled.yaml'))) {
    fs.copyFileSync(
      path.join(__dirname, '..', 'bundled.yaml'),
      path.join(distDir, 'bundled.yaml')
    );
  }

  // Create .nojekyll file for GitHub Pages
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

  console.log('\n✓ HTML documentation built successfully with Redocly in dist/');
  console.log('✓ Documentation is ready for deployment');
} catch (error) {
  console.error('\n✗ Error building documentation with Redocly');
  console.error('Falling back to manual Redoc build...\n');
  
  // Fallback to manual Redoc build
  const bundledSpec = fs.readFileSync('bundled.yaml', 'utf8');
  
  // Copy bundled.yaml to dist
  fs.copyFileSync('bundled.yaml', path.join(distDir, 'bundled.yaml'));

  // Copy logo assets to dist/assets directory
  const assetsDir = path.join(__dirname, '..', 'assets');
  const distAssetsDir = path.join(distDir, 'assets');
  if (!fs.existsSync(distAssetsDir)) {
    fs.mkdirSync(distAssetsDir, { recursive: true });
  }
  
  // Copy logo assets
  const logosToCopy = ['logo.png', 'logo-light.png'];
  logosToCopy.forEach(asset => {
    const srcPath = path.join(assetsDir, asset);
    const destPath = path.join(distAssetsDir, asset);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  // Favicons should already be generated in dist/assets by generate:favicons script
  // If they don't exist (fallback scenario), they will be missing but build will continue

  // Create HTML template with Redoc
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WRPay API Documentation</title>
  <!-- Favicons for multiple sizes -->
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/android-chrome-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/android-chrome-512x512.png">
  <link rel="manifest" href="/assets/site.webmanifest">
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="redoc-container"></div>
  <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  <script>
    Redoc.init('/bundled.yaml', {}, document.getElementById('redoc-container'));
  </script>
</body>
</html>`;

  // Write HTML file
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlTemplate);

  // Create .nojekyll file for GitHub Pages
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

  console.log('✓ HTML documentation built successfully in dist/');
  console.log('✓ Files created:');
  console.log('  - dist/index.html');
  console.log('  - dist/bundled.yaml');
  logosToCopy.forEach(asset => {
    if (fs.existsSync(path.join(distAssetsDir, asset))) {
      console.log(`  - dist/assets/${asset}`);
    }
  });
  console.log('  - dist/assets/*.png (favicons)');
  console.log('  - dist/assets/site.webmanifest');
}

