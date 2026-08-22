/**
 * Lightweight zero-dependency ANSI color and formatting utility
 */
export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Foreground
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Bright Foreground
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background
  bgBlue: '\x1b[44m',
  bgCyan: '\x1b[46m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
};

export const c = {
  cyan: (str: string) => `${colors.cyan}${str}${colors.reset}`,
  green: (str: string) => `${colors.green}${str}${colors.reset}`,
  yellow: (str: string) => `${colors.yellow}${str}${colors.reset}`,
  red: (str: string) => `${colors.red}${str}${colors.reset}`,
  blue: (str: string) => `${colors.blue}${str}${colors.reset}`,
  magenta: (str: string) => `${colors.magenta}${str}${colors.reset}`,
  gray: (str: string) => `${colors.gray}${str}${colors.reset}`,
  bold: (str: string) => `${colors.bold}${str}${colors.reset}`,
  dim: (str: string) => `${colors.dim}${str}${colors.reset}`,

  passBadge: () => `${colors.bgGreen}${colors.brightWhite}${colors.bold} PASS ${colors.reset}`,
  warnBadge: () => `${colors.bgYellow}${colors.black}${colors.bold} WARN ${colors.reset}`,
  failBadge: () => `${colors.bgRed}${colors.brightWhite}${colors.bold} FAIL ${colors.reset}`,
};
