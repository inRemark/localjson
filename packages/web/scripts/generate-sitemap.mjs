import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostname = 'https://localjson.com';
const distDir = resolve(__dirname, '../dist');
const routes = [];

// Recursively find all index.html files
function findHtmlFiles(dir, baseDir = dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, baseDir);
    } else if (file === 'index.html') {
      // Convert file path to URL path
      let urlPath = relative(baseDir, dir);
      urlPath = urlPath ? `/${urlPath}` : '/';
      urlPath = urlPath.replace(/\\/g, '/'); // Windows path fix
      routes.push(urlPath);
    }
  }
}

findHtmlFiles(distDir);

// Generate sitemap XML
const now = new Date().toISOString();
const urlEntries = routes
  .filter(route => !route.includes('/404'))
  .map(route => {
    const priority = route === '/' ? '1.0' : '0.8';
    const url = `${hostname}${route}`;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n');

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlEntries}
</urlset>`;

// Write sitemap.xml
const sitemapPath = join(distDir, 'sitemap.xml');
writeFileSync(sitemapPath, sitemapContent, 'utf-8');

console.log(`✓ Generated sitemap.xml with ${routes.length} routes`);
