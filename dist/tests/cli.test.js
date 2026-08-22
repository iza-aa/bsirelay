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
const assert = __importStar(require("assert"));
const figma_cdp_1 = require("../src/inspector/figma-cdp");
const colors_1 = require("../src/utils/colors");
console.log('🧪 Running TypeScript CLI Unit Tests...\n');
// Test 1: Adaptive deltaY calculation
const baseDown = (0, figma_cdp_1.calculateAdaptiveDeltaY)(0, 'DOWN');
assert.strictEqual(baseDown, -3000, 'Base DOWN deltaY should be -3000');
const step1Down = (0, figma_cdp_1.calculateAdaptiveDeltaY)(1, 'DOWN');
assert.strictEqual(step1Down, -3500, 'Step 1 DOWN deltaY should be -3500');
const baseUp = (0, figma_cdp_1.calculateAdaptiveDeltaY)(0, 'UP');
assert.strictEqual(baseUp, 3000, 'Base UP deltaY should be +3000');
console.log('  ✅ Adaptive deltaY calculations PASS');
// Test 2: ANSI color formatting
const coloredText = colors_1.c.cyan('test');
assert.ok(coloredText.includes('\x1b[36m'), 'Color helper should wrap with ANSI codes');
assert.ok(coloredText.includes('\x1b[0m'), 'Color helper should reset ANSI codes');
console.log('  ✅ ANSI color helpers PASS');
console.log('\n🎉 All TypeScript unit tests passed successfully!\n');
