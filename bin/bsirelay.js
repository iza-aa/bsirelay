#!/usr/bin/env node
const path = require('path');
let main;

try {
  main = require('../dist/src/cli').main;
} catch {
  try {
    main = require('../dist/cli').main;
  } catch (e) {
    console.error('❌ Please run `npm run build` before executing bsirelay.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n❌ BSI Relay Error:', err.message || err);
  process.exit(1);
});
