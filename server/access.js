const encoder = new TextEncoder();

function closedResponse(request, status, message, challenge = false) {
  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'private, no-store',
    'CDN-Cache-Control': 'no-store',
    'Netlify-CDN-Cache-Control': 'no-store',
    'Vary': 'Authorization',
    'X-Content-Type-Options': 'nosniff',
  });
  if (challenge) headers.set('WWW-Authenticate', 'Basic realm="UNICON DTS", charset="UTF-8"');
  return new Response(request.method === 'HEAD' ? null : message, { status, headers });
}

function decodeCredentials(header) {
  const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(header || '');
  if (!match || match[1].length > 4096) return null;
  try {
    const bytes = Uint8Array.from(atob(match[1]), char => char.charCodeAt(0));
    const value = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const separator = value.indexOf(':');
    if (separator < 0) return null;
    return [value.slice(0, separator), value.slice(separator + 1)];
  } catch {
    return null;
  }
}

async function sameCredentials(actual, expected) {
  const digests = await Promise.all([actual, expected].map(value =>
    crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify(value)))
  ));
  const a = new Uint8Array(digests[0]);
  const b = new Uint8Array(digests[1]);
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a[index] ^ b[index];
  return difference === 0;
}

// Return null only after authentication. Missing server secrets always close access.
export async function requireAccess(request, { login = 'unicondts2026', password } = {}) {
  if (!password || !login || login.includes(':')) {
    return closedResponse(request, 503, 'UNICON DTS: access is not configured. Contact the site owner.');
  }
  const credentials = decodeCredentials(request.headers.get('authorization'));
  if (!credentials || !(await sameCredentials(credentials, [login, password]))) {
    return closedResponse(request, 401, 'UNICON DTS: login and password are required.', true);
  }
  return null;
}

export function privateHeaders(headers) {
  headers.set('Cache-Control', 'private, no-store');
  headers.set('CDN-Cache-Control', 'no-store');
  headers.set('Netlify-CDN-Cache-Control', 'no-store');
  const vary = headers.get('Vary');
  if (!vary?.split(',').some(value => value.trim().toLowerCase() === 'authorization')) {
    headers.set('Vary', vary ? vary + ', Authorization' : 'Authorization');
  }
}
