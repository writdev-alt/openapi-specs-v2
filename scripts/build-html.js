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
  
  // Move temp.html to index.html
  if (fs.existsSync(tempHtml)) {
    fs.renameSync(tempHtml, path.join(distDir, 'index.html'));
  }

  // Copy logo assets to dist if they don't exist
  const assets = ['ilona-logo.png', 'ilona-light-logo.png', 'ilona-favicon.png'];
  assets.forEach(asset => {
    const srcPath = path.join(__dirname, '..', asset);
    const destPath = path.join(distDir, asset);
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });

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

  // Copy logo assets
  const assets = ['ilona-logo.png', 'ilona-light-logo.png', 'ilona-favicon.png'];
  assets.forEach(asset => {
    const srcPath = path.join(__dirname, '..', asset);
    const destPath = path.join(distDir, asset);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });

  // Create HTML template with Redoc
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WRPay API Documentation</title>
  <link rel="icon" type="image/png" href="/ilona-favicon.png">
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
    Redoc.init('/bundled.yaml', {
      scrollYOffset: 0,
      hideDownloadButton: false,
      theme: {
        colors: {
          primary: {
            main: '#32329f'
          }
        },
        typography: {
          fontSize: '14px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          code: {
            fontSize: '13px',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace'
          },
          headings: {
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontWeight: '600'
          }
        },
        sidebar: {
          backgroundColor: '#fafafa'
        }
      },
      menuToggle: true,
      nativeScrollbars: true,
      hideHostname: false,
      pathInMiddlePanel: true,
      requiredPropsFirst: true,
      sortPropsAlphabetically: false,
      sortOperationsAlphabetically: false,
      sortTagsAlphabetically: true,
      payloadSampleIdx: 0,
      jsonSampleExpandLevel: 2,
      hideSingleRequestSampleTab: false,
      expandResponses: '200,201',
      hideSchemaPattern: false,
      generatedPayloadSamplesMaxDepth: 10
    }, document.getElementById('redoc-container'));
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
  assets.forEach(asset => {
    if (fs.existsSync(path.join(__dirname, '..', asset))) {
      console.log(`  - dist/${asset}`);
    }
  });
}

