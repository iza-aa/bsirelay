"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.c = exports.colors = void 0;
/**
 * Lightweight zero-dependency ANSI color and formatting utility
 */
exports.colors = {
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
exports.c = {
    cyan: (str) => `${exports.colors.cyan}${str}${exports.colors.reset}`,
    green: (str) => `${exports.colors.green}${str}${exports.colors.reset}`,
    yellow: (str) => `${exports.colors.yellow}${str}${exports.colors.reset}`,
    red: (str) => `${exports.colors.red}${str}${exports.colors.reset}`,
    blue: (str) => `${exports.colors.blue}${str}${exports.colors.reset}`,
    magenta: (str) => `${exports.colors.magenta}${str}${exports.colors.reset}`,
    gray: (str) => `${exports.colors.gray}${str}${exports.colors.reset}`,
    bold: (str) => `${exports.colors.bold}${str}${exports.colors.reset}`,
    dim: (str) => `${exports.colors.dim}${str}${exports.colors.reset}`,
    passBadge: () => `${exports.colors.bgGreen}${exports.colors.brightWhite}${exports.colors.bold} PASS ${exports.colors.reset}`,
    warnBadge: () => `${exports.colors.bgYellow}${exports.colors.black}${exports.colors.bold} WARN ${exports.colors.reset}`,
    failBadge: () => `${exports.colors.bgRed}${exports.colors.brightWhite}${exports.colors.bold} FAIL ${exports.colors.reset}`,
};
