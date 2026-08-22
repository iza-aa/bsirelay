#!/usr/bin/env node
import { main } from '../src/cli';

main().catch((err) => {
  console.error('\n❌ BSI Relay Error:', err.message || err);
  process.exit(1);
});
