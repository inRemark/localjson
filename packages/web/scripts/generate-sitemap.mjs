import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const hostname = 'https://localjson.com';
const distDir = resolve(__dirname, '../dist');
const toolsDir = resolve(__dirname, '../../core/src/tools');

const routes = new Set(['/', '/about', '/apps', '/download', '/privacy']);

if (existsSync(toolsDir)) {
  for (const name of readdirSync(toolsDir)) {
    const indexPath = join(toolsDir, name, 'index.ts');
    if (!existsSync(indexPath)) continue;
    const content = readFileSync(indexPath, 'utf-8');
    const pathMatch = content.match(/path:\s*['"]([^'"]+)['"]/);
    if (pathMatch?.[1]) {
      routes.add(pathMatch[1]);
    }
    const redirectMatch = content.match(/redirectFrom:\s*\[([^\]]+)\]/);
    if (redirectMatch) {
      for (const m of redirectMatch[1].matchAll(/['"]([^'"]+)['"]/g)) {
        routes.add(m[1]);
      }
    }
  }
}

const now = new Date().toISOString();
const urlEntries = [...routes]
  .sort((a, b) => a.localeCompare(b))
  .map((route) => {
    const priority = route === '/' ? '1.0' : '0.8';
    return `  <url>
    <loc>${hostname}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n');

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log(`✓ Generated sitemap.xml with ${routes.size} routes`);
