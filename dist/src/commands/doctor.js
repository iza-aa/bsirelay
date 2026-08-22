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
exports.runDoctor = runDoctor;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const http = __importStar(require("http"));
const colors_1 = require("../utils/colors");
async function runDoctor(repoRoot = process.cwd()) {
    const agentsDir = fs.existsSync(path.join(repoRoot, '.agents'))
        ? path.join(repoRoot, '.agents')
        : repoRoot;
    const results = [];
    const addResult = (status, name, detail) => {
        results.push({ status, name, detail });
    };
    // Helper to read JSON
    let teamConfig = {};
    let localConfig = {};
    // 1. team.json
    const teamJsonPath = path.join(agentsDir, 'team.json');
    if (!fs.existsSync(teamJsonPath)) {
        addResult('FAIL', 'team.json', 'File not found');
    }
    else {
        try {
            teamConfig = JSON.parse(fs.readFileSync(teamJsonPath, 'utf8'));
            const req = ['team', (teamConfig.frontend || {}).module_root, (teamConfig.frontend || {}).services_file];
            if (req.every(Boolean)) {
                addResult('PASS', 'team.json', `Valid schema (team: ${teamConfig.team || 'EA'})`);
            }
            else {
                addResult('FAIL', 'team.json', 'Missing required fields (team/frontend.module_root/services_file)');
            }
        }
        catch (e) {
            addResult('FAIL', 'team.json', `Invalid JSON syntax: ${e.message}`);
        }
    }
    // 2. teammemory.md
    const teamMemoryPath = path.join(agentsDir, 'teammemory.md');
    if (fs.existsSync(teamMemoryPath)) {
        const lines = fs.readFileSync(teamMemoryPath, 'utf8').split('\n').length;
        addResult('PASS', 'teammemory.md', `Shared team memory active (${lines} lines)`);
    }
    else {
        addResult('FAIL', 'teammemory.md', 'Missing teammemory.md (Team SSOT)');
    }
    // 3. memory/local.md
    const localMemoryPath = path.join(agentsDir, 'memory', 'local.md');
    if (fs.existsSync(localMemoryPath)) {
        addResult('PASS', 'memory/local.md', 'Personal developer memory ready');
    }
    else {
        addResult('WARN', 'memory/local.md', 'Personal memory not yet initialized (run `bsirelay setup`)');
    }
    // 4. config.local.json
    const localConfigPath = path.join(agentsDir, 'config.local.json');
    if (fs.existsSync(localConfigPath)) {
        try {
            localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
            addResult('PASS', 'config.local.json', `Local overrides active (device: ${localConfig.device || 'default'})`);
        }
        catch (e) {
            addResult('FAIL', 'config.local.json', `Syntax error: ${e.message}`);
        }
    }
    else {
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
        }
        else {
            addResult('WARN', 'frontend paths', `Some frontend paths not found in ${repoRoot}`);
        }
    }
    // 6. Backend Repository
    const beRepo = localConfig.backend_repo !== undefined ? localConfig.backend_repo : (teamConfig.backend || {}).default_repo;
    if (!beRepo) {
        addResult('WARN', 'backend repo', 'Not configured (optional for UI-only slicing)');
    }
    else {
        const resolvedBe = path.isAbsolute(beRepo) ? beRepo : path.join(repoRoot, beRepo);
        if (fs.existsSync(resolvedBe) && fs.existsSync(path.join(resolvedBe, '.git'))) {
            addResult('PASS', 'backend repo', `Git repository resolved: ${beRepo}`);
        }
        else if (fs.existsSync(resolvedBe)) {
            addResult('PASS', 'backend repo', `Directory resolved: ${beRepo}`);
        }
        else {
            addResult('WARN', 'backend repo', `Path not found on disk: ${beRepo}`);
        }
    }
    // 7. UI Library Companion / Snapshot
    const docsFolder = path.join(agentsDir, 'pilar-docs');
    if (fs.existsSync(docsFolder) && fs.readdirSync(docsFolder).length > 0) {
        const count = fs.readdirSync(docsFolder).filter(f => f.endsWith('.md')).length;
        addResult('PASS', 'pilar-docs', `Authoritative UI snapshot active (${count} components)`);
    }
    else {
        addResult('WARN', 'pilar-docs', 'Docs companion not downloaded (run `bsirelay sync` to fetch)');
    }
    // 8. Node Runtime
    try {
        const nodeVer = process.version;
        const npxVer = (0, child_process_1.execSync)('npx --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        addResult('PASS', 'runtime', `Node ${nodeVer}, npx v${npxVer}`);
    }
    catch {
        addResult('FAIL', 'runtime', 'Node / npx not detected in PATH');
    }
    // 9. Chrome DevTools Endpoint (Port 9222)
    const isPortLive = await checkChromeDebugPort();
    if (isPortLive) {
        addResult('PASS', 'chrome-devtools', 'Port 9222 LIVE (Attach mode ready for Figma inspection)');
    }
    else {
        addResult('WARN', 'chrome-devtools', 'Port 9222 not open (Fresh-launch MCP mode will be used)');
    }
    // Render Table
    console.log(`\n${colors_1.c.bold('🩺 BSI Relay Workspace Preflight Diagnosis')}\n`);
    console.log('  Status │ Check                  │ Detail');
    console.log('  ───────┼────────────────────────┼──────────────────────────────────────────────────');
    let passCount = 0;
    let warnCount = 0;
    let failCount = 0;
    for (const r of results) {
        let badge = colors_1.c.passBadge();
        if (r.status === 'WARN') {
            badge = colors_1.c.warnBadge();
            warnCount++;
        }
        else if (r.status === 'FAIL') {
            badge = colors_1.c.failBadge();
            failCount++;
        }
        else {
            passCount++;
        }
        const checkPadded = r.name.padEnd(22, ' ');
        console.log(`  ${badge} │ ${colors_1.c.bold(checkPadded)} │ ${r.detail}`);
    }
    console.log('  ───────┴────────────────────────┴──────────────────────────────────────────────────');
    console.log(`\n  ${colors_1.c.bold('Summary:')} ${colors_1.c.green(`${passCount} PASS`)} · ${colors_1.c.yellow(`${warnCount} WARN`)} · ${colors_1.c.red(`${failCount} FAIL`)}\n`);
    if (failCount === 0) {
        console.log(`  ${colors_1.c.green('✅ Workspace is healthy and ready to run /newtask!')}\n`);
        return true;
    }
    else {
        console.log(`  ${colors_1.c.red('❌ Please resolve FAIL issues above before running /newtask.')}\n`);
        return false;
    }
}
function checkChromeDebugPort() {
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
