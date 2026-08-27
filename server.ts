import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Real SMM Provider API Proxy Route (/api/smm)
  app.post('/api/smm', async (req, res) => {
    try {
      const apiUrl = process.env.SMM_API_URL || process.env.VITE_SMM_API_URL || 'https://alsharq-world.com/api/v2';
      const apiKey = process.env.SMM_API_KEY || process.env.VITE_SMM_API_KEY || '';

      const bodyParams = new URLSearchParams();
      if (apiKey) {
        bodyParams.append('key', apiKey);
      }

      const incoming = req.body || {};
      Object.keys(incoming).forEach(k => {
        if (incoming[k] !== undefined && incoming[k] !== null) {
          bodyParams.append(k, String(incoming[k]));
        }
      });

      if (!apiKey) {
        // If no API key set yet, inform caller to fall back or return empty
        return res.json({ error: 'No API key configured' });
      }

      const providerRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      });

      if (!providerRes.ok) {
        const errorText = await providerRes.text();
        return res.status(providerRes.status).json({ error: errorText || providerRes.statusText });
      }

      const data = await providerRes.json();
      return res.json(data);
    } catch (err: any) {
      console.error('Error proxying SMM API request:', err);
      return res.status(500).json({ error: err.message || 'Server error proxying request' });
    }
  });

  // Health check API
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for dev mode or Static file serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
