import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readPublicFile(filename: string): string {
  return readFileSync(path.join(ROOT_DIR, 'public', filename), 'utf8');
}

test('llms.txt provides canonical and full-context pointers for AI agents', () => {
  const llms = readPublicFile('llms.txt');

  assert.match(llms, /^# BondLab/m);
  assert.match(llms, /https:\/\/bondlab\.orangely\.xyz\//);
  assert.match(llms, /\/llms-full\.txt/);
  assert.match(llms, /\/instructions/);
  assert.match(llms, /\/privacy/);
});

test('llms-full.txt documents capabilities and simplified chemistry limitations', () => {
  const llmsFull = readPublicFile('llms-full.txt');

  assert.match(llmsFull, /^# BondLab LLM Guide/m);
  assert.match(llmsFull, /Capabilities/i);
  assert.match(llmsFull, /simplified/i);
  assert.match(llmsFull, /stability/i);
  assert.match(llmsFull, /polarity/i);
});

test('robots.txt advertises llms resources for machine agents', () => {
  const robots = readPublicFile('robots.txt');

  assert.match(robots, /\/llms\.txt/);
  assert.match(robots, /\/llms-full\.txt/);
  assert.match(robots, /Sitemap:\s*https:\/\/bondlab\.orangely\.xyz\/sitemap\.xml/);
});
