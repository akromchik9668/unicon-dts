import test from 'node:test';
import assert from 'node:assert/strict';
import { requireAccess, privateHeaders } from './access.js';
import siteAccess, { config } from '../netlify/edge-functions/site-access.js';

const settings = { login: 'unicondts2026', password: 'Test-only-long-password:2026' };
const basic = (login, password) => 'Basic ' + Buffer.from(login + ':' + password).toString('base64');
const request = (authorization, pathname = '/', method = 'GET') =>
  new Request('https://example.test' + pathname, { method, headers: authorization ? { authorization } : {} });

test('missing configuration closes access even when credentials are supplied', async () => {
  for (const password of [undefined, '']) {
    const response = await requireAccess(request(basic(settings.login, settings.password)), { password });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  }
});

test('unauthenticated, malformed and wrong credentials never open assets or source paths', async () => {
  const headers = [undefined, 'Bearer token', 'Basic %%%', 'Basic Zm9v', 'Basic /w==',
    basic('other-user', settings.password), basic(settings.login, 'wrong-password')];
  for (const path of ['/', '/assets/app.js', '/unicon-logo.svg', '/src/Atlas.jsx', '/.env.auth.local']) {
    for (const header of headers) {
      const denied = await requireAccess(request(header, path), settings);
      assert.equal(denied.status, 401);
      assert.match(denied.headers.get('WWW-Authenticate'), /^Basic /);
      assert.doesNotMatch(await denied.text(), /Test-only-long-password/);
    }
  }
});

test('valid credentials support colons and UTF-8 in the password', async () => {
  for (const password of [settings.password, 'abc1234', 'Пароль-для-теста-2026:✓']) {
    assert.equal(await requireAccess(request(basic(settings.login, password)), { ...settings, password }), null);
  }
});

test('HEAD challenges do not contain a body', async () => {
  const denied = await requireAccess(request(undefined, '/', 'HEAD'), settings);
  assert.equal(denied.status, 401);
  assert.equal(await denied.text(), '');
});

test('authenticated responses cannot be shared through the CDN cache', () => {
  const headers = new Headers({ Vary: 'Accept-Encoding' });
  privateHeaders(headers);
  privateHeaders(headers);
  assert.equal(headers.get('Vary'), 'Accept-Encoding, Authorization');
  assert.equal(headers.get('Netlify-CDN-Cache-Control'), 'no-store');
});

test('edge gate runs before static content and only allows the exact pair', async () => {
  globalThis.Netlify = { env: { get: key => ({ DTS_AUTH_LOGIN: settings.login, DTS_AUTH_PASSWORD: settings.password })[key] } };
  let opened = 0;
  const context = { next: async () => { opened++; return new Response('protected app'); } };
  assert.equal(config.path, '/*');
  assert.equal((await siteAccess(request(undefined, '/assets/app.js'), context)).status, 401);
  assert.equal(opened, 0);
  const response = await siteAccess(request(basic(settings.login, settings.password)), context);
  assert.equal(opened, 1);
  assert.equal(await response.text(), 'protected app');
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  delete globalThis.Netlify;
});
