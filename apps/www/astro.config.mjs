import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
    integrations: [tailwind(), react()],
    output: 'static',
    build: {
        assets: 'assets'
    },
    vite: {
        envDir: '../../'  // Load .env from project root (Fikanova-HQ)
    }
});
