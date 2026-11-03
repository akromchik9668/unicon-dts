import {defineConfig} from 'vite';
import {accessPlugin} from './server/vite-access.js';
export default defineConfig({plugins:[accessPlugin()],esbuild:{jsx:'transform',jsxFactory:'h',jsxFragment:'React.Fragment'}});

