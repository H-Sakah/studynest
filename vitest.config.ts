import { defineConfig } from 'vitest/config';

import pluginReact from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [pluginReact()],
  test: {
    environment: 'happy-dom',
    setupFiles: './src/setup-test.ts',
    globals: true,
  },
});
