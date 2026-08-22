/**
 * Lightweight zero-dependency ANSI color and formatting utility
 */
export declare const colors: {
    reset: string;
    bold: string;
    dim: string;
    italic: string;
    underline: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    gray: string;
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightCyan: string;
    brightWhite: string;
    bgBlue: string;
    bgCyan: string;
    bgGreen: string;
    bgRed: string;
    bgYellow: string;
};
export declare const c: {
    cyan: (str: string) => string;
    green: (str: string) => string;
    yellow: (str: string) => string;
    red: (str: string) => string;
    blue: (str: string) => string;
    magenta: (str: string) => string;
    gray: (str: string) => string;
    bold: (str: string) => string;
    dim: (str: string) => string;
    passBadge: () => string;
    warnBadge: () => string;
    failBadge: () => string;
};
