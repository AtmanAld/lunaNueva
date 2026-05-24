const fs = require('fs');

const content = fs.readFileSync('spiral_messages.md', 'utf8');

// The file contains `messageCatalog: {`
const startIndex = content.indexOf('messageCatalog: {');
if (startIndex !== -1) {
  // We want to export it as a module
  let jsContent = content.substring(startIndex);
  // Replace `messageCatalog: {` with `export const spiralCatalog = {`
  jsContent = jsContent.replace('messageCatalog: {', 'export const spiralCatalog = {');
  
  // Make sure to write it to src/data directory
  if (!fs.existsSync('src/data')) {
    fs.mkdirSync('src/data', { recursive: true });
  }
  
  fs.writeFileSync('src/data/spiralCatalog.js', jsContent, 'utf8');
  console.log('spiralCatalog.js extracted successfully.');
} else {
  console.log('messageCatalog not found');
}
