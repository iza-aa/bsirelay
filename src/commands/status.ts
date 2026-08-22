import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { c } from '../utils/colors';

export function runStatus(repoRoot = process.cwd()): void {
  const agentsDir = fs.existsSync(path.join(repoRoot, '.agents'))
    ? path.join(repoRoot, '.agents')
    : repoRoot;

  let currentBranch = 'unknown';
  try {
    currentBranch = execSync('git branch --show-current', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {}

  let teamConfig: any = {};
  let localConfig: any = {};

  try {
    teamConfig = JSON.parse(fs.readFileSync(path.join(agentsDir, 'team.json'), 'utf8'));
  } catch {}
  try {
    localConfig = JSON.parse(fs.readFileSync(path.join(agentsDir, 'config.local.json'), 'utf8'));
  } catch {}

  let memoryRulesCount = 0;
  const teamMemoryPath = path.join(agentsDir, 'teammemory.md');
  if (fs.existsSync(teamMemoryPath)) {
    const content = fs.readFileSync(teamMemoryPath, 'utf8');
    const matches = content.match(/- \[\d{4}-\d{2}-\d{2}\]/g);
    memoryRulesCount = matches ? matches.length : 0;
  }

  let pilarCount = 0;
  const docsFolder = path.join(agentsDir, 'pilar-docs');
  if (fs.existsSync(docsFolder)) {
    pilarCount = fs.readdirSync(docsFolder).filter(f => f.endsWith('.md')).length;
  }

  console.log(`\n${c.bold('📊 BSI Relay — Workspace Status Dashboard')}`);
  console.log(`${c.dim('─'.repeat(58))}`);
  console.log(`  ${c.cyan('• Framework Version')} : v1.2.0`);
  console.log(`  ${c.cyan('• Git Branch       ')} : ${c.bold(currentBranch)}`);
  console.log(`  ${c.cyan('• Team Profile     ')} : ${teamConfig.team || 'EA'}`);
  console.log(`  ${c.cyan('• Frontend Root    ')} : ${c.dim((teamConfig.frontend || {}).module_root || 'N/A')}`);
  console.log(`  ${c.cyan('• Backend Repo     ')} : ${c.dim(localConfig.backend_repo || (teamConfig.backend || {}).default_repo || 'null')}`);
  console.log(`  ${c.cyan('• UI Library Repo  ')} : ${c.dim(localConfig.ui_library_repo || 'null (Snapshot authoritative)')}`);
  console.log(`  ${c.cyan('• Pilar Docs Count ')} : ${pilarCount > 0 ? c.green(`${pilarCount} components`) : c.yellow('0 (run bsirelay sync)')}`);
  console.log(`  ${c.cyan('• Team Memory Rules')} : ${c.green(`${memoryRulesCount} distilled rules active`)}`);
  console.log(`  ${c.cyan('• Scroll Direction ')} : ${c.bold('Adaptive')} (Base deltaY=3000, +500 step)`);
  console.log(`${c.dim('─'.repeat(58))}\n`);
}
