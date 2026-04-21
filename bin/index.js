#!/usr/bin/env node

import { create } from './commands/create.js';
import { release } from './commands/release.js';

const [command, ...args] = process.argv.slice(2);

async function router() {
  const flags = {
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    withAuth: args.includes('--with-auth'),
    withRedux: args.includes('--with-redux'),
  };

  switch (command) {
    case 'release':
      const releaseType = args.find(arg => !arg.startsWith('--')) || 'patch';
      await release(releaseType, flags);
      break;

    default:
      if (!command) {
        console.log('Usage:');
        console.log('  nextforge <project-name> [flags]');
        console.log('  nextforge release <patch|minor|major> [--dry-run]');
        process.exit(0);
      }
      await create(command, flags);
      break;
  }
}

router().catch(err => {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
});
