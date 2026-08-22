import * as assert from 'assert';
import { calculateAdaptiveDeltaY } from '../src/inspector/figma-cdp';
import { colors, c } from '../src/utils/colors';

console.log('🧪 Running TypeScript CLI Unit Tests...\n');

// Test 1: Adaptive deltaY calculation
const baseDown = calculateAdaptiveDeltaY(0, 'DOWN');
assert.strictEqual(baseDown, -3000, 'Base DOWN deltaY should be -3000');

const step1Down = calculateAdaptiveDeltaY(1, 'DOWN');
assert.strictEqual(step1Down, -3500, 'Step 1 DOWN deltaY should be -3500');

const baseUp = calculateAdaptiveDeltaY(0, 'UP');
assert.strictEqual(baseUp, 3000, 'Base UP deltaY should be +3000');

console.log('  ✅ Adaptive deltaY calculations PASS');

// Test 2: ANSI color formatting
const coloredText = c.cyan('test');
assert.ok(coloredText.includes('\x1b[36m'), 'Color helper should wrap with ANSI codes');
assert.ok(coloredText.includes('\x1b[0m'), 'Color helper should reset ANSI codes');

console.log('  ✅ ANSI color helpers PASS');

console.log('\n🎉 All TypeScript unit tests passed successfully!\n');
