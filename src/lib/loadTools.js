import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function loadTools() {
  const yamlPath = path.join(__dirname, '../data/tools.yaml');
  const fileContents = fs.readFileSync(yamlPath, 'utf8');
  return yaml.load(fileContents);
}
