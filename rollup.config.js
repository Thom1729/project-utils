import ts from '@rollup/plugin-typescript';

export default [
  {
    input: ['src/index.ts'],
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
      },
    ],
    plugins: [
      ts(),
    ],
  },
];
