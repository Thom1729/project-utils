import ts from 'rollup-plugin-ts';

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
      ts({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
];
