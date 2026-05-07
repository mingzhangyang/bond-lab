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

test('test script discovers nested TypeScript and TSX tests', () => {
  const packageJson = readJson<{
    scripts?: Record<string, string>;
  }>('package.json');

  const testScript = packageJson.scripts?.test ?? '';
  assert.match(testScript, /src\/\*\*\/\*\.test\.ts/);
  assert.match(testScript, /src\/\*\*\/\*\.test\.tsx/);
});

test('challenge slice does not directly mutate molecule slice fields', () => {
  const source = readFileSync('src/store/slices/challengeSlice.ts', 'utf8');

  assert.doesNotMatch(source, /\batoms\s*:/);
  assert.doesNotMatch(source, /\bbonds\s*:/);
  assert.doesNotMatch(source, /\blastRemovedBond\s*:/);
  assert.doesNotMatch(source, /\bselectedAtom\s*:/);
  assert.doesNotMatch(source, /\bselectedBond\s*:/);
  assert.doesNotMatch(source, /\brotatingBond\s*:/);
});

test('identifier keeps molecule templates in a dedicated data module', () => {
  const source = readFileSync('src/identifier.ts', 'utf8');

  assert.doesNotMatch(source, /const MOLECULE_TEMPLATES:\s*MoleculeTemplate\[\]\s*=/);
  assert.match(source, /from '\.\/data\/moleculeTemplates\.ts'/);
});
