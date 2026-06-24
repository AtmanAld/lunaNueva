const fs = require('fs');
const path = require('path');
const base = 'c:/Users/ameli/.gemini/antigravity/scratch/luna-nueva/public/Album Mágico';
const dirs = ['1', '2', '3'];
for (const d of dirs) {
  const dir = path.join(base, d);
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.svg')) {
      const content = fs.readFileSync(path.join(dir, f), 'utf-8');
      const fills = [...content.matchAll(/fill=\"([^\"]+)\"/g)].map(m => m[1]);
      console.log(d + '/' + f + ' fills:', Array.from(new Set(fills)));
    }
  }
}
