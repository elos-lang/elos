import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./src/index.ts'],
    format: ['cjs', 'esm'], // Build for commonJS and ESmodules
    target: 'es2018',   // or 'es2020', 'es2022', 'node18', etc.
    dts: true, // Generate declaration file (.d.ts)
    splitting: false,
    sourcemap: true,
    clean: true,
});