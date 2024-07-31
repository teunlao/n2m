import esbuild from 'rollup-plugin-esbuild';
import tsConfigPaths from "rollup-plugin-tsconfig-paths"

const bundle = config => ({
  ...config,
  input: ['src/client/index.ts', 'src/server/index.ts', 'src/shared/index.ts', 'src/api/index.ts'],
  external: id => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [tsConfigPaths(), esbuild()],
    output: [
      {
        dir: 'dist',
        format: 'es',
        exports: 'named',
        preserveModules: true, // Keep directory structure and files
      },
    ],
  }),
];
