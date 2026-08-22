import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as http from 'http';
import { c } from '../utils/colors';

interface CheckResult {
  status: 'PASS' | 'WARN' | 'FAIL';
  name: string;
  detail: string;
}

export async function runDoctor(repoRoot = process.cwd()): Promise<boolean> {
  const agentsDir = fs.existsSync(path.join(repoRoot, '.agents'))
    ? path.join(repoRoot, '.agents')
    : repoRoot;

  const results: CheckResult[] = [];

  const addResult = (status: 'PASS' | 'WARN' | 'FAIL', name: string, detail: string) => {
    results.push({ status, name, detail });
  };

  // Helper to read JSON
  let teamConfig: any = {};
  let localConfig: any = {};

  // 1. team.json
  const teamJsonPath = path.join(agentsDir, 'team.json');
  if (!fs.existsSync(teamJsonPath)) {
    addResult('FAIL', 'team.json', 'File not found');
  } else {
    try {
      teamConfig = JSON.parse(fs.readFileSync(teamJsonPath, 'utf8'));
      const req = ['team', (teamConfig.frontend || {}).module_root, (teamConfig.frontend || {}).services_file];
      if (req.every(Boolean)) {
        addResult('PASS', 'team.json', `Valid schema (team: ${teamConfig.team || 'EA'})`);
      } else {
        addResult('FAIL', 'team.json', 'Missing required fields (team/frontend.module_root/services_file)');
      }
    } catch (e: any) {
      addResult('FAIL', 'team.json', `Invalid JSON syntax: ${e.message}`);
    }
  }

  // 2. teammemory.md
  const teamMemoryPath = path.join(agentsDir, 'teammemory.md');
  if (fs.existsSync(teamMemoryPath)) {
    const lines = fs.readFileSync(teamMemoryPath, 'utf8').split('\n').length;
    addResult('PASS', 'teammemory.md', `Shared team memory active (${lines} lines)`);
  } else {
    addResult('FAIL', 'teammemory.md', 'Missing teammemory.md (Team SSOT)');
  }

  // 3. memory/local.md
  const localMemoryPath = path.join(agentsDir, 'memory', 'local.md');
  if (fs.existsSync(localMemoryPath)) {
    addResult('PASS', 'memory/local.md', 'Personal developer memory ready');
  } else {
    addResult('WARN', 'memory/local.md', 'Personal memory not yet initialized (run `bsirelay setup`)');
  }

  // 4. config.local.json
  const localConfigPath = path.join(agentsDir, 'config.local.json');
  if (fs.existsSync(localConfigPath)) {
    try {
      localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
      addResult('PASS', 'config.local.json', `Local overrides active (device: ${localConfig.device || 'default'})`);
    } catch (e: any) {
      addResult('FAIL', 'config.local.json', `Syntax error: ${e.message}`);
    }
  } else {
    addResult('WARN', 'config.local.json', 'No local override file (using team.json defaults)');
  }

  // 5. Frontend Module Paths
  if (teamConfig.frontend) {
    const keys = ['module_root', 'services_file', 'routing_file', 'module_file', 'styles_file'];
    let allExist = true;
    for (const k of keys) {
      const relPath = teamConfig.frontend[k];
      if (relPath && !fs.existsSync(path.join(repoRoot, relPath))) {
        allExist = false;
        break;
      }
    }
    if (allExist) {
      addResult('PASS', 'frontend paths', 'All module & service paths resolved on disk');
    } else {
      addResult('WARN', 'frontend paths', `Some frontend paths not found in ${repoRoot}`);
    }
  }

  // 6. Backend Repository
  const beRepo = localConfig.backend_repo !== undefined ? localConfig.backend_repo : (teamConfig.backend || {}).default_repo;
  if (!beRepo) {
    addResult('WARN', 'backend repo', 'Not configured (optional for UI-only slicing)');
  } else {
    const resolvedBe = path.isAbsolute(beRepo) ? beRepo : path.join(repoRoot, beRepo);
    if (fs.existsSync(resolvedBe) && fs.existsSync(path.join(resolvedBe, '.git'))) {
      addResult('PASS', 'backend repo', `Git repository resolved: ${beRepo}`);
    } else if (fs.existsSync(resolvedBe)) {
      addResult('PASS', 'backend repo', `Directory resolved: ${beRepo}`);
    } else {
      addResult('WARN', 'backend repo', `Path not found on disk: ${beRepo}`);
    }
  }

  // 7. UI Library Companion / Snapshot
  const docsFolder = path.join(agentsDir, 'pilar-docs');
  if (fs.existsSync(docsFolder) && fs.readdirSync(docsFolder).length > 0) {
    const count = fs.readdirSync(docsFolder).filter(f => f.endsWith('.md')).length;
    addResult('PASS', 'pilar-docs', `Authoritative UI snapshot active (${count} components)`);
  } else {
    addResult('WARN', 'pilar-docs', 'Docs companion not downloaded (run `bsirelay sync` to fetch)');
  }

  // 8. Node Runtime
  try {
    const nodeVer = process.version;
    const npxVer = execSync('npx --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    addResult('PASS', 'runtime', `Node ${nodeVer}, npx v${npxVer}`);
  } catch {
    addResult('FAIL', 'runtime', 'Node / npx not detected in PATH');
  }

  // 9. Chrome DevTools Endpoint (Port 9222)
  const isPortLive = await checkChromeDebugPort();
  if (isPortLive) {
    addResult('PASS', 'chrome-devtools', 'Port 9222 LIVE (Attach mode ready for Figma inspection)');
  } else {
    addResult('WARN', 'chrome-devtools', 'Port 9222 not open (Fresh-launch MCP mode will be used)');
  }

  // Render Table
  console.log(`\n${c.bold('🩺 BSI Relay Workspace Preflight Diagnosis')}\n`);
  console.log('  Status │ Check                  │ Detail');
  console.log('  ───────┼────────────────────────┼──────────────────────────────────────────────────');

  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  for (const r of results) {
    let badge = c.passBadge();
    if (r.status === 'WARN') {
      badge = c.warnBadge();
      warnCount++;
    } else if (r.status === 'FAIL') {
      badge = c.failBadge();
      failCount++;
    } else {
      passCount++;
    }

    const checkPadded = r.name.padEnd(22, ' ');
    console.log(`  ${badge} │ ${c.bold(checkPadded)} │ ${r.detail}`);
  }

  console.log('  ───────┴────────────────────────┴──────────────────────────────────────────────────');
  console.log(`\n  ${c.bold('Summary:')} ${c.green(`${passCount} PASS`)} · ${c.yellow(`${warnCount} WARN`)} · ${c.red(`${failCount} FAIL`)}\n`);

  if (failCount === 0) {
    console.log(`  ${c.green('✅ Workspace is healthy and ready to run /newtask!')}\n`);
    return true;
  } else {
    console.log(`  ${c.red('❌ Please resolve FAIL issues above before running /newtask.')}\n`);
    return false;
  }
}

function checkChromeDebugPort(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:9222/json/version', { timeout: 1500 }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}
