import { readFile } from 'node:fs/promises';

const required = [
  'README.md',
  'package.json',
  'config/markets.json',
  '.gitignore'
];

for (const file of required) {
  try {
    await readFile(file, 'utf8');
  } catch {
    throw new Error(`Missing required baseline file: ${file}`);
  }
}

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const config = JSON.parse(await readFile('config/markets.json', 'utf8'));

if (pkg.name !== 'pm-cosmetics-hub') throw new Error('Invalid package name');
if (config.canonical_name !== 'PM Cosmetics Hub') throw new Error('Invalid canonical brand name');
if (!Array.isArray(config.markets) || config.markets.length < 1) throw new Error('No markets configured');
if (config.rules.secrets_in_git !== false) throw new Error('Secret protection rule is invalid');

console.log(`Validation passed: ${config.canonical_name} / ${config.markets.length} markets`);
