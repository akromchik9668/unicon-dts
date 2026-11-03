import { loadEnv } from 'vite';
import { requireAccess, privateHeaders } from './access.js';

export function accessPlugin() {
  return {
    name: 'dts-server-access',
    configureServer(server) {
      const settings = { ...loadEnv('auth', server.config.root, 'DTS_AUTH_'), ...process.env };
      server.middlewares.use(async (req, res, next) => {
        try {
          const request = new Request(new URL(req.url, 'http://localhost'), {
            method: req.method,
            headers: req.headers,
          });
          const denied = await requireAccess(request, {
            login: settings.DTS_AUTH_LOGIN || 'unicondts2026',
            password: settings.DTS_AUTH_PASSWORD,
          });
          if (denied) {
            res.statusCode = denied.status;
            denied.headers.forEach((value, name) => res.setHeader(name, value));
            res.end(await denied.text());
            return;
          }
          const headers = new Headers();
          privateHeaders(headers);
          headers.forEach((value, name) => res.setHeader(name, value));
          next();
        } catch {
          res.statusCode = 503;
          res.setHeader('Cache-Control', 'no-store');
          res.end('UNICON DTS: access is temporarily unavailable.');
        }
      });
    },
  };
}
