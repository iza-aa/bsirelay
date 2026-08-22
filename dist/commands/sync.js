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
exports.runSync = runSync;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const colors_1 = require("../utils/colors");
function runSync(repoRoot = process.cwd()) {
    const agentsDir = fs.existsSync(path.join(repoRoot, '.agents'))
        ? path.join(repoRoot, '.agents')
        : repoRoot;
    const docsDir = path.join(agentsDir, 'pilar-docs');
    const docsRepo = 'https://github.com/iza-aa/pilar-docs.git';
    console.log(`\n${colors_1.c.bold('🔄 BSI Relay — Pilar UI Docs Synchronizer')}`);
    if (fs.existsSync(path.join(docsDir, '.git'))) {
        console.log(`  Updating existing pilar-docs repository...`);
        try {
            (0, child_process_1.execSync)('git pull origin main', { cwd: docsDir, stdio: 'pipe' });
            const count = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).length;
            console.log(`  ${colors_1.c.green(`✅ Pilar Docs updated successfully (${count} components).`)}\n`);
        }
        catch {
            console.log(`  ${colors_1.c.yellow(`⚠️ Could not pull latest updates (network or authentication required).`)}\n`);
        }
        return;
    }
    if (fs.existsSync(docsDir) && fs.readdirSync(docsDir).length > 0) {
        const count = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).length;
        console.log(`  ${colors_1.c.green(`✅ Local pilar-docs snapshot is active (${count} components).`)}\n`);
        return;
    }
    console.log(`  Cloning companion pilar-docs from ${colors_1.c.dim(docsRepo)}...`);
    try {
        (0, child_process_1.execSync)(`git clone --depth 1 "${docsRepo}" "${docsDir}"`, { stdio: 'pipe' });
        const count = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).length;
        console.log(`  ${colors_1.c.green(`✅ Pilar Docs cloned successfully (${count} components ready).`)}\n`);
    }
    catch {
        console.log(`  ${colors_1.c.yellow(`⚠️ Pilar Docs companion is private and requires repository access.`)}`);
        console.log(`  ${colors_1.c.dim(`Framework bsirelay will continue with standard component generation.`)}\n`);
    }
}
