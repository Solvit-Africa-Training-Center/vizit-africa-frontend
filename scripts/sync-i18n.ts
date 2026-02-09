
import fs from 'node:fs';
import path from 'node:path';

const messagesDir = path.join(process.cwd(), 'messages');
const sourceFile = path.join(messagesDir, 'en.json');

// Read source file
const sourceContent = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

// Helper to sort object keys
function sortObject(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, unknown>, key) => {
      result[key] = sortObject((obj as Record<string, unknown>)[key]);
      return result;
    }, {});
}

// Recursive sync function
function syncObjects(source: Record<string, any>, target: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  // Iterate over source keys
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      // If it's a nested object, recurse
      result[key] = syncObjects(source[key], target[key] || {});
    } else {
      // If it's a value (string, array, etc.)
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        // Keep existing translation
        result[key] = target[key];
      } else {
        // Use source value (English) for missing keys
        result[key] = source[key];
      }
    }
  }

  return result;
}

// Get all json files in messages dir
const files = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json') && file !== 'en.json');

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  const targetContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log(`Syncing ${file}...`);
  const syncedContent = syncObjects(sourceContent, targetContent);
  
  // Sort keys deeply for consistent diffs
  const sortedContent = sortObject(syncedContent);

  fs.writeFileSync(filePath, JSON.stringify(sortedContent, null, 2) + '\n');
});

console.log('Sync complete!');
