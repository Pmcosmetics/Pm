import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = join(process.cwd(), 'supabase', 'migrations');
const files = (await readdir(dir)).filter((name) => name.endsWith('.sql')).sort();

if (files.length === 0) throw new Error('No SQL migrations found in supabase/migrations');

const numbers = files.map((name) => {
  const match = name.match(/^(\d+)_.*\.sql$/);
  if (!match) throw new Error(`Invalid migration filename: ${name}`);
  return Number(match[1]);
});

const unique = new Set(numbers);
if (unique.size !== numbers.length) throw new Error('Duplicate migration sequence number detected');

for (let i = 0; i < files.length; i += 1) {
  const expected = i + 1;
  if (numbers[i] !== expected) {
    throw new Error(`Migration sequence gap/order error: expected ${String(expected).padStart(3, '0')}, found ${files[i]}`);
  }
  const content = await readFile(join(dir, files[i]), 'utf8');
  if (!content.trim()) throw new Error(`Empty migration: ${files[i]}`);
}

console.log(`Migration validation OK: ${files.length} files (${files.join(', ')})`);
