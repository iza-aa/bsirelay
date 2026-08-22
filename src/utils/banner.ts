import { c, colors } from './colors';

export function printBanner(version = '1.2.0') {
  console.log(`
${colors.cyan}${colors.bold}  ██████╗ ███████╗██╗██████╗ ███████╗██╗      █████╗ ██╗   ██╗
  ██╔══██╗██╔════╝██║██╔══██╗██╔════╝██║     ██╔══██╗╚██╗ ██╔╝
  ██████╔╝███████╗██║██████╔╝█████╗  ██║     ███████║ ╚████╔╝ 
  ██╔══██╗╚════██║██║██╔══██╗██╔══╝  ██║     ██╔══██║  ╚██╔╝  
  ██████╔╝███████║██║██║  ██║███████╗███████╗██║  ██║   ██║   
  ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   ${colors.reset}
  ${c.dim('─'.repeat(62))}
  ${c.bold('BSI Frontend Agentic Delivery & Workflow Framework')} ${c.cyan(`v${version}`)}
  ${c.dim('Multi-Agent: Antigravity · Claude Code · ZCode · Cursor · Hermes')}
  ${c.dim('─'.repeat(62))}
`);
}
