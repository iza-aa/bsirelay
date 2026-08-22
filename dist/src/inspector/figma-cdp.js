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
exports.FigmaCDPInspector = void 0;
exports.calculateAdaptiveDeltaY = calculateAdaptiveDeltaY;
const http = __importStar(require("http"));
const colors_1 = require("../utils/colors");
/**
 * Calculates adaptive deltaY according to BSI Relay SSOT:
 * Base deltaY = 3000 (DOWN = -3000, UP = +3000), increments by +500 per additional scroll
 */
function calculateAdaptiveDeltaY(scrollIndex, direction = 'DOWN') {
    const magnitude = 3000 + scrollIndex * 500;
    return direction === 'DOWN' ? -magnitude : magnitude;
}
/**
 * Chrome DevTools Protocol helper for Figma WebGL canvas inspection
 */
class FigmaCDPInspector {
    host;
    port;
    constructor(host = '127.0.0.1', port = 9222) {
        this.host = host;
        this.port = port;
    }
    async isAvailable() {
        return new Promise((resolve) => {
            const req = http.get(`http://${this.host}:${this.port}/json/version`, { timeout: 1500 }, (res) => {
                resolve(res.statusCode === 200);
            });
            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });
        });
    }
    getAdaptivePlan(maxSteps = 4, direction = 'DOWN') {
        const steps = [];
        for (let i = 0; i < maxSteps; i++) {
            const dY = calculateAdaptiveDeltaY(i, direction);
            steps.push({
                stepIndex: i + 1,
                deltaY: dY,
                reason: i === 0 ? 'Base initial scroll' : `Adaptive increment +${i * 500}px for overlapping canvas`,
            });
        }
        return steps;
    }
    printInspectionGuide() {
        console.log(`\n${colors_1.c.bold('📐 Figma DevTools MCP Adaptive Scroll Specification')}`);
        console.log(`${colors_1.c.dim('─'.repeat(60))}`);
        console.log(`  • Macro Overview  : Zoom 25-30% to capture full layout hierarchy`);
        console.log(`  • Micro Inspection: Zoom 80% to verify tokens, paddings & borders`);
        console.log(`  • Scroll Formula  : Base |deltaY| = 3000, increment +500 per step`);
        console.log(`  • Exit Criterion  : Stop immediately once bottom border is captured`);
        console.log(`${colors_1.c.dim('─'.repeat(60))}\n`);
    }
}
exports.FigmaCDPInspector = FigmaCDPInspector;
