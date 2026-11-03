import { requireAccess, privateHeaders } from '../../server/access.js';

export default async function siteAccess(request, context) {
  const denied = await requireAccess(request, {
    login: Netlify.env.get('DTS_AUTH_LOGIN') || 'unicondts2026',
    password: Netlify.env.get('DTS_AUTH_PASSWORD'),
  });
  if (denied) return denied;
  const upstream = await context.next();
  const response = new Response(upstream.body, upstream);
  privateHeaders(response.headers);
  return response;
}

export const config = { path: '/*' };
