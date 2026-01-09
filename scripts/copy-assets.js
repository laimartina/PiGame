const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Files to copy (some may not exist, that's OK)
const filesToCopy = [
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'sw.js',
  'pi-digits.js',
  'pi-digits-manager.js',
  'supabase.js',
  'dev-mode.js'
].filter(file => {
  // Only include files that exist
  const src = path.join(__dirname, '..', file);
  return fs.existsSync(src);
});

// Copy files
filesToCopy.forEach(file => {
  const src = path.join(__dirname, '..', file);
  const dest = path.join(distDir, file);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  } else {
    console.warn(`⚠ File not found: ${file}`);
  }
});

// Copy icons directory if it exists
const iconsSrc = path.join(__dirname, '..', 'icons');
const iconsDest = path.join(distDir, 'icons');
if (fs.existsSync(iconsSrc)) {
  if (!fs.existsSync(iconsDest)) {
    fs.mkdirSync(iconsDest, { recursive: true });
  }
  const iconFiles = fs.readdirSync(iconsSrc);
  iconFiles.forEach(file => {
    fs.copyFileSync(
      path.join(iconsSrc, file),
      path.join(iconsDest, file)
    );
    console.log(`✓ Copied icons/${file}`);
  });
}

console.log('\n✓ Build complete! Files copied to dist/');
