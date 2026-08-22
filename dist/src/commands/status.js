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
exports.runStatus = runStatus;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const colors_1 = require("../utils/colors");
function runStatus(repoRoot = process.cwd()) {
    const agentsDir = fs.existsSync(path.join(repoRoot, '.agents'))
        ? path.join(repoRoot, '.agents')
        : repoRoot;
    let currentBranch = 'unknown';
    try {
        currentBranch = (0, child_process_1.execSync)('git branch --show-current', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    }
    catch { }
    let teamConfig = {};
    let localConfig = {};
    try {
        teamConfig = JSON.parse(fs.readFileSync(path.join(agentsDir, 'team.json'), 'utf8'));
    }
    catch { }
    try {
        localConfig = JSON.parse(fs.readFileSync(path.join(agentsDir, 'config.local.json'), 'utf8'));
    }
    catch { }
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
    console.log(`\n${colors_1.c.bold('📊 BSI Relay — Workspace Status Dashboard')}`);
    console.log(`${colors_1.c.dim('─'.repeat(58))}`);
    console.log(`  ${colors_1.c.cyan('• Framework Version')} : v1.2.0`);
    console.log(`  ${colors_1.c.cyan('• Git Branch       ')} : ${colors_1.c.bold(currentBranch)}`);
    console.log(`  ${colors_1.c.cyan('• Team Profile     ')} : ${teamConfig.team || 'EA'}`);
    console.log(`  ${colors_1.c.cyan('• Frontend Root    ')} : ${colors_1.c.dim((teamConfig.frontend || {}).module_root || 'N/A')}`);
    console.log(`  ${colors_1.c.cyan('• Backend Repo     ')} : ${colors_1.c.dim(localConfig.backend_repo || (teamConfig.backend || {}).default_repo || 'null')}`);
    console.log(`  ${colors_1.c.cyan('• UI Library Repo  ')} : ${colors_1.c.dim(localConfig.ui_library_repo || 'null (Snapshot authoritative)')}`);
    console.log(`  ${colors_1.c.cyan('• Pilar Docs Count ')} : ${pilarCount > 0 ? colors_1.c.green(`${pilarCount} components`) : colors_1.c.yellow('0 (run bsirelay sync)')}`);
    console.log(`  ${colors_1.c.cyan('• Team Memory Rules')} : ${colors_1.c.green(`${memoryRulesCount} distilled rules active`)}`);
    console.log(`  ${colors_1.c.cyan('• Scroll Direction ')} : ${colors_1.c.bold('Adaptive')} (Base deltaY=3000, +500 step)`);
    console.log(`${colors_1.c.dim('─'.repeat(58))}\n`);
}
