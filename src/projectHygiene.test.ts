import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

test('project uses built-in random UUID generation instead of uuid package', () => {
  const packageJson = readJson<{
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }>('package.json');

  assert.equal(packageJson.dependencies?.uuid, undefined);
  assert.equal(packageJson.devDependencies?.['@types/uuid'], undefined);
});

test('TypeScript config enables stricter project checks', () => {
  const tsconfig = readJson<{
    compilerOptions?: Record<string, unknown>;
  }>('tsconfig.json');

  assert.equal(tsconfig.compilerOptions?.strict, true);
  assert.equal(tsconfig.compilerOptions?.noUnusedLocals, true);
  assert.equal(tsconfig.compilerOptions?.noUnusedParameters, true);
});

test('physics position change tracking is scoped per animation frame', () => {
  const source = readFileSync('src/physics.ts', 'utf8');

  assert.match(source, /useFrame\(\(_, delta\) => \{\n\s+let positionsChanged = false;/);
  assert.doesNotMatch(source, /\n\s+let positionsChanged = false;\n\s*$/);
});
