import fs from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const env = new URL('.env.auth.local', root);
try {
  await fs.access(env);
  console.log('Access is already configured locally. The existing password was not changed.');
} catch {
  const login = 'unicondts2026';
  const password = randomBytes(24).toString('base64url');
  await fs.mkdir(new URL('access-private/', root), { recursive: true });
  await fs.writeFile(env, `DTS_AUTH_LOGIN=${login}\nDTS_AUTH_PASSWORD=${password}\n`, { flag: 'wx', mode: 0o600 });
  const credentials = new URL('access-private/credentials.txt', root);
  await fs.writeFile(credentials,
    `UNICON DTS\n\nLogin: ${login}\nPassword: ${password}\n\nThis file is private. Do not upload it to GitHub or include it in the site archive.\nProduction access requires these values in Netlify environment variables and an Edge Function deployment.\n`,
    { flag: 'wx', mode: 0o600 });
  console.log('Local access configured. Your private credentials are in: ' + fileURLToPath(credentials));
}
