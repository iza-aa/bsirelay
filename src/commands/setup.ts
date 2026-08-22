import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { execSync } from 'child_process';
import { c } from '../utils/colors';
import { runDoctor } from './doctor';

export async function runSetup(repoRoot = process.cwd()): Promise<void> {
  const agentsDir = fs.existsSync(path.join(repoRoot, '.agents'))
    ? path.join(repoRoot, '.agents')
    : repoRoot;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (promptText: string): Promise<string> => {
    return new Promise((resolve) => rl.question(promptText, (ans) => resolve(ans.trim())));
  };

  console.log(`\n${c.bold('🚀 BSI Relay — Interactive Workspace Setup Wizard')}`);
  console.log(`${c.dim('This wizard configures personal paths and pre-caches tools for your agent.')}\n`);

  // 1. Scaffold config.local.json
  const localConfigPath = path.join(agentsDir, 'config.local.json');
  const defaultConfigPath = fs.existsSync(path.join(agentsDir, 'templates', 'config.default.json')) ? path.join(agentsDir, 'templates', 'config.default.json') : path.join(agentsDir, 'config.default.json');
  let localConfig: any = {};

  if (fs.existsSync(localConfigPath)) {
    try {
      localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
    } catch {}
  } else if (fs.existsSync(defaultConfigPath)) {
    try {
      localConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
    } catch {}
  }

  // 2. Scaffold memory/local.md
  const memoryDir = path.join(agentsDir, 'memory');
  const localMemoryPath = path.join(memoryDir, 'local.md');
  if (!fs.existsSync(memoryDir)) {
    fs.mkdirSync(memoryDir, { recursive: true });
  }
  if (!fs.existsSync(localMemoryPath)) {
    const template = `# 👤 Developer Personal Memory & Preferences
> Sifat: Lokal, pribadi, tidak di-commit ke Git.

## 📌 Preferensi Komunikasi & Interview
- Gaya interview: Sekuansial 1-per-1.
- Kata kunci approval: "go" (atau "run", "proceed").

## 📜 Riwayat Koreksi Pribadi (/learn)
*(Poin koreksi pribadi Anda akan dicatat otomatis di sini)*
`;
    fs.writeFileSync(localMemoryPath, template, 'utf8');
    console.log(`  ${c.green('✅ Initialized personal memory:')} ${c.dim('.agents/memory/local.md')}`);
  }

  // Interactive Prompts
  const defaultBe = localConfig.backend_repo || '../svc-ea-lumen';
  const beInput = await question(`\n📁 [1/2] Local Backend repository path ${c.dim(`[default: ${defaultBe}]`)}: `);
  localConfig.backend_repo = beInput || defaultBe;

  const defaultUi = localConfig.ui_library_repo || null;
  const uiInput = await question(`📁 [2/2] Local UI Library repo path (leave blank if not cloned) ${c.dim(`[default: null]`)}: `);
  localConfig.ui_library_repo = uiInput ? uiInput : null;
  localConfig.device = process.env.USER || 'local-developer';

  // Save config.local.json
  fs.writeFileSync(localConfigPath, JSON.stringify(localConfig, null, 2), 'utf8');
  console.log(`\n  ${c.green('✅ Saved local configuration:')} ${c.dim('.agents/config.local.json')}`);

  // 3. Pre-cache chrome-devtools-mcp
  console.log(`\n🌐 Checking Chrome DevTools MCP...`);
  try {
    execSync('npm install -g chrome-devtools-mcp 2>/dev/null || npx -y chrome-devtools-mcp@latest --version', {
      stdio: 'ignore',
    });
    console.log(`  ${c.green('✅ chrome-devtools-mcp is cached and ready.')}`);
  } catch {
    console.log(`  ${c.yellow('⚠️ Could not pre-cache chrome-devtools-mcp (will be run on-the-fly via npx).')}`);
  }

  rl.close();

  // Run Doctor automatically
  console.log('\n🔍 Running preflight diagnostics...\n');
  await runDoctor(repoRoot);
}
