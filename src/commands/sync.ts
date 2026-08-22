import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { c } from '../utils/colors';

export function runSync(repoRoot = process.cwd()): void {
  const agentsDir = fs.existsSync(path.join(repoRoot, '.agents'))
    ? path.join(repoRoot, '.agents')
    : repoRoot;

  const docsDir = path.join(agentsDir, 'pilar-docs');
  const docsRepo = 'https://github.com/iza-aa/pilar-docs.git';

  console.log(`\n${c.bold('🔄 BSI Relay — Pilar UI Docs Synchronizer')}`);

  if (fs.existsSync(path.join(docsDir, '.git'))) {
    console.log(`  Updating existing pilar-docs repository...`);
    try {
      execSync('git pull origin main', { cwd: docsDir, stdio: 'pipe' });
      const count = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).length;
      console.log(`  ${c.green(`✅ Pilar Docs updated successfully (${count} components).`)}\n`);
    } catch {
      console.log(`  ${c.yellow(`⚠️ Could not pull latest updates (network or authentication required).`)}\n`);
    }
    return;
  }

  if (fs.existsSync(docsDir) && fs.readdirSync(docsDir).length > 0) {
    const count = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).length;
    console.log(`  ${c.green(`✅ Local pilar-docs snapshot is active (${count} components).`)}\n`);
    return;
  }

  console.log(`  Cloning companion pilar-docs from ${c.dim(docsRepo)}...`);
  try {
    execSync(`git clone --depth 1 "${docsRepo}" "${docsDir}"`, { stdio: 'pipe' });
    const count = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).length;
    console.log(`  ${c.green(`✅ Pilar Docs cloned successfully (${count} components ready).`)}\n`);
  } catch {
    console.log(`  ${c.yellow(`⚠️ Pilar Docs companion is private and requires repository access.`)}`);
    console.log(`  ${c.dim(`Framework bsirelay will continue with standard component generation.`)}\n`);
  }
}
