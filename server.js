'use strict';

/* ============================================================================
 * VRIDHI AI — Standalone Node.js Server
 * server.js
 *
 * For platforms like Render, Railway, Fly.io, or VPS.
 * - Serves frontend static files (HTML, CSS, JS, models, assets)
 * - Handles all /api/* routes via existing api/*.js handlers
 * - Zero external dependencies (uses Node built-in http, fs, path, url)
 * ========================================================================= */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm',
};

// Lazy cache for API route handlers
const API_ROUTES = {
  admin: () => require('./api/admin.js'),
  advisories: () => require('./api/advisories.js'),
  agriculture: () => require('./api/agriculture.js'),
  auth: () => require('./api/auth.js'),
  community: () => require('./api/community.js'),
  diagnose: () => require('./api/diagnose.js'),
  google: () => require('./api/google.js'),
  mandi: () => require('./api/mandi.js'),
  outbreaks: () => require('./api/outbreaks.js'),
  protocols: () => require('./api/protocols.js'),
  scans: () => require('./api/scans.js'),
  stats: () => require('./api/stats.js'),
  translate: () => require('./api/translate.js'),
  weather: () => require('./api/weather.js'),
};

function sendFile(res, filePath, status = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end('<h1>404 Not Found</h1>');
    }

    res.statusCode = status;
    res.setHeader('Content-Type', contentType);

    // Caching headers
    if (ext === '.html' || filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (filePath.includes('/models/') || filePath.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Server Error');
      }
    });
    stream.pipe(res);
  });
}

function decorateResponse(res) {
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };

  res.json = function (data) {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    return res.end(JSON.stringify(data));
  };

  res.send = function (body) {
    if (typeof body === 'object' && body !== null && !Buffer.isBuffer(body)) {
      return res.json(body);
    }
    return res.end(body == null ? '' : body);
  };

  return res;
}

const server = http.createServer(async (req, res) => {
  decorateResponse(res);

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
  req.query = parsedUrl.query || {};

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // 1. API routes (/api/*)
  if (pathname.startsWith('/api/')) {
    const routeParts = pathname.slice('/api/'.length).split('/');
    const routeName = routeParts[0];
    const loadHandler = API_ROUTES[routeName];

    if (!loadHandler) {
      return res.status(404).json({ error: 'not_found', path: pathname });
    }

    // Collect request body
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk;
    });

    req.on('end', async () => {
      let parsedBody;
      const ctype = String(req.headers['content-type'] || '');
      if (rawBody && ctype.includes('application/json')) {
        try {
          parsedBody = JSON.parse(rawBody);
        } catch (_) {
          parsedBody = undefined;
        }
      }
      req.body = parsedBody;

      // Re-emitter for handlers reading body stream (e.g., api/auth.js)
      const listeners = {};
      let scheduled = false;
      const origOn = req.on.bind(req);
      req.on = function (ev, cb) {
        (listeners[ev] || (listeners[ev] = [])).push(cb);
        if (!scheduled) {
          scheduled = true;
          setImmediate(() => {
            if (rawBody) (listeners.data || []).forEach(f => f(rawBody));
            (listeners.end || []).forEach(f => f());
          });
        }
        return req;
      };

      try {
        const handler = loadHandler();
        await handler(req, res);
      } catch (err) {
        console.error(`[api/${routeName}] error:`, err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'server_error', message: err.message });
        }
      }
    });

    return;
  }

  // 2. Page Rewrites & Static Routing
  if (pathname === '/' || pathname === '/index.html') {
    return sendFile(res, path.join(ROOT_DIR, 'index.html'));
  }
  if (pathname === '/app') {
    return sendFile(res, path.join(ROOT_DIR, 'app.html'));
  }
  if (pathname === '/login') {
    return sendFile(res, path.join(ROOT_DIR, 'login.html'));
  }
  if (pathname === '/signup') {
    return sendFile(res, path.join(ROOT_DIR, 'signup.html'));
  }
  if (pathname === '/forgot-password') {
    return sendFile(res, path.join(ROOT_DIR, 'forgot-password.html'));
  }
  if (pathname === '/privacy') {
    return sendFile(res, path.join(ROOT_DIR, 'privacy.html'));
  }
  if (pathname === '/terms') {
    return sendFile(res, path.join(ROOT_DIR, 'terms.html'));
  }
  if (pathname === '/admin') {
    return sendFile(res, path.join(ROOT_DIR, 'admin-portal', 'index.html'));
  }
  if (pathname === '/regional-admin' || pathname.startsWith('/regional-admin/')) {
    // If requesting static assets inside regional-admin (e.g. /regional-admin/assets/...)
    const subPath = pathname.slice('/regional-admin'.length);
    const candidatePath = path.join(ROOT_DIR, 'regional-admin', subPath);
    if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
      return sendFile(res, candidatePath);
    }
    // Single page application fallback
    return sendFile(res, path.join(ROOT_DIR, 'regional-admin', 'index.html'));
  }

  // 3. Static Files (css, js, assets, models, etc.)
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const candidateFilePath = path.join(ROOT_DIR, safePath);

  fs.stat(candidateFilePath, (err, stats) => {
    if (!err && stats.isFile()) {
      return sendFile(res, candidateFilePath);
    }
    // Try appending .html
    const htmlCandidate = candidateFilePath + '.html';
    fs.stat(htmlCandidate, (htmlErr, htmlStats) => {
      if (!htmlErr && htmlStats.isFile()) {
        return sendFile(res, htmlCandidate);
      }
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('<h1>404 Not Found</h1>');
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[vridhi-ai] Server running at http://0.0.0.0:${PORT}`);
});
