"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const banner_1 = require("./utils/banner");
const doctor_1 = require("./commands/doctor");
const setup_1 = require("./commands/setup");
const status_1 = require("./commands/status");
const sync_1 = require("./commands/sync");
const figma_cdp_1 = require("./inspector/figma-cdp");
const colors_1 = require("./utils/colors");
async function main(args = process.argv.slice(2)) {
    const command = args[0] || 'help';
    switch (command) {
        case 'doctor':
        case 'check':
            (0, banner_1.printBanner)();
            await (0, doctor_1.runDoctor)();
            break;
        case 'setup':
        case 'init':
            (0, banner_1.printBanner)();
            await (0, setup_1.runSetup)();
            break;
        case 'status':
            (0, banner_1.printBanner)();
            (0, status_1.runStatus)();
            break;
        case 'sync':
        case 'sync-docs':
            (0, banner_1.printBanner)();
            (0, sync_1.runSync)();
            break;
        case 'inspect':
        case 'figma':
            (0, banner_1.printBanner)();
            const inspector = new figma_cdp_1.FigmaCDPInspector();
            inspector.printInspectionGuide();
            const isLive = await inspector.isAvailable();
            if (isLive) {
                console.log(`  ${colors_1.c.green('✅ Chrome DevTools CDP Port 9222 is connected.')}`);
            }
            else {
                console.log(`  ${colors_1.c.yellow('ℹ️ Chrome DevTools CDP Port 9222 is offline. Launch Chrome with --remote-debugging-port=9222.')}`);
            }
            break;
        case 'version':
        case '-v':
        case '--version':
            console.log('bsirelay v1.2.0');
            break;
        case 'help':
        case '--help':
        case '-h':
        default:
            (0, banner_1.printBanner)();
            console.log(`${colors_1.c.bold('Usage:')} npx bsirelay <command>\n`);
            console.log(`${colors_1.c.bold('Available Commands:')}`);
            console.log(`  ${colors_1.c.cyan('setup')}     - Interactive workspace onboarding & auto-install tools`);
            console.log(`  ${colors_1.c.cyan('doctor')}    - Run preflight health diagnosis & path validations`);
            console.log(`  ${colors_1.c.cyan('status')}    - Show active workspace configuration & memory statistics`);
            console.log(`  ${colors_1.c.cyan('sync')}      - Synchronize companion Pilar UI component documentation`);
            console.log(`  ${colors_1.c.cyan('inspect')}   - Test Figma Chrome DevTools connection & scroll recipe`);
            console.log(`  ${colors_1.c.cyan('version')}   - Display framework version\n`);
            break;
    }
}
