import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Catch‑all API proxy for Resumify backend.
 * Any request to `/api/<path>` will be forwarded to the real backend URL
 * defined by the `BACKEND_URL` environment variable.
 * The response is streamed back to the client, so the browser only sees
 * the Vercel endpoint (`/api/...`) and never the actual Azure backend URL.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path = [] } = req.query as { path?: string[] };
  const backendBase = process.env.BACKEND_URL;
  if (!backendBase) {
    res.status(500).json({ error: 'Backend URL not configured' });
    return;
  }
  const targetUrl = `${backendBase}/${path.join('/')}`;
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { ...req.headers, host: undefined }, // remove host header
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });
    // Forward status and headers (excluding hop‑by‑hop headers)
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'upgrade'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({ error: 'Bad gateway' });
  }
}
