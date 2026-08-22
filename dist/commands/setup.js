"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSetup = runSetup;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
const child_process_1 = require("child_process");
const colors_1 = require("../utils/colors");
const doctor_1 = require("./doctor");
async function runSetup(repoRoot = process.cwd()) {
    const agentsDir = fs.existsSync(path.join(repoRoot, '.agents'))
        ? path.join(repoRoot, '.agents')
        : repoRoot;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const question = (promptText) => {
        return new Promise((resolve) => rl.question(promptText, (ans) => resolve(ans.trim())));
    };
    console.log(`\n${colors_1.c.bold('🚀 BSI Relay — Interactive Workspace Setup Wizard')}`);
    console.log(`${colors_1.c.dim('This wizard configures personal paths and pre-caches tools for your agent.')}\n`);
    // 1. Scaffold config.local.json
    const localConfigPath = path.join(agentsDir, 'config.local.json');
    const defaultConfigPath = path.join(agentsDir, 'config.default.json');
    let localConfig = {};
    if (fs.existsSync(localConfigPath)) {
        try {
            localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
        }
        catch { }
    }
    else if (fs.existsSync(defaultConfigPath)) {
        try {
            localConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
        }
        catch { }
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
        console.log(`  ${colors_1.c.green('✅ Initialized personal memory:')} ${colors_1.c.dim('.agents/memory/local.md')}`);
    }
    // Interactive Prompts
    const defaultBe = localConfig.backend_repo || '../svc-ea-lumen';
    const beInput = await question(`\n📁 [1/2] Local Backend repository path ${colors_1.c.dim(`[default: ${defaultBe}]`)}: `);
    localConfig.backend_repo = beInput || defaultBe;
    const defaultUi = localConfig.ui_library_repo || null;
    const uiInput = await question(`📁 [2/2] Local UI Library repo path (leave blank if not cloned) ${colors_1.c.dim(`[default: null]`)}: `);
    localConfig.ui_library_repo = uiInput ? uiInput : null;
    localConfig.device = process.env.USER || 'local-developer';
    // Save config.local.json
    fs.writeFileSync(localConfigPath, JSON.stringify(localConfig, null, 2), 'utf8');
    console.log(`\n  ${colors_1.c.green('✅ Saved local configuration:')} ${colors_1.c.dim('.agents/config.local.json')}`);
    // 3. Pre-cache chrome-devtools-mcp
    console.log(`\n🌐 Checking Chrome DevTools MCP...`);
    try {
        (0, child_process_1.execSync)('npm install -g chrome-devtools-mcp 2>/dev/null || npx -y chrome-devtools-mcp@latest --version', {
            stdio: 'ignore',
        });
        console.log(`  ${colors_1.c.green('✅ chrome-devtools-mcp is cached and ready.')}`);
    }
    catch {
        console.log(`  ${colors_1.c.yellow('⚠️ Could not pre-cache chrome-devtools-mcp (will be run on-the-fly via npx).')}`);
    }
    rl.close();
    // Run Doctor automatically
    console.log('\n🔍 Running preflight diagnostics...\n');
    await (0, doctor_1.runDoctor)(repoRoot);
}
