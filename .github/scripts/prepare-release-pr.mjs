import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import semanticRelease from 'semantic-release';

const result = await semanticRelease({
  branches: ['main'],
  ci: false,
  dryRun: true,
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
  ],
});

if (!result?.nextRelease) {
  console.log('No release is required.');
  process.exit(0);
}

const { version, notes } = result.nextRelease;
const packageJsonPath = 'package.json';
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
packageJson.version = version;
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

const changelogPath = 'CHANGELOG.md';
let changelog = '';
try {
  changelog = readFileSync(changelogPath, 'utf8').trim();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

writeFileSync(
  changelogPath,
  `${notes.trim()}${changelog ? `\n\n${changelog}\n` : '\n'}`,
);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `release_required=true\nversion=${version}\n`);
}
