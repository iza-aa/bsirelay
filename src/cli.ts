import { printBanner } from './utils/banner';
import { runDoctor } from './commands/doctor';
import { runSetup } from './commands/setup';
import { runStatus } from './commands/status';
import { runSync } from './commands/sync';
import { FigmaCDPInspector } from './inspector/figma-cdp';
import { c } from './utils/colors';

export async function main(args: string[] = process.argv.slice(2)): Promise<void> {
  const command = args[0] || 'help';

  switch (command) {
    case 'doctor':
    case 'check':
      printBanner();
      await runDoctor();
      break;

    case 'setup':
    case 'init':
      printBanner();
      await runSetup();
      break;

    case 'status':
      printBanner();
      runStatus();
      break;

    case 'sync':
    case 'sync-docs':
      printBanner();
      runSync();
      break;

    case 'inspect':
    case 'figma':
      printBanner();
      const inspector = new FigmaCDPInspector();
      inspector.printInspectionGuide();
      const isLive = await inspector.isAvailable();
      if (isLive) {
        console.log(`  ${c.green('✅ Chrome DevTools CDP Port 9222 is connected.')}`);
      } else {
        console.log(`  ${c.yellow('ℹ️ Chrome DevTools CDP Port 9222 is offline. Launch Chrome with --remote-debugging-port=9222.')}`);
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
      printBanner();
      console.log(`${c.bold('Usage:')} npx bsirelay <command>\n`);
      console.log(`${c.bold('Available Commands:')}`);
      console.log(`  ${c.cyan('setup')}     - Interactive workspace onboarding & auto-install tools`);
      console.log(`  ${c.cyan('doctor')}    - Run preflight health diagnosis & path validations`);
      console.log(`  ${c.cyan('status')}    - Show active workspace configuration & memory statistics`);
      console.log(`  ${c.cyan('sync')}      - Synchronize companion Pilar UI component documentation`);
      console.log(`  ${c.cyan('inspect')}   - Test Figma Chrome DevTools connection & scroll recipe`);
      console.log(`  ${c.cyan('version')}   - Display framework version\n`);
      break;
  }
}
