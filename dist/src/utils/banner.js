"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printBanner = printBanner;
const colors_1 = require("./colors");
function printBanner(version = '1.2.0') {
    console.log(`
${colors_1.colors.cyan}${colors_1.colors.bold}  ██████╗ ███████╗██╗██████╗ ███████╗██╗      █████╗ ██╗   ██╗
  ██╔══██╗██╔════╝██║██╔══██╗██╔════╝██║     ██╔══██╗╚██╗ ██╔╝
  ██████╔╝███████╗██║██████╔╝█████╗  ██║     ███████║ ╚████╔╝ 
  ██╔══██╗╚════██║██║██╔══██╗██╔══╝  ██║     ██╔══██║  ╚██╔╝  
  ██████╔╝███████║██║██║  ██║███████╗███████╗██║  ██║   ██║   
  ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   ${colors_1.colors.reset}
  ${colors_1.c.dim('─'.repeat(62))}
  ${colors_1.c.bold('BSI Frontend Agentic Delivery & Workflow Framework')} ${colors_1.c.cyan(`v${version}`)}
  ${colors_1.c.dim('Multi-Agent: Antigravity · Claude Code · ZCode · Cursor · Hermes')}
  ${colors_1.c.dim('─'.repeat(62))}
`);
}
