import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const assetsDir = path.resolve('dist/assets');

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

try {
  const files = readdirSync(assetsDir)
    .map((name) => {
      const fullPath = path.join(assetsDir, name);
      const stats = statSync(fullPath);
      return {
        name,
        bytes: stats.size,
      };
    })
    .filter((entry) => entry.name.endsWith('.js') || entry.name.endsWith('.css'))
    .sort((a, b) => b.bytes - a.bytes);

  if (files.length === 0) {
    console.log('No JS/CSS assets found in dist/assets. Run `npm run build` first.');
    process.exit(0);
  }

  console.log('Bundle report (largest first):');
  for (const file of files) {
    console.log(`- ${file.name}: ${formatKB(file.bytes)}`);
  }
} catch (error) {
  console.error('Failed to read dist/assets. Run `npm run build` first.');
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}
