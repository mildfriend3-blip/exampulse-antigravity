const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3000;
const WEB_DIR = path.join(__dirname, 'web');
const HTML_FILE = path.join(WEB_DIR, 'index.html');
const PROJECT_DIR = __dirname;
const REPO_URL = "https://github.com/mildfriend3-blip/exampulse-antigravity";

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/' || url === '/index.html') {
    if (fs.existsSync(HTML_FILE)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      res.end(fs.readFileSync(HTML_FILE));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('HTML UI not found');
    }
  } else if (url.endsWith('.apk') || url === '/download/apk') {
    const apkPath = path.join(PROJECT_DIR, 'ExamPulse-Antigravity-v2.0.0.apk');
    if (fs.existsSync(apkPath)) {
      const stat = fs.statSync(apkPath);
      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="ExamPulse-Antigravity-v2.0.0.apk"',
        'Content-Length': stat.size
      });
      fs.createReadStream(apkPath).pipe(res);
    } else {
      res.writeHead(302, { 'Location': 'https://github.com/mildfriend3-blip/exampulse-antigravity/releases/download/v2.0.0-antigravity/ExamPulse-Antigravity-v2.0.0.apk' });
      res.end();
    }
  } else if (url === '/download/project.zip') {
    const zipPath = path.join(PROJECT_DIR, 'exampulse-antigravity-source.zip');
    try {
      // Create zip archive of the android codebase if not present
      if (!fs.existsSync(zipPath)) {
        console.log('[Server] Generating project zip bundle...');
        execSync(`powershell -Command "Compress-Archive -Path '${path.join(PROJECT_DIR, 'app')}', '${path.join(PROJECT_DIR, 'build.gradle.kts')}', '${path.join(PROJECT_DIR, 'settings.gradle.kts')}', '${path.join(PROJECT_DIR, 'gradle.properties')}', '${path.join(PROJECT_DIR, 'README.md')}' -DestinationPath '${zipPath}' -Force"`);
      }
      const stat = fs.statSync(zipPath);
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="exampulse-antigravity-source.zip"',
        'Content-Length': stat.size
      });
      fs.createReadStream(zipPath).pipe(res);
    } catch (err) {
      console.error('[Server] Zip error:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error creating zip package: ' + err.message);
    }
  } else if (url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      app: 'ExamPulse // Antigravity',
      version: '2.0.0-ANTIGRAVITY',
      port: PORT,
      repo: REPO_URL
    }));
  } else {
    // Serve static files from web/ if exist
    const filePath = path.join(WEB_DIR, url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.writeHead(200);
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(302, { 'Location': '/' });
      res.end();
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 ExamPulse // Antigravity Zero-G HUD Live Server`);
  console.log(`======================================================`);
  console.log(`📍 Localhost URL: http://localhost:${PORT}`);
  console.log(`🌐 Network URL:   http://127.0.0.1:${PORT}`);
  console.log(`📦 Project Source Bundle: http://localhost:${PORT}/download/project.zip`);
  console.log(`======================================================\n`);
});
